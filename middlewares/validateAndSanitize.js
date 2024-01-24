import { check, validationResult } from "express-validator";
import createError from "http-errors";

const validateSanitize = [
  check("firstName").trim().escape(),
  check("lastName").trim().escape(),
  check("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email address")
    .normalizeEmail()
    .escape(),
  check("password")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 charachters"),
  //! You need to add a confirm password filed in the form on the frontend to be able to use confirmPassword check
  /*  check("passwordConfirm")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Please confirm your password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 charachters"),
 */
  (req, res, next) => {
    let result = validationResult(req);
    result.isEmpty() ? next() : next(createError(422, result.errors[0].msg));
  },
];

export default validateSanitize;
