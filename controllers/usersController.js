import multer from "multer";
import sharp from "sharp";
import createError from "http-errors";

import User from "../models/userModel.js";
import successHandler from "../middlewares/successHandler.js";
import { isValidId } from "../middlewares/errorHandlers.js";

//* --------------------- Multer & sharp configurations -----------------------
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  file.mimetype.startsWith("image")
    ? cb(null, true)
    : cb(createError(400, "The uploaded file is not an image"), false);
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

export const processUserAvatar = (req, res, next) => {
  if (req.file) {
    req.file.fileName = `user_${req.user.id}-${Date.now()}.jpeg`;

    sharp(req.file.buffer)
      .resize(500, 500)
      .toFormat("jpeg")
      .jpeg({ quality: 80 })
      .toFile(`uploads/${req.file.fileName}`);
  }
  next();
};

export const uploadUserAvatar = upload.single("avatar");
//* -------------------------------------------------------------------------

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    successHandler(res, 200, users);
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    isValidId(req);
    const user = await User.findById(req.params.id);
    successHandler(res, 200, user);
  } catch (error) {
    next(error);
  }
};

export const deleteAllUsers = async (req, res, next) => {
  try {
    const deleteConfirm = await User.deleteMany();
    successHandler(res, 200, deleteConfirm);
  } catch (error) {
    next(error);
  }
};

export const updateUserById = async (req, res, next) => {
  try {
    isValidId(req);
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (req.file) {
      user.avatar = req.file.filename;

      //! Uncomment this if you are using the confirmPassword field
      // user.passwordConfirm = req.user.password;
    }

    await user.save();

    successHandler(res, 200, user);
  } catch (error) {
    next(error);
  }
};

export const deleteUserById = async (req, res, next) => {
  try {
    isValidId(req);
    const user = await User.findByIdAndDelete(req.params.id);
    successHandler(res, 200, user);
  } catch (error) {
    next(error);
  }
};
