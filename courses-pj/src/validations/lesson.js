import { body } from 'express-validator';

export const validateCreateLesson = [
  body('grade')
    .notEmpty().withMessage('الصف مطلوب')
    .isString().withMessage('الصف يجب أن يكون نصاً'),
  body('unitTitle')
    .notEmpty().withMessage('عنوان الوحدة مطلوب')
    .isLength({ min: 2 }).withMessage('عنوان الوحدة قصير جداً'),
  body('lessonTitle')
    .notEmpty().withMessage('عنوان الدرس مطلوب')
    .isLength({ min: 2 }).withMessage('عنوان الدرس قصير جداً'),
  body('videoUrl')
    .notEmpty().withMessage('رابط الفيديو مطلوب')
    .isURL().withMessage('صيغة رابط الفيديو غير صحيحة')
    .matches(/(youtube\.com|youtu\.be|vimeo\.com|drive\.google\.com|\.mp4$)/)
      .withMessage('الرابط يجب أن يكون YouTube أو Vimeo أو Google Drive أو ملف mp4'),
];
