const axios = require("axios");
const { utilDef, utilPre } = require("../primaryQueries");
const shared = require("../shared");
/*
  On-Demand Action Interceptor
  Wrapper for CRUD operations of MySQL automating the on-demand regeneration
*/
class Odai {
  static OdaiTables = [];

  static tablesGet(database, table) {
    const t = this.OdaiTables.find(
      (t) => t.database === database && t.table === table
    );
    return t;
  }
  static tablesHas(database, table) {
    const t = this.tablesGet(database, table);
    return t ? t : null;
  }

  static composeIdPrefix() {
    return `${this.config.appName}_reinv`;
  }
  static composeIdPostfix(dtb, table) {
    return `${dtb}_${table}`;
  }

  static config = {
    defaultDatabase: "bachelor_internal",
    appName: "attendance_track",
  };

  static async loadClass() {
    // create and use reinv_reserved_dtb if not yet created
    await this.initDatabase();
    // create reinvalidatin tables for each table present in OdaiTables
    await this.initUsedTables();

    // register termination signal handler
    process.on("message", async (msg) => {
      if (msg == "shutdown") {
        await this.reinvalidateAll();
        process.exit(0);
      }
    });
  }

  static async initDatabase() {
    // init and use database used for reinvalidation purposes
    let m = await utilDef.noReturnQuery(
      `CREATE DATABASE IF NOT EXISTS reinv_reserved_dtb`,
      shared.Connect2.connWrap
    );
    m = await utilDef.noReturnQuery(
      `USE reinv_reserved_dtb`,
      shared.Connect2.connWrap
    );
  }
  static async initUsedTables() {
    // drop root table if exists
    let r = await utilDef.noReturnQuery(
      `DROP TABLE IF EXISTS ${this.composeIdPrefix()}_reserved_root`,
      shared.Connect2.connWrap
    );
    if (!r.state) throw new Error(r.result);

    r = await utilDef.noReturnQuery(
      `CREATE TABLE ${this.composeIdPrefix()}_reserved_root (
        reinv_id int AUTO_INCREMENT,
        path varchar(255),
        prepared text,
        query_full text,
        CONSTRAINT PK_reinv_reserved_root PRIMARY KEY (reinv_id),
        UNIQUE INDEX SEC1_reinv_reserved_root (path, prepared, query_full)
        )`,
      shared.Connect2.connWrap
    );
    if (!r.state) throw new Error(r.result);

    // loop through every defined table
    this.OdaiTables.map(async (table) => {
      const tablePostfix = this.composeIdPostfix(table.database, table.table);

      // select information about
      r = await utilDef.retQuery(
        `SELECT COLUMN_NAME AS columnName, DATA_TYPE AS dataType, COLUMN_TYPE AS columnType, COLUMN_KEY AS columnKey FROM information_schema.columns WHERE table_schema = '${table.database}' AND table_name = '${table.table}' AND COLUMN_KEY = 'PRI'`,
        shared.Connect2.connWrap
      );
      if (r.state) table.primaries = r.result;
      else throw new Error(r.result);

      // drop tables if exists
      r = await utilDef.noReturnQuery(
        `DROP TABLE IF EXISTS ${this.composeIdPrefix()}_${tablePostfix}, ${this.composeIdPrefix()}_id_${tablePostfix}, ${this.composeIdPrefix()}_col_${tablePostfix}`,
        shared.Connect2.connWrap
      );
      if (!r.state) throw new Error(r.result);

      const primaryColsDefinition = table.primaries.map(
        (col) => `${col.columnName} ${col.columnType}`
      );
      const primaryColsNames = table.primaries.map((col) => col.columnName);

      // create reinv tables for a given table
      r = await utilDef.noReturnQuery(
        `CREATE TABLE ${this.composeIdPrefix()}_${tablePostfix} (
          reinv_id int,
          query_reinv text,
          CONSTRAINT PK_reinv_${tablePostfix} PRIMARY KEY (reinv_id)
        )`,
        shared.Connect2.connWrap
      );
      if (!r.state) throw new Error(r.result);

      r = await utilDef.noReturnQuery(
        `CREATE TABLE ${this.composeIdPrefix()}_id_${tablePostfix} (
          reinv_id int,
          ${primaryColsDefinition.join(",")},
          CONSTRAINT PK_reinv_id_${tablePostfix} PRIMARY KEY (reinv_id, ${primaryColsNames.join(
          ","
        )}),
          INDEX (${primaryColsNames.join(",")})
        )`,
        shared.Connect2.connWrap
      );
      if (!r.state) throw new Error(r.result);

      r = await utilDef.noReturnQuery(
        `CREATE TABLE ${this.composeIdPrefix()}_col_${tablePostfix} (
          reinv_id int,
          col varchar(255),
          CONSTRAINT PK_reinv_col_${tablePostfix} PRIMARY KEY (reinv_id, col),
          INDEX (col)
        )`,
        shared.Connect2.connWrap
      );
      if (!r.state) throw new Error(r.result);
    });
  }

  // function for reinvalidation on SSR API
  static reinvalidatePaths(paths) {
    // TODO:
  }

  // function for full reinvalidation on SSR API
  static async reinvalidateAll() {
    // TODO:
  }
}

module.exports.Odai = Odai;
