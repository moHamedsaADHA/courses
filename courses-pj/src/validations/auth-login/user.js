import { body } from "express-validator";

export const validateUserLogin = [
  body("email")
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid email format"),

  body("password")
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),

  body("role")
    .optional()
    .isIn(["instructor", "admin"])
    .withMessage("Role must be either instructor or admin"),
];
