const { Parser } = require("node-sql-parser");

const { Odai } = require("./odai");
const { utilDef, utilPre, QueryResultTransform } = require("../primaryQueries");
const shared = require("../shared");

const ZongJi = require("../../zongji-fix-unique");
const {
  UpdateRows,
  WriteRows,
  DeleteRows,
} = require("../../zongji-fix-unique/lib/rows_event");
/*
  OdaiTable class should be used for read operations done by Server and handles CRUD events for such operations

  handling can be lazily performed (in best case by other app)
  this proposes a pretty safe technique for reinvalidation, but faces some major performance spikes, especially with a use of dynamic routes every /product/id/ is inserted in db on its own using same columns (so every will require change but probably only 1 would actually change), also 
*/
class OdaiTable {
  static parser = new Parser();

  static async loadClass() {
    await this.startEventWatcher();
  }

  static colRefExprTemplate(fromTable, primaryColumn) {
    return {
      type: "column_ref",
      table: fromTable,
      column: primaryColumn,
    };
  }

  static groupConcatExprTemplate(fromTable, primaryColumn) {
    return {
      type: "aggr_func",
      over: null,
      name: "GROUP_CONCAT",
      args: {
        distinct: null,
        orderBy: null,
        separator: null,
        expr: {
          name: "CONCAT",
          type: "function",
          over: null,
          args: {
            type: "expr_list",
            value: [
              {
                type: "case",
                expr: null,
                args: [
                  {
                    cond: {
                      left: this.colRefExprTemplate(fromTable, primaryColumn),
                      operator: "REGEXP",
                      right: {
                        type: "single_quote_string",
                        value: "^[0-9]+$",
                      },
                      type: "binary_expr",
                    },
                    result: this.colRefExprTemplate(fromTable, primaryColumn),
                    type: "when",
                  },
                  {
                    result: {
                      type: "function",
                      over: null,
                      name: "CONCAT",
                      args: {
                        type: "expr_list",
                        value: [
                          { type: "single_quote_string", value: '"' },
                          this.colRefExprTemplate(fromTable, primaryColumn),
                          { type: "single_quote_string", value: '"' },
                        ],
                      },
                    },
                    type: "else",
                  },
                ],
              },
            ],
          },
        },
      },
    };
  }

  static async startEventWatcher() {
    const zongji = new ZongJi({
      host: "localhost",
      user: process.env.VUE_APP_MYSQL_USER_REINV,
      password: process.env.VUE_APP_MYSQL_PASS_REINV,
      // debug: true
    });

    zongji.on(
      "binlog",
      function (evt) {
        if (evt instanceof UpdateRows) this.onUpdateEvent(evt);
        if (evt instanceof WriteRows) this.onInsertEvent(evt);
        if (evt instanceof DeleteRows) this.onDeleteEvent(evt);
      }.bind(this)
    );

    zongji.start({
      includeEvents: ["tablemap", "writerows", "updaterows", "deleterows"],
      startAtEnd: true,
      includeSchema: {
        bachelor_eshop: true,
      },
    });

    process.on("SIGINT", function () {
      zongji.stop();
      process.exit();
    });
  }

  static astifyOr(keyValues, i = 0, ast = null, fromTable = "") {
    if (i === keyValues.length) return ast; // out of bounds
    const keyValue = keyValues[i];
    const newObj = this.astifyAnd(keyValue, undefined, undefined, fromTable);

    if (i === 0) {
      // the first one
      return this.astifyOr(keyValues, ++i, newObj, fromTable);
    } else {
      const obj = {
        type: "binary_expr",
        operator: "OR",
        left: ast,
        right: newObj,
      };
      return this.astifyOr(keyValues, ++i, obj, fromTable);
    }
  }
  static astifyAnd(keyValues, i = 0, ast = null, fromTable = "") {
    if (i === keyValues.length) return ast; // out of bounds
    const keyValue = keyValues[i];
    const newObj = {
      type: "binary_expr",
      operator: "=",
      left: {
        type: "column_ref",
        column: keyValue.key,
        table: fromTable,
      },
      right: {
        type: typeof keyValue.value,
        value: keyValue.value,
      },
    };

    if (i === 0) {
      // the first one
      return this.astifyAnd(keyValues, ++i, newObj, fromTable);
    } else {
      const obj = {
        type: "binary_expr",
        operator: "AND",
        left: ast,
        right: newObj,
      };
      return this.astifyAnd(keyValues, ++i, obj, fromTable);
    }
  }

