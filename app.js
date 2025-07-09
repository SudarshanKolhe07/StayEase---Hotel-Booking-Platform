const express = require("express");
const app = express();
const mongoose= require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride =require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema,reviewSchema} = require("./schema.js");
const { error } = require("console");
const Review = require("./models/reviews.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wander";

main()
    .then(()=>{
        console.log("Connected to DB..");
    })
    .catch((err)=>{
        console.log("err");
    });

async function main(){
    await mongoose.connect(MONGO_URL); 
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

app.get("/", (req,res) => {
    res.send("Hii, I am root");
});

const validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
};

const validateReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
};

//Index route
app.get("/listings", wrapAsync(async(req,res)=>{
    let allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings});
}));

//new route
app.get("/listings/new", (req,res)=>{
    res.render("listings/new.ejs");
})

//show route
app.get("/listings/:id", wrapAsync(async(req,res)=>{
    let {id}= req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs",{listing});
}));

//create route
app.post("/listings", validateListing,wrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
        await newListing.save();
        res.redirect("/listings");
}));


//edit route
app.get("/listings/:id/edit", wrapAsync(async(req,res)=>{
    let {id}= req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
}));

// update route
app.put("/listings/:id", validateListing,wrapAsync(async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
}));

//Delete Route
app.delete("/listings/:id", wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let deleteListing=await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
    res.redirect("/listings");
}));

//Review Post route
app.post("/listings/:id/reviews",validateReview,wrapAsync(async(req,res)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview=new Review(req.body.review);

    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();

    res.redirect(`/listings/${listing._id}`);
}));

// Delete Review route
app.delete('/listings/:id/reviews/:reviewsId',wrapAsync(async(req,res)=>{
    let {id, reviewsId} = req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews: reviewsId}});
    await Review.findByIdAndDelete(reviewsId);

    res.redirect(`/listings/${id}`);
}));


app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"page not found!"));
});

app.use((err,req,res,next)=>{
    let {statusCode=500, message="Something went wrong!"} = err;
    res.status(statusCode).render("error.ejs",{message});
    
});

app.listen(8080, () => {
    console.log("Server is listening to port 8080...");
});