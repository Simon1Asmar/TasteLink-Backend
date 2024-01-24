import { isValidObjectId } from "mongoose";
import Order from "../models/order.schema.js";
import User from "../models/users.schema.js";
import Item from "../models/item.schema.js";
import OrderItem from "../models/orderItem.schema.js";
import Store from "../models/store.schema.js";
import STATUS_CODE from "../constants/statusCodes.js";

export const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({})
      .populate("orderItems")
      .populate("buyer")
      .populate("restaurant");

    res.status(STATUS_CODE.OK).json(orders);
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      throw new Error("ID not valid");
    }

    const order = await Order.findById(id)
      .populate("orderItems")
      .populate("buyer")
      .populate("restaurant");

    if (!order) {
      throw new Error("Order does not exist");
    }

    res.status(STATUS_CODE.OK).json(order);
  } catch (error) {
    next(error);
  }
};

export const createOrder = async (req, res, next) => {
  try {
    const { orderItems, totalPrice, buyer, restaurant, orderStatus } = req.body;

    if (!(orderItems && totalPrice !== undefined && buyer && restaurant)) {
      throw new Error("Order items, Total Price, Buyer, and Restaurant are required");
    }

    const newOrder = await Order.create({
      orderItems,
      totalPrice,
      buyer,
      restaurant,
      orderStatus: orderStatus || "waiting",
    });

    // Populate the references in the response
    const populatedOrder = await newOrder
      .populate("orderItems")
      .populate("buyer")
      .populate("restaurant");

    res.status(STATUS_CODE.CREATED).json(populatedOrder);
  } catch (error) {
    next(error);
  }
};

export const updateOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { orderItems, totalPrice, buyer, restaurant, orderStatus } = req.body;

    if (!isValidObjectId(id)) {
      throw new Error("ID not valid");
    }

    const order = await Order.findById(id);

    if (!order) {
      throw new Error("Order does not exist");
    }

    order.orderItems = orderItems || order.orderItems;
    order.totalPrice = totalPrice !== undefined ? totalPrice : order.totalPrice;
    order.buyer = buyer || order.buyer;
    order.restaurant = restaurant || order.restaurant;
    order.orderStatus = orderStatus || order.orderStatus;

    const updatedOrder = await order.save();

    // Populate the references in the response
    const populatedOrder = await updatedOrder
      .populate("orderItems")
      .populate("buyer")
      .populate("restaurant");

    res.status(STATUS_CODE.OK).json(populatedOrder);
  } catch (error) {
    next(error);
  }
};

export const deleteOrder = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      throw new Error("ID not valid");
    }

    const order = await Order.findById(id);

    if (!order) {
      throw new Error("Order does not exist");
    }

    await Order.deleteOne(order);

    res.status(STATUS_CODE.NO_CONTENT).send();
  } catch (error) {
    next(error);
  }
};

export const addItemToOrder = async (req, res, next) => {
  try {
    const { itemId, quantity, userId } = req.body;

    if (!(itemId && quantity && userId)) {
      throw new Error("Item ID, Quantity, and User ID are required");
    }

    const item = await Item.findById(itemId).populate("restaurant");

    if (!item) {
      throw new Error("Item does not exist");
    }

    const totalPrice = item.price * quantity;

    const storeId = item.restaurant._id;

    if (!isValidObjectId(storeId)) {
      throw new Error("Invalid Store ID");
    }

    const orderItem = await OrderItem.create({
      item: itemId,
      quantity,
      totalPrice,
      restaurant: storeId,
    });
    
    const user = await User.findById(userId);
    
    if (!user) {
      throw new Error("User does not exist");
    }
    
    let existingOrder;
    
    // Check if the user has any orders
    if (user.currentOrders.length > 0) {
      // If there are orders, find an existing order for the specified restaurant
      existingOrder = await Order.findOne({
        buyer: userId,
        restaurant: storeId,
      }).populate("restaurant");
      
    }

    if (existingOrder) {
      existingOrder.orderItems.push(orderItem._id);
      existingOrder.totalPrice += totalPrice;
      await existingOrder.save();
    } else {
      // If no existing order is found, create a new order
      const newOrder = await Order.create({
        orderItems: [orderItem._id],
        totalPrice,
        buyer: userId,
        restaurant: storeId,
        // orderStatus: "waiting",
      });

      user.currentOrders.push(newOrder._id);
      await user.save();
    }

    res.status(STATUS_CODE.CREATED).json(orderItem);
  } catch (error) {
    next(error);
  }
};

export const submitOrder = async (req, res, next) => {
  try {
    const { orderId } = req.params;

    if (!isValidObjectId(orderId)) {
      throw new Error("Invalid order ID");
    }

    const order = await Order.findById(orderId);

    if (!order) {
      throw new Error("Order not found");
    }

    console.log('order.orderStatus', order.orderStatus)

    if(order.orderStatus !== "none"){
      throw new Error("Order already submitted")
    }

    const { restaurant } = order;

    if (!isValidObjectId(restaurant)) {
      throw new Error("Invalid restaurant ID");
    }

    const store = await Store.findById(restaurant);

    if (!store) {
      throw new Error("Restaurant not found");
    }

    // Add the order to the store's currentOrders array
    store.currentOrders.push(order._id);
    await store.save();

    // Update the order status to "waiting" only after successful addition to currentOrders
    order.orderStatus = "waiting";
    await order.save();

    res.status(STATUS_CODE.OK).json({ message: "Order submitted successfully" });
  } catch (error) {
    next(error);
  }
};