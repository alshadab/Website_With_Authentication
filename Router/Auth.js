const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../Model/UserRegSchema");

const { response } = require("express");
const router = express.Router();
const SECRET_KEY = process.env.SECRET_KEY;

const authenticate = require("../Middleware/Authenticate");

//Signup
router.post("/signup", async (req, res) => {
  try {
    const password = req.body.password;
    const cPassword = req.body.cPassword;
    const email = req.body.email;
    const phone = req.body.phone;
    const find = await User.findOne({ email });
    const find2 = await User.findOne({ phone });
    if (find) {
      res.status(400).json({ message: "User already exists" });
    } else if (password !== cPassword) {
      res.status(400).json({ message: "Password don't match" });
    } else if (find2) {
      res.status(400).json({ message: "Phone is already used" });
    } else {
      const user = await new User(req.body).save();
      res.status(201).json({
        profile: user,
        message: "Registration successful",
      });
    }
  } catch (err) {
    res.send(err);
  }
});

//Signin
router.post("/signin", async (req, res) => {
  try {
    const password = req.body.password;

    const email = req.body.email;

    const find = await User.findOne({ email });

    if (find) {
      const user = await bcrypt.compare(password, find.password);
      if (user) {
        let token = await find.generateToken();
        res.cookie(process.env.TOKEN_NAME, token, {
          expires: new Date(Date.now() + 3600000),
          httpOnly: true,
        });
        return res.status(200).json({
          user: find.name,

          message: "Login successful",
        });
      } else {
        return res.status(400).send("Authentication failed");
      }
    }

    return res.status(400).send("Authentication failed");
  } catch (err) {
    res.send(err.message);
  }
});

router.get("/get", authenticate, async (req, res) => {
  try {
    res.json(req.MainUser);
  } catch (err) {
    res.send(err.message);
  }
});

module.exports = router;
