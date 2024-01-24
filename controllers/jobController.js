import { isValidObjectId } from "mongoose";
import Job from "../models/job.schema.js";
import Store from "../models/store.schema.js";
import STATUS_CODE from "../constants/statusCodes.js";

export const getAllJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find({}).populate("restaurant").populate("appliedUsers");
    res.status(STATUS_CODE.OK).json(jobs);
  } catch (error) {
    next(error);
  }
};

export const getJobById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      throw new Error("ID not valid");
    }

    const job = await Job.findById(id).populate("restaurant").populate("appliedUsers");

    if (!job) {
      throw new Error("Job does not exist");
    }

    res.status(STATUS_CODE.OK).json(job);
  } catch (error) {
    next(error);
  }
};

export const createJob = async (req, res, next) => {
  try {
    const { jobTitle, jobDescription, restaurant } = req.body;

    if (!(jobTitle && jobDescription && restaurant)) {
      throw new Error("Job title, Job description, and Restaurant are required");
    }

    const job = await Job.create({
      jobTitle,
      jobDescription,
      restaurant,
      appliedUsers: [],
      isOpen: true,
    });

    await Store.findByIdAndUpdate(restaurant, {
      $addToSet: { availableJobs: job._id },
    });

    // Populate the references in the response
    const populatedJob = await Job.findById(job._id).populate("restaurant").populate("appliedUsers");

    res.status(STATUS_CODE.CREATED).json(populatedJob);
  } catch (error) {
    next(error);
  }
};

export const updateJob = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { jobTitle, jobDescription, isOpen } = req.body;

    if (!isValidObjectId(id)) {
      throw new Error("ID not valid");
    }

    const job = await Job.findById(id);

    if (!job) {
      throw new Error("Job does not exist");
    }

    job.jobTitle = jobTitle || job.jobTitle;
    job.jobDescription = jobDescription || job.jobDescription;
    // job.isOpen = isOpen !== undefined ? isOpen : job.isOpen;

    await job.save();

    // Populate the references in the response
    const updatedJob = await Job.findById(job._id).populate("restaurant").populate("appliedUsers");

    res.status(STATUS_CODE.OK).json(updatedJob);
  } catch (error) {
    next(error);
  }
};


export const deleteJob = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      throw new Error("ID not valid");
    }

    const job = await Job.findById(id);

    if (!job) {
      throw new Error("Job does not exist");
    }

    await Job.deleteOne(job);

    res.status(STATUS_CODE.NO_CONTENT).send();
  } catch (error) {
    next(error);
  }
};
