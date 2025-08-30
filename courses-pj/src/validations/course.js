import { body } from "express-validator";

export const validateCourse = [
  body("title")
    .notEmpty().withMessage("Course title is required")
    .isString().withMessage("Course title must be a string")
    .isLength({ min: 3, max: 100 }).withMessage("Course title must be between 3 and 100 characters"),

  body("price")
    .notEmpty().withMessage("Course price is required")
    .isNumeric().withMessage("Course price must be a number")
    .isFloat({ min: 0 }).withMessage("Course price must be greater than or equal to 0"),

  body("duration")
    .notEmpty().withMessage("Course duration is required")
    .isString().withMessage("Course duration must be a string"),

  body("description")
    .notEmpty().withMessage("Course description is required")
    .isString().withMessage("Course description must be a string")
    .isLength({ min: 10, max: 500 }).withMessage("Course description must be between 10 and 500 characters"),

  body("categoryId")
    .optional()
    .isMongoId().withMessage("Invalid categoryId format"),
];
