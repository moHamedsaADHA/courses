import { body } from 'express-validator';

export const validateUpdateLesson = [
  body('grade').optional().isString().withMessage('الصف يجب أن يكون نصاً'),
  body('unitTitle').optional().isLength({ min: 2 }).withMessage('عنوان الوحدة قصير'),
  body('lessonTitle').optional().isLength({ min: 2 }).withMessage('عنوان الدرس قصير'),
  body('videoUrl').optional().isURL().withMessage('رابط غير صالح')
    .matches(/(youtube\.com|youtu\.be|vimeo\.com|drive\.google\.com|\.mp4$)/)
    .withMessage('الرابط يجب أن يكون YouTube أو Vimeo أو Google Drive أو mp4'),
];
