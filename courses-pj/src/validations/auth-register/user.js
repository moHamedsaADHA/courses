import { body } from "express-validator";
import { User } from "../../models/user.js"; 

export const registerUserValidation = [
  body("name")
    .notEmpty().withMessage("Name is required")
    .isString().withMessage("Name must be a string")
    .isLength({ min: 3, max: 50 }).withMessage("Name must be between 3 and 50 characters"),

  body("email")
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid email format")
    .custom(async (value) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        throw new Error("Invalid email format");
      }
      const existingEmail = await User.findOne({ email: value });
      if (existingEmail) {
        throw new Error("Email already exists");
      }

      return true;
    }),

  body("password")
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),

  body("role")
    .notEmpty().withMessage("Role is required")
    .isIn(["user", "admin"]).withMessage("Role must be either user or admin"),

  body("phone")
    .optional()
    .isString().withMessage("Phone must be a string")
    .isLength({ min: 8, max: 20 }).withMessage("Phone number must be between 8 and 20 characters"),
];
