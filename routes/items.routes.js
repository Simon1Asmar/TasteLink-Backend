// items.routes.js
import { Router } from "express";
import { getAllItems, getItemById, createItem, updateItem, deleteItem } from "../controllers/itemController.js";

const router = Router();

router.get("/", getAllItems);
router.get("/:id", getItemById);
router.post("/", createItem);
router.put("/:id", updateItem);
router.delete("/:id", deleteItem);

export default router;
