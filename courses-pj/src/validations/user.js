import { body } from "express-validator";

export const validateUser = [
  body("name")
    .notEmpty().withMessage("User name is required")
    .isString().withMessage("User name must be a string")
    .isLength({ min: 3, max: 50 }).withMessage("User name must be between 3 and 50 characters"),

  body("id")
    .notEmpty().withMessage("User ID is required")
    .isInt({ min: 1 }).withMessage("User ID must be a positive integer"),

  body("password") 
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 8 }).withMessage("Password must be at least 8 characters long"),


    
  body("role")
    .notEmpty().withMessage("Role is required")
    .isIn(["user", "admin"]).withMessage("Role must be either 'user' or 'admin'"),

  body("image")
    .optional()
    .isString().withMessage("Image must be a string"),

  body("phone")
    .notEmpty().withMessage("Phone number is required")
    .isString().withMessage("Phone must be a string")
    .isLength({ min: 8, max: 20 }).withMessage("Phone number must be between 8 and 20 characters"),

  body("courseId")
    .optional()
    .isArray().withMessage("CourseId must be an array of IDs"),
  body("courseId.*")
    .optional()
    .isMongoId().withMessage("Each courseId must be a valid MongoId"),
];
