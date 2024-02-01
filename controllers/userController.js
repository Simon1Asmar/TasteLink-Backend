import { isValidObjectId } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/users.schema.js";
import STATUS_CODE from "../constants/statusCodes.js";

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({})
      .populate("currentOrders")
      .populate("jobsAppliedTo")
      .populate("previousOrders")
      .populate("ownedRestaurants");

    res.status(STATUS_CODE.OK).json(users);
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      res.status(STATUS_CODE.BAD_REQUEST);
      throw new Error("ID not valid");
    }

    const user = await User.findById(id)
      .populate("currentOrders")
      .populate("jobsAppliedTo")
      .populate("previousOrders")
      .populate("ownedRestaurants");

    if (!user) {
      res.status(STATUS_CODE.BAD_REQUEST);
      throw new Error("User does not exist");
    }

    res.status(STATUS_CODE.OK).json(user);
  } catch (error) {
    next(error);
  }
};

export const createUser = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!(firstName && lastName && email && password)) {
      res.status(STATUS_CODE.BAD_REQUEST);
      throw new Error("First Name, Last Name, Email, and Password are required");
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      res.status(STATUS_CODE.BAD_REQUEST);
      throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      firstName,
      lastName,
      email,
      password: hashedPassword,
    };

    const createdUser = await User.create(newUser);

    // Automatically log in the user after account creation
    const token = generateAuthToken(createdUser);
    res.status(STATUS_CODE.CREATED).json({ user: createdUser, token });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!(email && password)) {
      res.status(STATUS_CODE.BAD_REQUEST);
      throw new Error("Email and password must be filled");
    }

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      res.status(STATUS_CODE.BAD_REQUEST);
      throw new Error("User does not exist");
    }

    const comparePass = await bcrypt.compare(password, existingUser.password);

    if (comparePass && existingUser) {
      const token = generateAuthToken(existingUser);
      res.status(STATUS_CODE.OK).json({ token, existingUser });
    } else {
      res.status(STATUS_CODE.BAD_REQUEST);
      throw new Error("Incorrect email or password");
    }
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, password, currentOrders, jobsAppliedTo, previousOrders, ownedRestaurants } = req.body;

    if (!isValidObjectId(id)) {
      res.status(STATUS_CODE.BAD_REQUEST);
      throw new Error("ID not valid");
    }

    const user = await User.findById(id);

    if (!user) {
      res.status(STATUS_CODE.BAD_REQUEST);
      throw new Error("User does not exist");
    }

    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.email = email || user.email;
    user.password = password || user.password;
    user.currentOrders = currentOrders || user.currentOrders;
    user.jobsAppliedTo = jobsAppliedTo || user.jobsAppliedTo;
    user.previousOrders = previousOrders || user.previousOrders;

    // Push the new ownedRestaurants to the existing array
    if (ownedRestaurants) {
      user.ownedRestaurants.push(...ownedRestaurants);
    }

    const updatedUser = await user.save();
    res.status(STATUS_CODE.OK).json(updatedUser);
  } catch (error) {
    next(error);
  }
};


export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      res.status(STATUS_CODE.BAD_REQUEST);
      throw new Error("ID not valid");
    }

    const user = await User.findById(id);

    if (!user) {
      res.status(STATUS_CODE.BAD_REQUEST);
      throw new Error("User does not exist");
    }

    await User.deleteOne(user);

    // Log the user out after account deletion
    res.status(STATUS_CODE.NO_CONTENT).send();
  } catch (error) {
    next(error);
  }
};

// export const logoutUser = async (req, res, next) => {
//   try {
//     // Implement any token revocation mechanism here if needed
//     res.status(STATUS_CODE.OK).send("Logged out successfully");
//   } catch (error) {
//     next(error);
//   }
// };

// Function to generate JWT token
const generateAuthToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
    },
    process.env.SECRET,
    {
      expiresIn: "1h", // Set the expiration time as needed
    }
  );
};
