import { isValidObjectId } from "mongoose";
import OrderItem from "../models/orderItem.schema.js";
import STATUS_CODE from "../constants/statusCodes.js";

export const getAllOrderItems = async (req, res, next) => {
  try {
    const orderItems = await OrderItem.find({})
      .populate("item"); // Populate the "item" reference

    res.status(STATUS_CODE.OK).json(orderItems);
  } catch (error) {
    next(error);
  }
};

export const getOrderItemById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      throw new Error("ID not valid");
    }

    const orderItem = await OrderItem.findById(id)
      .populate("item"); // Populate the "item" reference

    if (!orderItem) {
      throw new Error("OrderItem does not exist");
    }

    res.status(STATUS_CODE.OK).json(orderItem);
  } catch (error) {
    next(error);
  }
};

export const createOrderItem = async (req, res, next) => {
  try {
    const { item, quantity, totalPrice, isAvailable } = req.body;

    if (!(item && quantity)) {
      throw new Error("Item and Quantity are required");
    }

    const orderItem = await OrderItem.create({
      item,
      quantity,
      totalPrice,
      isAvailable: isAvailable || true,
    });

    // Populate the "item" reference in the response
    const populatedOrderItem = await orderItem
      .populate("item");

    res.status(STATUS_CODE.CREATED).json(populatedOrderItem);
  } catch (error) {
    next(error);
  }
};

export const updateOrderItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { quantity, totalPrice, isAvailable } = req.body;

    if (!isValidObjectId(id)) {
      throw new Error("ID not valid");
    }

    const orderItem = await OrderItem.findById(id);

    if (!orderItem) {
      throw new Error("OrderItem does not exist");
    }

    orderItem.quantity = quantity || orderItem.quantity;
    orderItem.totalPrice = totalPrice || orderItem.totalPrice;
    orderItem.isAvailable = isAvailable !== undefined ? isAvailable : orderItem.isAvailable;

    const updatedOrderItem = await orderItem.save();

    // Populate the "item" reference in the response
    const populatedOrderItem = await updatedOrderItem
      .populate("item");

    res.status(STATUS_CODE.OK).json(populatedOrderItem);
  } catch (error) {
    next(error);
  }
};

export const deleteOrderItem = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      throw new Error("ID not valid");
    }

    const orderItem = await OrderItem.findById(id);

    if (!orderItem) {
      throw new Error("OrderItem does not exist");
    }

    await OrderItem.deleteOne(orderItem);

    res.status(STATUS_CODE.NO_CONTENT).send();
  } catch (error) {
    next(error);
  }
};
