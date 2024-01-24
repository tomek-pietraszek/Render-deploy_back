import express from "express";

import {
  getCart,
  addCartItem,
  deleteCartItemById,
  updateItemFieldById,
} from "../controllers/cartController.js";

import { protect } from "../controllers/authController.js";

const router = express.Router();

//TODO: Getting unauthorized error for cart
router.use(protect);

router
  .route("/:id")
  .get(getCart)
  .post(addCartItem)
  .put(deleteCartItemById)
  .patch(updateItemFieldById);

export default router;
