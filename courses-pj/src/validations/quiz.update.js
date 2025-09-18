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

  // التحقق من الأسئلة (إذا تم تحديثها)
  body('questions')
    .optional()
    .isArray({ min: 1 })
    .withMessage('يجب أن يحتوي الكويز على سؤال واحد على الأقل'),

  body('questions.*.questionText')
    .optional()
    .isLength({ min: 5, max: 500 })
    .withMessage('نص السؤال يجب أن يكون بين 5 و 500 حرف')
    .trim(),

  body('questions.*.type')
    .optional()
    .isIn(['صح وخطأ', 'اختر من متعدد'])
    .withMessage('نوع السؤال يجب أن يكون "صح وخطأ" أو "اختر من متعدد"'),

  body('questions.*.points')
    .optional()
    .isInt({ min: 1, max: 10 })
    .withMessage('نقاط السؤال يجب أن تكون بين 1 و 10'),

  body('questions.*.explanation')
    .optional()
    .isLength({ max: 300 })
    .withMessage('شرح السؤال يجب أن يكون أقل من 300 حرف')
    .trim(),

  // التحقق من الإجابة الصحيحة لأسئلة صح وخطأ
  body('questions.*.correctAnswer')
    .if(body('questions.*.type').equals('صح وخطأ'))
    .optional()
    .isBoolean()
    .withMessage('الإجابة الصحيحة يجب أن تكون صح أو خطأ'),

  // التحقق من الخيارات لأسئلة الاختيار من متعدد
  body('questions.*.options')
    .if(body('questions.*.type').equals('اختر من متعدد'))
    .optional()
    .isArray({ min: 2 })
    .withMessage('أسئلة الاختيار من متعدد يجب أن تحتوي على خيارين على الأقل'),

  body('questions.*.options.*.text')
    .if(body('questions.*.type').equals('اختر من متعدد'))
    .optional()
    .isLength({ min: 1, max: 200 })
    .withMessage('نص الخيار يجب أن يكون بين 1 و 200 حرف')
    .trim(),

  body('questions.*.options.*.isCorrect')
    .if(body('questions.*.type').equals('اختر من متعدد'))
    .optional()
    .isBoolean()
    .withMessage('حالة الخيار يجب أن تكون صح أو خطأ')
];