import { body } from 'express-validator';

export const taskUpdateValidation = [
  body('title')
    .optional()
    .isLength({ min: 3, max: 200 })
    .withMessage('عنوان المهمة يجب أن يكون بين 3 و 200 حرف')
    .trim(),

  body('description')
    .optional()
    .isLength({ min: 10, max: 1000 })
    .withMessage('وصف المهمة يجب أن يكون بين 10 و 1000 حرف')
    .trim(),

  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('تاريخ التسليم يجب أن يكون بصيغة صحيحة')
    .custom((value) => {
      if (value) {
        const dueDate = new Date(value);
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        
        if (dueDate < now) {
          throw new Error('تاريخ التسليم لا يمكن أن يكون في الماضي');
        }
      }
      return true;
    }),

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

  body('priority')
    .optional()
    .isIn(['منخفض', 'متوسط', 'عالي', 'عاجل'])
    .withMessage('أولوية المهمة غير صحيحة'),

  body('status')
    .optional()
    .isIn(['نشط', 'منتهي', 'ملغي'])
    .withMessage('حالة المهمة غير صحيحة'),

  body('attachments')
    .optional()
    .isArray()
    .withMessage('المرفقات يجب أن تكون مصفوفة'),

  body('attachments.*.filename')
    .optional()
    .isString()
    .isLength({ min: 1, max: 255 })
    .withMessage('اسم الملف يجب أن يكون نص صحيح'),

  body('attachments.*.url')
    .optional()
    .isURL()
    .withMessage('رابط الملف يجب أن يكون رابط صحيح')
];