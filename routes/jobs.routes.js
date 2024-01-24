// jobs.routes.js
import { Router } from "express";
import { getAllJobs, getJobById, createJob, updateJob, deleteJob } from "../controllers/jobController.js";

const router = Router();

router.get("/", getAllJobs);
router.get("/:id", getJobById);
router.post("/", createJob);
router.put("/:id", updateJob);
router.delete("/:id", deleteJob);

export default router;
