const express = require("express");
const formidable = require("formidable");
const bcrypt = require("bcrypt");
const sharp = require("sharp");
const router = express.Router();
const crypto = require("node:crypto");
const utilAll = require("./server_modules/utils/utilAll");
const { utilPre } = require("./server_modules/primaryQueries");
const shared = require("./server_modules/shared");
const nodeUtil = require("util");
const path = require("path");
const fs = require("fs/promises");

/*
router.get("/hashup", async function (req, res) {
  let hash = null,
    reqState = null;

  const inputs = {
    toHashStr: req.query.toHashStr || null,
  };

  try {
    if (inputs.toHashStr === null) throw new Error("HGO48E869EFI");

    hash = await bcrypt.hash(inputs.toHashStr, 10);
  } catch (e) {
    console.log(e);
    reqState = e.message;
  }

  res.send(JSON.stringify({ reqState, result: { hash } }));
  res.end();
});
*/

router.post("/login", async function (req, res) {
  let reqState = null;

  const inputs = {
    username: req.body.username || "",
    pass: req.body.pass || "",
  };

  try {
    let teacherId = null,
      teacherPass = null;

    if (req.session.teacherId) {
      throw new Error("HZGET78DI");
    }

    let r = await utilPre.retQueryOne(
      `SELECT user_id AS teacherId, password FROM user WHERE username = ?`,
      [inputs.username],
      shared.Connect.connWrap
    );
    if (r.state) {
      teacherId = r.result.teacherId;
      teacherPass = r.result.password;
    } else throw new Error("RPTRD1D84E");

    const isValid = await bcrypt.compare(inputs.pass, teacherPass);
    if (!isValid) throw new Error("TOJO7DJOWE89");

    req.session.teacherId = teacherId;

    const saveSessionAsync = nodeUtil
      .promisify(req.session.save)
      .bind(req.session);

    try {
      await saveSessionAsync();
    } catch (err) {
      throw new Error("LDP761D84E");
    }
  } catch (e) {
    console.log(e);
    reqState = e.message;
  }

  res.send(JSON.stringify({ reqState, result: {} }));
  res.end();
});

router.post("/whoami", async function (req, res) {
  let whoami = { teacherId: null, teacherName: null },
    reqState = null;

  whoami: try {
    if (!req.session.teacherId) break whoami;

    let r = await utilPre.retQueryOne(
      `SELECT username FROM user WHERE user_id = ?`,
      [req.session.teacherId],
      shared.Connect.connWrap
    );
    if (r.state) {
      whoami = {
        teacherId: req.session.teacherId,
        teacherName: r.result.username,
      };
    } else throw new Error("ZHJ8VFJ5B7");
  } catch (e) {
    console.log(e);
    reqState = e.message;
  }

  res.send(JSON.stringify({ reqState, result: { whoami } }));
  res.end();
});

router.post("/is-logged", async function (req, res) {
  let isLogged = false,
    reqState = null;

  try {
    if (!req.session.teacherId) throw new Error("VZE75ANENI");
    isLogged = true;
  } catch (e) {
    console.log(e);
    reqState = e.message;
  }

  res.send(JSON.stringify({ reqState, result: { isLogged } }));
  res.end();
});

router.use(function (req, res, next) {
  if (!req.session || !req.session.teacherId) {
    res.send(JSON.stringify({ reqState: "ZTIDOFSEI4D", result: {} }));
    res.end();
  } else next();
});

// TODO: implement logout
router.post("/logout", async function (req, res) {
  let reqState = null;

  try {
    const destroySessionAsync = nodeUtil
      .promisify(req.session.destroy)
      .bind(req.session);

    try {
      await destroySessionAsync();
    } catch (err) {
      throw new Error("ZGRS1D84E");
    }
  } catch (e) {
    console.log(e);
    reqState = e.message;
  }

  res.send(JSON.stringify({ reqState, result: {} }));
  res.end();
});

router.post("/view-edit-class-choose-csr", async function (req, res) {
  let reqState = null,
    classes = [];

  try {
    let r = await utilPre.retQuery(
      `SELECT class_id AS id, subject, day, t_by AS tBy, t_till AS tTill, recurrence, c_by AS cBy, c_till AS cTill, min_attend AS minAtt FROM class WHERE teacher_id = ?`,
      [req.session.teacherId],
      shared.Connect.connWrap
    );
    if (r.state) {
      classes = r.result;
    } else throw new Error("HU45EQNAI8B");
  } catch (e) {
    console.log(e);
    reqState = e.message;
  }

  res.send(JSON.stringify({ reqState, result: { classes } }));
  res.end();
});

