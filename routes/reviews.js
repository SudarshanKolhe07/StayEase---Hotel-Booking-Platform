const express = require("express");
const router = express.Router({ mergeParams: true });
const Review = require("../models/reviews.js");
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const  {validateReview,isLoggedIn,isReviewAuthor}=require("../middleware.js");

const reviewController=require("../controllers/reviews.js");

//Review Post route
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.createReview));

// Delete Review route
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, wrapAsync(reviewController.destroyReview));


 
module.exports = router;