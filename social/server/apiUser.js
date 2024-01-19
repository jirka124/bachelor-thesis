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

router.post("/whoami", async function (req, res) {
  let whoami = { userId: null, userName: null, userAvatar: null },
    reqState = null;

  whoami: try {
    if (!req.session.userId) break whoami;

    let r = await utilPre.retQueryOne(
      `SELECT login, avatar FROM user WHERE user_id = ?`,
      [req.session.userId],
      shared.Connect.connWrap
    );
    if (r.state) {
      whoami = {
        userId: req.session.userId,
        userName: r.result.login,
        userAvatar: r.result.avatar,
      };
    } else throw new Error("54YNALI36YNALINFE");
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
    if (!req.session.userId) throw new Error("665ANMLI123YNAI48E");
    isLogged = true;
  } catch (e) {
    console.log(e);
    reqState = e.message;
  }

  res.send(JSON.stringify({ reqState, result: { isLogged } }));
  res.end();
});

router.post("/login", async function (req, res) {
  let reqState = null;

  const inputs = {
    name: req.body.name || "",
    pass: req.body.pass || "",
  };

  try {
    let userId = null,
      userPass = null;

    if (req.session.userId) throw new Error("01YNA45YLNA961YAN");

    let r = await utilPre.retQueryOne(
      `SELECT user_id AS userId, password FROM user WHERE login = ?`,
      [inputs.name],
      shared.Connect.connWrap
    );
    if (r.state) {
      userId = r.result.userId;
      userPass = r.result.password;
    } else throw new Error("B755YN9YLAN12YAN");

    const isValid = await bcrypt.compare(inputs.pass, userPass);
    if (!isValid) throw new Error("78AEE06YAP784YNAL");

    req.session.userId = userId;

    const saveSessionAsync = nodeUtil
      .promisify(req.session.save)
      .bind(req.session);

    try {
      await saveSessionAsync();
    } catch (err) {
      throw new Error("HJ15YANO00YLANGE");
    }
  } catch (e) {
    console.log(e);
    reqState = e.message;
  }

  res.send(JSON.stringify({ reqState, result: {} }));
  res.end();
});

