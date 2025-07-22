const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const Review = require("./reviews.js");

const listingSchema = new Schema({
    title: {
        type:String,
        required:true,
    },
    description:String,
    image: {
        filename: String, // Optional filename, can be blank or omitted
        url: {
        type: String,   // Main image URL
        default: "https://i.pinimg.com/736x/53/e0/a1/53e0a1efcd011d97fc5f728b1b6093cb.jpg", // Default if not provided
        set: (v) => v === "" ? "https://i.pinimg.com/736x/53/e0/a1/53e0a1efcd011d97fc5f728b1b6093cb.jpg" : v
        }
    },
    price:Number,
    location:String,
    country:String,
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review",
        },
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },
});

listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id:{$in:listing.reviews}});
    }
});

const Listing = mongoose.model("Listing",listingSchema);
module.exports=Listing;