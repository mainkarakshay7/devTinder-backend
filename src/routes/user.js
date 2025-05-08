const express = require("express");
const { userAuth } = require("../middlewares/auth");
const userRouter = express.Router();
const connectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const SAFE_USER_INFO = "firstName lastName photoUrl age gender about skills";

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedinUser = req.user;

    const connectionRequests = await connectionRequest
      .find({
        toUserId: loggedinUser._id,
        status: "interested",
      })
      .populate("fromUserId", SAFE_USER_INFO);

    res.json({
      message: "Data fetched successfully!",
      data: connectionRequests,
    });
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedinUser = req.user;

    const connections = await connectionRequest
      .find({
        $or: [
          { toUserId: loggedinUser._id, status: "accepted" },
          { fromUserId: loggedinUser._id, status: "accepted" },
        ],
      })
      .populate("fromUserId", SAFE_USER_INFO)
      .populate("toUserId", SAFE_USER_INFO);

    const data = connections.map((row) => {
      if (row.fromUserId._id.toString() === loggedinUser._id.toString()) {
        return row.toUserId;
      }

      return row.fromUserId;
    });

    res.json({ message: "data fetched!!", data });
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedinUser = req.user;
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;

    const skip = (page - 1) * limit;

    //fetch all the connection request who has loggedin user as sender or receiver
    const connectionRequests = await connectionRequest
      .find({
        $or: [{ toUserId: loggedinUser._id }, { fromUserId: loggedinUser._id }],
      })
      .select("fromUserId toUserId");

    //create a new set to store unique user id's who has either sent or received the connection request with loggedin user
    const blockedUsersFromFeed = new Set();

    //push all unique user id's into set
    connectionRequests.forEach((req) => {
      blockedUsersFromFeed.add(req.toUserId.toString());
      blockedUsersFromFeed.add(req.fromUserId.toString());
    });

    //now query all the users which are not in blockedUsersFromFeed and also user is not a logged in user
    const feed = await User.find({
      $and: [
        { _id: { $nin: Array.from(blockedUsersFromFeed) } },
        { _id: { $ne: loggedinUser._id } },
      ],
    })
      .select(SAFE_USER_INFO)
      .skip(skip)
      .limit(limit);

    res.json({
      users: feed,
      size: feed.length,
    });
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

module.exports = userRouter;
