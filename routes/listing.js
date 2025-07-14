const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema} = require("../schema.js");

const validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
};

//Index route
router.get("/", wrapAsync(async(req,res)=>{
    let allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings});
}));

//new route
router.get("/new", (req,res)=>{
    res.render("listings/new.ejs");
})

//show route
router.get("/:id", wrapAsync(async(req,res)=>{
    let {id}= req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs",{listing});
}));

//create route
router.post("/", validateListing,wrapAsync(async (req, res) => {
    const newListing = new Listing(req.body.listing);
        await newListing.save();
        res.redirect("/listings");
}));


//edit route
router.get("/:id/edit", wrapAsync(async(req,res)=>{
    let {id}= req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
}));

// update route
router.put("/:id", validateListing,wrapAsync(async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});

    if (!req.body.listing.image || !req.body.listing.image.url) {
        req.body.listing.image = listing.image;
    }
    res.redirect(`/listings/${id}`);
}));

//Delete Route
router.delete("/:id", wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let deleteListing=await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
    res.redirect("/listings");
}));

module.exports = router;