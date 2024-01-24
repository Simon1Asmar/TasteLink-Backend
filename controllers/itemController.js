import { isValidObjectId } from "mongoose";
import Item from "../models/item.schema.js";
import Store from "../models/store.schema.js";
import STATUS_CODE from "../constants/statusCodes.js";

export const getAllItems = async (req, res, next) => {
  try {
    const items = await Item.find({}).populate("restaurant");
    res.status(STATUS_CODE.OK).json(items);
  } catch (error) {
    next(error);
  }
};

export const getItemById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      throw new Error("ID not valid");
    }

    const item = await Item.findById(id).populate("restaurant");

    if (!item) {
      throw new Error("Item does not exist");
    }

    res.status(STATUS_CODE.OK).json(item);
  } catch (error) {
    next(error);
  }
};

export const createItem = async (req, res, next) => {
  try {
    const { itemName, imageURL, price, restaurant } = req.body;

    if (!(itemName && price && restaurant)) {
      throw new Error("ItemName, price, and restaurant are required");
    }

    const newItem = await Item.create({
      itemName,
      imageURL,
      price,
      restaurant,
    });

    await Store.findByIdAndUpdate(restaurant, {
      $addToSet: { itemsForSale: newItem._id },
    });

    // Populate the restaurant field in the response
    const populatedItem = await newItem.populate("restaurant");

    res.status(STATUS_CODE.CREATED).json(populatedItem);
  } catch (error) {
    next(error);
  }
};

export const updateItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { itemName, imageURL, price, restaurant } = req.body;

    if (!isValidObjectId(id)) {
      throw new Error("ID not valid");
    }

    const item = await Item.findById(id);

    if (!item) {
      throw new Error("Item does not exist");
    }

    item.itemName = itemName || item.itemName;
    item.imageURL = imageURL || item.imageURL;
    item.price = price !== undefined ? price : item.price;
    item.restaurant = restaurant || item.restaurant;

    const updatedItem = await item.save();
    const populatedItem = await updatedItem.populate("restaurant");

    res.status(STATUS_CODE.OK).json(populatedItem);
  } catch (error) {
    next(error);
  }
};

export const deleteItem = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      throw new Error("ID not valid");
    }

    const item = await Item.findById(id);

    if (!item) {
      throw new Error("Item does not exist");
    }

    await Item.deleteOne(item);

    res.status(STATUS_CODE.NO_CONTENT).send();
  } catch (error) {
    next(error);
  }
};
