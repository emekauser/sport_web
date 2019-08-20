//Dependencies
const express = require("express");
const User = require("../models/user");
const Team = require("../models/team");
const Fixture = require("../models/fixture");
const auth = require("../middleware/auth");
const router = express.Router();

router.post("/users", async (req, res) => {
  // Create a new user
  try {
    const user = new User(req.body);
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/users/login", async (req, res) => {
  //Login a registered user
  try {
    const { email, password } = req.body;
    const user = await User.findByCredentials(email, password);
    if (!user) {
      return res
        .status(401)
        .send({ error: "Login failed! Check authentication credentials" });
    }
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/users/me/logout", auth, async (req, res) => {
  // Log user out of the application
  try {
    req.user.tokens = req.user.tokens.filter(token => {
      return token.token != req.token;
    });
    await req.user.save();
    res.send("successfully logged out");
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post("/users/me/logoutall", auth, async (req, res) => {
  // Log user out of all devices
  try {
    req.user.tokens.splice(0, req.user.tokens.length);
    await req.user.save();
    res.send("successfully logged out");
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/users/me", auth, async (req, res) => {
  // View logged in user profile
  res.send(req.user);
});

// route for user to view teams------------------------------------------------------/
// veiw teams
router.get("/users/login/view", auth, async (req, res, next) => {
  Team.find()
    .exec()
    .then(docs => {
      res.status(201).json(docs);
    })
    .catch(err => {
      res.status(400).json({ error: err });
    });
});

// route for view completed or pending fixture--------------------------------------------/

router.get("/users/login/matches", async (req, res) => {
  const FT = req.body.FT === "true";
  Fixture.find({ FT: FT })
    .exec()
    .then(docs => {
      res.status(201).json(docs);
    })
    .catch(err => {
      res.status(400).json({ error: err });
    });
});

module.exports = router;
