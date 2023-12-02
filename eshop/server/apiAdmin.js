const express = require("express");
const formidable = require("formidable");
const bcrypt = require("bcrypt");
const sharp = require("sharp");
const router = express.Router();
const crypto = require("node:crypto");
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
    name: req.body.name || "",
    pass: req.body.pass || "",
  };

  try {
    let adminId = null,
      adminPass = null;

    if (req.session.adminId) {
      throw new Error("HZGET78DI");
    }

    let r = await utilPre.retQueryOne(
      `SELECT admin_account_id AS adminId, pass FROM admin_account WHERE name = ?`,
      [inputs.name],
      shared.Connect.connWrap
    );
    if (r.state) {
      adminId = r.result.adminId;
      adminPass = r.result.pass;
    } else throw new Error("RPTRD1D84E");

    const isValid = await bcrypt.compare(inputs.pass, adminPass);
    if (!isValid) throw new Error("TOJO7DJOWE89");

    req.session.adminId = adminId;

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
  let whoami = { adminId: null, adminName: null },
    reqState = null;

  whoami: try {
    if (!req.session.adminId) break whoami;

    let r = await utilPre.retQueryOne(
      `SELECT name FROM admin_account WHERE admin_account_id = ?`,
      [req.session.adminId],
      shared.Connect.connWrap
    );
    if (r.state) {
      whoami = { adminId: req.session.adminId, adminName: r.result.name };
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
    if (!req.session.adminId) throw new Error("VZE75ANENI");
    isLogged = true;
  } catch (e) {
    console.log(e);
    reqState = e.message;
  }

  res.send(JSON.stringify({ reqState, result: { isLogged } }));
  res.end();
});

router.use(function (req, res, next) {
  if (!req.session || !req.session.adminId) {
    res.send(JSON.stringify({ reqState: "ZTIDOFSEI4D", result: {} }));
    res.end();
  } else next();
});

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

router.post("/view-manage-product-csr", async function (req, res) {
  let reqState = null,
    products = [];

  try {
    let r = await utilPre.retQuery(
      `SELECT product_id as id, name, description, price FROM product`,
      [],
      shared.Connect.connWrap
    );
    if (r.state) {
      products = r.result;
    } else throw new Error("HU45EQNAI8B");
  } catch (e) {
    console.log(e);
    reqState = e.message;
  }

  res.send(JSON.stringify({ reqState, result: { products } }));
  res.end();
});

const uploadProductImage = async (file, productId) => {
  const allowedTypes = [".gif", ".jpeg", ".jpg", ".png"];
  const extension = path.extname(file.originalFilename).toLowerCase();

  if (allowedTypes.includes(extension)) {
    try {
      let width = 512,
        height = 512,
        enlarge = false;
      const animated = extension === ".gif" ? true : false;
      const img = await sharp(file.filepath, { animated });
      const data = await img.metadata();
      const minSide = Math.min(data.width, data.height);
      if (minSide < 512) {
        width = minSide;
        height = minSide;
        enlarge = true;
      }
      img.resize(width, height, {
        fit: sharp.fit.cover,
        withoutEnlargement: enlarge,
      });

      img
        .toFormat("png")
        .toFile(
          path.join(
            process.env.VUE_APP_SERVER_ROOT,
            `uploads/products/png/${productId}.png`
          )
        );

      img
        .toFormat("webp")
        .toFile(
          path.join(
            process.env.VUE_APP_SERVER_ROOT,
            `uploads/products/webp/${productId}.webp`
          )
        );
    } catch (e) {
      console.error(e);
      throw new Error("G45QN96ANET4");
    }
  }
};

