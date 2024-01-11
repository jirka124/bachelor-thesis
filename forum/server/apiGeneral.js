const express = require("express");
const formidable = require("formidable");
const bcrypt = require("bcrypt");
const sharp = require("sharp");
const router = express.Router();
const crypto = require("node:crypto");
const { utilPre } = require("./server_modules/primaryQueries");
const shared = require("./server_modules/shared");
const { OdaiTable } = require("./server_modules/odai/table");
const nodeUtil = require("util");

router.post("/view-home-csr", async function (req, res) {
  let reqState = null,
    posts = [];

  try {
    let r = await utilPre.retQuery(
      `SELECT t1.post_id AS postId, t1.title, t1.name, t1.date, COUNT(t2.post_view_id) AS viewCount, COUNT(t3.post_reply_id) AS replyCount FROM post t1 LEFT JOIN post_view t2 ON t1.post_id = t2.post_id LEFT JOIN post_reply t3 ON t1.post_id = t3.post_id GROUP BY t1.post_id, t1.title, t1.name, t1.date ORDER BY RAND() LIMIT 6`,
      [],
      shared.Connect.connWrap
    );
    if (r.state) {
      posts = r.result;
    } else throw new Error("BN32YIENA3YANE8");
  } catch (e) {
    console.log(e);
    reqState = e.message;
  }

  res.send(JSON.stringify({ reqState, result: { posts } }));
  res.end();
});

router.post("/view-search-csr", async function (req, res) {
  let reqState = null,
    posts = [];

  const inputs = {
    srchFor: req.body.srchFor || null,
  };

  try {
    if (typeof inputs.srchFor !== "string" || inputs.srchFor === "")
      throw new Error("Z02YAB64YABL6BA3");

    let r = await utilPre.retQuery(
      `SELECT t1.post_id AS postId, t1.title, t1.name, t1.date, COUNT(t2.post_view_id) AS viewCount, COUNT(t3.post_reply_id) AS replyCount FROM post t1 LEFT JOIN post_view t2 ON t1.post_id = t2.post_id LEFT JOIN post_reply t3 ON t1.post_id = t3.post_id WHERE t1.title LIKE ? GROUP BY t1.post_id, t1.title, t1.name, t1.date`,
      [`${inputs.srchFor}%`],
      shared.Connect.connWrap
    );
    if (r.state) {
      posts = r.result;
    } else throw new Error("78YNAN020YABLE946Y");
  } catch (e) {
    console.log(e);
    reqState = e.message;
  }

  res.send(JSON.stringify({ reqState, result: { posts } }));
  res.end();
});

router.post("/create-post", async function (req, res) {
  let reqState = null,
    postId = null;

  const inputs = {
    title: req.body.titleVal || null,
    description: req.body.descriptionVal || null,
    name: req.body.nameVal || null,
  };

  try {
    if (
      typeof inputs.title !== "string" ||
      inputs.title === "" ||
      inputs.title.length > 128
    )
      throw new Error("HN387YANLNE00YAB");
    if (
      typeof inputs.description !== "string" ||
      inputs.description === "" ||
      inputs.description.length > 1000
    )
      throw new Error("84YLAN03AYNALE95");
    if (
      typeof inputs.name !== "string" ||
      inputs.name === "" ||
      inputs.name.length > 32
    )
      throw new Error("HUNAL0491YALNGIAB");

    let r = await utilPre.noReturnQuery(
      `INSERT INTO post (title, description, name) VALUES (?, ?, ?)`,
      [inputs.title, inputs.description, inputs.name],
      shared.Connect.connWrap
    );
    if (r.state) {
      postId = r.result.insertIds[0];
    } else throw new Error("HNB552YANLINAL68Y");
  } catch (e) {
    console.log(e);
    reqState = e.message;
  }

  res.send(JSON.stringify({ reqState, result: { postId } }));
  res.end();
});

router.post("/view-discussion-ssr", async function (req, res) {
  let reqState = null,
    post = null;

  const inputs = {
    postId: +req.body.postId || null,
    path: req.body.path || null,
  };

  try {
    if (typeof inputs.postId !== "number" || inputs.postId < 1)
      throw new Error("BJ46YANLIE12Y0BE");

    let r = await OdaiTable.read({
      query: `SELECT t1.post_id AS postId, t1.title, t1.description, t1.name, t1.date, COUNT(t2.post_view_id) AS viewCount, COUNT(t3.post_reply_id) AS replyCount FROM post t1 LEFT JOIN post_view t2 ON t1.post_id = t2.post_id LEFT JOIN post_reply t3 ON t1.post_id = t3.post_id WHERE t1.post_id = ? GROUP BY t1.post_id, t1.title, t1.description, t1.name, t1.date`,
      prepared: [inputs.postId],
      path: inputs.path,
      transformer: "retQueryOne",
    });
    if (r.state) {
      post = r.result;
    } else throw new Error("48AN12YENA946YLAN");

    r = await OdaiTable.read({
      query: `SELECT post_reply_id AS postReplyId, reply, name, date FROM post_reply WHERE post_id = ?`,
      prepared: [inputs.postId],
      path: inputs.path,
    });
    if (r.state) {
      post.replies = r.result;
    } else {
      post.replies = [];
      throw new Error("HL46YANLE884YLANG");
    }
  } catch (e) {
    console.log(e);
    reqState = e.message;
  }

  res.send(JSON.stringify({ reqState, result: { post } }));
  res.end();
});

router.post("/create-reply", async function (req, res) {
  let reqState = null,
    replyObj = null;

  const inputs = {
    postId: +req.body.postId || null,
    reply: req.body.replyVal || null,
    name: req.body.nameVal || null,
  };

  try {
    if (typeof inputs.postId !== "number" || inputs.postId < 1)
      throw new Error("GUAN48ANLYINE58");
    if (
      typeof inputs.reply !== "string" ||
      inputs.reply === "" ||
      inputs.reply.length > 1000
    )
      throw new Error("78BMA13YAN86ANYI38");
    if (
      typeof inputs.name !== "string" ||
      inputs.name === "" ||
      inputs.name.length > 32
    )
      throw new Error("ZZ48YL00ALYNAIEBJ98");

    let r = await utilPre.retQueryOne(
      `SELECT post_id FROM post WHERE post_id = ?`,
      [inputs.postId],
      shared.Connect.connWrap
    );
    if (!r.state) throw new Error("96YANLI13YAKNG348GE");

    r = await utilPre.noReturnQuery(
      `INSERT INTO post_reply (post_id, reply, name) VALUES (?, ?, ?)`,
      [inputs.postId, inputs.reply, inputs.name],
      shared.Connect.connWrap
    );
    if (r.state) {
      replyObj = {
        postReplyId: r.result.insertIds[0],
        postId: inputs.postId,
        reply: inputs.reply,
        name: inputs.name,
      };
    } else throw new Error("745YIAL3656YKANECEG");
  } catch (e) {
    console.log(e);
    reqState = e.message;
  }

  res.send(JSON.stringify({ reqState, result: { replyObj } }));
  res.end();
});

module.exports = router;
