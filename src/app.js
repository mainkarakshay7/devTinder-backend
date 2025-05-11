const express = require("express");
const { userAuth } = require("./middlewares/auth");
const connectDB = require("./config/database");
const User = require("./models/user");
const { validateSignupData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const requestRouter = require("./routes/request");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const userRouter = require("./routes/user");
const cors = require("cors");
require("dotenv").config();

const app = express();

//this is middleware which converts the req.body object to valid readable json
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173", credentials: true })); //helps to set cookie on mentioned origin

app.use("/", requestRouter);
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", userRouter);

connectDB()
  .then(() => {
    console.log("Database connection established");
    app.listen(process.env.PORT, () => {
      console.log("Server is running on PORT 3000");
    });
  })
  .catch((err) =>
    console.log("Something went wrong while connecting to Database", err)
  );
