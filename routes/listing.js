const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const  {isLoggedIn, isOwner,validateListing}=require("../middleware.js");

//Index route
router.get("/", wrapAsync(async(req,res)=>{
    let allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings});
}));

//new route
router.get("/new", isLoggedIn,(req,res)=>{
    res.render("listings/new.ejs");
})

//show route
router.get("/:id", wrapAsync(async(req,res)=>{
    let {id}= req.params;
    const listing = await Listing.findById(id).populate({
        path:"reviews",populate:{path:"author"},
    }).populate("owner");

    if(!listing){
        req.flash("error","Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
}));

//create route
router.post("/", isLoggedIn,validateListing,wrapAsync(async (req, res) => {
    const newListing = new Listing(req.body.listing);
    newListing.owner=req.user._id;
        await newListing.save();
        req.flash("success", "New Listing Created!");
        res.redirect("/listings");
}));


//edit route
router.get("/:id/edit", isLoggedIn,isOwner,wrapAsync(async(req,res)=>{
    let {id}= req.params;
    const listing = await Listing.findById(id);
    req.flash("success", "Listing Edited!");
    res.render("listings/edit.ejs",{listing});
}));

// update route
router.put("/:id", isLoggedIn,validateListing, isOwner,wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findByIdAndUpdate(id, req.body.listing);
    req.flash("success", "Listing Upadated!");
    res.redirect(`/listings/${listing._id}`);
}));

//Delete Route
router.delete("/:id", isLoggedIn,isOwner,wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let deleteListing=await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
    req.flash("success", "Listing deleted!");
    res.redirect("/listings");
}));

module.exports = router;