  static async onInsertEvent(e) {
    // based on update event but only look based on column (NO IDs, is not used anywhere yet)
    console.log("IN INSERT");

    // find out table name
    const tableMap = e.tableMap[e.tableId];

    // find out primary keys of table
    const table = Odai.tablesGet(tableMap.parentSchema, tableMap.tableName);

    const changeRows = e.rows.map((row) => {
      const changeObj = { primaries: [] };
      table.primaries.map((primaryKey) =>
        changeObj.primaries.push({
          key: primaryKey.columnName,
          value: row[primaryKey.columnName],
        })
      );

      return changeObj;
    });

    if (changeRows.length < 1) return;

    const tablePostfix = Odai.composeIdPostfix(
      tableMap.parentSchema,
      tableMap.tableName
    );

    let rowsMatchColumns = [];
    let m = await utilDef.retQuery(
      `SELECT t1.reinv_id FROM ${Odai.composeIdPrefix()}_${tablePostfix} AS t1`,
      shared.Connect2.connWrap
    );
    if (m.state) rowsMatchColumns = m.result;
    else throw new Error(m.result);

    if (rowsMatchColumns.length < 1) return;

    const reinvIfQueryMap = new Map();
    rowsMatchColumns.map((row) => {
      let mapRow = reinvIfQueryMap.get(row.reinv_id);
      if (!mapRow)
        reinvIfQueryMap.set(row.reinv_id, { reinv_id: row.reinv_id });
      return row;
    });

    const allPrimaryKeysInserted = [];
    changeRows.map((changedRow) =>
      allPrimaryKeysInserted.push(changedRow.primaries)
    );

    let reinvObjs = [];
    m = await utilDef.retQuery(
      `SELECT t1.reinv_id, t1.path, t1.prepared, t2.query_reinv FROM ${Odai.composeIdPrefix()}_reserved_root AS t1 JOIN ${Odai.composeIdPrefix()}_${tablePostfix} AS t2 ON t1.reinv_id = t2.reinv_id`,
      shared.Connect2.connWrap
    );
    if (m.state) reinvObjs = m.result;
    else throw new Error(m.result);

    let unionQueries = [];
    let unionPrepares = [];
    reinvIfQueryMap.forEach((reinvIf) => {
      const reinvObj = reinvObjs.find(
        (reinvObj) => reinvObj.reinv_id === reinvIf.reinv_id
      );
      if (reinvObj) {
        let reinvQuery = JSON.parse(reinvObj.query_reinv);

        if (Array.isArray(reinvQuery)) reinvQuery = reinvQuery[0];

        const fromTable = reinvQuery.from.find(
          (table) =>
            table.db === tableMap.parentSchema &&
            table.table === tableMap.tableName
        );

        let whereClause = this.astifyOr(
          allPrimaryKeysInserted,
          undefined,
          undefined,
          fromTable.as
        );

        if (reinvQuery.where !== null) {
          reinvQuery.where.parentheses = true;
          whereClause.parentheses = true;

          whereClause = {
            type: "binary_expr",
            operator: "AND",
            left: reinvQuery.where,
            right: whereClause,
          };
        }

        reinvQuery.where = whereClause;

        unionQueries.push(this.parser.sqlify(reinvQuery));
        unionPrepares.push(JSON.parse(reinvObj.prepared));
      }
    });

    unionQueries = unionQueries.join(" UNION ");
    unionPrepares = unionPrepares.flat();

    let forceByQuery = [];
    m = await utilPre.retQuery(
      unionQueries,
      unionPrepares,
      shared.Connect2.connWrap
    );
    if (m.state) forceByQuery = m.result;
    else throw new Error(m.result);

    const forceReinv = forceByQuery.map((fbq) => fbq.reinv_id);
    let forceReinvPaths = reinvObjs
      .filter((reinvObj) => forceReinv.includes(reinvObj.reinv_id))
      .map((reinvObj) => reinvObj.path);

    // delete duplicit paths
    forceReinvPaths = [...new Set(forceReinvPaths)];
    console.log("REINVALIDATE FOLLOWING PATHS: ");
    console.log(forceReinvPaths);
  }

