const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const  {isLoggedIn, isOwner,validateListing}=require("../middleware.js");

const listingController=require("../controllers/listings.js");

//Index route
router.get("/", wrapAsync(listingController.index));

//new route
router.get("/new", isLoggedIn,listingController.createListingForm);

//show route
router.get("/:id", wrapAsync(listingController.showListing));

//create route
router.post("/", isLoggedIn,validateListing,wrapAsync(listingController.createListing));


//edit route
router.get("/:id/edit", isLoggedIn,isOwner,wrapAsync(listingController.showEditListing));

// update route
router.put("/:id", isLoggedIn,validateListing, isOwner,wrapAsync(listingController.updateEditListing));

//Delete Route
router.delete("/:id", isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));

module.exports = router;