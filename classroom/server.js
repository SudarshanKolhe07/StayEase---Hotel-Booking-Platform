const express = require("express");
const app = express();
const session = require("express-session");

app.use(session({
    secret: "mysupersecretstring",
    resave: false,
    saveUninitialized: true
})); 

app.get("/reqcount", (req,res)=>{
    if (!req.session.count) {
        req.session.count = 1;
    } else {
        req.session.count += 1;
    }
    res.send(`You sent a request ${req.session.count} times`);
})

app.listen(3000, ()=>{
    console.log("Server is listening to 3000");
});