router.post("/add-product", async function (req, res) {
  let reqState = null,
    product = { id: null };

  const form = new formidable.IncomingForm();
  const { fields, files } = await new Promise((res, rej) => {
    form.parse(req, async function (err, fields, files) {
      if (err) res({ fields: {}, files: {} });
      res({ fields, files });
    });
  });

  const inputs = {
    name: fields.name || null,
    description: fields.description || null,
    price: Number(fields.price) || 0,
  };

  try {
    if (typeof inputs.name !== "string") throw new Error("45BNEIBNI44H");
    if (typeof inputs.description !== "string") throw new Error("HUB13QNBI84");
    if (typeof inputs.price !== "number") throw new Error("BMYLO151AIEA");

    let r = await utilPre.noReturnQuery(
      `INSERT INTO product (name, description, price) VALUES (?, ?, ?)`,
      [inputs.name, inputs.description, inputs.price],
      shared.Connect.connWrap
    );
    if (r.state) {
      product = {
        id: r.result.insertIds[0],
        name: inputs.name,
        description: inputs.description,
        price: inputs.price,
      };
    } else throw new Error("B76ANOI32BEJ");

    if (`file` in files) await uploadProductImage(files.file, product.id);
  } catch (e) {
    console.log(e);
    reqState = e.message;
  }

  res.send(JSON.stringify({ reqState, result: { product } }));
  res.end();
});

router.post("/alter-product", async function (req, res) {
  let reqState = null,
    product = { id: null };

  const form = new formidable.IncomingForm();
  const { fields, files } = await new Promise((res, rej) => {
    form.parse(req, async function (err, fields, files) {
      if (err) res({ fields: {}, files: {} });
      res({ fields, files });
    });
  });

  const inputs = {
    id: Number(fields.id) || null,
    name: fields.name || null,
    description: fields.description || null,
    price: Number(fields.price) || 0,
  };

  try {
    if (typeof inputs.id !== "number" || inputs.id < 1)
      throw new Error("BUEN74ANE6YE");
    if (typeof inputs.name !== "string") throw new Error("45BNEIBNI44H");
    if (typeof inputs.description !== "string") throw new Error("HUB13QNBI84");
    if (typeof inputs.price !== "number") throw new Error("BMYLO151AIEA");

    let r = await utilPre.noReturnQuery(
      `UPDATE product SET name = ?, description = ?, price = ? WHERE product_id = ?`,
      [inputs.name, inputs.description, inputs.price, inputs.id],
      shared.Connect.connWrap
    );
    if (r.state) {
      product = {
        id: inputs.id,
        name: inputs.name,
        description: inputs.description,
        price: inputs.price,
      };
    } else throw new Error("NM34ABE48YIE");

    if (`file` in files) await uploadProductImage(files.file, inputs.id);
  } catch (e) {
    console.log(e);
    reqState = e.message;
  }

  res.send(JSON.stringify({ reqState, result: { product } }));
  res.end();
});

router.post("/del-product", async function (req, res) {
  let reqState = null,
    product = { id: null };

  const inputs = {
    id: req.body.id || null,
  };

  try {
    if (typeof inputs.id !== "number" || inputs.id < 1)
      throw new Error("EU17ANE94CE3A");

    let r = await utilPre.noReturnQuery(
      `DELETE FROM product WHERE product_id = ?`,
      [inputs.id],
      shared.Connect.connWrap
    );
    if (r.state) {
      product = { id: inputs.id };
    } else throw new Error("N76ANE84YN73Q");

    const filepathPng = path.join(
      process.env.VUE_APP_SERVER_ROOT,
      `uploads/products/png/${inputs.id}.png`
    );
    const filepathWebp = path.join(
      process.env.VUE_APP_SERVER_ROOT,
      `uploads/products/webp/${inputs.id}.webp`
    );
    try {
      await fs.access(filepathPng);
      await fs.unlink(filepathPng);
    } catch (ee) {
      console.error(e);
    }
    try {
      await fs.access(filepathWebp);
      await fs.unlink(filepathWebp);
    } catch (ee) {
      console.error(e);
    }
  } catch (e) {
    console.log(e);
    reqState = e.message;
  }

  res.send(JSON.stringify({ reqState, result: { product } }));
  res.end();
});

module.exports = router;
