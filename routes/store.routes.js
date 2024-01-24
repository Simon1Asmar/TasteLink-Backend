// stores.routes.js
import { Router } from "express";
import { getAllStores, getStoreById, createStore, updateStore, deleteStore } from "../controllers/storeController.js";

const router = Router();

router.get("/", getAllStores);
router.get("/:id", getStoreById);
router.post("/", createStore);
router.put("/:id", updateStore);
router.delete("/:id", deleteStore);

export default router;
