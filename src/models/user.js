const mongoose = require("mongoose");
const validate = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 2,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    age: {
      type: Number,
      min: 18,
    },
    emailId: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validate.isEmail(value)) {
          throw new Error("Invalid email Id" + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      validate(value) {
        if (!validate.isStrongPassword(value)) {
          throw new Error("Weak password detected" + value);
        }
      },
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "others"].includes(value?.toLowerCase())) {
          throw new Error("Gender data is not valid!");
        }
      },
    },
    photoUrl: {
      type: String,
      default:
        "https://www.kindpng.com/picc/m/252-2524695_dummy-profile-image-jpg-hd-png-download.png",
      validate(value) {
        if (!validate.isURL(value)) {
          throw new Error("Invalid photo URL" + value);
        }
      },
    },
    about: {
      type: String,
      default: "This is default about for the user!",
    },
    skills: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.getJWT = async function () {
  const user = this;

  const token = await jwt.sign({ _id: user._id }, "anfield", {
    expiresIn: "1d",
  });

  return token;
};

userSchema.methods.validatePassword = async function (userInputPassord) {
  const user = this;
  const passwordHash = user.password;

  const isPasswordValid = await bcrypt.compare(userInputPassord, passwordHash);

  return isPasswordValid;
};

module.exports = mongoose.model("User", userSchema);
