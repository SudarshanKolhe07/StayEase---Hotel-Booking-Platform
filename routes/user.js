const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const {savedRedirectUrl} = require("../middleware.js");

const userController = require("../controllers/users.js");

router
    .route("/signup")
    .get(userController.createSignUp)
    .post(wrapAsync(userController.signUp));

router
    .route("/login")
    .get(userController.createLogin)
    .post(
        savedRedirectUrl,
        passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true
    }),
    userController.login
    );


router.get("/logout",userController.logout);



module.exports=router;