const express = require("express");

const app = express();

//REMEMBER: ORDER OF ROUTES MATTERS A LOT! (USE TOP TO BOTTOM HIERARCHY)

//next function is used to pass the control to next request handler function, that means if next() is called then the next handler function has to take care of req
//if it encounters more that one res.send() then it will give you an error on server since already one res has been sent
//execution will stop at first occurance of res.send() anyways.
app.use(
"/gini",
(req, res, next) => {
console.log("handler 1");
// res.send("first handler!");
next();
},
(req, res, next) => {
console.log("handler 2");
// res.send("second handler!");
next();
},
(req, res, next) => {
console.log("handler 3");
// res.send("third handler!");
next();
},
(req, res, next) => {
console.log("handler 4");
// res.send("fourth handler!");
next();
},
(req, res, next) => {
console.log("handler 5");
res.send("fifth handler!");
//next();
}
);

//just like above code, we can do same thing by defining two differnt app.use blocks
app.use("/gini", (req, res, next) => {
console.log("handler 1");
// res.send("first handler!");
next();
});

app.use("/gini", (req, res, next) => {
console.log("handler 2");
res.send("second handler");
});

//in following case request will be in loop and willbe timed out since nothing is returned
app.get("/gene", (req, res) => {
//nothing here
});

app.delete("/user", (req, res) => {
res.send("data deleted successfully!");
});

app.post("/user", (req, res) => {
console.log(res);

res.send("data saved successfully to the database");
});

//this will only handle GET call to /user
app.get("/user/:userId/:name/:password", (req, res) => {
console.log(req.params);
res.send({ firstName: "Akshay", lastName: "Mainkar" });
});

//this will match all the HTTP method API calls to /test
app.use("/test", (req, res) => {
res.send("test 123");
});

app.listen(3000, () => {
console.log("Server is running on PORT 3000");
});
