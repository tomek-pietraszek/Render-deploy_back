import express from "express";

import {
  getAllUsers,
  getUserById,
  deleteAllUsers,
  deleteUserById,
  updateUserById,
  uploadUserAvatar,
  processUserAvatar,
} from "../controllers/usersController.js";

import {
  signup,
  login,
  logout,
  protect,
  restrictTo,
  getMe,
} from "../controllers/authController.js";

import validateSanitize from "../middlewares/validateAndSanitize.js";

const router = express.Router();

router.post("/signup", validateSanitize, signup);
router.post("/login", validateSanitize, login);
router.get("/logout", logout);

router.use(protect);
router.get("/me", getMe);

router
  .route("/:id")
  .get(getUserById)
  .patch(uploadUserAvatar, processUserAvatar, updateUserById)
  .delete(deleteUserById);

router.use(restrictTo("admin"));
router.route("/").get(getAllUsers).delete(deleteAllUsers);

export default router;
