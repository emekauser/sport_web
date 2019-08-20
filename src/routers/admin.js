//dependencies
const express = require("express");
const Admin = require("../models/admin");
const Team = require("../models/team");
const Fixture = require("../models/fixture");
const mongoose = require("mongoose");
const authadmin = require("../middleware/authadmin");
const router = express.Router();

router.post("/admins", async (req, res) => {
  // Create a new admin
  try {
    if (
      req.body.email === "admin@gmail.com" &&
      req.body.password === "admin12345"
    ) {
      const admin = new Admin(req.body);
      const token = await admin.generateAuthToken();
      await admin.save();
      res.status(201).send({ admin, token });
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/admins/login", async (req, res) => {
  //Login a admin
  try {
    const { email, password } = req.body;
    const admin = await Admin.findByCredentials(email, password);
    if (!admin) {
      return res
        .status(401)
        .send({ error: "Login failed! Check authentication credentials" });
    }
    const token = await admin.generateAuthToken();
    res.send({ admin, token });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/admins/me/logout", authadmin, async (req, res) => {
  // Log admin out of the application
  try {
    req.admin.tokens = req.admin.tokens.filter(token => {
      return token.token != req.token;
    });
    await req.admin.save();
    res.send("successfully logged out");
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post("/admins/me/logoutall", authadmin, async (req, res) => {
  // Log admin out of all devices
  try {
    req.admin.tokens.splice(0, req.admin.tokens.length);
    await req.admin.save();
    res.send("successfully logged out");
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/admins/me", authadmin, async (req, res) => {
  // View logged in admin profile
  res.send(req.admin);
});

//this is for team mangement routes------------------------------------------/

router.post("/admins/login/create/teams", authadmin, async (req, res, next) => {
  //add teams
  try {
    const team = new Team({
      _id: new mongoose.Types.ObjectId(),
      name: req.body.name
    });
    await team.save();
    res.status(201).send({ team });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.delete(
  "/admins/login/delete/teams",
  authadmin,
  async (req, res, next) => {
    //delete teams
    const id = req.body.id;
    Team.deleteOne({ id: id })
      .exec()
      .then(result => {
        res.status(202).json(result);
      })
      .catch(err => {
        res.status(400).json({ error: err });
      });
  }
);

router.get("/admins/login/view/teams", authadmin, async (req, res, next) => {
  // veiw teams
  Team.find()
    .exec()
    .then(docs => {
      res.status(201).json(docs);
    })
    .catch(err => {
      res.status(400).json({ error: err });
    });
});

router.patch("/admins/login/update", authadmin, async (req, res, next) => {
  // update teams
  const id = req.body._id;
  Team.updateOne({ _id: id }, { $set: { name: req.body.newName } })
    .exec()
    .then(docs => {
      res.status(201).json(docs);
    })
    .catch(err => {
      res.status(400).json({ error: err });
    });
});

//this sections is for fixtures routes--------------------------------------/
router.post("/admins/login/create/matches", authadmin, async (req, res) => {
  //add matches
  let id = new mongoose.Types.ObjectId();
  try {
    const fixture = new Fixture({
      _id: id,
      match: req.body.match,
      FT: req.body.FT === "true",
      link: req.headers.host + "/admins/login/view/match?id=" + id
    });
    await fixture.save();
    res.status(201).send({ fixture });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.delete(
  "/admins/login/delete/matches",
  authadmin,
  async (req, res, next) => {
    //delete matches
    const id = req.body.id;
    Fixture.deleteOne({ id: id })
      .exec()
      .then(result => {
        res.status(202).json(result);
      })
      .catch(err => {
        res.status(400).json({ error: err });
      });
  }
);

router.get("/admins/login/view/matches", authadmin, async (req, res, next) => {
  // veiw matches
  Fixture.find()
    .exec()
    .then(docs => {
      res.status(201).json(docs);
    })
    .catch(err => {
      res.status(400).json({ error: err });
    });
});
router.get("/admins/login/view/match", authadmin, async (req, res, next) => {
  // veiw matche only
  Fixture.find({ _id: req.query.id })
    .exec()
    .then(docs => {
      res.status(201).json(docs);
    })
    .catch(err => {
      res.status(400).json({ error: err });
    });
});

router.patch(
  "/admins/login/updateFixture",
  authadmin,
  async (req, res, next) => {
    // update matches
    const id = req.body._id;
    Fixture.updateOne({ _id: id }, { $set: { match: req.body.newMatch } })
      .exec()
      .then(docs => {
        res.status(201).json(docs);
      })
      .catch(err => {
        res.status(400).json({ error: err });
      });
  }
);

module.exports = router;
