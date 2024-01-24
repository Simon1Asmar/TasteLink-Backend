// item.schema.js
import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  itemName: {
    type: String,
    required: [true, "Item Name is Required"],
  },
  imageURL: {
    type: String,
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
    min: [0, "Price cannot be less than 0"],
  },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Store",
    required: [true, "restaurant is required"]
  },
});

const Item = mongoose.model("Item", itemSchema);

export default Item;
