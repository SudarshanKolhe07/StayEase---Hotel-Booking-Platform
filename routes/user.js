const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const {savedRedirectUrl} = require("../middleware.js");

const userController = require("../controllers/users.js");

router.get("/signup",userController.createSignUp);

router.post("/signup",wrapAsync(userController.SignUp));

router.get("/login",userController.createLogin);

router.post("/login",
    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true
    }),
    userController.login
);

router.get("/logout",userController.logout);



module.exports=router;