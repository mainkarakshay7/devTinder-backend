const validator = require("validator");

const validateSignupData = (req) => {
  const { firstName, lastName, emailId, password } = req;

  if (!firstName || !lastName) {
    throw new Error("Invalid name!");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Invalid email address!");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Please enter a strong password!");
  }
};

const validateProfileEditData = (data) => {
  const allowedEditKeys = [
    "firstName",
    "lastName",
    "emailId",
    "photoUrl",
    "about",
    "skills",
    "age",
    "gender",
  ];

  return Object.keys(data).every((key) => allowedEditKeys.includes(key));
};

module.exports = { validateSignupData, validateProfileEditData };