router.post("/signup", async function (req, res) {
  let reqState = null;

  const inputs = {
    name: req.body.name || "",
    pass: req.body.pass || "",
  };

  try {
    let userId = null,
      userPass = null;

    if (req.session.userId) throw new Error("78AN002YLAN846YLNAE");
    if (
      typeof inputs.name !== "string" ||
      inputs.name.length < 1 ||
      inputs.name.length > 32
    )
      throw new Error("GG45Y84YLAN35ANYE");
    if (typeof inputs.pass !== "string" || inputs.pass.length < 1)
      throw new Error("78YLAN36YNAIIE264YU");

    userPass = await bcrypt.hash(inputs.pass, 10);

    let r = await utilPre.noReturnQuery(
      `INSERT INTO user (login, password) VALUES (?, ?)`,
      [inputs.name, userPass],
      shared.Connect.connWrap
    );
    if (r.state) userId = r.result.insertIds[0];
    else throw new Error("ZU45YMA23ALILINEAL8");

    req.session.userId = userId;

    const saveSessionAsync = nodeUtil
      .promisify(req.session.save)
      .bind(req.session);

    try {
      await saveSessionAsync();
    } catch (err) {
      throw new Error("003IEN699YNANI16A");
    }
  } catch (e) {
    console.log(e);
    reqState = e.message;
  }

  res.send(JSON.stringify({ reqState, result: {} }));
  res.end();
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

router.post("/view-feed-csr", async function (req, res) {
  let reqState = null,
    posts = [],
    likeCounts = [],
    replyCounts = [],
    likes = [];

  try {
    let friends = [];
    if (req.session.userId) {
      let r = await utilPre.retQuery(
        `SELECT CASE WHEN friend_1 = ? THEN friend_2 ELSE friend_1 END AS friend FROM friendship WHERE friend_1 = ? OR friend_2 = ?`,
        [req.session.userId, req.session.userId, req.session.userId],
        shared.Connect.connWrap
      );
      if (r.state) {
        friends = r.result;
      } else throw new Error("03YIN96YNAL16YLNA78");
    }

    if (friends.length > 0) {
      const friendIds = friends.map((f) => f.friend);
      let r = await utilPre.retQuery(
        `SELECT t1.post_id AS postId, t1.user_id AS userId, t1.content, t1.date AS createDate, t2.login, t2.avatar FROM post t1 JOIN user t2 ON t1.user_id = t2.user_id WHERE t1.user_id IN (${[
          ...friendIds,
          req.session.userId,
        ].join(
          ","
        )}) GROUP BY t1.post_id, t1.user_id, t1.content, t1.date, t2.login, t2.avatar ORDER BY t1.date DESC`,
        [req.session.userId],
        shared.Connect.connWrap
      );
      if (r.state) {
        posts = r.result;
      } else throw new Error("45YNI32YNALIEN846Y");

      const postIds = posts.map((p) => p.postId);

      if (postIds.length > 0) {
        // Fetch only user likes
        r = await utilPre.retQuery(
          `SELECT post_id AS postId, COUNT(user_id) as hasLiked FROM post_like WHERE user_id = ? AND post_id IN (${postIds.join(
            ","
          )}) GROUP BY post_id`,
          [req.session.userId],
          shared.Connect.connWrap
        );
        if (r.state) {
          likes = r.result;
        } else throw new Error("7325YLNYINAG6YGE32");

        // fetch all likes
        r = await utilPre.retQuery(
          `SELECT post_id AS postId, COUNT(user_id) as likeCount FROM post_like WHERE post_id IN (${postIds.join(
            ","
          )}) GROUP BY post_id`,
          [],
          shared.Connect.connWrap
        );
        if (r.state) {
          likeCounts = r.result;
        } else throw new Error("T94E06E64EEB78GBBB");

        // fetch all replies
        r = await utilPre.retQuery(
          `SELECT post_id AS postId, COUNT(user_id) as replyCount FROM post_comment WHERE post_id IN (${postIds.join(
            ","
          )}) GROUP BY post_id`,
          [],
          shared.Connect.connWrap
        );
        if (r.state) {
          replyCounts = r.result;
        } else throw new Error("777E16B63YA9E1366E");
      }
    }
  } catch (e) {
    console.log(e);
    reqState = e.message;
  }

  res.send(
    JSON.stringify({
      reqState,
      result: { posts, likes, likeCounts, replyCounts },
    })
  );
  res.end();
});

router.post("/like-post", async function (req, res) {
  let reqState = null,
    likeObj = null;

  const inputs = {
    postId: +req.body.postId || null,
  };

  try {
    if (!req.session.userId) throw new Error("13YAN956YLNANE03AG");
    if (typeof inputs.postId !== "number" || inputs.postId < 1)
      throw new Error("M56YNA032YLANE8BG6");

    let r = await utilPre.noReturnQuery(
      `INSERT IGNORE INTO post_like (post_id, user_id) VALUES (?, ?)`,
      [inputs.postId, req.session.userId],
      shared.Connect.connWrap
    );
    if (r.state) {
      likeObj = {
        postId: inputs.postId,
        hasLiked: true,
      };
    } else throw new Error("GH85YLNA878165Y99");
  } catch (e) {
    console.log(e);
    reqState = e.message;
  }

  res.send(JSON.stringify({ reqState, result: { likeObj } }));
  res.end();
});

router.post("/unlike-post", async function (req, res) {
  let reqState = null,
    likeObj = null;

  const inputs = {
    postId: +req.body.postId || null,
  };

  try {
    if (!req.session.userId) throw new Error("33BA49AG87AB635EWG");
    if (typeof inputs.postId !== "number" || inputs.postId < 1)
      throw new Error("9AB616EG35AGE78A");

    let r = await utilPre.noReturnQuery(
      `DELETE FROM post_like WHERE post_id = ? AND user_id = ?`,
      [inputs.postId, req.session.userId],
      shared.Connect.connWrap
    );
    if (r.state) {
      likeObj = {
        postId: inputs.postId,
        hasLiked: false,
      };
    } else throw new Error("98LA326ABINE48AG");
  } catch (e) {
    console.log(e);
    reqState = e.message;
  }

  res.send(JSON.stringify({ reqState, result: { likeObj } }));
  res.end();
});

router.post("/fetch-post-comments", async function (req, res) {
  let reqState = null,
    commentObj = null;

  const inputs = {
    postId: +req.body.postId || null,
  };

  try {
    if (!req.session.userId) throw new Error("445ANE69NALY03Y89AE");
    if (typeof inputs.postId !== "number" || inputs.postId < 1)
      throw new Error("GG59ANEN03YNEINLA94");

    // check whether is friend or not
    let r = await utilPre.retQueryOne(
      `SELECT 1 AS state FROM post t1 JOIN friendship t2 ON (t1.user_id = t2.friend_1 OR t1.user_id = t2.friend_2) WHERE t1.post_id = ? AND (t1.user_id = t2.friend_1 AND t2.friend_2 = ?) OR (t1.user_id = t2.friend_2 AND t2.friend_1 = ?)`,
      [inputs.postId, req.session.userId, req.session.userId],
      shared.Connect.connWrap
    );
    if (!r.state) throw new Error("659AN03ACNNE998GMJH");

    r = await utilPre.retQuery(
      `SELECT t1.post_comment_id AS postCommentId, t1.post_id AS postId, t1.user_id as userId, t1.content, t1.date, t2.login, t2.avatar FROM post_comment t1 JOIN user t2 ON t1.user_id = t2.user_id WHERE post_id = ?`,
      [inputs.postId],
      shared.Connect.connWrap
    );
    if (r.state) {
      commentObj = {
        postId: inputs.postId,
        comments: r.result,
      };
    } else throw new Error("66B7AENHLAN86ARH1");
  } catch (e) {
    console.log(e);
    reqState = e.message;
  }

  res.send(JSON.stringify({ reqState, result: { commentObj } }));
  res.end();
});

router.post("/create-post-comment", async function (req, res) {
  let reqState = null,
    commentObj = null;

  const inputs = {
    postId: +req.body.postId || null,
    commentVal: req.body.commentVal || null,
  };

  try {
    if (!req.session.userId) throw new Error("45VA3AD94AGE16EGE64");
    if (typeof inputs.postId !== "number" || inputs.postId < 1)
      throw new Error("9AGE48EGA55EG61AEB");
    if (typeof inputs.commentVal !== "string" || inputs.commentVal.length < 1)
      throw new Error("JHHH94EGSG77EEG222E");

    // check whether is friend or not
    let r = await utilPre.retQueryOne(
      `SELECT 1 AS state FROM post t1 JOIN friendship t2 ON (t1.user_id = t2.friend_1 OR t1.user_id = t2.friend_2) WHERE t1.post_id = ? AND (t1.user_id = t2.friend_1 AND t2.friend_2 = ?) OR (t1.user_id = t2.friend_2 AND t2.friend_1 = ?)`,
      [inputs.postId, req.session.userId, req.session.userId],
      shared.Connect.connWrap
    );
    if (!r.state) throw new Error("8AG12Y0E00EG55EGE");

    r = await utilPre.noReturnQuery(
      `INSERT INTO post_comment (post_id, user_id, content) VALUES (?, ?, ?)`,
      [inputs.postId, req.session.userId, inputs.commentVal],
      shared.Connect.connWrap
    );
    if (r.state) {
      commentObj = {
        postId: inputs.postId,
        comment: {
          postCommentId: r.result.insertIds[0],
          postId: inputs.postId,
          userId: req.session.userId,
          content: inputs.commentVal,
          date: new Date(),
        },
      };
    } else throw new Error("99GE44EG02EGE588EGE");
  } catch (e) {
    console.log(e);
    reqState = e.message;
  }

  res.send(JSON.stringify({ reqState, result: { commentObj } }));
  res.end();
});

router.post("/create-post", async function (req, res) {
  let reqState = null;

  const inputs = {
    contentVal: req.body.contentVal || null,
  };

  try {
    if (!req.session.userId) throw new Error("776GE13EAG94A02EGGAE");
    if (typeof inputs.contentVal !== "string" || inputs.contentVal.length < 1)
      throw new Error("BB29EA658EEEGGH481E");

    let r = await utilPre.noReturnQuery(
      `INSERT INTO post (user_id, content) VALUES (?, ?)`,
      [req.session.userId, inputs.contentVal],
      shared.Connect.connWrap
    );
    if (!r.state) throw new Error("784EEE56A99AGBL15EE");
  } catch (e) {
    console.log(e);
    reqState = e.message;
  }

  res.send(JSON.stringify({ reqState, result: {} }));
  res.end();
});

router.post("/view-user-profile-ssr", async function (req, res) {
  let reqState = null,
    userObj = null;

  const inputs = {
    userId: +req.body.userId || null,
    path: req.body.path || null,
  };

  try {
    let accessLevel = "guest",
      isFriend = null;

    if (typeof inputs.userId !== "number" || inputs.userId < 1)
      throw new Error("73AG998EEB02YA65");

    if (req.session.userId && req.session.userId === inputs.userId)
      accessLevel = "own";
    else if (req.session.userId) {
      // check whether is friend or not
      let r = await utilPre.retQueryOne(
        `SELECT 1 AS state FROM friendship WHERE (? = friend_1 AND friend_2 = ?) OR (? = friend_2 AND friend_1 = ?)`,
        [inputs.userId, req.session.userId, inputs.userId, req.session.userId],
        shared.Connect.connWrap
      );
      if (r.state) accessLevel = "friend";
      isFriend = r.state;
    }

    if (accessLevel === "own" || accessLevel === "friend") {
      let r = await OdaiTable.read({
        query: `SELECT user_id AS userId, login, description, avatar, signup_date AS signupDate FROM user WHERE user_id = ?`,
        prepared: [inputs.userId],
        path: inputs.path,
        transformer: "retQueryOne",
      });
      if (r.state) {
        userObj = {
          ...r.result,
          accessLevel,
          isFriend,
        };
      } else throw new Error("78BNE36YANE94SNEG");
    } else {
      let r = await OdaiTable.read({
        query: `SELECT user_id AS userId, login, avatar FROM user WHERE user_id = ?`,
        prepared: [inputs.userId],
        path: inputs.path,
        transformer: "retQueryOne",
      });
      if (r.state) {
        userObj = {
          ...r.result,
          accessLevel,
          isFriend,
        };
      } else throw new Error("MM76AB03AG96AG84E0");
    }
  } catch (e) {
    console.log(e);
    reqState = e.message;
  }

  res.send(JSON.stringify({ reqState, result: { userObj } }));
  res.end();
});

router.post("/view-user-profile-csr", async function (req, res) {
  let reqState = null,
    posts = [],
    likes = [],
    likeCounts = [],
    replyCounts = [],
    friends = [];

  const inputs = {
    userId: +req.body.userId || null,
  };

  try {
    let accessLevel = "guest";

    if (typeof inputs.userId !== "number" || inputs.userId < 1)
      throw new Error("44V96AG13E0BBE48EG");

    if (req.session.userId && req.session.userId === inputs.userId)
      accessLevel = "own";
    else if (req.session.userId) {
      // check whether is friend or not
      let r = await utilPre.retQueryOne(
        `SELECT 1 AS state FROM friendship WHERE (? = friend_1 AND friend_2 = ?) OR (? = friend_2 AND friend_1 = ?)`,
        [inputs.userId, req.session.userId, inputs.userId, req.session.userId],
        shared.Connect.connWrap
      );
      if (r.state) accessLevel = "friend";
    }
    if (accessLevel === "own" || accessLevel === "friend") {
      let r = await utilPre.retQuery(
        `SELECT t1.post_id AS postId, t1.user_id AS userId, t1.content, t1.date AS createDate, t2.login, t2.avatar FROM post t1 JOIN user t2 ON t1.user_id = t2.user_id WHERE t1.user_id = ? GROUP BY t1.post_id, t1.user_id, t1.content, t1.date, t2.login, t2.avatar ORDER BY t1.date DESC`,
        [inputs.userId],
        shared.Connect.connWrap
      );
      if (r.state) {
        posts = r.result;
      } else throw new Error("96AG03AEG486GGN06WG9");

      const postIds = posts.map((p) => p.postId);
      if (postIds.length > 0) {
        // Fetch only user likes
        r = await utilPre.retQuery(
          `SELECT post_id AS postId, COUNT(user_id) as hasLiked FROM post_like WHERE user_id = ? AND post_id IN (${postIds.join(
            ","
          )}) GROUP BY post_id`,
          [req.session.userId],
          shared.Connect.connWrap
        );
        if (r.state) {
          likes = r.result;
        } else throw new Error("ZZ66WG94E02QGT94Z");

        // fetch all likes
        r = await utilPre.retQuery(
          `SELECT post_id AS postId, COUNT(user_id) as likeCount FROM post_like WHERE post_id IN (${postIds.join(
            ","
          )}) GROUP BY post_id`,
          [],
          shared.Connect.connWrap
        );
        if (r.state) {
          likeCounts = r.result;
        } else throw new Error("78EM36EB79A61E4G5");

        // fetch all replies
        r = await utilPre.retQuery(
          `SELECT post_id AS postId, COUNT(user_id) as replyCount FROM post_comment WHERE post_id IN (${postIds.join(
            ","
          )}) GROUP BY post_id`,
          [],
          shared.Connect.connWrap
        );
        if (r.state) {
          replyCounts = r.result;
        } else throw new Error("98E1635E74E64E94E");
      }

      r = await utilPre.retQuery(
        `SELECT CASE WHEN t1.friend_1 = ? THEN t1.friend_2 ELSE t1.friend_1 END AS userId, t2.login, t2.avatar FROM friendship t1 INNER JOIN user t2 ON (CASE WHEN t1.friend_1 = ? THEN t1.friend_2 ELSE t1.friend_1 END = t2.user_id) WHERE t1.friend_1 = ? OR t1.friend_2 = ?`,
        [inputs.userId, inputs.userId, inputs.userId, inputs.userId],
        shared.Connect.connWrap
      );
      if (r.state) {
        friends = r.result;
      } else throw new Error("325EG94AE64HE03EH9");
    }
  } catch (e) {
    console.log(e);
    reqState = e.message;
  }

  res.send(
    JSON.stringify({
      reqState,
      result: { posts, likes, likeCounts, replyCounts, friends },
    })
  );
  res.end();
});

router.post("/save-user-description", async function (req, res) {
  let reqState = null;

  const inputs = {
    description: req.body.description || null,
  };

  try {
    if (!req.session.userId) throw new Error("36A180E84EG68EGBTP");
    if (
      typeof inputs.description !== "string" ||
      inputs.description.length < 1 ||
      inputs.description.length > 255
    )
      throw new Error("77E36EG94E84A699EG1");

    let r = await utilPre.noReturnQuery(
      `UPDATE user SET description = ? WHERE user_id = ?`,
      [inputs.description, req.session.userId],
      shared.Connect.connWrap
    );
    if (!r.state) throw new Error("00E63E94AE1636E9GN");
  } catch (e) {
    console.log(e);
    reqState = e.message;
  }

  res.send(JSON.stringify({ reqState, result: {} }));
  res.end();
});

router.post("/add-friend", async function (req, res) {
  let reqState = null;

  const inputs = {
    userId: +req.body.userId || null,
  };

  try {
    if (!req.session.userId) throw new Error("002E35E48E699E1586E12");
    if (typeof inputs.userId !== "number" || inputs.userId < 1)
      throw new Error("778E9135E19556EE168");

    let r = await utilPre.retQueryOne(
      `SELECT date FROM friendship WHERE (friend_1 = ? AND friend_2 = ?) OR (friend_2 = ? AND friend_1 = ?)`,
      [inputs.userId, req.session.userId, inputs.userId, req.session.userId],
      shared.Connect.connWrap
    );
    if (!r.state) {
      r = await utilPre.noReturnQuery(
        `INSERT INTO friendship (friend_1, friend_2) VALUES (?, ?)`,
        [req.session.userId, inputs.userId],
        shared.Connect.connWrap
      );
      if (!r.state) throw new Error("78E0039E485E29637EEG");
    }
  } catch (e) {
    console.log(e);
    reqState = e.message;
  }

  res.send(JSON.stringify({ reqState, result: {} }));
  res.end();
});

router.post("/delete-friend", async function (req, res) {
  let reqState = null;

  const inputs = {
    userId: +req.body.userId || null,
  };

  try {
    if (!req.session.userId) throw new Error("77AE3088E309EGE");
    if (typeof inputs.userId !== "number" || inputs.userId < 1)
      throw new Error("777EGGAS06E977E1E0");

    let r = await utilPre.noReturnQuery(
      `DELETE FROM friendship WHERE (friend_1 = ? AND friend_2 = ?) OR (friend_2 = ? AND friend_1 = ?)`,
      [inputs.userId, req.session.userId, inputs.userId, req.session.userId],
      shared.Connect.connWrap
    );
    if (!r.state) throw new Error("44E6E9166E1955E9136E");
  } catch (e) {
    console.log(e);
    reqState = e.message;
  }

  res.send(JSON.stringify({ reqState, result: {} }));
  res.end();
});

module.exports = router;
