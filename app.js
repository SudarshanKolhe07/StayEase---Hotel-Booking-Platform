const express = require("express");
const app = express();
const mongoose= require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride =require("method-override");


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

app.get("/", (req,res) => {
    res.send("Hii, I am root");
});

//Index route
app.get("/listings", async(req,res)=>{
    let allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings});
});

//new route
app.get("/listings/new", (req,res)=>{
    res.render("listings/new.ejs");
})

//show route
app.get("/listings/:id", async(req,res)=>{
    let {id}= req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs",{listing});
});

//create route
app.post("/listings",async(req,res)=>{
    const newListing= new Listing(req.body.listing);
    newListing.save();
    res.redirect("/listings");
});

//edit route
app.get("/listings/:id/edit", async(req,res)=>{
    let {id}= req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
});

// update route
app.put("/listings/:id", async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
})

// app.get("/testlisting", async(req,res)=>{
//     let sampleListing=new Listing({
//         title:"My new Villa",
//         description:"By the beach",
//         price:1200,
//         location:"marine",
//         country:"India",
//     });

//     await sampleListing.save();
//     console.log("Sample was saved..");
//     res.send("Successfull testing..!");
// });

app.listen(8080, () => {
    console.log("Server is listening to port 8080...");
});