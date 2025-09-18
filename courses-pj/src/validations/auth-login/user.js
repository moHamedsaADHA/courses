import { body } from "express-validator";

export const validateUserLogin = [
  body("email")
    .notEmpty().withMessage("البريد الإلكتروني مطلوب")
    .isEmail().withMessage("صيغة البريد الإلكتروني غير صحيحة"),

  body("password")
    .notEmpty().withMessage("كلمة المرور مطلوبة")
    .isLength({ min: 8 }).withMessage("كلمة المرور يجب أن تكون 8 أحرف على الأقل"),
];
