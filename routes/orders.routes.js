// orders.routes.js
import { Router } from "express";
import { getAllOrders, getOrderById, createOrder, updateOrder, deleteOrder, addItemToOrder, submitOrder } from "../controllers/orderController.js";

const router = Router();

router.get("/", getAllOrders);
router.get("/:id", getOrderById);
router.post("/", createOrder);
router.put("/:id", updateOrder);
router.delete("/:id", deleteOrder);
// Send order to store
router.post("/add-item-to-order", addItemToOrder);
router.post("/submit-order/:orderId", submitOrder);
export default router;