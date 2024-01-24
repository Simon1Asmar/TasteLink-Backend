// job.schema.js
import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  jobTitle: {
    type: String,
    required: [true, "Job title is required"],
  },
  jobDescription: {
    type: String,
    required: [true, "Job description is required"],
  },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Store",
    required: [true, "Restaurant (Store) is required"],
  },
  appliedUsers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  isOpen: {
    type: Boolean,
    default: true,
  },
});

const Job = mongoose.model("Job", jobSchema);

export default Job;
