var express = require('express');
var router = express.Router();
const bcrypt = require("bcrypt");
const auth = require("../middleware/auth");

// /Users/neats/OneDrive/Documents/APIs/MemorandumAPI/socket/index


router.get("/all", async function (req, res, next) {
  try {
    res.status(200).json(await req.db.from("users").select("*"));
  } catch (err) {
    console.log(err)
  }
});

router.get("/:id", async function (req, res, next) {
  const { id } = req.params;
  try {
    res.status(200).json(await req.db.from("users").select("*").where({id: id}));
  } catch (err) {
    console.log(err)
  }
});

router.get("/:id/friendrequests", async function (req, res, next) {
  const { id } = req.params;
  try {

    const potentialFriends = await req.db.from("friends").select("*").where({user2_id: id})
    const ourFriends = await req.db.from("friends").select("*").where({user1_id: id})

    console.log(ourFriends)

    let friends = potentialFriends.filter(e => !ourFriends.some((arr) =>
    arr.user2_id === e.user1_id));

    let friendProfiles = []

    for(let i = 0; i < friends.length; i++) {
      let ret = await req.db.from("users").select("*").where({id: friends[i].user1_id});
      if (ret[0] !== undefined) friendProfiles.push(ret[0])
    }

    res.status(200).json(
      friendProfiles
    );
    return;

  } catch (err) {
    console.log(err)
  }
});

router.get("/:id/friends", async function (req, res, next) {
  const { id } = req.params;
  try {

    const ourFriends = await req.db.from("friends").select("*").where({user1_id: id})
    let friendProfiles = []

    for(let i = 0; i < ourFriends.length; i++) {
      let ret = await req.db.from("users").select("*").where({id: ourFriends[i].user2_id});
      friendProfiles.push(ret[0])
    }

    res.status(200).json({
      friendProfiles
    });
  } catch (err) {
    console.log(err)
  }
});

router.post("/friend/:username/accept", async function(req, res, next) {
  try {

    const { username } = req.params;
    const { sender_id } = req.body;

    console.log(sender_id)

    const friend = await req.db.from("users").select("*").where({username});

    const request = await req.db.from("friends").select("*")
    .where({user1_id: friend[0].id}).andWhere({user2_id: sender_id})

    if (request.length === 0) {
      res.status(400).json({
        message: "They have not sent a friend request"
      })
      return;
    }

    await req.db.from("friends").insert({user1_id: sender_id, user2_id: friend[0].id})
    res.status(201).json({
      message: "Friend request accepted!"
    })
    return;


  } catch(err) {
    console.log(err)
  }

})

router.post("/friend/:username", async function(req, res, next) {
  try {

    const { username } = req.params;
    const { sender_id } = req.body;

    console.log(sender_id)

    const friend = await req.db.from("users").select("*").where({username});

    const haveWeSentARequestAlready = await req.db.from("friends").select("*")
    .where({user1_id: sender_id}).andWhere({user2_id: friend[0].id})

    if (haveWeSentARequestAlready.length !== 0) {
      res.status(200).json({
        message: "You have already sent a friend request to " + friend[0].username,
        friend
      })
      return;
    }

    await req.db.from("friends").insert({user1_id: sender_id, user2_id: friend[0].id})
    res.status(201).json({
      message: "Friend request succesfully sent!",
      friend
    })

    return;


  } catch(err) {
    console.log(err)
  }

})

// const getUser = (user) => {
//   for (let i = 0; i < socketUsers.length; i++) {
//     if (socketUsers[i].id === user) {
//       console.log(socketUsers[i]);
//       return socketUsers[i].socketId;
//     }
//   }
// };

/* GET user account. */
router.get(
  "/:username/profile",
  auth.checkAuthorization,
  function (req, res, next) {
    const { username } = req.params;
    var { authed, unauthorizedToken } = res.locals;

    if (unauthorizedToken) authed = false;

    req.db
      .from("users")
      .select("*")
      .where({ username })
      .then((users) => {
        if (users.length == 0) {
          res.status(404).json({
            error: true,
            message: "User not found",
          });
          return;
        }
        res.status(200).json({profile: users[0]});
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          Error: true,
          Message: "Error in MySQL query",
        });
      });
  }
);

router.post("/register", function (req, res, next) {
  const { username, password, publicKey } = req.body;

  if (!username || !password) {
    res.status(400).json({
      error: true,
      message: "Request body incomplete, both email and password are required",
    });
    return;
  }

  req.db
    .from("users")
    .select("*")
    .where({ username })
    .then((users) => {
      if (users.length > 0) {
        res.status(409).json({
          Error: true,
          message: "User already exists",
        });
        return;
      }

      const hash = bcrypt.hashSync(password, 10);
      req.db
        .from("users")
        .insert({ username, hash, publicKey })
        .then((u) => {
          res.status(201).json({
            message: "User created",
            id: u[0]
          });
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json({
            Error: true,
            Message: "Error in MySQL query",
          });
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        Error: true,
        Message: "Error in MySQL query",
      });
    });
});

router.put("/:id/edit", function (req, res, next) {
  const { lastOnline } = req.body;
  req.db
  .from("users")
  .select("*")
  .where("id", "=", req.params.id)
  .then((users) => {
    if (users.length == 0) {
      res.status(401).json({
        error: true,
        message: "Doesn't exist",
      });
      return;
    }
    req.db
    .from("users")
    .where("id", "=", req.params.id)
    .update({lastOnline})
    .then((users) => {
      res.status(200).json({
        message: "updated"
      })
    })
    .catch((err) => {
      res.status(500).json({
        error: true,
        message: "Error in MySQL query",
      });
      return;
    });
  })
  .catch((err) => {
    res.status(500).json({
      error: true,
      message: "Error in MySQL query",
    });
    return;
  });
})

router.put("/:id/keys", function (req, res, next) {
  const { publicKey } = req.body;
  req.db
  .from("users")
  .select("*")
  .where("id", "=", req.params.id)
  .then((users) => {
    if (users.length == 0) {
      res.status(401).json({
        error: true,
        message: "Doesn't exist",
      });
      return;
    }
    req.db
    .from("users")
    .where("id", "=", req.params.id)
    .update({publicKey})
    .then((users) => {
      res.status(200).json({
        message: "updated"
      })
    })
    .catch((err) => {
      res.status(500).json({
        error: true,
        message: "Error in MySQL query",
      });
      return;
    });
  })
  .catch((err) => {
    res.status(500).json({
      error: true,
      message: "Error in MySQL query",
    });
    return;
  });
})


/* POST user login. */
router.post("/login", function (req, res, next) {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).json({
      error: true,
      message: "Request body incomplete, both email and password are required",
    });
    return;
  }

  req.db
    .from("users")
    .select("*")
    .where({ username })
    .then((users) => {
      if (users.length == 0) {
        res.status(401).json({
          error: true,
          message: "Incorrect email or password",
        });
        return;
      }

      if (users[0].username !== username) {
        res.status(401).json({
          error: true,
          message: "Incorrect email or password",
        });
        return;
      }

      const { hash } = users[0];

      if (!bcrypt.compareSync(password, hash)) {
        res.status(401).json({
          error: true,
          message: "Incorrect email or password",
        });
        return;
      }
      const expires_in = 60 * 60 * 24;
      const token = auth.sign(username, expires_in);
      res.status(200).json({
        user: users[0],
        token_details: {
          token_str: token,
          token_type: "Bearer",
          expires_in,
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        Error: true,
        Message: "Error in MySQL query",
      });
    });
});

module.exports = router;
