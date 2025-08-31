const cron = require("node-cron");
const { startOfDay, subDays, endOfDay } = require("date-fns");
const ConnectionRequestModel = require("../models/connectionRequest");

cron.schedule("14 21 * * *", async () => {
  const today = subDays(new Date(), 0);

  const todayStart = startOfDay(today);
  const todayEnd = endOfDay(today);

  const pendingRequests = await ConnectionRequestModel.find({
    status: "interested",
    createdAt: {
      $gte: todayStart,
      $lt: todayEnd,
    },
  }).populate("fromUserId toUserId");

  const listOfEmails = [
    ...new Set(pendingRequests.map((req) => req.toUserId.emailId)),
  ];

  for (email of listOfEmails) {
    console.log("Sending email for", email);
  }
    
    
});
