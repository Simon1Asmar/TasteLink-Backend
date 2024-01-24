import { isValidObjectId } from "mongoose";
import Store from "../models/store.schema.js";
import User from "../models/users.schema.js";
import Item from "../models/item.schema.js";
import Order from "../models/order.schema.js";
import Job from "../models/job.schema.js";
import STATUS_CODE from "../constants/statusCodes.js";

export const getAllStores = async (req, res, next) => {
  try {
    const stores = await Store.find({})
      .populate("itemsForSale")
      .populate("currentOrders")
      .populate("orderHistory")
      .populate("availableJobs");

    res.status(STATUS_CODE.OK).json(stores);
  } catch (error) {
    next(error);
  }
};

export const getStoreById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      throw new Error("ID not valid");
    }

    const store = await Store.findById(id)
      .populate("itemsForSale")
      .populate("currentOrders")
      .populate("orderHistory")
      .populate("availableJobs");

    if (!store) {
      throw new Error("Store does not exist");
    }

    res.status(STATUS_CODE.OK).json(store);
  } catch (error) {
    next(error);
  }
};

export const createStore = async (req, res, next) => {
  try {
    const { name, owner } = req.body;

    if (!name && !owner) {
      throw new Error("Name and owner are required");
    }

    let ownerId = owner || req.user._id; // If owner is not provided, use the logged-in user's ID

    // Check if the provided owner ID is valid
    if (owner && !isValidObjectId(owner)) {
      throw new Error("Invalid owner ID");
    }

    let newStore;

    const ownerExists = await User.exists({ _id: owner });

    if (!ownerExists) {
      throw new Error("Specified owner does not exist");
    }

    // Create the store first
    newStore = await Store.create({
      name,
      owner: ownerId,
    });

    // Update the ownedRestaurants array in the user document
    await User.findByIdAndUpdate(owner, {
      $addToSet: { ownedRestaurants: newStore._id },
    });

    res.status(STATUS_CODE.CREATED).json(newStore);
  } catch (error) {
    next(error);
  }
};

export const updateStore = async (req, res, next) => {
  try {
    // const { id } = req.params;
    // const {
    //   name,
    //   location,
    // } = req.body;

    // if (!isValidObjectId(id)) {
    //   throw new Error("ID not valid");
    // }

    // const store = await Store.findById(id);

    // if (!store) {
    //   throw new Error("Store does not exist");
    // }

    // store.name = name || store.name;
    // store.location = location || store.location;

    // const updatedStore = await store.save();
    // res.status(STATUS_CODE.OK).json(updatedStore);
    res.status(STATUS_CODE.OK).json();
    
  } catch (error) {
    next(error);
  }
};

export const deleteStore = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      throw new Error("ID not valid");
    }

    // Find the store
    const store = await Store.findById(id);

    if (!store) {
      throw new Error("Store does not exist");
    }

    // Delete itemsForSale, currentOrders, orderHistory, and availableJobs
    await Item.deleteMany({ _id: { $in: store.itemsForSale } });
    await Order.deleteMany({ _id: { $in: store.currentOrders } });
    await Order.deleteMany({ _id: { $in: store.orderHistory } });
    await Job.deleteMany({ _id: { $in: store.availableJobs } });

    // Delete the store
    await Store.deleteOne(store);

    res.status(STATUS_CODE.NO_CONTENT).send();
  } catch (error) {
    next(error);
  }
};

export const setLocation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { lat, long } = req.body;

    if (!isValidObjectId(id)) {
      throw new Error("ID not valid");
    }

    const store = await Store.findById(id);

    if (!store) {
      throw new Error("Store does not exist");
    }

    // make sure latitude and longitude are provided
    if (!lat || !long) {
      throw new Error("Latitude and Longitude are required");
    }

    // Set the store's location
    store.location = [{ lat: lat, long: long }];

    const updatedStore = await store.save();
    res.status(STATUS_CODE.OK).json(updatedStore);
  } catch (error) {
    next(error);
  }
};

export const updateName = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!isValidObjectId(id)) {
      throw new Error("ID not valid");
    }

    const store = await Store.findById(id);

    if (!store) {
      throw new Error("Store does not exist");
    }

    // Make sure a new name is provided
    if (!name) {
      throw new Error("Name is required");
    }

    // Update the store's name
    store.name = name;

    const updatedStore = await store.save();
    res.status(STATUS_CODE.OK).json(updatedStore);
  } catch (error) {
    next(error);
  }
};