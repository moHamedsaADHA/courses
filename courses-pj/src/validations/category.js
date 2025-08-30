import { body } from "express-validator";

export const validateCategory = [
  body("name")
    .notEmpty().withMessage("Category name is required")
    .isString().withMessage("Category name must be a string")
    .isLength({ min: 3, max: 50 }).withMessage("Category name must be between 3 and 50 characters"),
];
