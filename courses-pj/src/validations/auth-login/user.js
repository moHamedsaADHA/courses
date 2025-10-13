import { body } from "express-validator";

export const validateUserLogin = [
  body("code")
    .notEmpty().withMessage("الكود مطلوب")
    .isString().withMessage("الكود يجب أن يكون نص")
    .isLength({ min: 8, max: 20 }).withMessage("الكود يجب أن يكون بين 8 و 20 حرف"),

  body("password")
    .notEmpty().withMessage("كلمة المرور مطلوبة")
    .isLength({ min: 8 }).withMessage("كلمة المرور يجب أن تكون 8 أحرف على الأقل"),
];
