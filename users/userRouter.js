const express = require("express");
const Users = require("./userDb");
const Posts = require("../posts/postDb");
const router = express.Router();

router.use(express.json());

router.post("/", validateUser, (req, res) => {
  Users.insert(req.body)
    .then(user => {
      res.status(201).json({ message: "The post was added", user });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: "error adding the user" });
    });
});

router.post("/:id/posts", (req, res) => {
  // do your magic!
});

router.get("/", (req, res) => {
  // do your magic!
  Users.get(req.query)
    .then(users => {
      res.status(200).json(users);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: "error retrieving the users" });
    });
});

router.get("/:id", validateUserId, (req, res) => {
  res.status(200).json(req.user);
});

router.get("/:id/posts", (req, res) => {
  // do your magic!
});

router.delete("/:id", (req, res) => {
  // do your magic!
});

router.put("/:id", (req, res) => {
  // do your magic!
});

//custom middleware

function validateUserId(req, res, next) {
  console.log("id: ", req.params.id);
  Users.getById(req.params.id)
    .then(user => {
      if (user) {
        req.user = user;
        next();
      } else {
        res.status(404).json({ message: "invalid user id" });
      }
    })
    .catch(err => {
      console.log(err);
      res
        .status(500)
        .json({ error: "The user information could not be retrieved." });
    });
}

function validateUser(req, res, next) {
  const body = req.body;
  if (Object.keys(body).length === 0) {
    res.status(400).json({ message: "Missing user data" });
  } else if (body.name === "") {
    res.status(400).json({ message: "Missing required name field" });
  }
  next();
}

function validatePost(req, res, next) {
  // do your magic!
}

module.exports = router;
