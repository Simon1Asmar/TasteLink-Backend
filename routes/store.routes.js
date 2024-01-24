// stores.routes.js
import { Router } from "express";
import { getAllStores, getStoreById, createStore, updateStore, deleteStore, setLocation, updateName } from "../controllers/storeController.js";

const router = Router();

router.get("/", getAllStores);
router.get("/:id", getStoreById);
router.post("/", createStore);
// router.put("/:id", updateStore);
router.patch("/:id/set-location", setLocation);
router.patch("/:id/update-name", updateName);
router.delete("/:id", deleteStore);

export default router;