  static async onDeleteEvent(e) {
    // TODO: based on update event but only look based on IDs, but also columns! its possible that its used for example in aggregation function
    console.log("IN DELETE");

    // find out table name
    const tableMap = e.tableMap[e.tableId];

    // find out primary keys of table
    const table = Odai.tablesGet(tableMap.parentSchema, tableMap.tableName);

    const changeRows = e.rows.map((row) => {
      const changeObj = { primaries: [] };
      table.primaries.map((primaryKey) =>
        changeObj.primaries.push({
          key: primaryKey.columnName,
          value: row[primaryKey.columnName],
        })
      );
      return changeObj;
    });

    if (changeRows.length < 1) return;

    const tablePostfix = `${tableMap.parentSchema}_${tableMap.tableName}`;
    const primaryColumns = table.primaries.map(
      (primaryKey) => `t1.${primaryKey.columnName}`
    );

    let rowsMatchColumns = [];
    let m = await utilDef.retQuery(
      `SELECT t1.reinv_id, ${primaryColumns.join(
        ","
      )} FROM ${Odai.composeIdPrefix()}_id_${tablePostfix} AS t1`,
      shared.Connect2.connWrap
    );
    if (m.state) rowsMatchColumns = m.result;
    else throw new Error(m.result);

    if (rowsMatchColumns.length < 1) return;

    const forceWithoutQuery = new Set();
    rowsMatchColumns.map((row) => {
      const shallSkip = changeRows.some((changedRow) =>
        changedRow.primaries.every(
          (primary) => row[primary.key] === primary.value
        )
      );

      if (shallSkip) forceWithoutQuery.add(row.reinv_id);
    });

    const allReinv = [...forceWithoutQuery];

    if (allReinv.length < 1) return;

    let reinvObjs = [];
    m = await utilDef.retQuery(
      `SELECT t1.reinv_id, t1.path, t1.prepared, t2.query_reinv FROM ${Odai.composeIdPrefix()}_reserved_root AS t1 JOIN ${Odai.composeIdPrefix()}_${tablePostfix} AS t2 ON t1.reinv_id = t2.reinv_id WHERE t1.reinv_id IN (${allReinv.join(
        ","
      )})`,
      shared.Connect2.connWrap
    );
    if (m.state) reinvObjs = m.result;
    else throw new Error(m.result);

    const forceReinv = [...forceWithoutQuery];
    let forceReinvPaths = reinvObjs
      .filter((reinvObj) => forceReinv.includes(reinvObj.reinv_id))
      .map((reinvObj) => reinvObj.path);

    // delete duplicit paths
    forceReinvPaths = [...new Set(forceReinvPaths)];
    console.log("REINVALIDATE FOLLOWING PATHS: ");
    console.log(forceReinvPaths);
  }

