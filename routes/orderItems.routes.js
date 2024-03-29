// orderItems.routes.js
import { Router } from "express";
import { getAllOrderItems, getOrderItemById, createOrderItem, updateOrderItem, deleteOrderItem } from "../controllers/orderItemController.js";

const router = Router();

router.get("/", getAllOrderItems);
router.get("/:id", getOrderItemById);
router.post("/", createOrderItem);
router.put("/:id", updateOrderItem);
router.delete("/:id", deleteOrderItem);

export default router;
