const express = require('express')
const formidable = require('formidable')
const bcrypt = require('bcrypt')
const sharp = require('sharp')
const router = express.Router()
const crypto = require('node:crypto')
const { utilPre } = require('./server_modules/primaryQueries')
const shared = require('./server_modules/shared')
const nodeUtil = require('util')

router.post("/login", async function (req, res) {
  let reqState = null;

  const inputs = {
    name: req.body.name || "",
    pass: req.body.pass || ""
  }

  try {
    let adminId = null, adminPass = null;

    if (req.session.adminId) {
      throw new Error("HZGET78DI"); // user logged as admin already
    }

    let r = await utilPre.retQueryOne(
      `SELECT adminId, password FROM admin_account WHERE name = ?`,
      [inputs.name],
      shared.Connect.connWrap
    );
    if (r.state) {
      adminId = r.result.adminId;
      adminPass = r.result.password;
    } else throw new Error("RPTRD1D84E"); // account with such a credentials doesnt exist

    // validate sent password with a dtb hash
    const isValid = await bcrypt.compare(inputs.pass, adminPass);
    if (!isValid) throw new Error("TOJO7DJOWE89");

    req.session.adminId = adminId;

    const saveSessionAsync = nodeUtil.promisify(req.session.save).bind(req.session);

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

  try {
    if (!req.session.adminId) throw new Error("HZGEZU98DI"); // user not logged as admin yet}

    let r = await utilPre.retQueryOne(
      `SELECT name FROM admin_account WHERE adminId = ?`,
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

router.use(function (req, res, next) {
  if (!req.session || !req.session.adminId) {
    console.error("catch all - ZTIDOFSEI4d");
    res.send(JSON.stringify({ reqState: "catch all - ZTIDOFSEI4d", result: {} }));
    res.end();
  } else next();
})

router.post("/hashup", async function (req, res) {
  let hash = null,
    reqState = null;

  const inputs = {
    toHashStr: req.body.toHashStr || null
  };

  try {
    if(inputs.toHashStr === null) throw new Error("HGO48E869EFI")

    hash = await bcrypt.hash(inputs.toHashStr, 10);

  } catch (e) {
    console.log(e);
    reqState = e.message;
  }

  res.send(JSON.stringify({ reqState, result: { hash } }));
  res.end();
});

router.post('/logout', async function (req, res) {
  let reqState = null;

  try {
    const destroySessionAsync = nodeUtil.promisify(req.session.destroy).bind(req.session);

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
})

router.post("/get-products", async function (req, res) {
  let products = [], pictures = [], parameters = [], categories = [],
    reqState = null;

  try {
    let r = await utilPre.retQuery(
      `SELECT * FROM product`,
      [],
      shared.Connect.connWrap
    );
    if (r.state) {
      products = r.result;
    } else throw new Error("84E8VFJ5B7");

    r = await utilPre.retQuery(
      `SELECT * FROM product_picture`,
      [],
      shared.Connect.connWrap
    );
    if (r.state) {
      pictures = r.result;
    } else throw new Error("ZHGDI85B7");

    r = await utilPre.retQuery(
      `SELECT * FROM product_parameter`,
      [],
      shared.Connect.connWrap
    );
    if (r.state) {
      parameters = r.result;
    } else throw new Error("Z8D84EFJ5B7");

    r = await utilPre.retQuery(
      `SELECT * FROM product_category`,
      [],
      shared.Connect.connWrap
    );
    if (r.state) {
      categories = r.result;
    } else throw new Error("ZHJ8VFFG48DE");
  } catch (e) {
    console.log(e);
    reqState = e.message;
  }

  res.send(JSON.stringify({ reqState, result: { products, pictures, parameters, categories } }));
  res.end();
});

router.post("/new-product", async function (req, res) {
  let productObj = null,
    reqState = null;

  try {
    let r = await utilPre.noReturnQuery(
      `INSERT INTO product (name, description, price, product_category_id, onStock, visibility) VALUES ('JMENO', 'POPIS', 10, 1, 0, 0);`,
      [],
      shared.Connect.connWrap
    );
    if (r.state) {
      productObj = {
        product_id: r.result.insertIds[0],
        name: "JMENO",
        description: "POPIS",
        price: 10,
        product_category_id: 1,
        onStock: 0,
        visibility: 0
      }
    } else throw new Error("FORJKEOI7");

  } catch (e) {
    console.log(e);
    reqState = e.message;
  }

  res.send(JSON.stringify({ reqState, result: { productObj } }));
  res.end();
});

router.post("/del-product", async function (req, res) {
  let productObj = null,
    reqState = null;

  const inputs = {
    productId: req.body.productId || null
  }

  try {
    if(inputs.productId === null) throw new Error("GD884DFE86IF");

    let r = await utilPre.noReturnQuery(
      `DELETE FROM product WHERE product_id = ?;`,
      [inputs.productId],
      shared.Connect.connWrap
    );
    if (r.state) {
      productObj = { product_id: inputs.productId }
    } else throw new Error("FORJKEOI7");

  } catch (e) {
    console.log(e);
    reqState = e.message;
  }

  res.send(JSON.stringify({ reqState, result: { productObj } }));
  res.end();
});

router.post("/alter-product-inc-stock", async function (req, res) {
  let alter = {},
    reqState = null;

  const inputs = {
    productId: req.body.productId || null,
    value: req.body.value || null
  }

  try {
    if(inputs.productId === null || inputs.value === null)  throw new Error("ZEI86EFIE9");

    let r = await utilPre.noReturnQuery(
      `UPDATE product SET onStock = onStock + ? WHERE product_id = ?`,
      [inputs.value, inputs.productId],
      shared.Connect.connWrap
    );
    let rr = await utilPre.retQueryOne(
      `SELECT onStock FROM product WHERE product_id = ?`,
      [inputs.productId],
      shared.Connect.connWrap
    );


    if (r.state && rr.state) {
      alter = { productId: inputs.productId, onStock: rr.result.onStock };
    } else throw new Error("FORJKEOI7");

  } catch (e) {
    console.log(e);
    reqState = e.message;
  }

  res.send(JSON.stringify({ reqState, result: { alter } }));
  res.end();
});

router.post("/alter-product", async function (req, res) {
  let alter = {},
    reqState = null;

  const inputs = {
    productId: req.body.productId || null,
    value: req.body.value || null,
    fieldname: req.body.fieldname || null
  }
  const possibleFields = ["name", "description", "price", "categoryId", "onStock", "weight", "visibility"];

  try {
    if(inputs.fieldname === "visibility" && inputs.value === null) inputs.value = 0;

    if(inputs.productId === null || inputs.value === null || inputs.fieldname === null)  throw new Error("GD884DFE86IF");

    if(!possibleFields.includes(inputs.fieldname)) throw new Error("GD884DTD74W6");

    if(inputs.fieldname === "categoryId") inputs.fieldname = "product_category_id";

    let r = await utilPre.noReturnQuery(
      `UPDATE product SET ${inputs.fieldname} = ? WHERE product_id = ?`,
      [inputs.value, inputs.productId],
      shared.Connect.connWrap
    );
    if (r.state) {
      alter = { productId: inputs.productId };
      alter[inputs.fieldname] = inputs.value;
    } else throw new Error("FORJKEOI7");

  } catch (e) {
    console.log(e);
    reqState = e.message;
  }

  res.send(JSON.stringify({ reqState, result: { alter } }));
  res.end();
});

router.post("/new-product-img", async function (req, res) {
  let picObj = null,
    reqState = null;

  const inputs = {
    productId: req.body.productId || null
  }

  try {
    if(inputs.productId === null)  throw new Error("GD884DFE86IF");

    let r = await utilPre.noReturnQuery(
      `INSERT INTO product_picture (product_id, rank, extension) VALUES (?, 100, '');`,
      [inputs.productId],
      shared.Connect.connWrap
    );
    if (r.state) {
      picObj = {
        picture_id: r.result.insertIds[0],
        product_id: inputs.productId,
        rank: 100,
        extension: ""
      }
    } else throw new Error("FORJKEOI7");

  } catch (e) {
    console.log(e);
    reqState = e.message;
  }

  res.send(JSON.stringify({ reqState, result: { picObj } }));
  res.end();
});

router.post("/alter-product-img-rank", async function (req, res) {
  let picObj = null,
    reqState = null;

  const inputs = {
    pictureId: req.body.pictureId || null,
    rank: req.body.rank || null
  }

  try {
    if(inputs.pictureId === null || inputs.rank === null)  throw new Error("GD884DFE86IF");

    let r = await utilPre.noReturnQuery(
      `UPDATE product_picture SET rank = ? WHERE picture_id = ?;`,
      [inputs.rank, inputs.pictureId],
      shared.Connect.connWrap
    );
    if (r.state) {
      picObj = {
        picture_id: inputs.pictureId,
        rank: inputs.rank,
      }
    } else throw new Error("FORJKEOI7");

  } catch (e) {
    console.log(e);
    reqState = e.message;
  }

  res.send(JSON.stringify({ reqState, result: { picObj } }));
  res.end();
});

router.post("/alter-product-img-pic", async function (req, res) {
  const path = require('path')
  const allowedTypes = [".jpeg", ".jpg", ".png"]

  let picObj = null,
    reqState = null;

  const form = new formidable.IncomingForm()

  form.parse(req, async function (err, fields, files) {
    try {
      if(!fields.hasOwnProperty("pictureId") || !files.hasOwnProperty("newPic")) throw new Error("GD884DFE86IF");

      // check whether image was uploaded, and if has right format .png, ....
      let file = null, hasPic = false, picExt = ""
      if (`newPic` in files) {
        file = files[`newPic`]
        picExt = path.extname(file.originalFilename).toLowerCase()
        if (allowedTypes.includes(picExt)) hasPic = true
      }

      if(!hasPic) throw new Error("GD8IEH58DEIF");
  
      let r = await utilPre.noReturnQuery(
        `UPDATE product_picture SET extension = ? WHERE picture_id = ?;`,
        [picExt.slice(1), fields.pictureId],
        shared.Connect.connWrap
      );
      if (r.state) {} else throw new Error("FORJKEOI7");

      // perform file upload if blog pic available
      let width = 512, height = 512, enlarge = false
      const img = await sharp(file.filepath)
      const data = await img.metadata()
      const minSide = Math.min(data.width, data.height)
      if (minSide < 512) {
        width = minSide
        height = minSide
        enlarge = true
      }
      const imgRegExt =  img.resize(width, height, {
        fit: sharp.fit.cover,
        withoutEnlargement: enlarge
      })

      imgRegExt.toFormat(picExt.slice(1))
      .toFile(process.env.VUE_APP_SERVER_ROOT + `uploads/products/reg/${fields.pictureId}${picExt}`)

      imgRegExt.toFormat("webp")
      .toFile(process.env.VUE_APP_SERVER_ROOT + `uploads/products/webp/${fields.pictureId}.webp`)

      picObj = {
        picture_id: fields.pictureId,
        extension: picExt.slice(1),
      }
  
      res.send(JSON.stringify({ reqState, result: { picObj } }));
      res.end();
    } catch (e) {
      console.log(e);
      reqState = e.message;

      res.send(JSON.stringify({ reqState, result: { picObj } }));
      res.end();
    }
  })
});

async function deleteFilesWithName(folderPath, fileName) {
  const fs = require('fs').promises;
  const path = require('path');

  let state = true;

  try {
    const files = await fs.readdir(folderPath);

    for (const file of files) {
      const extension = path.extname(file);
      const name = path.basename(file, extension);

      if (name === fileName) {
        const filePath = path.join(folderPath, file);
        await fs.unlink(filePath);
      }
    }
  } catch (err) {
    console.error(`Error deleting files: ${err}`);
    state = false
  }

  return state
}

router.post("/del-product-img", async function (req, res) {
  let picObj = null,
    reqState = null;

  const inputs = {
    pictureId: req.body.pictureId || null
  }

  try {
    if(inputs.pictureId === null) throw new Error("GD884DFE86IF");

    const folderPathReg = `${process.env.VUE_APP_SERVER_ROOT}uploads/products/reg/`;
    const folderPathWebp = `${process.env.VUE_APP_SERVER_ROOT}uploads/products/webp/`;
    const fileName = `${inputs.pictureId}`;

    const delState1 = await deleteFilesWithName(folderPathReg, fileName);
    const delState2 = await deleteFilesWithName(folderPathWebp, fileName);

    if(!delState1 || !delState2) throw new Error("RG88DFD85IF");

    let r = await utilPre.noReturnQuery(
      `DELETE FROM product_picture WHERE picture_id = ?;`,
      [inputs.pictureId],
      shared.Connect.connWrap
    );
    if (r.state) {
      picObj = { picture_id: inputs.pictureId }
    } else throw new Error("FORJKEOI7");

  } catch (e) {
    console.log(e);
    reqState = e.message;
  }

  res.send(JSON.stringify({ reqState, result: { picObj } }));
  res.end();
});


router.post("/alter-product-parameter", async function (req, res) {
  let alter = {},
    reqState = null;

  const inputs = {
    parameterId: req.body.parameterId || null,
    value: req.body.value || null,
    fieldname: req.body.fieldname || null
  }
  const possibleFields = ["name", "value", "priority"];

  try {
    if(inputs.parameterId === null || inputs.value === null || inputs.fieldname === null)  throw new Error("GD884DFE86IF");

    if(!possibleFields.includes(inputs.fieldname)) throw new Error("GD884DTD74W6");

    if(inputs.fieldname === "priority") inputs.fieldname = "rank";

    let r = await utilPre.noReturnQuery(
      `UPDATE product_parameter SET ${inputs.fieldname} = ? WHERE product_parameter_id = ?`,
      [inputs.value, inputs.parameterId],
      shared.Connect.connWrap
    );
    if (r.state) {
      alter = { parameterId: inputs.parameterId };
      alter[inputs.fieldname] = inputs.value;
    } else throw new Error("FORJKEOI7");

  } catch (e) {
    console.log(e);
    reqState = e.message;
  }

  res.send(JSON.stringify({ reqState, result: { alter } }));
  res.end();
});


router.post("/new-product-parameter", async function (req, res) {
  let paramObj = null,
    reqState = null;

  const inputs = {
    productId: req.body.productId || null
  }

  try {
    if(inputs.productId === null)  throw new Error("GD884DFE86IF");

    let r = await utilPre.noReturnQuery(
      `INSERT INTO product_parameter (product_id, rank, name, value) VALUES (?, 100, 'Klíč!', 'Hodnota!');`,
      [inputs.productId],
      shared.Connect.connWrap
    );
    if (r.state) {
      paramObj = {
        product_parameter_id: r.result.insertIds[0],
        product_id: inputs.productId,
        rank: 100,
        name: "Klíč!",
        value: "Hodnota!"
      }
    } else throw new Error("FORJKEOI7");

  } catch (e) {
    console.log(e);
    reqState = e.message;
  }

  res.send(JSON.stringify({ reqState, result: { paramObj } }));
  res.end();
});

router.post("/del-product-parameter", async function (req, res) {
  let paramObj = null,
    reqState = null;

  const inputs = {
    parameterId: req.body.parameterId || null
  }

  try {
    if(inputs.parameterId === null) throw new Error("GD884DFE86IF");

    let r = await utilPre.noReturnQuery(
      `DELETE FROM product_parameter WHERE product_parameter_id = ?;`,
      [inputs.parameterId],
      shared.Connect.connWrap
    );
    if (r.state) {
      paramObj = { product_parameter_id: inputs.parameterId }
    } else throw new Error("FORJKEOI7");

  } catch (e) {
    console.log(e);
    reqState = e.message;
  }

  res.send(JSON.stringify({ reqState, result: { paramObj } }));
  res.end();
});

router.post("/alter-category", async function (req, res) {
  let alter = {},
    reqState = null;

  const inputs = {
    categoryId: req.body.categoryId || null,
    value: req.body.value || null,
    fieldname: req.body.fieldname || null
  }
  const possibleFields = ["category", "supCategory"];

  try {
    if(inputs.categoryId === null || inputs.value === null || inputs.fieldname === null)  throw new Error("GD884DFE86IF");

    if(!possibleFields.includes(inputs.fieldname)) throw new Error("GD884DTD74W6");

    if(inputs.fieldname === "supCategory") inputs.fieldname = "sup_category";

    let r = await utilPre.noReturnQuery(
      `UPDATE product_category SET ${inputs.fieldname} = ? WHERE product_category_id = ?`,
      [inputs.value, inputs.categoryId],
      shared.Connect.connWrap
    );
    if (r.state) {
      alter = { categoryId: inputs.categoryId };
      alter[inputs.fieldname] = inputs.value;
    } else throw new Error("FORJKEOI7");

  } catch (e) {
    console.log(e);
    reqState = e.message;
  }

  res.send(JSON.stringify({ reqState, result: { alter } }));
  res.end();
});

router.post("/new-category", async function (req, res) {
  let categoryObj = null,
    reqState = null;

  try {
    let r = await utilPre.noReturnQuery(
      `INSERT INTO product_category (category, sup_category) VALUES ('KATEGORIE', 1);`,
      [],
      shared.Connect.connWrap
    );
    if (r.state) {
      categoryObj = {
        product_category_id: r.result.insertIds[0],
        category: "KATEGORIE",
        sup_category: 1,
      }
    } else throw new Error("FORJKEOI7");

  } catch (e) {
    console.log(e);
    reqState = e.message;
  }

  res.send(JSON.stringify({ reqState, result: { categoryObj } }));
  res.end();
});


router.post("/del-category", async function (req, res) {
  let categoryObj = null,
    reqState = null;

  const inputs = {
    categoryId: req.body.categoryId || null
  }

  try {
    if(inputs.categoryId === null) throw new Error("GD884DFE86IF");

    // cannot delete root category
    if(+inputs.categoryId === 1) throw new Error("IFGUO59E6EGP");

    const folderPathReg = `${process.env.VUE_APP_SERVER_ROOT}uploads/categories/reg/`;
    const fileName = `${inputs.categoryId}`;

    const delState = await deleteFilesWithName(folderPathReg, fileName);

    if(!delState) throw new Error("RG88DFD85IF");

    let r = await utilPre.noReturnQuery(
      `DELETE FROM product_category WHERE product_category_id = ?;`,
      [inputs.categoryId],
      shared.Connect.connWrap
    );
    if (r.state) {
      categoryObj = { product_category_id: inputs.categoryId }
    } else throw new Error("FORJKEOI7");

  } catch (e) {
    console.log(e);
    reqState = e.message;
  }

  res.send(JSON.stringify({ reqState, result: { categoryObj } }));
  res.end();
});

router.post("/alter-category-img-pic", async function (req, res) {
  const path = require('path')
  const allowedTypes = [".png"]

  let picObj = null,
    reqState = null;

  const form = new formidable.IncomingForm()

  form.parse(req, async function (err, fields, files) {
    try {
      if(!fields.hasOwnProperty("categoryId") || !files.hasOwnProperty("newPic")) throw new Error("GD884DFE86IF");

      // check whether image was uploaded, and if has right format .png, ....
      let file = null, hasPic = false, picExt = ""
      if (`newPic` in files) {
        file = files[`newPic`]
        picExt = path.extname(file.originalFilename).toLowerCase()
        if (allowedTypes.includes(picExt)) hasPic = true
      }

      if(!hasPic) throw new Error("GD8IEH58DEIF");
  
      // perform file upload if blog pic available
      let width = 128, height = 128, enlarge = false
      const img = await sharp(file.filepath)
      const data = await img.metadata()
      const minSide = Math.min(data.width, data.height)
      if (minSide < 128) {
        width = minSide
        height = minSide
        enlarge = true
      }
      const imgRegExt =  img.resize(width, height, {
        fit: sharp.fit.cover,
        withoutEnlargement: enlarge
      })

      imgRegExt.toFormat(picExt.slice(1))
      .toFile(process.env.VUE_APP_SERVER_ROOT + `uploads/categories/reg/${fields.categoryId}${picExt}`)

      picObj = {
        product_category_id: fields.categoryId,
      }
  
      res.send(JSON.stringify({ reqState, result: { picObj } }));
      res.end();
    } catch (e) {
      console.log(e);
      reqState = e.message;

      res.send(JSON.stringify({ reqState, result: { picObj } }));
      res.end();
    }
  })
});

router.post("/get-blogs", async function (req, res) {
  let blogs = [],
    reqState = null;

  try {
    let r = await utilPre.retQuery(
      `SELECT * FROM blog`,
      [],
      shared.Connect.connWrap
    );
    if (r.state) {
      blogs = r.result;
    } else throw new Error("84E8VFJ5B7");
  } catch (e) {
    console.log(e);
    reqState = e.message;
  }

  res.send(JSON.stringify({ reqState, result: { blogs } }));
  res.end();
});

router.post("/new-blog", async function (req, res) {
  let blogObj = null,
    reqState = null;

  try {
    let r = await utilPre.noReturnQuery(
      `INSERT INTO blog (date, title, content) VALUES (NOW(), 'NADPIS', 'OBSAH');`,
      [],
      shared.Connect.connWrap
    );
    if (r.state) {
      blogObj = {
        blog_id: r.result.insertIds[0],
        date: new Date(),
        title: "NADPIS",
        content: "OBSAH"
      }
    } else throw new Error("FORJKEOI7");

  } catch (e) {
    console.log(e);
    reqState = e.message;
  }

  res.send(JSON.stringify({ reqState, result: { blogObj } }));
  res.end();
});
 
router.post("/del-blog", async function (req, res) {
  let blogObj = null,
    reqState = null;

  const inputs = {
    blogId: req.body.blogId || null
  }

  try {
    if(inputs.blogId === null) throw new Error("GD884DFE86IF");

    const folderPathReg = `${process.env.VUE_APP_SERVER_ROOT}uploads/blogs/reg/`;
    const fileName = `${inputs.blogId}`;

    const delState = await deleteFilesWithName(folderPathReg, fileName);

    if(!delState) throw new Error("RG88DFD85IF");

    let r = await utilPre.noReturnQuery(
      `DELETE FROM blog WHERE blog_id = ?;`,
      [inputs.blogId],
      shared.Connect.connWrap
    );
    if (r.state) {
      blogObj = { blog_id: inputs.blogId }
    } else throw new Error("FORJKEOI7");

  } catch (e) {
    console.log(e);
    reqState = e.message;
  }

  res.send(JSON.stringify({ reqState, result: { blogObj } }));
  res.end();
});

router.post("/alter-blog", async function (req, res) {
  let alter = {},
    reqState = null;

  const inputs = {
    blogId: req.body.blogId || null,
    value: req.body.value || null,
    fieldname: req.body.fieldname || null
  }
  const possibleFields = ["date", "title", "content"];

  try {
    if(inputs.blogId === null || inputs.value === null || inputs.fieldname === null)  throw new Error("GD884DFE86IF");

    if(!possibleFields.includes(inputs.fieldname)) throw new Error("GD884DTD74W6");

    let r = await utilPre.noReturnQuery(
      `UPDATE blog SET ${inputs.fieldname} = ? WHERE blog_id = ?`,
      [inputs.value, inputs.blogId],
      shared.Connect.connWrap
    );
    if (r.state) {
      alter = { blogId: inputs.blogId };
      alter[inputs.fieldname] = inputs.value;
    } else throw new Error("FORJKEOI7");

  } catch (e) {
    console.log(e);
    reqState = e.message;
  }

  res.send(JSON.stringify({ reqState, result: { alter } }));
  res.end();
});

router.post("/alter-blog-img-pic", async function (req, res) {
  const path = require('path')
  const allowedTypes = [".jpg", ".jpeg"]

  let picObj = null,
    reqState = null;

  const form = new formidable.IncomingForm()

  form.parse(req, async function (err, fields, files) {
    try {
      if(!fields.hasOwnProperty("blogId") || !files.hasOwnProperty("newPic")) throw new Error("GD884DFE86IF");

      // check whether image was uploaded, and if has right format .png, ....
      let file = null, hasPic = false, picExt = ""
      if (`newPic` in files) {
        file = files[`newPic`]
        picExt = path.extname(file.originalFilename).toLowerCase()
        if (allowedTypes.includes(picExt)) hasPic = true
      }

      if(!hasPic) throw new Error("GD8IEH58DEIF");
  
      // perform file upload if blog pic available
      let width = 400, height = 400, enlarge = false
      const img = await sharp(file.filepath)
      const data = await img.metadata()
      const minSide = Math.min(data.width, data.height)
      if (minSide < 400) {
        width = minSide
        height = minSide
        enlarge = true
      }
      const imgRegExt =  img.resize(width, height, {
        fit: sharp.fit.cover,
        withoutEnlargement: enlarge
      })

      imgRegExt.toFormat("jpg")
      .toFile(process.env.VUE_APP_SERVER_ROOT + `uploads/blogs/reg/${fields.blogId}.jpg`)

      picObj = {
        blog_id: fields.blogId,
      }
  
      res.send(JSON.stringify({ reqState, result: { picObj } }));
      res.end();
    } catch (e) {
      console.log(e);
      reqState = e.message;

      res.send(JSON.stringify({ reqState, result: { picObj } }));
      res.end();
    }
  })
});

router.post("/get-promos", async function (req, res) {
  let promos = [],
    reqState = null;

  try {
    let r = await utilPre.retQuery(
      `SELECT * FROM promo_code`,
      [],
      shared.Connect.connWrap
    );
    if (r.state) {
      promos = r.result;
    } else throw new Error("BENA84BIEN3A");
  } catch (e) {
    console.log(e);
    reqState = e.message;
  }

  res.send(JSON.stringify({ reqState, result: { promos } }));
  res.end();
});

router.post("/new-promo", async function (req, res) {
  let promoObj = null,
    reqState = null;

  const defaultCode = crypto.randomInt(0, 9999999999).toString().padStart(10, '0')
  try {
    let r = await utilPre.noReturnQuery(
      `INSERT INTO promo_code (code, type, amount) VALUES (?, "p", 0);`,
      [defaultCode],
      shared.Connect.connWrap
    );
    if (r.state) {
      promoObj = {
        promo_code_id: r.result.insertIds[0],
        code: defaultCode,
        type: "p",
        amount: 0,
        usedByOrderId: null
      }
    } else throw new Error("48ENAI12ENB778V");

  } catch (e) {
    console.log(e);
    reqState = e.message;
  }

  res.send(JSON.stringify({ reqState, result: { promoObj } }));
  res.end();
});
 
router.post("/del-promo", async function (req, res) {
  let promoObj = null,
    reqState = null;

  const inputs = {
    promoId: req.body.promoId || null
  }

  try {
    if(inputs.promoId === null) throw new Error("BU87MBIW12VEBB");

    let r = await utilPre.noReturnQuery(
      `DELETE FROM promo_code WHERE promo_code_id = ?;`,
      [inputs.promoId],
      shared.Connect.connWrap
    );
    if (r.state) {
      promoObj = { promo_code_id: inputs.promoId }
    } else throw new Error("BUEMM45BNYME112");

  } catch (e) {
    console.log(e);
    reqState = e.message;
  }

  res.send(JSON.stringify({ reqState, result: { promoObj } }));
  res.end();
});

router.post("/alter-promo", async function (req, res) {
  let alter = {},
    reqState = null;

  const inputs = {
    promoId: req.body.promoId || null,
    value: req.body.value || null,
    fieldname: req.body.fieldname || null
  }
  const possibleFields = ["code", "amount"];

  try {
    if(inputs.promoId === null || inputs.value === null || inputs.fieldname === null)  throw new Error("NNN78EMYELN23EV");

    if(!possibleFields.includes(inputs.fieldname)) throw new Error("BIEN455AINMM78EP");

    let r = await utilPre.noReturnQuery(
      `UPDATE promo_code SET ${inputs.fieldname} = ? WHERE promo_code_id = ?`,
      [inputs.value, inputs.promoId],
      shared.Connect.connWrap
    );
    if (r.state) {
      alter = { promoId: inputs.promoId };
      alter[inputs.fieldname] = inputs.value;
    } else throw new Error("UU733BIE0BBMEQP");

  } catch (e) {
    console.log(e);
    reqState = e.message;
  }

  res.send(JSON.stringify({ reqState, result: { alter } }));
  res.end();
});


router.post("/alter-account", async function (req, res) {
  let alter = {},
    reqState = null;

  const inputs = {
    adminId: req.body.adminId || null,
    value: req.body.value || null,
    fieldname: req.body.fieldname || null
  }
  const possibleFields = ["name", "password"];

  try {
    if(inputs.adminId === null || inputs.value === null || inputs.fieldname === null)  throw new Error("RTIGIU966E3E");

    if(!possibleFields.includes(inputs.fieldname)) throw new Error("ZIVHEUI962WVIE");

    if(inputs.fieldname === "password") inputs.value = await bcrypt.hash(inputs.value, 10);

    let r = await utilPre.noReturnQuery(
      `UPDATE admin_account SET ${inputs.fieldname} = ? WHERE adminId = ?`,
      [inputs.value, inputs.adminId],
      shared.Connect.connWrap
    );
    if (r.state) {
      alter = { adminId: inputs.adminId };
      alter[inputs.fieldname] = inputs.value;
    } else throw new Error("UIFI632EF963E");

  } catch (e) {
    console.log(e);
    reqState = e.message;
  }

  res.send(JSON.stringify({ reqState, result: { alter } }));
  res.end();
});

router.post("/get-orders", async function (req, res) {
  let orders = [], items = [], deliveryOptions = [], paymentOptions = [],
    reqState = null;

  try {
    let r = await utilPre.retQuery(
      `SELECT t1.*, t2.*, t3.*, t4.*, t5.* FROM customer_order t1 LEFT JOIN customer_order_detail t2 ON t1.order_id = t2.order_id LEFT JOIN customer_order_delivery t3 ON t1.order_id = t3.order_id LEFT JOIN customer_order_payment t4 ON t1.order_id = t4.order_id LEFT JOIN promo_code t5 ON t1.order_id = t5.usedByOrderId`,
      [],
      shared.Connect.connWrap
    );
    if (r.state) {
      orders = r.result;
    } else throw new Error("894GHR130B94EB13");

    r = await utilPre.retQuery(
      `SELECT t1.*, t2.name FROM customer_order_item t1 LEFT JOIN product t2 ON t1.product_id = t2.product_id`,
      [],
      shared.Connect.connWrap
    );
    if (r.state) {
      items = r.result;
    } else throw new Error("894GHR130B94EB13");

    r = await utilPre.retQuery(
      `SELECT option_id, option_name FROM delivery_option`,
      [],
      shared.Connect.connWrap
    );
    if (r.state) {
      deliveryOptions = r.result;
    } else throw new Error("894GHR130B94EB13");

    r = await utilPre.retQuery(
      `SELECT option_id, option_name FROM payment_option`,
      [],
      shared.Connect.connWrap
    );
    if (r.state) {
      paymentOptions = r.result;
    } else throw new Error("894GHR130B94EB13");
  } catch (e) {
    console.log(e);
    reqState = e.message;
  }

  res.send(JSON.stringify({ reqState, result: { orders, items, deliveryOptions, paymentOptions } }));
  res.end();
});


router.post("/order-next-phase", async function (req, res) {
  let alter = {},
    reqState = null;

  const inputs = {
    orderId: req.body.orderId || null,
    wEmail: req.body.wEmail || false,
  }

  try {
    if(inputs.orderId === null || inputs.wEmail === null)  throw new Error("12BM76ECI30DIY");

    let phase = null, email = null;
    let r = await utilPre.retQueryOne(
      `SELECT t1.phase, t2.email FROM customer_order t1 LEFT JOIN customer_order_detail t2 ON t1.order_id = t2.order_id WHERE t1.order_id = ?`,
      [inputs.orderId],
      shared.Connect.connWrap
    );
    if (r.state) {
      phase = +r.result.phase;
      email = r.result.email;
    } else throw new Error("15EB956EBI21EY"); // account with such a credentials doesnt exist

    // max phase reached
    if(phase > 2) throw new Error("48BI3BZUUU9EAX")

    r = await utilPre.noReturnQuery(
      `UPDATE customer_order SET phase = ${phase + 1} WHERE order_id = ?`,
      [inputs.orderId],
      shared.Connect.connWrap
    );
    if (r.state) {
      alter = { orderId: inputs.orderId };
      alter.phase = phase + 1;
    } else throw new Error("UIFI632EF963E");

    if(inputs.wEmail) {
      console.log("MAN SEND A MAIL")
      if(phase === 0) { // send processing email
        await sendProcessingMail(+inputs.orderId, email);
      }
      else if(phase === 1) { // send delivery email
        let deliveryOption = null;
        let r = await utilPre.retQueryOne(
          `SELECT t2.option_name FROM customer_order_delivery t1 JOIN delivery_option t2 ON t1.delivery_option = t2.option_id WHERE t1.order_id = ?`,
          [inputs.orderId],
          shared.Connect.connWrap
        );
        if (r.state) {
          deliveryOption = r.result.option_name;
        } else throw new Error("78VBEI123EBU94GIE1");

        await sendDeliveryMail(+inputs.orderId, email, deliveryOption);
      }
      else if(phase === 2) { // send completed email
        await sendCompletedMail(+inputs.orderId, email);
      }
      
    }

  } catch (e) {
    console.log(e);
    reqState = e.message;
  }

  res.send(JSON.stringify({ reqState, result: { alter } }));
  res.end();
});

router.post("/order-cancel-phase", async function (req, res) {
  let alter = {},
    reqState = null;

  const inputs = {
    orderId: req.body.orderId || null,
    wEmail: req.body.wEmail || false,
  }

  try {
    if(inputs.orderId === null || inputs.wEmail === null)  throw new Error("M3L9LE13E2EG914");

    let phase = null, email = null;
    let r = await utilPre.retQueryOne(
      `SELECT t1.phase, t2.email FROM customer_order t1 LEFT JOIN customer_order_detail t2 ON t1.order_id = t2.order_id WHERE t1.order_id = ?`,
      [inputs.orderId],
      shared.Connect.connWrap
    );
    if (r.state) {
      phase = +r.result.phase;
      email = r.result.email;
    } else throw new Error("VUR24VZU1MN7QA3");

    let items = [];
    r = await utilPre.retQuery(
      `SELECT product_id, count FROM customer_order_item WHERE order_id = ?`,
      [inputs.orderId],
      shared.Connect.connWrap
    );
    if (r.state) {
      items = r.result;
    } else throw new Error("MU96E10QNBU41EAE");

    // not cancelable phase rached (finished, canceled)
    if(phase > 2) throw new Error("48BI3BZUUU9EAX")

    r = await utilPre.noReturnQuery(
      `UPDATE customer_order SET phase = 4 WHERE order_id = ?`,
      [inputs.orderId],
      shared.Connect.connWrap
    );
    if (r.state) {
      alter = { orderId: inputs.orderId };
      alter.phase = 4;
    } else throw new Error("URI12E9QBB33QPOI78");

    // add returned goods into a stock
    const onStockCases = items.map(item => {
      if(item.product_id !== null) return `WHEN product_id = ${item.product_id} THEN onStock + ${item.count} `
    }).filter(v => v);
    const toReturnIds = items.map(item => { if(item.product_id !== null) return item.product_id }).filter(v => v);
    if(toReturnIds.length > 0) {
      r = await utilPre.noReturnQuery(
        `UPDATE product SET onStock = CASE ${onStockCases.join(" ")} END WHERE product_id IN (${toReturnIds.join(",")})`,
        [],
        shared.Connect.connWrap
      );
      if (!r.state) throw new Error("45EM01Q36VUI97DF");
    }
    
    if(inputs.wEmail) {
      console.log("MAN SEND A MAIL")
      await sendCanceledMail(+inputs.orderId, email);
    }

  } catch (e) {
    console.log(e);
    reqState = e.message;
  }

  res.send(JSON.stringify({ reqState, result: { alter } }));
  res.end();
});

router.post("/order-was-payed", async function (req, res) {
  let alter = {},
    reqState = null;

  const inputs = {
    orderId: req.body.orderId || null
  }

  try {
    if(inputs.orderId === null)  throw new Error("JHI94ECIL41YUEB");

    let paymentDetail = null
    let r = await utilPre.retQueryOne(
      `SELECT payment_detail FROM customer_order_payment WHERE order_id = ?`,
      [inputs.orderId],
      shared.Connect.connWrap
    );
    if (r.state) {
      paymentDetail = JSON.parse(r.result.payment_detail);
    } else throw new Error("CUUC4NEIN94YUEQR");

    paymentDetail.payed = true

    r = await utilPre.noReturnQuery(
      `UPDATE customer_order_payment SET payment_detail = ? WHERE order_id = ?`,
      [JSON.stringify(paymentDetail), inputs.orderId],
      shared.Connect.connWrap
    );
    if (r.state) {
      alter = { orderId: inputs.orderId };
      alter.payment_detail = JSON.stringify(paymentDetail);
    } else throw new Error("BBNIEN45BLHAIE183");
  } catch (e) {
    console.log(e);
    reqState = e.message;
  }

  res.send(JSON.stringify({ reqState, result: { alter } }));
  res.end();
});

module.exports = router