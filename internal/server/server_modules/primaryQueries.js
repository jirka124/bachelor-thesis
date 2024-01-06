class WaitOptions {
  constructor() {
    this.triedCount = 1;
    this.maxTries = 10;
    this.timeEscalation = 100;
  }
}

class QueryResultTransform {
  static retQuery(result, rows, fields) {
    result.state = true;
    result.result = rows.length > 0 ? rows : [];
  }
  static retQueryOne(result, rows, fields) {
    result.state = rows.length === 1;
    result.result =
      rows.length === 1 ? rows[0] : `${rows.length} rows instead of 1`;
  }
  static retQueryMore(result, rows, fields) {
    result.state = rows.length > 0;
    result.result =
      rows.length > 0 ? rows : `${rows.length} found instead of 2+`;
  }
  static noReturnQuery(result, rows, fields) {
    if (rows.affectedRows > 1)
      rows.insertIds = Array(rows.affectedRows)
        .fill(0, 0)
        .map((val, ind) => rows.insertId + ind);
    else rows.insertIds = [rows.insertId];

    result.state = true;
    result.result = rows;
  }
}

class PrimaryQueriesSkelt {
  delay(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  async waitForConnOpen(connWrap, waitOpts) {
    if (connWrap.conn) return connWrap.conn; // connection should be up and running

    const waitOptions = waitOpts || new WaitOptions();
    if (++waitOptions.triedCount > waitOptions.maxTries)
      throw new Error(
        "maximum tries reached, while waiting for the MYSQL connection to go up!"
      );

    console.log("WAITING UP FOR TRY: " + waitOptions.triedCount);
    await this.delay(waitOptions.triedCount * waitOptions.timeEscalation);

    return this.waitForConnOpen(connWrap, waitOptions);
  }
}

class PrimaryQueriesDef extends PrimaryQueriesSkelt {
  constructor() {
    super();
  }

  async retQuery(query, connWrap) {
    let result = { state: false, result: "unknown" };

    try {
      const conn = await this.waitForConnOpen(connWrap);

      const [rows, fields] = await conn.query(query);
      QueryResultTransform.retQuery(result, rows, fields);
    } catch (e) {
      console.error(e);
      result = { state: false, result: e };
    }
    return result;
  }
  async retQueryOne(query, connWrap) {
    let result = { state: false, result: "unknown" };

    try {
      const conn = await this.waitForConnOpen(connWrap);

      const [rows, fields] = await conn.query(query);
      QueryResultTransform.retQueryOne(result, rows, fields);
    } catch (e) {
      console.error(e);
      result = { state: false, result: e };
    }
    return result;
  }
  async retQueryMore(query, connWrap) {
    let result = { state: false, result: "unknown" };

    try {
      const conn = await this.waitForConnOpen(connWrap);

      const [rows, fields] = await conn.query(query);
      QueryResultTransform.retQueryMore(result, rows, fields);
    } catch (e) {
      console.error(e);
      result = { state: false, result: e };
    }
    return result;
  }
  async noReturnQuery(query, connWrap) {
    let result = { state: false, result: "unknown" };

    try {
      const conn = await this.waitForConnOpen(connWrap);

      const [rows, fields] = await conn.query(query);
      QueryResultTransform.noReturnQuery(result, rows, fields);
    } catch (e) {
      console.error(e);
      result = { state: false, result: e };
    }
    return result;
  }
}

class PrimaryQueriesPre extends PrimaryQueriesSkelt {
  constructor() {
    super();
  }

  async retQuery(query, statements, connWrap) {
    // ('SELECT * from table where name=?',['Thomas']
    let result = { state: false, result: "unknown" };

    try {
      const conn = await this.waitForConnOpen(connWrap);

      const [rows, fields] = await conn.execute(query, statements);
      QueryResultTransform.retQuery(result, rows, fields);
    } catch (e) {
      console.error(e);
      result = { state: false, result: e };
    }
    return result;
  }
  async retQueryOne(query, statements, connWrap) {
    let result = { state: false, result: "unknown" };

    try {
      const conn = await this.waitForConnOpen(connWrap);

      const [rows, fields] = await conn.execute(query, statements);
      QueryResultTransform.retQueryOne(result, rows, fields);
    } catch (e) {
      console.error(e);
      result = { state: false, result: e };
    }
    return result;
  }
  async retQueryMore(query, statements, connWrap) {
    let result = { state: false, result: "unknown" };

    try {
      const conn = await this.waitForConnOpen(connWrap);

      const [rows, fields] = await conn.execute(query, statements);
      QueryResultTransform.retQueryMore(result, rows, fields);
    } catch (e) {
      console.error(e);
      result = { state: false, result: e };
    }
    return result;
  }
  async noReturnQuery(query, statements, connWrap) {
    let result = { state: false, result: "unknown" };

    try {
      const conn = await this.waitForConnOpen(connWrap);

      const [rows, fields] = await conn.execute(query, statements);
      QueryResultTransform.noReturnQuery(result, rows, fields);
    } catch (e) {
      console.error(e);
      result = { state: false, result: e };
    }
    return result;
  }
}

module.exports.QueryResultTransform = QueryResultTransform;
module.exports.PrimaryQueriesDef = PrimaryQueriesDef;
module.exports.PrimaryQueriesPre = PrimaryQueriesPre;
module.exports.utilDef = new PrimaryQueriesDef();
module.exports.utilPre = new PrimaryQueriesPre();
