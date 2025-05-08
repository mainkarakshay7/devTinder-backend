const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User", //referance to user collection
    },
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User", //referance to user collection
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["accepted", "rejected", "interested", "ignored"],
        message: `{VALUE} is incorrect status type!`,
      },
    },
  },
  {
    timestamps: true,
  }
);

connectionRequestSchema.pre("save", function (next) {
  const connectionRequest = this;

  if (connectionRequest.toUserId.equals(connectionRequest.fromUserId)) {
    throw new Error("You cannot send connection request to yourself!!!");
  }

  next();
});

const ConnectionRequestModel = new mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema
);

module.exports = ConnectionRequestModel;
