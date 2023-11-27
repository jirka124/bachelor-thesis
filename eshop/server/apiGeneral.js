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
    products = [];

  try {
    let r = await utilPre.retQuery(
      `SELECT product_id as productId, name, description, price FROM product ORDER BY RAND() LIMIT 6`,
      [],
      shared.Connect.connWrap
    );
    if (r.state) {
      products = r.result;
    } else throw new Error("RPTRD1D84E");
  } catch (e) {
    console.log(e);
    reqState = e.message;
  }

  res.send(JSON.stringify({ reqState, result: { products } }));
  res.end();
});

router.post("/view-stock-products-csr", async function (req, res) {
  let reqState = null,
    products = [],
    totalCount = 0;

  const availSorts = [
    "feat",
    "sell",
    "aplha-a",
    "aplha-z",
    "price-low",
    "price-high",
  ];
  const inputs = {
    srchVal: req.body.srchVal || "",
    sortVal: req.body.sortVal || "feat",
    pageVal: +req.body.pageVal || 1,
  };

  try {
    if (typeof inputs.srchVal !== "string") throw new Error("GU_EL86BU_E");
    if (
      typeof inputs.sortVal !== "string" ||
      !availSorts.includes(inputs.sortVal)
    )
      throw new Error("ZU_7BBOM4V4");
    if (typeof inputs.pageVal !== "number" || inputs.pageVal < 1)
      throw new Error("TIE1ER13_VE");

    let r = await utilPre.retQueryOne(
      `SELECT COUNT(product_id) AS totalCount FROM product WHERE name LIKE ?`,
      [`${inputs.srchVal}%`],
      shared.Connect.connWrap
    );
    if (r.state) {
      totalCount = r.result.totalCount;
    } else throw new Error("GUE_7E45EBL");

    let orderBy = "product_id DESC";
    if (inputs.sortVal === "sell") {
      let orderArr = [];
      r = await utilPre.retQuery(
        `SELECT product_id FROM order_product GROUP BY product_id ORDER BY SUM(count) DESC`,
        [],
        shared.Connect.connWrap
      );
      if (r.state) {
        orderArr = r.result;
      } else throw new Error("FU5E9_ENE65");

      orderArr = orderArr.map((orderItem) => orderItem.product_id);
      if (orderArr.length > 0)
        orderBy = `CASE WHEN product_id IN (${orderArr.join(
          ","
        )}) THEN 1 ELSE 2 END, FIELD(product_id, ${orderArr.join(",")})`;
      else orderBy = "product_id DESC";
    } else if (inputs.sortVal === "aplha-a") orderBy = "name";
    else if (inputs.sortVal === "aplha-z") orderBy = "name DESC";
    else if (inputs.sortVal === "price-low") orderBy = "price";
    else if (inputs.sortVal === "price-high") orderBy = "price DESC";

    const pageSize = 20;
    const offset = pageSize * (inputs.pageVal - 1);
    r = await utilPre.retQuery(
      `SELECT product_id AS productId, name, description, price FROM product WHERE name LIKE ? ORDER BY ${orderBy} LIMIT ? OFFSET ?`,
      [`${inputs.srchVal}%`, pageSize, offset],
      shared.Connect.connWrap
    );
    if (r.state) {
      products = r.result;
    } else throw new Error("TU7V8EB_EI");
  } catch (e) {
    console.log(e);
    reqState = e.message;
  }

  res.send(JSON.stringify({ reqState, result: { products, totalCount } }));
  res.end();
});

router.post("/view-product-ssr", async function (req, res) {
  let reqState = null,
    product = null;
  const inputs = {
    productId: +req.body.productId || null,
    path: req.body.path || null,
  };

  try {
    if (typeof inputs.productId !== "number" || inputs.productId < 1)
      throw new Error("RIG45BLE_L");
    let r = await OdaiTable.read({
      query: `SELECT product_id as productId, name, description, price FROM product WHERE product_id = ?`,
      prepared: [inputs.productId],
      path: inputs.path,
      transformer: "retQueryOne",
    });
    if (r.state) {
      product = r.result;
    } else throw new Error("HUL48BLEANE");

    r = await OdaiTable.read({
      query: `SELECT f_key AS fKey, f_value as fValue FROM product_feature WHERE product_id = ?`,
      prepared: [inputs.productId],
      path: inputs.path,
    });
    if (r.state) {
      product.features = r.result;
    } else {
      product.features = [];
      throw new Error("ZU45B_ENE784");
    }
  } catch (e) {
    console.log(e);
    reqState = e.message;
  }

  res.send(JSON.stringify({ reqState, result: { product } }));
  res.end();
});

router.post("/view-product-csr", async function (req, res) {
  let reqState = null,
    similar = [],
    reviews = [];
  const inputs = {
    productId: +req.body.productId || null,
  };

  try {
    if (typeof inputs.productId !== "number" || inputs.productId < 1)
      throw new Error("HU4E_NE36AEB");
    let r = await utilPre.retQuery(
      `SELECT product_id as productId, name, description, price FROM product WHERE product_id != ? ORDER BY RAND() LIMIT 4`,
      [inputs.productId],
      shared.Connect.connWrap
    );
    if (r.state) {
      similar = r.result;
    } else throw new Error("ZUENN75ENA");

    r = await utilPre.retQuery(
      `SELECT product_review_id AS productReviewId, product_id AS productId, stars, text FROM product_review WHERE product_id = ? ORDER BY productReviewId DESC`,
      [inputs.productId],
      shared.Connect.connWrap
    );
    if (r.state) {
      reviews = r.result;
    } else throw new Error("HUEH79NYE3");
  } catch (e) {
    console.log(e);
    reqState = e.message;
  }

  res.send(JSON.stringify({ reqState, result: { similar, reviews } }));
  res.end();
});

router.post("/product-add-review", async function (req, res) {
  let reqState = null,
    addedReview = null;
  const inputs = {
    productId: +req.body.productId || null,
    stars: +req.body.stars || 1,
    text: req.body.text || "",
  };

  try {
    if (typeof inputs.productId !== "number" || inputs.productId < 1)
      throw new Error("TUDLEN78_EIH");
    if (
      typeof inputs.stars !== "number" ||
      inputs.stars < 1 ||
      inputs.stars > 5
    )
      throw new Error("KE35E_BIE48A");
    if (
      typeof inputs.text !== "string" ||
      inputs.text.length < 1 ||
      inputs.text.length > 500
    )
      throw new Error("JFU8EAMB6E");

    let r = await utilPre.noReturnQuery(
      `INSERT INTO product_review (product_id, stars, text) VALUES (?, ?, ?)`,
      [inputs.productId, inputs.stars, inputs.text],
      shared.Connect.connWrap
    );
    if (r.state) {
      addedReview = {
        productReviewId: r.result.insertIds[0],
        productId: inputs.productId,
        stars: inputs.stars,
        text: inputs.text,
      };
    } else throw new Error("UIE48B_EDIB");
  } catch (e) {
    console.log(e);
    reqState = e.message;
  }

  res.send(JSON.stringify({ reqState, result: { addedReview } }));
  res.end();
});

module.exports = router;
