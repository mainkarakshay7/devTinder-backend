const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { validateProfileEditData } = require("../utils/validation");
const bcrypt = require("bcrypt");

const profileRouter = express.Router();

//get user profile using the cookie token
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req?.user;

    if (!user) {
      res.status(404).send("User not found!");
    }
    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR: " + err);
  }
});

//profile edit api
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    const requestData = req.body;
    const isDataValidated = validateProfileEditData(requestData);

    if (isDataValidated) {
      const userData = req.user;

      Object.keys(requestData).map((key) => (userData[key] = requestData[key]));

      await userData.save();

      res.json({
        message: "User data updated!",
        data: userData,
      });
    } else {
      throw new Error("Operation not allowed!!");
    }
  } catch (err) {
    res.status(400).send("ERROR: " + err);
  }
});


//password update api
profileRouter.patch("/profile/updatePassword", userAuth, async (req, res) => {
  try {
    const { currentPassword, updatedPassword } = req.body;

    const isPasswordValid = await req.user.validatePassword(currentPassword);

    if (isPasswordValid) {
      const passwordHash = await bcrypt.hash(updatedPassword, 10);
      const currentUser = req.user;

      currentUser.password = passwordHash;

      await currentUser.save();

      res.status(200).send("Password updated successfully!");
    } else {
      throw new Error("Incorrect existing password!");
    }
  } catch (err) {
    res.status(400).send("ERROR: " + err);
  }
});
module.exports = profileRouter;
