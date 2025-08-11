const Listing =require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index=async(req,res)=>{
    let allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings});
};

module.exports.createListingForm=(req,res)=>{
    res.render("listings/new.ejs");
};

module.exports.showListing=async(req,res)=>{
    let {id}= req.params;
    const listing = await Listing.findById(id).populate({
        path:"reviews",populate:{path:"author"},
    }).populate("owner");

    if(!listing){
        req.flash("error","Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
};

module.exports.createListing=async (req, res) => {
    let response = await geocodingClient
    .forwardGeocode({
        query:req.body.listing.location,
        limit:1,
    })
    .send();

    const newListing = new Listing(req.body.listing);
    newListing.owner=req.user._id;
    if (req.file) {
        newListing.image = {
            url: req.file.path,       // Cloudinary provides this
            filename: req.file.filename
        };
    }

        newListing.geometry=response.body.features[0].geometry;
        let saved = await newListing.save();
        console.log(saved);
        req.flash("success", "New Listing Created!");
        res.redirect("/listings");
};

module.exports.showEditListing=async(req,res)=>{
    let {id}= req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested for does not exist!");
        res.redirect("/listings");
    }

    let originalImageUrl = listing.image.url;
    originalImageUrl=originalImageUrl.replace("/upload","/upload/w_250");
    // req.flash("success", "Listing Edited!");
    res.render("listings/edit.ejs",{listing,originalImageUrl});
};

module.exports.updateEditListing = async (req, res) => {
    const { id } = req.params;
    
    // Get the listing before updating
    let listing = await Listing.findById(id);

    // Update the basic fields from form
    listing.title = req.body.listing.title;
    listing.price = req.body.listing.price;
    listing.description = req.body.listing.description;
    listing.location = req.body.listing.location;

    // If location is changed or missing coordinates, fetch from Mapbox
    if (req.body.listing.location) {
        let geoData = await geocodingClient
            .forwardGeocode({
                query: req.body.listing.location,
                limit: 1
            })
            .send();
        listing.geometry = geoData.body.features[0].geometry;
    }

    // If a new image was uploaded
    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
    }

    await listing.save();

    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
};


module.exports.destroyListing=async(req,res)=>{
    let {id}=req.params;
    let deleteListing=await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
    req.flash("success", "Listing deleted!");
    res.redirect("/listings");
};