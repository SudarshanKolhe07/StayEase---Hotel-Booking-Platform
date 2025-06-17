const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type:String,
        required:true,
    },
    discription:String,
    image:{
        type:String,
        set:(v)=> v=== "" ? "https://i.pinimg.com/736x/53/e0/a1/53e0a1efcd011d97fc5f728b1b6093cb.jpg" : v,
    },
    price:Number,
    location:String,
    country:String,
});

const Listing = mongoose.model("Listing",listingSchema);
module.export=Listing;