  static async onUpdateEvent(e) {
    console.log("IN UPDATE");

    // find out table name
    const tableMap = e.tableMap[e.tableId];

    // find out primary keys of table
    const table = Odai.tablesGet(tableMap.parentSchema, tableMap.tableName);

    // find out all columns of table
    const columns = Object.keys(e.rows[0].before);

    let allColumns = new Set();
    const changeRows = e.rows.map((row) => {
      const changeObj = { primaries: [], columns: [] };
      table.primaries.map((primaryKey) =>
        changeObj.primaries.push({
          key: primaryKey.columnName,
          value: row.before[primaryKey.columnName],
        })
      );
      columns.map((column) => {
        if (row.before[column] !== row.after[column]) {
          changeObj.columns.push(column);
          allColumns.add(column);
        }
      });
      return changeObj;
    });

    if (changeRows.length < 1) return;

    allColumns = [...allColumns].map((col) => `'${col}'`);

    const tablePostfix = `${tableMap.parentSchema}_${tableMap.tableName}`;
    const primaryColumns = table.primaries.map(
      (primaryKey) => `t2.${primaryKey.columnName}`
    );

    let rowsMatchColumns = [];
    m = await utilDef.retQuery(
      `SELECT t1.reinv_id, t1.col, ${primaryColumns.join(
        ","
      )} FROM ${Odai.composeIdPrefix()}_col_${tablePostfix} AS t1 LEFT JOIN ${Odai.composeIdPrefix()}_id_${tablePostfix} AS t2 ON t1.reinv_id = t2.reinv_id WHERE t1.col IN (${allColumns.join(
        ","
      )})`,
      shared.Connect2.connWrap
    );
    if (m.state) rowsMatchColumns = m.result;
    else throw new Error(m.result);

    if (rowsMatchColumns.length < 1) return;

    const forceWithoutQuery = new Set();
    const reinvIfQueryMap = new Map();
    rowsMatchColumns
      .filter((row) => {
        const shallSkip = changeRows.some((changedRow) => {
          if (!changedRow.columns.includes(row.col)) return false;
          else {
            if (!row.usedByPrimaries) row.usedByPrimaries = [];
            row.usedByPrimaries.push(changedRow.primaries);
          }

          return changedRow.primaries.every(
            (primary) => row[primary.key] === primary.value
          );
        });

        if (shallSkip) forceWithoutQuery.add(row.reinv_id);
        return !shallSkip;
      })
      .filter((row) => !forceWithoutQuery.has(row.reinv_id))
      .map((row) => {
        let mapRow = reinvIfQueryMap.get(row.reinv_id);
        if (!mapRow) {
          mapRow = { reinv_id: row.reinv_id, usedByPrimaries: [] };
          reinvIfQueryMap.set(row.reinv_id, mapRow);
        }
        mapRow.usedByPrimaries = [
          ...mapRow.usedByPrimaries,
          ...row.usedByPrimaries,
        ];
        return row;
      });

    const allReinv = [...reinvIfQueryMap.keys(), ...forceWithoutQuery];

    if (allReinv.length < 1) return;

    let reinvObjs = [];
    m = await utilDef.retQuery(
      `SELECT t1.reinv_id, t1.path, t1.prepared, t2.query_reinv FROM ${Odai.composeIdPrefix()}_reserved_root AS t1 JOIN ${Odai.composeIdPrefix()}_${tablePostfix} AS t2 ON t1.reinv_id = t2.reinv_id WHERE t1.reinv_id IN (${allReinv.join(
        ","
      )})`,
      shared.Connect2.connWrap
    );
    if (m.state) reinvObjs = m.result;
    else throw new Error(m.result);

    // use reinvObjs and reinvIfQueryMap to make composite query using UNION asking for each of reinvIfQueryMap rows if will return excepted ids or not
    let unionQueries = [];
    let unionPrepares = [];
    reinvIfQueryMap.forEach((reinvIf) => {
      const reinvObj = reinvObjs.find(
        (reinvObj) => reinvObj.reinv_id === reinvIf.reinv_id
      );
      if (reinvObj) {
        let reinvQuery = JSON.parse(reinvObj.query_reinv);

        if (Array.isArray(reinvQuery)) reinvQuery = reinvQuery[0];

        const fromTable = reinvQuery.from.find(
          (table) =>
            table.db === tableMap.parentSchema &&
            table.table === tableMap.tableName
        );

        let whereClause = this.astifyOr(
          reinvIf.usedByPrimaries,
          undefined,
          undefined,
          fromTable.as
        );

        if (reinvQuery.where !== null) {
          reinvQuery.where.parentheses = true;
          whereClause.parentheses = true;

          whereClause = {
            type: "binary_expr",
            operator: "AND",
            left: reinvQuery.where,
            right: whereClause,
          };
        }

        reinvQuery.where = whereClause;

        unionQueries.push(this.parser.sqlify(reinvQuery));
        unionPrepares.push(JSON.parse(reinvObj.prepared));
      }
    });

    unionQueries = unionQueries.join(" UNION ");
    unionPrepares = unionPrepares.flat();

    let forceByQuery = [];
    m = await utilPre.retQuery(
      unionQueries,
      unionPrepares,
      shared.Connect2.connWrap
    );
    if (m.state) forceByQuery = m.result;
    else throw new Error(m.result);

    const forceReinv = [
      ...forceWithoutQuery,
      ...forceByQuery.map((fbq) => fbq.reinv_id),
    ];
    let forceReinvPaths = reinvObjs
      .filter((reinvObj) => forceReinv.includes(reinvObj.reinv_id))
      .map((reinvObj) => reinvObj.path);

    // delete duplicit paths
    forceReinvPaths = [...new Set(forceReinvPaths)];
  }

