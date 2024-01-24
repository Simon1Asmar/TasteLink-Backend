// order.schema.js
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  orderItems: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OrderItem",
      required: [true, "Order items are required"],
    },
  ],
  totalPrice: {
    type: Number,
    required: [true, "Total Price is required"],
    min: [0, "Total price cannot be negative"],
  },
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Buyer is required"],
  },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Store",
    required: [true, "Restaurant is required"],
  },
  orderStatus: {
    type: String,
    enum: ["none", "waiting", "preparing", "ready", "complete"],
    default: "none",
  },
});

const Order = mongoose.model("Order", orderSchema);

export default Order;
