const express = require("express");
const router = express.Router({ mergeParams: true });
const Review = require("../models/reviews.js");
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {reviewSchema} = require("../schema.js");

const validateReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400, errMsg);
    }
    next();
};

//Review Post route
router.post("/",validateReview,wrapAsync(async(req,res)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview=new Review(req.body.review);

    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success", "Review Created!");

    res.redirect(`/listings/${listing._id}`);
}));

// Delete Review route
router.delete('/:reviewsId',wrapAsync(async(req,res)=>{
    let {id, reviewsId} = req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews: reviewsId}});
    await Review.findByIdAndDelete(reviewsId);
    req.flash("success", "Review deleted!");

    res.redirect(`/listings/${id}`);
}));

module.exports = router;