  /*
    runs through the ref_columns of query, performs basic check and dependency managing
  */
  static processColumns(processObj, entity, tablesMap, initial = true) {
    if (Array.isArray(entity)) {
      for (let i = 0, len = entity.length; i < len; i++)
        this.processColumns(processObj, entity[i], tablesMap, false);
    } else if (entity && entity.constructor === Object) {
      if (entity.type === "aggr_func") processObj.usesAggrFunc = true;
      if (entity.type === "select" && !initial)
        throw new Error("ERROR: query may not include subqueries");

      if (entity.type === "column_ref") {
        const columnTable =
          tablesMap.get(entity.table) || [...tablesMap.values()][0];

        if (entity.column === "*")
          throw new Error(
            "ERROR: use of * is not permitted in current version."
          );

        if (!entity.table) {
          if (tablesMap.size > 1)
            throw new Error(
              `ERROR: column '${entity.column}' must have specified table name in multi-table select!`
            );
          else entity.table = columnTable.as;
        }
      } else
        for (const value of Object.values(entity))
          this.processColumns(processObj, value, tablesMap, false);
    }
  }

  /*
    runs through every ref_column of query selecting every column of just once
  */
  static getColumns(entity, tablesMap, columnsMap) {
    if (!columnsMap)
      throw new Error("ERROR: columnsMap param cannot be empty!");

    if (Array.isArray(entity)) {
      for (let i = 0, len = entity.length; i < len; i++)
        this.getColumns(entity[i], tablesMap, columnsMap);
    } else if (entity && entity.constructor === Object) {
      if (entity.type === "column_ref") {
        const columnTable =
          tablesMap.get(entity.table) || tablesMap.values()[0];

        const columnId = `${columnTable.db}_${columnTable.table}_${entity.column}`;
        const col = columnsMap.get(columnId);
        if (!col)
          columnsMap.set(columnId, {
            db: columnTable.db,
            table: columnTable.table,
            column: entity.column,
          });
      } else
        for (const value of Object.values(entity))
          this.getColumns(value, tablesMap, columnsMap);
    }
  }

