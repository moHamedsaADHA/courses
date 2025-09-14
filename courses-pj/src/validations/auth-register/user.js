import { body } from "express-validator";
import { User } from "../../models/user.js"; 

export const registerUserValidation = [
  body("name")
    .notEmpty().withMessage("الاسم الرباعي مطلوب")
    .isString().withMessage("الاسم يجب أن يكون نص")
    .isLength({ min: 5, max: 100 }).withMessage("الاسم يجب أن يكون بين 5 و 100 حرف")
    .custom((value) => {
      if (!value || typeof value !== 'string') {
        throw new Error("الاسم مطلوب");
      }
      const words = value.trim().split(/\s+/);
      if (words.length < 2) {
        throw new Error("يجب أن يحتوي الاسم على كلمتين على الأقل");
      }
      return true;
    }),

  body("email")
    .notEmpty().withMessage("البريد الإلكتروني مطلوب")
    .isEmail().withMessage("صيغة البريد الإلكتروني غير صحيحة")
    .custom(async (value) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        throw new Error("صيغة البريد الإلكتروني غير صحيحة");
      }
      const existingEmail = await User.findOne({ email: value });
      if (existingEmail) {
        throw new Error("البريد الإلكتروني مستخدم مسبقاً");
      }
      return true;
    }),

  body("password")
    .notEmpty().withMessage("كلمة المرور مطلوبة")
    .isLength({ min: 8 }).withMessage("كلمة المرور يجب أن تكون 8 أحرف على الأقل")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage("كلمة المرور يجب أن تحتوي على حرف صغير وكبير ورقم"),

  body("location")
    .notEmpty().withMessage("المكان مطلوب")
    .isString().withMessage("المكان يجب أن يكون نص")
    .isLength({ min: 2, max: 50 }).withMessage("المكان يجب أن يكون بين حرفين و 50 حرف"),

  body("grade")
    .notEmpty().withMessage("الصف الدراسي مطلوب")
    .isIn([
      "الصف الأول الابتدائي",
      "الصف الثاني الابتدائي", 
      "الصف الثالث الابتدائي",
      "الصف الرابع الابتدائي",
      "الصف الخامس الابتدائي",
      "الصف السادس الابتدائي",
      "الصف الأول الإعدادي",
      "الصف الثاني الإعدادي",
      "الصف الثالث الإعدادي",
      "الصف الأول الثانوي",
      "الصف الثاني الثانوي",
      "الصف الثالث الثانوي",
      "جامعي",
      "معلم"
    ]).withMessage("يرجى اختيار صف دراسي صحيح"),

  body("role")
    .optional()
    .isIn(["student", "instructor", "admin"]).withMessage("يجب أن يكون الدور طالب أو مدرس أو مدير"),

  body("phone")
    .optional()
    .isString().withMessage("رقم الهاتف يجب أن يكون نص")
    .matches(/^01[0-2,5]{1}[0-9]{8}$/).withMessage("رقم الهاتف غير صحيح (يجب أن يبدأ بـ 010, 011, 012, أو 015)"),
];
