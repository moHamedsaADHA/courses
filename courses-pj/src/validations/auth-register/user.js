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
    .optional({ nullable: true, checkFalsy: true })  // اختياري بالكامل حتى للقيم الفارغة
    .custom(async (value) => {
      // فقط تحقق إذا كان هناك قيمة حقيقية وليست فارغة
      if (value && typeof value === 'string' && value.trim() !== '') {
        // تحقق من صيغة البريد الإلكتروني
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value.trim())) {
          throw new Error("صيغة البريد الإلكتروني غير صحيحة");
        }
        // تحقق من عدم وجود البريد مسبقاً
        const existingEmail = await User.findOne({ email: value.trim() });
        if (existingEmail) {
          throw new Error("البريد الإلكتروني مستخدم مسبقاً");
        }
      }
      return true;
    }),

  body("code")
    .notEmpty().withMessage("الكود مطلوب")
    .isString().withMessage("الكود يجب أن يكون نص")
    .isLength({ min: 8, max: 20 }).withMessage("الكود يجب أن يكون بين 8 و 20 حرف")
    .custom(async (value) => {
      const existingUser = await User.findOne({ code: value });
      if (existingUser) {
        throw new Error("الكود مستخدم مسبقاً");
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
      "الصف الأول الثانوي",
      "الصف الثاني الثانوي علمي",
      "الصف الثاني الثانوي ادبي",
      "الصف الثالث الثانوي علمي",
      "الصف الثالث الثانوي ادبي",
    ]).withMessage("يرجى اختيار صف دراسي صحيح"),

  body("role")
    .optional()
    .isIn(["student", "instructor", "admin"]).withMessage("يجب أن يكون الدور طالب أو مدرس أو مدير"),

  body("phone")
    .optional()
    .isString().withMessage("رقم الهاتف يجب أن يكون نص")
    .matches(/^01[0-2,5]{1}[0-9]{8}$/).withMessage("رقم الهاتف غير صحيح (يجب أن يبدأ بـ 010, 011, 012, أو 015)"),
];
