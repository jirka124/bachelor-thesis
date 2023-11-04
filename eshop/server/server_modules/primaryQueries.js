

class WaitOptions {
  constructor() {
    this.triedCount = 1;
    this.maxTries = 10;
    this.timeEscalation = 100;
  }
}

class PrimaryQueriesSkelt {
  delay(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  async waitForConnOpen(connWrap, waitOpts) {
    if(connWrap.conn) return connWrap.conn; // connection should be up and running

    const waitOptions = waitOpts || new WaitOptions();
    if(++waitOptions.triedCount > waitOptions.maxTries) throw new Error("maximum tries reached, while waiting for the MYSQL connection to go up!")

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

      const [rows, fields] = await conn.execute(query)
      if(rows.length > 0) result = { state: true, result: rows }
      else result = { state: true, result: [] }
    } catch(e) {
      console.error(e);
      result = { state: false, result: e };
    }
    return result;
  }
  async retQueryOne(query, connWrap) {
    let result = { state: false, result: "unknown" };

    try {
      const conn = await this.waitForConnOpen(connWrap);

      const [rows, fields] = await conn.execute(query)
      if(rows.length === 1) result = { state: true, result: rows[0] }
      else result = { state: false, result: `${rows.length} rows instead of 1` }
    } catch(e) {
      console.error(e);
      result = { state: false, result: e };
    }
    return result;
  }
  async retQueryMore(query, connWrap) {
    let result = { state: false, result: "unknown" };

    try {
      const conn = await this.waitForConnOpen(connWrap);

      const [rows, fields] = await conn.execute(query)
      if(rows.length > 0) result = { state: true, result: rows }
      else result = { state: false, result: `${rows.length} found instead of 2+` }
    } catch(e) {
      console.error(e);
      result = { state: false, result: e };
    }
    return result;
  }
  async noReturnQuery(query, connWrap) {
    let result = { state: false, result: "unknown" };

    try {
      const conn = await this.waitForConnOpen(connWrap);

      const [rows, fields] = await conn.execute(query, statements)
      if(rows.affectedRows > 1) rows.insertIds = Array(rows.affectedRows).fill(0, 0).map((val, ind) => rows.insertId + ind)
      else rows.insertIds = [rows.insertId]
      result = { state: true, result: rows }
    } catch(e) {
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

  async retQuery(query, statements, connWrap) { // ('SELECT * from table where name=?',['Thomas']
    let result = { state: false, result: "unknown" };

    try {
      const conn = await this.waitForConnOpen(connWrap);

      const [rows, fields] = await conn.execute(query, statements)
      if(rows.length > 0) result = { state: true, result: rows }
      else result = { state: true, result: [] }
    } catch(e) {
      console.error(e);
      result = { state: false, result: e };
    }
    return result;
  }
  async retQueryOne(query, statements, connWrap) {
    let result = { state: false, result: "unknown" };

    try {
      const conn = await this.waitForConnOpen(connWrap);

      const [rows, fields] = await conn.execute(query, statements)
      if(rows.length === 1) result = { state: true, result: rows[0] }
      else result = { state: false, result: `${rows.length} rows instead of 1` }
    } catch(e) {
      console.error(e);
      result = { state: false, result: e };
    }
    return result;
  }
  async retQueryMore(query, statements, connWrap) {
    let result = { state: false, result: "unknown" };

    try {
      const conn = await this.waitForConnOpen(connWrap);

      const [rows, fields] = await conn.execute(query, statements)
      if(rows.length > 0) result = { state: true, result: rows }
      else result = { state: false, result: `${rows.length} found instead of 2+` }
    } catch(e) {
      console.error(e);
      result = { state: false, result: e };
    }
    return result;
  }
  async noReturnQuery(query, statements, connWrap) {
    let result = { state: false, result: "unknown" };

    try {
      const conn = await this.waitForConnOpen(connWrap);

      const [rows, fields] = await conn.execute(query, statements)
      if(rows.affectedRows > 1) rows.insertIds = Array(rows.affectedRows).fill(0, 0).map((val, ind) => rows.insertId + ind)
      else rows.insertIds = [rows.insertId]
      result = { state: true, result: rows }
    } catch(e) {
      console.error(e);
      result = { state: false, result: e };
    }
    return result;
  }
}

module.exports.PrimaryQueriesDef = PrimaryQueriesDef;
module.exports.PrimaryQueriesPre = PrimaryQueriesPre;
module.exports.utilDef = new PrimaryQueriesDef();
module.exports.utilPre = new PrimaryQueriesPre();