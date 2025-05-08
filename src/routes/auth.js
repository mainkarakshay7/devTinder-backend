const express = require("express");
const { validateSignupData } = require("../utils/validation");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const req = require("express/lib/request");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, emailId, password } = req.body;

    //validating signup data
    validateSignupData(req.body);

    //hashing the password with 10 rounds of salts
    const passwordHash = await bcrypt.hash(password, 10);

    //creating new instance of user model
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });

    const savedUser = await user.save();
    const token = await savedUser.getJWT();
    res.cookie("token", token, { maxAge: 86400000 });

    res.json({ message: "User added successfully!", data: savedUser });
  } catch (error) {
    res.status(400).send("ERROR: " + error?.message);
  }
});

//login api
authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId });

    if (!user) {
      throw new Error("Invalid credentials!");
    }
    const isPasswordValid = await user.validatePassword(password);

    if (isPasswordValid) {
      const token = await user.getJWT();
      res.cookie("token", token, { maxAge: 86400000 });

      res.status(200).send(user);
    } else {
      throw new Error("Invalid credentials!");
    }
  } catch (error) {
    res.status(400).send("ERROR: " + error?.message);
  }
});

//logout api
authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });

  res.send("Logged out!!");
});

module.exports = authRouter;
