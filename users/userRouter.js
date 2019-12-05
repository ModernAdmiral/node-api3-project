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

router.post("/:id/posts", validateUserId, validatePost, (req, res) => {
  const newPost = { user_id: req.params.id, text: req.body.text };
  Posts.insert(newPost)
    .then(post => {
      res.status(201).json(post);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: "Error inserting new post." });
    });
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

router.get("/:id/posts", validateUserId, (req, res) => {
  Users.getUserPosts(req.params.id)
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(err => {
      res.status(500).json({ message: `Could not retrieve user's posts.` });
    });
});
router.delete("/:id", validateUserId, (req, res) => {
  Users.remove(req.params.id)
    .then(user => {
      res.status(200).json({ message: "The user has been removed" });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: "The user could not be removed" });
    });
});

router.put("/:id", validateUser, validateUserId, (req, res) => {
  const id = req.params.id;
  const body = req.body;
  Users.update(id, body)
    .then(user => {
      res.status(200).json({ message: "user has been updated", user });
    })
    .catch(err => {
      console.log(err);
      res
        .status(500)
        .json({ error: "The user information could not be modified." });
    });
});

//custom middleware

function validateUserId(req, res, next) {
  Users.getById(req.params.id)
    .then(user => {
      if (user) {
        req.user = user; //set user to be req.user if id is valid
        next(); // move to next function
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
    // Check if empty object
    res.status(400).json({ message: "Missing user data" });
  } else if (body.name === "") {
    // check if body name is empty
    res.status(400).json({ message: "Missing required name field" });
  }
  next(); // move to next function
}

function validatePost(req, res, next) {
  const body = req.body;
  if (body && !body.text) {
    //check if text post exists
    res.status(400).json({ message: "Missing required text field" });
  } else if (Object.keys(body).length === 0) {
    //check if post is just empty object
    res.status(400).json({ message: "Missing post data" });
  }

  next(); // move to next function
}

module.exports = router;
