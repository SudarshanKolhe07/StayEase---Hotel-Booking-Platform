const Listing =require("../models/listing");

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
    const newListing = new Listing(req.body.listing);
    newListing.owner=req.user._id;
        await newListing.save();
        req.flash("success", "New Listing Created!");
        res.redirect("/listings");
};

module.exports.showEditListing=async(req,res)=>{
    let {id}= req.params;
    const listing = await Listing.findById(id);
    req.flash("success", "Listing Edited!");
    res.render("listings/edit.ejs",{listing});
};

module.exports.updateEditListing=async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findByIdAndUpdate(id, req.body.listing);
    req.flash("success", "Listing Upadated!");
    res.redirect(`/listings/${listing._id}`);
};

module.exports.destroyListing=async(req,res)=>{
    let {id}=req.params;
    let deleteListing=await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
    req.flash("success", "Listing deleted!");
    res.redirect("/listings");
};