router.post("/create-class", async function (req, res) {
  let reqState = null;

  const inputs = {
    classId: req.body.id || null,
    subject: req.body.subject || null,
    day: req.body.day || null,
    tBy: req.body.tBy || null,
    tTill: req.body.tTill || null,
    recurrence: req.body.recurrence || null,
    cBy: req.body.cBy || null,
    cTill: req.body.cTill || null,
    minAtt: parseInt(req.body.minAtt) || null,
  };
  const allowedDays = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];
  const allowedRecurs = ["once", "e1week", "e2week", "e3week"];

  try {
    if (inputs.classId !== "AUTO") throw new Error("H45QN25YEN96AA");
    if (
      typeof inputs.subject !== "string" ||
      inputs.subject.length < 1 ||
      inputs.subject.length > 10
    )
      throw new Error("A1E94AEBYUE22A");
    if (!allowedDays.includes(inputs.day)) throw new Error("45VI65WQN94AB");
    if (!/^\d{2}:\d{2}$/.test(inputs.tBy)) throw new Error("45VAN21ANIL613");
    if (!/^\d{2}:\d{2}$/.test(inputs.tTill)) throw new Error("78VIN64EAN9AN3");
    if (!allowedRecurs.includes(inputs.recurrence))
      throw new Error("BL31AIUB98ABL");
    if (!/^\d{4}-\d{2}-\d{2}$/.test(inputs.cBy) || isNaN(new Date(inputs.cBy)))
      throw new Error("HSD78ANE12YIE");
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(inputs.cTill) ||
      isNaN(new Date(inputs.cTill))
    )
      throw new Error("BJ12AN98YEN74Y");
    if (
      typeof inputs.minAtt !== "number" ||
      inputs.minAtt < 0 ||
      inputs.minAtt > 100
    )
      throw new Error("BGP12QBNYI94CB");

    let r = await utilPre.noReturnQuery(
      `INSERT INTO class (teacher_id, subject, day, t_by, t_till, recurrence, c_by, c_till, min_attend) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        req.session.teacherId,
        inputs.subject,
        allowedDays.indexOf(inputs.day),
        inputs.tBy,
        inputs.tTill,
        inputs.recurrence,
        inputs.cBy,
        inputs.cTill,
        inputs.minAtt,
      ],
      shared.Connect.connWrap
    );
    if (!r.state) throw new Error("HIE12ACNA94ACIG");
  } catch (e) {
    console.log(e);
    reqState = e.message;
  }

  res.send(JSON.stringify({ reqState, result: {} }));
  res.end();
});

router.post("/view-edit-class-csr", async function (req, res) {
  let reqState = null,
    classObj = null,
    attendants = [];

  const inputs = {
    classId: parseInt(req.body.classId) || null,
  };

  try {
    if (typeof inputs.classId !== "number" || inputs.classId < 1)
      throw new Error("GT84BE320ABBN7");

    let r = await utilPre.retQueryOne(
      `SELECT class_id AS id, subject, day, t_by AS tBy, t_till AS tTill, recurrence, c_by AS cBy, c_till AS cTill, min_attend AS minAtt FROM class WHERE class_id = ? AND teacher_id = ?`,
      [inputs.classId, req.session.teacherId],
      shared.Connect.connWrap
    );
    if (r.state) {
      classObj = r.result;
    } else throw new Error("UJ45AENY64AB8WB");

    r = await utilPre.retQuery(
      `SELECT attendant_id AS id, class_id AS classId, name FROM attendant WHERE class_id = ?`,
      [inputs.classId],
      shared.Connect.connWrap
    );
    if (r.state) {
      attendants = r.result;
    } else throw new Error("GUE15AEN3Y2EBAGT");
  } catch (e) {
    console.log(e);
    reqState = e.message;
  }

  res.send(JSON.stringify({ reqState, result: { classObj, attendants } }));
  res.end();
});

router.post("/save-class", async function (req, res) {
  let reqState = null;

  const inputs = {
    classId: parseInt(req.body.id) || null,
    subject: req.body.subject || null,
    day: req.body.day || null,
    tBy: req.body.tBy || null,
    tTill: req.body.tTill || null,
    recurrence: req.body.recurrence || null,
    cBy: req.body.cBy || null,
    cTill: req.body.cTill || null,
    minAtt: parseInt(req.body.minAtt) || null,
  };
  const allowedDays = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];
  const allowedRecurs = ["once", "e1week", "e2week", "e3week"];

  try {
    if (typeof inputs.classId !== "number" || inputs.classId < 1)
      throw new Error("BV84AEMB32A95Q");
    if (
      typeof inputs.subject !== "string" ||
      inputs.subject.length < 1 ||
      inputs.subject.length > 10
    )
      throw new Error("784VEANII32ABEPKG");
    if (!allowedDays.includes(inputs.day)) throw new Error("784YNENYKL55YMAGZ");
    if (!/^\d{2}:\d{2}$/.test(inputs.tBy)) throw new Error("45CE31A0YYENN54");
    if (!/^\d{2}:\d{2}$/.test(inputs.tTill))
      throw new Error("J4OA12AB65ABL65A");
    if (!allowedRecurs.includes(inputs.recurrence))
      throw new Error("78SJN32YNENY46YNA4");
    if (!/^\d{4}-\d{2}-\d{2}$/.test(inputs.cBy) || isNaN(new Date(inputs.cBy)))
      throw new Error("84ACNE32IIENA655");
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(inputs.cTill) ||
      isNaN(new Date(inputs.cTill))
    )
      throw new Error("84AICNE3254YINAGE");
    if (
      typeof inputs.minAtt !== "number" ||
      inputs.minAtt < 0 ||
      inputs.minAtt > 100
    )
      throw new Error("94ACBNAL23AYNA84A");

    let r = await utilPre.noReturnQuery(
      `UPDATE class SET subject = ?, day = ?, t_by = ?, t_till = ?, recurrence = ?, c_by = ?, c_till = ?, min_attend = ? WHERE class_id = ? AND teacher_id = ?`,
      [
        inputs.subject,
        allowedDays.indexOf(inputs.day),
        inputs.tBy,
        inputs.tTill,
        inputs.recurrence,
        inputs.cBy,
        inputs.cTill,
        inputs.minAtt,
        inputs.classId,
        req.session.teacherId,
      ],
      shared.Connect.connWrap
    );
    if (!r.state) throw new Error("78AYNIE35AYN84YNALNO");
  } catch (e) {
    console.log(e);
    reqState = e.message;
  }

  res.send(JSON.stringify({ reqState, result: {} }));
  res.end();
});

router.post("/delete-class", async function (req, res) {
  let reqState = null;

  const inputs = {
    classId: parseInt(req.body.classId) || null,
  };

  try {
    if (typeof inputs.classId !== "number" || inputs.classId < 1)
      throw new Error("6A89ANC75ANEABA");

    let r = await utilPre.noReturnQuery(
      `DELETE FROM class WHERE class_id = ? AND teacher_id = ?`,
      [inputs.classId, req.session.teacherId],
      shared.Connect.connWrap
    );
    if (!r.state) throw new Error("78VN36ANY944YNEB");
  } catch (e) {
    console.log(e);
    reqState = e.message;
  }

  res.send(JSON.stringify({ reqState, result: {} }));
  res.end();
});

router.post("/create-attendant", async function (req, res) {
  let reqState = null;

  const inputs = {
    attendId: req.body.id || null,
    name: req.body.name || null,
    classId: parseInt(req.body.classId) || null,
  };

  try {
    if (inputs.attendId !== "AUTO") throw new Error("GU45YN996ANHJ8");
    if (
      typeof inputs.name !== "string" ||
      inputs.name.length < 1 ||
      inputs.name.length > 64
    )
      throw new Error("78QN33ABPLA45YBE");
    if (typeof inputs.classId !== "number" || inputs.classId < 1)
      throw new Error("78N44AB3ERRMLA8");

    let r = await utilPre.retQueryOne(
      `SELECT teacher_id FROM class WHERE class_id = ? AND teacher_id = ?`,
      [inputs.classId, req.session.teacherId],
      shared.Connect.connWrap
    );
    if (!r.state) throw new Error("TU45ACN730ABMPO");

    r = await utilPre.noReturnQuery(
      `INSERT INTO attendant (class_id, name) VALUES (?, ?)`,
      [inputs.classId, inputs.name],
      shared.Connect.connWrap
    );
    if (!r.state) throw new Error("BBUI45AYNLLNYYZH");
  } catch (e) {
    console.log(e);
    reqState = e.message;
  }

  res.send(JSON.stringify({ reqState, result: {} }));
  res.end();
});

router.post("/view-edit-attendant-csr", async function (req, res) {
  let reqState = null,
    attendObj = null;

  const inputs = {
    attendId: parseInt(req.body.attendId) || null,
  };

  try {
    if (typeof inputs.attendId !== "number" || inputs.attendId < 1)
      throw new Error("ZU78YMNBIE155ABE");

    let r = await utilPre.retQueryOne(
      `SELECT t1.class_id FROM attendant t1 JOIN class t2 ON t1.class_id = t2.class_id WHERE t1.attendant_id = ? AND t2.teacher_id = ?`,
      [inputs.attendId, req.session.teacherId],
      shared.Connect.connWrap
    );
    if (!r.state) throw new Error("RUR45YNABBYI63Y");

    r = await utilPre.retQueryOne(
      `SELECT attendant_id AS id, name FROM attendant WHERE attendant_id = ?`,
      [inputs.attendId],
      shared.Connect.connWrap
    );
    if (r.state) {
      attendObj = r.result;
    } else throw new Error("TUH45YGGIHYNE65Y");
  } catch (e) {
    console.log(e);
    reqState = e.message;
  }

  res.send(JSON.stringify({ reqState, result: { attendObj } }));
  res.end();
});

router.post("/save-attendant", async function (req, res) {
  let reqState = null;

  const inputs = {
    attendId: parseInt(req.body.id) || null,
    name: req.body.name || null,
  };

  try {
    if (typeof inputs.attendId !== "number" || inputs.attendId < 1)
      throw new Error("ZURL62YENYINNL8");
    if (
      typeof inputs.name !== "string" ||
      inputs.name.length < 1 ||
      inputs.name.length > 64
    )
      throw new Error("43YN61YNNAI62IHJ");

    let r = await utilPre.retQueryOne(
      `SELECT t1.class_id FROM attendant t1 JOIN class t2 ON t1.class_id = t2.class_id WHERE t1.attendant_id = ? AND t2.teacher_id = ?`,
      [inputs.attendId, req.session.teacherId],
      shared.Connect.connWrap
    );
    if (!r.state) throw new Error("45YN36YANIN45YANT");

    r = await utilPre.noReturnQuery(
      `UPDATE attendant SET name = ? WHERE attendant_id = ?`,
      [inputs.name, inputs.attendId],
      shared.Connect.connWrap
    );
    if (!r.state) throw new Error("11BNBII45YNAL78A");
  } catch (e) {
    console.log(e);
    reqState = e.message;
  }

  res.send(JSON.stringify({ reqState, result: {} }));
  res.end();
});

router.post("/delete-attendant", async function (req, res) {
  let reqState = null;

  const inputs = {
    attendId: parseInt(req.body.attendId) || null,
  };

  try {
    if (typeof inputs.attendId !== "number" || inputs.attendId < 1)
      throw new Error("30AYINY85YIANGL");

    let r = await utilPre.retQueryOne(
      `SELECT t1.class_id FROM attendant t1 JOIN class t2 ON t1.class_id = t2.class_id WHERE t1.attendant_id = ? AND t2.teacher_id = ?`,
      [inputs.attendId, req.session.teacherId],
      shared.Connect.connWrap
    );
    if (!r.state) throw new Error("96AYN003YNALIE45");

    r = await utilPre.noReturnQuery(
      `DELETE FROM attendant WHERE attendant_id = ?`,
      [inputs.attendId],
      shared.Connect.connWrap
    );
    if (!r.state) throw new Error("N96YNAB2BIAN006YA");
  } catch (e) {
    console.log(e);
    reqState = e.message;
  }

  res.send(JSON.stringify({ reqState, result: {} }));
  res.end();
});

router.post("/view-schedule-csr", async function (req, res) {
  let reqState = null,
    classes = [];

  try {
    let r = await utilPre.retQuery(
      `SELECT class_id AS id, subject, day, t_by AS tBy, t_till AS tTill, recurrence, c_by AS cBy, c_till AS cTill, min_attend AS minAtt FROM class WHERE teacher_id = ?`,
      [req.session.teacherId],
      shared.Connect.connWrap
    );
    if (r.state) {
      classes = r.result;
    } else throw new Error("78BB30AYN9LYI21");
  } catch (e) {
    console.log(e);
    reqState = e.message;
  }

  res.send(JSON.stringify({ reqState, result: { classes } }));
  res.end();
});

router.post("/view-write-attend-csr", async function (req, res) {
  let reqState = null,
    classObj = null,
    attendants = [],
    presence = [];

  const inputs = {
    classId: parseInt(req.body.classId) || null,
    recurrId: parseInt(req.body.recurrId) || null,
  };

  try {
    if (typeof inputs.classId !== "number" || inputs.classId < 1)
      throw new Error("45VMA36YBIE84A95");
    if (typeof inputs.recurrId !== "number" || inputs.recurrId < 1)
      throw new Error("36YAN44ACNEBYLIIE");

    let r = await utilPre.retQueryOne(
      `SELECT class_id AS id, subject, day, t_by AS tBy, t_till AS tTill, recurrence, c_by AS cBy, c_till AS cTill, min_attend AS minAtt FROM class WHERE class_id = ? AND teacher_id = ?`,
      [inputs.classId, req.session.teacherId],
      shared.Connect.connWrap
    );
    if (r.state) {
      classObj = r.result;
    } else throw new Error("TU45YNA66AGA15YIEF");

    r = await utilPre.retQuery(
      `SELECT attendant_id AS id, class_id AS classId, name FROM attendant WHERE class_id = ?`,
      [inputs.classId],
      shared.Connect.connWrap
    );
    if (r.state) {
      attendants = r.result;
    } else throw new Error("L12YNAUUI3YAKLEIA20T");

    r = await utilPre.retQuery(
      `SELECT class_id AS classId, recurr_id AS recurrId, attendant_id AS attendantId FROM presence WHERE class_id = ? AND recurr_id = ?`,
      [inputs.classId, inputs.recurrId],
      shared.Connect.connWrap
    );
    if (r.state) {
      presence = r.result;
    } else throw new Error("KU75YNA95YVA7508ALY");
  } catch (e) {
    console.log(e);
    reqState = e.message;
  }

  res.send(
    JSON.stringify({ reqState, result: { classObj, attendants, presence } })
  );
  res.end();
});

router.post("/create-presence", async function (req, res) {
  let reqState = null,
    newPresences = [];

  const inputs = {
    classId: parseInt(req.body.classId) || null,
    recurrId: parseInt(req.body.recurrId) || null,
    attendants: req.body.attendants || null,
  };

  try {
    if (typeof inputs.classId !== "number" || inputs.classId < 1)
      throw new Error("78VI12YNA96YNENL");
    if (typeof inputs.recurrId !== "number" || inputs.recurrId < 1)
      throw new Error("45YNAMM36YBIWBAJ");
    if (!Array.isArray(inputs.attendants) || inputs.attendants.length < 1)
      throw new Error("LL36YNAIN84Y0ANYL");
    if (inputs.attendants.some((a) => typeof a !== "number" || a < 1))
      throw new Error("CC66YA22YIABB32Y0");

    let r = await utilPre.retQueryOne(
      `SELECT class_id FROM class WHERE class_id = ? AND teacher_id = ?`,
      [inputs.classId, req.session.teacherId],
      shared.Connect.connWrap
    );
    if (!r.state) throw new Error("12VNA96YNAI00AYNEB");

    const prepArr = [];
    const valArr = inputs.attendants.map((a) => {
      newPresences.push({
        classId: inputs.classId,
        recurrId: inputs.recurrId,
        attendantId: a,
      });
      prepArr.push(inputs.classId, inputs.recurrId, a);
      return `(?, ?, ?)`;
    });

    r = await utilPre.noReturnQuery(
      `INSERT IGNORE INTO presence (class_id, recurr_id, attendant_id) VALUES ${valArr.join(
        ","
      )}`,
      prepArr,
      shared.Connect.connWrap
    );
    if (!r.state) throw new Error("B00YNA96IN63YAIE");
  } catch (e) {
    console.log(e);
    reqState = e.message;
  }

  res.send(JSON.stringify({ reqState, result: { newPresences } }));
  res.end();
});

router.post("/delete-presence", async function (req, res) {
  let reqState = null,
    oldPresences = [];

  const inputs = {
    classId: parseInt(req.body.classId) || null,
    recurrId: parseInt(req.body.recurrId) || null,
    attendants: req.body.attendants || null,
  };

  try {
    if (typeof inputs.classId !== "number" || inputs.classId < 1)
      throw new Error("BN12YANLIEG96YHG");
    if (typeof inputs.recurrId !== "number" || inputs.recurrId < 1)
      throw new Error("48YANGIE12YANGLIE");
    if (!Array.isArray(inputs.attendants) || inputs.attendants.length < 1)
      throw new Error("BUEH32YNA5YIAN662Y");
    if (inputs.attendants.some((a) => typeof a !== "number" || a < 1))
      throw new Error("ACIE36YANGI5483AI");

    let r = await utilPre.retQueryOne(
      `SELECT class_id FROM class WHERE class_id = ? AND teacher_id = ?`,
      [inputs.classId, req.session.teacherId],
      shared.Connect.connWrap
    );
    if (!r.state) throw new Error("GU78YANLI320YUWBAB");

    const prepArr = inputs.attendants.map((a) => {
      oldPresences.push({
        classId: inputs.classId,
        recurrId: inputs.recurrId,
        attendantId: a,
      });
      return a;
    });

    r = await utilPre.noReturnQuery(
      `DELETE FROM presence WHERE class_id = ? AND recurr_id = ? AND attendant_id IN (${new Array(
        oldPresences.length
      )
        .fill("?")
        .join(",")})`,
      [inputs.classId, inputs.recurrId, ...prepArr],
      shared.Connect.connWrap
    );
    if (!r.state) throw new Error("IN45YNAINE32YAN8D");
  } catch (e) {
    console.log(e);
    reqState = e.message;
  }

  res.send(JSON.stringify({ reqState, result: { oldPresences } }));
  res.end();
});

router.post("/view-read-attend-choose-csr", async function (req, res) {
  let reqState = null,
    classes = [];

  try {
    let r = await utilPre.retQuery(
      `SELECT class_id AS id, subject, day, t_by AS tBy, t_till AS tTill, recurrence, c_by AS cBy, c_till AS cTill, min_attend AS minAtt FROM class WHERE teacher_id = ?`,
      [req.session.teacherId],
      shared.Connect.connWrap
    );
    if (r.state) {
      classes = r.result;
    } else throw new Error("BU45YIAB32YANEGA8");
  } catch (e) {
    console.log(e);
    reqState = e.message;
  }

  res.send(JSON.stringify({ reqState, result: { classes } }));
  res.end();
});

router.post("/view-read-attend-csr", async function (req, res) {
  let reqState = null,
    classObj = null,
    attendants = [],
    presence = [];

  const inputs = {
    classId: parseInt(req.body.classId) || null,
  };

  try {
    if (typeof inputs.classId !== "number" || inputs.classId < 1)
      throw new Error("78Y30ANENA65YANBNB");

    let r = await utilPre.retQueryOne(
      `SELECT class_id AS id, subject, day, t_by AS tBy, t_till AS tTill, recurrence, c_by AS cBy, c_till AS cTill, min_attend AS minAtt FROM class WHERE class_id = ? AND teacher_id = ?`,
      [inputs.classId, req.session.teacherId],
      shared.Connect.connWrap
    );
    if (r.state) {
      classObj = r.result;
    } else throw new Error("98ANYEIN42YNAL93YA");

    r = await utilPre.retQuery(
      `SELECT attendant_id AS id, class_id AS classId, name FROM attendant WHERE class_id = ?`,
      [inputs.classId],
      shared.Connect.connWrap
    );
    if (r.state) {
      attendants = r.result;
    } else throw new Error("46YAIN212YIANLNY96YN");

    r = await utilPre.retQuery(
      `SELECT class_id AS classId, recurr_id AS recurrId, attendant_id AS attendantId FROM presence WHERE class_id = ?`,
      [inputs.classId],
      shared.Connect.connWrap
    );
    if (r.state) {
      presence = r.result;
    } else throw new Error("TZU45YZUM65YALN30786");
  } catch (e) {
    console.log(e);
    reqState = e.message;
  }

  res.send(
    JSON.stringify({ reqState, result: { classObj, attendants, presence } })
  );
  res.end();
});

module.exports = router;
