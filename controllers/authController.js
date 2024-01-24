import createError from "http-errors";
import jwt from "jsonwebtoken";

import User from "../models/userModel.js";
import Cart from "../models/cartModel.js";

//! Helpers

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXP,
  });

const removeCookies = (res, ...cookies) => {
  cookies.forEach((name) => res.clearCookie(name));
};

const createSendToken = (res, status, user) => {
  const jwtToken = signToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXP * 24 * 60 * 60 * 1000
    ),
    secure: true, // Will still work over http if it is a localhost
    httpOnly: true,
  };

  res.cookie("jwtToken", jwtToken, cookieOptions);

  user.password = undefined;

  res.status(status).json({
    success: true,
    status,
    user,
  });
};

const createCart = async (user) => {
  const newCart = await Cart.create({});
  user.cartId = newCart._id;
  await user.save();
};

//! Controllers

export const signup = async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    await createCart(user);
    createSendToken(res, 201, user);
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw createError(400, "Please provide email and password");
    }

    const user = await User.findOne({ email });

    if (!user || !(await user.correctPassword(password, user.password))) {
      throw createError(401, "Incorrect email or password.");
    }

    createSendToken(res, 200, user);
  } catch (error) {
    next(error);
  }
};

export const logout = (req, res, next) => {
  try {
    removeCookies(res, "jwtToken");

    res.status(200).json({
      success: true,
      status: 200,
      data: "User was successfully logged out.",
    });
  } catch (error) {
    next();
  }
};

export const protect = async (req, res, next) => {
  try {
    const jwtToken = req.cookies["jwtToken"]; // We need to parse the cookie using 'cookie-parser'

    if (!jwtToken) throw createError(401, "Unauthorized request");

    const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) throw createError(401, "User is no longer exist.");

    req.user = user;
    req.isAuthenticated = true;

    next();
  } catch (error) {
    next(error);
  }
};

export const getMe = (req, res, next) => {
  try {
    const { user, isAuthenticated, cookies } = req;
    // user.password = undefined;

    res.status(200).json({
      sucess: true,
      user,
      isAuthenticated,
      // jwtToken: cookies["jwtToken"],
    });
  } catch (error) {
    next(error);
  }
};

export const restrictTo = (...roles) => {
  try {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        throw createError(
          403,
          "Access denied: You don't have the required permitions."
        );
      }
      next();
    };
  } catch (error) {
    next();
  }
};