  /*
    @param path.. path that the query was requested by
    @param prepared... array of values that are used for prepared statement
    @param query... the whole query that is requested (after modifications)
    @param reinvObjs... includes info about all rows that will take a part in reinvalidation process
    @param columns... list of all columns that are take part in reinvalidation process
  */
  static async onReadEvent(path, prepared, query, reinvObjs, columns) {
    console.log("IN READ");

    let reinvId = null;

    let m = await utilPre.noReturnQuery(
      `INSERT IGNORE INTO ${Odai.composeIdPrefix()}_reserved_root (path, prepared, query_full) VALUES (?, ?, ?)`,
      [path, prepared, query],
      shared.Connect2.connWrap
    );
    if (!m.state) throw new Error(m.result);
    else if (m.result.affectedRows > 0) reinvId = m.result.insertIds[0];

    if (reinvId === null) {
      // already exists
      let reinvRows = [];
      m = await utilPre.retQuery(
        `SELECT reinv_id FROM ${Odai.composeIdPrefix()}_reserved_root WHERE path = ? AND query_full = ? AND prepared = ?`,
        [path, query, prepared],
        shared.Connect2.connWrap
      );
      if (m.state) reinvRows = m.result;
      else throw new Error(m.result);

      reinvId = reinvRows[0].reinv_id;

      reinvObjs.map(async (reinvObj) => {
        reinvObj.usedPrimaries = [];
        m = await utilDef.retQuery(
          `SELECT ${reinvObj.primaries.join(
            ","
          )} FROM ${Odai.composeIdPrefix()}_id_${Odai.composeIdPostfix(
            reinvObj.table.db,
            reinvObj.table.table
          )} WHERE reinv_id = ${reinvId}`,
          shared.Connect2.connWrap
        );
        if (m.state) reinvObj.usedPrimaries = m.result;
        else throw new Error(m.result);
      });
    } else {
      // create new reinv_row and insert its ids and primaries
      const mapReturn = reinvObjs.map(async (reinvObj) => {
        reinvObj.usedPrimaries = [];
        reinvObj.toAddColumns = [];

        columns.map((column) => {
          if (
            column.db === reinvObj.table.db &&
            column.table === reinvObj.table.table
          )
            reinvObj.toAddColumns.push(column.column);
        });

        reinvObj.ast.columns.push({
          as: "reinv_id",
          expr: {
            type: "number",
            value: reinvId,
          },
        });

        m = await utilPre.noReturnQuery(
          `INSERT IGNORE INTO ${Odai.composeIdPrefix()}_${Odai.composeIdPostfix(
            reinvObj.table.db,
            reinvObj.table.table
          )} (reinv_id, query_reinv) VALUES (${reinvId}, ?)`,
          [JSON.stringify(reinvObj.ast)],
          shared.Connect2.connWrap
        );
        if (!m.state) throw new Error(m.result);

        if (reinvObj.toAddColumns.length > 0) {
          const valueArr = reinvObj.toAddColumns.map((toAddColumn) => {
            return `(${reinvId}, '${toAddColumn}')`;
          });

          // go through all toAddColumns and make valueArr of each row to add
          m = await utilDef.noReturnQuery(
            `INSERT IGNORE INTO ${Odai.composeIdPrefix()}_col_${Odai.composeIdPostfix(
              reinvObj.table.db,
              reinvObj.table.table
            )} (reinv_id, col) VALUES ${valueArr.join(",")}`,
            shared.Connect2.connWrap
          );
          if (!m.state) throw new Error(m.result);
        }
      });
      await Promise.all(mapReturn);
    }

    reinvObjs.map((reinvObj) => {
      reinvObj.toAddIds = [];
      reinvObj.toDelIds = [];

      reinvObj.ids.map((currentId) => {
        if (
          reinvObj.usedPrimaries.findIndex((usedId) => {
            return reinvObj.primaries.every((idKey) => {
              return currentId[idKey] === usedId[idKey];
            });
          }) < 0
        )
          reinvObj.toAddIds.push(currentId);
      });

      reinvObj.usedPrimaries.map((usedId) => {
        if (
          reinvObj.ids.findIndex((currentId) => {
            return reinvObj.primaries.every((idKey) => {
              return currentId[idKey] === usedId[idKey];
            });
          }) < 0
        )
          reinvObj.toDelIds.push(usedId);
      });
    });

    reinvObjs.map(async (reinvObj) => {
      let tableKeys;
      if (reinvObj.toAddIds.length > 0)
        tableKeys = Object.keys(reinvObj.toAddIds[0]);
      else if (reinvObj.toDelIds.length > 0)
        tableKeys = Object.keys(reinvObj.toDelIds[0]);
      else return;

      if (reinvObj.toAddIds.length > 0) {
        const valueArr = reinvObj.toAddIds.map((toAddId) => {
          return `(${reinvId}, ${tableKeys
            .map((tableKey) => toAddId[tableKey])
            .join(",")})`;
        });

        // go through all toAddIds and make valueArr of each row to add
        m = await utilDef.noReturnQuery(
          `INSERT IGNORE INTO ${Odai.composeIdPrefix()}_id_${Odai.composeIdPostfix(
            reinvObj.table.db,
            reinvObj.table.table
          )} (reinv_id, ${tableKeys.join(",")}) VALUES ${valueArr.join(",")}`,
          shared.Connect2.connWrap
        );
        if (!m.state) throw new Error(m.result);
      }

      if (reinvObj.toDelIds.length > 0) {
        const conditionArr = reinvObj.toDelIds.map((toDelId) => {
          return `(reinv_id = ${reinvId} AND ${tableKeys
            .map((tableKey) => `${tableKey} = ${toDelId[tableKey]}`)
            .join(" AND ")})`;
        });

        // go through all toDelIds and prepare delete condition
        m = await utilDef.noReturnQuery(
          `DELETE FROM ${Odai.composeIdPrefix()}_id_${Odai.composeIdPostfix(
            reinvObj.table.db,
            reinvObj.table.table
          )} WHERE ${conditionArr.join(" OR ")}`,
          shared.Connect2.connWrap
        );
        if (!m.state) throw new Error(m.result);
      }
    });
  }

