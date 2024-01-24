// orderItem.schema.js
import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    required: [true, 'Item is required']
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [1, 'Quantity must be at least 1']
  },
  totalPrice: {
    type: Number,
  },
  isAvailable:{
    type: Boolean,
    default: true,
  }
});

const OrderItem = mongoose.model('OrderItem', orderItemSchema);

export default OrderItem;
