import { body } from 'express-validator';

export const quizValidation = [
  body('title')
    .notEmpty()
    .withMessage('عنوان الكويز مطلوب')
    .isLength({ min: 3, max: 200 })
    .withMessage('عنوان الكويز يجب أن يكون بين 3 و 200 حرف')
    .trim(),

  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('وصف الكويز يجب أن يكون أقل من 500 حرف')
    .trim(),

  body('grade')
    .notEmpty()
    .withMessage('الصف مطلوب')
    .isIn([
      "الصف الأول الثانوي",
      "الصف الثاني الثانوي علمي",
      "الصف الثاني الثانوي ادبي",
      "الصف الثالث الثانوي علمي",
      "الصف الثالث الثانوي ادبي"
    ])
    .withMessage('الصف المحدد غير صحيح'),

  body('subject')
    .notEmpty()
    .withMessage('المادة مطلوبة')
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

  // التحقق من الأسئلة
  body('questions')
    .isArray({ min: 1 })
    .withMessage('يجب أن يحتوي الكويز على سؤال واحد على الأقل'),

  body('questions.*.questionText')
    .notEmpty()
    .withMessage('نص السؤال مطلوب')
    .isLength({ min: 5, max: 500 })
    .withMessage('نص السؤال يجب أن يكون بين 5 و 500 حرف')
    .trim(),

  body('questions.*.type')
    .notEmpty()
    .withMessage('نوع السؤال مطلوب')
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
    .notEmpty()
    .withMessage('الإجابة الصحيحة مطلوبة لأسئلة صح وخطأ')
    .isBoolean()
    .withMessage('الإجابة الصحيحة يجب أن تكون صح أو خطأ'),

  // التحقق من الخيارات لأسئلة الاختيار من متعدد
  body('questions.*.options')
    .if(body('questions.*.type').equals('اختر من متعدد'))
    .isArray({ min: 2 })
    .withMessage('أسئلة الاختيار من متعدد يجب أن تحتوي على خيارين على الأقل'),

  body('questions.*.options.*.text')
    .if(body('questions.*.type').equals('اختر من متعدد'))
    .notEmpty()
    .withMessage('نص الخيار مطلوب')
    .isLength({ min: 1, max: 200 })
    .withMessage('نص الخيار يجب أن يكون بين 1 و 200 حرف')
    .trim(),

  body('questions.*.options.*.isCorrect')
    .if(body('questions.*.type').equals('اختر من متعدد'))
    .isBoolean()
    .withMessage('حالة الخيار يجب أن تكون صح أو خطأ')
];