  /*
    @param options, object with config of operation:
  */
  static async read(options) {
    if (!options.path)
      throw new Error(
        "ERROR: ODAI read operation cannot be run without path parameter"
      );

    let fullAst = this.parser.astify(options.query);

    if (Array.isArray(fullAst)) fullAst = fullAst[0];
    if (!fullAst || fullAst.constructor !== Object)
      throw new Error("ERROR: not a valid mysql");

    const processObj = {};

    const from = fullAst.from;
    if (from === null) throw new Error("ERROR: from clause cannot be empty!");
    const fromMap = new Map();
    from.map((table) => {
      if (table.db === null) table.db = Odai.config.defaultDatabase;
      if (!table.as) table.as = table.table;
      if (!Odai.tablesHas(table.db, table.table))
        throw new Error(
          `ERROR: used table (${table.db}.${table.table}) not defined in table list!`
        );

      fromMap.set(table.as, table);
    });

    this.processColumns(processObj, fullAst, fromMap);

    // check if query results are to be grouped in some way
    processObj.isGroupedQuery =
      fullAst.groupby !== null || processObj.usesAggrFunc;

    const reinvAstStr = JSON.stringify({ ...fullAst, ...{ columns: [] } });

    // add primary keys of all tables to a query
    let i = -1;
    const reinvObjs = new Array(fromMap.size).fill(null).map((v, i) => ({
      i,
      table: null,
      ast: JSON.parse(reinvAstStr),
      primaries: [],
      ids: [],
    }));

    for (const table of fromMap.values()) {
      const reinvObj = reinvObjs[++i];
      const tableStructure = Odai.tablesGet(table.db, table.table);

      reinvObj.table = table;

      for (let j = 0, len = tableStructure.primaries.length; j < len; j++) {
        const primary = tableStructure.primaries[j].columnName;
        const primaryAs = `${table.db}_${table.table}_${primary}`;

        // add select of primaries into a select
        let expr = processObj.isGroupedQuery
          ? this.groupConcatExprTemplate(table.as, primary)
          : this.colRefExprTemplate(table.as, primary);
        this.addExprToSelect(fullAst, expr, primaryAs);

        reinvObj.primaries.push(primary);
      }
    }

    const columnsMap = new Map();
    this.getColumns(fullAst, fromMap, columnsMap);

    const query = this.parser.sqlify(fullAst);

    let r = await utilPre.retQuery(
      query,
      options.prepared,
      shared.Connect.connWrap
    );
    if (!r.state) return { state: false, result: r.result };

    // read the list of ids that were returned (get list of ids)
    r.result.map((result) => {
      if (processObj.isGroupedQuery) {
        reinvObjs.map((reinvObj) => {
          const primaryConcats = reinvObj.primaries.map((primary) => {
            const primaryIdentity = `${reinvObj.table.db}_${reinvObj.table.table}_${primary}`;
            const primaryConcat = JSON.parse(`[${result[primaryIdentity]}]`);
            delete result[primaryIdentity];
            return primaryConcat;
          });

          for (let i = 0, len = primaryConcats[0].length; i < len; i++) {
            const idObj = {};

            primaryConcats.map((primaryConcat, j) => {
              const primary = reinvObj.primaries[j];
              idObj[primary] = primaryConcat[i];
            });
            reinvObj.ids.push(idObj);
          }
        });
      } else {
        reinvObjs.map((reinvObj) => {
          const idObj = {};

          // extract primary keys from row
          reinvObj.primaries.map((primary) => {
            const primaryIdentity = `${reinvObj.table.db}_${reinvObj.table.table}_${primary}`;
            if (result.hasOwnProperty(primaryIdentity)) {
              idObj[primary] = result[primaryIdentity];
              delete result[primaryIdentity];
            }
          });

          reinvObj.ids.push(idObj);
        });
      }
    });

    this.onReadEvent(
      options.path,
      JSON.stringify(options.prepared),
      query,
      reinvObjs,
      Array.from(columnsMap.values())
    );

    const result = { state: true, result: r.result };
    if (options.transformer)
      QueryResultTransform[options.transformer](result, r.result);
    return result;
  }

  static addExprToSelect(ast, exprObj, exprAs) {
    ast.columns.push({
      as: exprAs || null,
      expr: exprObj,
    });
  }
}

module.exports.OdaiTable = OdaiTable;
