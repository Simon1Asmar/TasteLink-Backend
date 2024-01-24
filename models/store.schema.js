// store.schema.js
import mongoose from "mongoose";

const storeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: [
    {
      lat: { type: Number, required: true },
      long: { type: Number, required: true },
    },
  ],
  itemsForSale: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
    },
  ],
  currentOrders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
  ],
  orderHistory: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
  ],
  availableJobs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
    },
  ],
  owner:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "owner is required"]
  }
});

const Store = mongoose.model("Store", storeSchema);

export default Store;
