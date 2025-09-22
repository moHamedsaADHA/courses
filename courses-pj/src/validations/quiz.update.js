import { body } from 'express-validator';

export const quizUpdateValidation = [
  body('title')
    .optional()
    .isLength({ min: 3, max: 200 })
    .withMessage('عنوان الكويز يجب أن يكون بين 3 و 200 حرف')
    .trim(),

  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('وصف الكويز يجب أن يكون أقل من 500 حرف')
    .trim(),

  body('grade')
    .optional()
    .isIn([
      "الصف الأول الثانوي",
      "الصف الثاني الثانوي علمي",
      "الصف الثاني الثانوي ادبي",
      "الصف الثالث الثانوي علمي",
      "الصف الثالث الثانوي ادبي"
    ])
    .withMessage('الصف المحدد غير صحيح'),

  body('subject')
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage('اسم المادة يجب أن يكون بين 2 و 50 حرف')
    .trim(),

  body('timeLimit')
    .optional()
    .isInt({ min: 5, max: 180 })
    .withMessage('مدة الكويز يجب أن تكون بين 5 و 180 دقيقة'),

  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('حالة الكويز يجب أن تكون صح أو خطأ'),

  // تم إزالة التحقق من الأسئلة والخيارات لتسهيل إضافة أنواع أسئلة جديدة مثل "لينك"
];