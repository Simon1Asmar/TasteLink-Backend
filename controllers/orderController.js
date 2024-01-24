import { isValidObjectId } from "mongoose";
import Order from "../models/order.schema.js";
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
