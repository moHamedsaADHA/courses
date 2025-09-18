import { body } from 'express-validator';

export const validateCreateSchedule = [
  body('day')
    .notEmpty().withMessage('اليوم مطلوب')
    .isIn(['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'])
    .withMessage('اليوم غير صحيح'),
  body('subject')
    .notEmpty().withMessage('المادة مطلوبة')
    .isLength({ min: 2 }).withMessage('اسم المادة قصير جداً'),
  body('date')
    .isISO8601().withMessage('تاريخ غير صحيح')
    .custom((value) => {
      const date = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (date < today) {
        throw new Error('التاريخ لا يمكن أن يكون في الماضي');
      }
      return true;
    }),
  body('timeFrom')
    .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('صيغة وقت البداية غير صحيحة (HH:MM)'),
  body('timeTo')
    .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('صيغة وقت النهاية غير صحيحة (HH:MM)')
    .custom((timeTo, { req }) => {
      const timeFromMinutes = req.body.timeFrom.split(':').reduce((h, m) => h * 60 + +m);
      const timeToMinutes = timeTo.split(':').reduce((h, m) => h * 60 + +m);
      if (timeFromMinutes >= timeToMinutes) {
        throw new Error('وقت النهاية يجب أن يكون بعد وقت البداية');
      }
      return true;
    }),
  body('grade')
    .notEmpty().withMessage('الصف مطلوب')
    .isIn([
      "الصف الأول الثانوي",
      "الصف الثاني الثانوي علمي", 
      "الصف الثاني الثانوي ادبي",
      "الصف الثالث الثانوي علمي",
      "الصف الثالث الثانوي ادبي"
    ]).withMessage('الصف غير صحيح'),
  body('instructor')
    .isMongoId().withMessage('معرف المعلم غير صحيح')
];

export const validateUpdateSchedule = [
  body('day').optional()
    .isIn(['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'])
    .withMessage('اليوم غير صحيح'),
  body('subject').optional()
    .isLength({ min: 2 }).withMessage('اسم المادة قصير جداً'),
  body('date').optional()
    .isISO8601().withMessage('تاريخ غير صحيح'),
  body('timeFrom').optional()
    .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('صيغة وقت البداية غير صحيحة'),
  body('timeTo').optional()
    .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('صيغة وقت النهاية غير صحيحة'),
  body('grade').optional()
    .isIn([
      "الصف الأول الثانوي",
      "الصف الثاني الثانوي علمي",
      "الصف الثاني الثانوي ادبي", 
      "الصف الثالث الثانوي علمي",
      "الصف الثالث الثانوي ادبي"
    ]).withMessage('الصف غير صحيح'),
  body('instructor').optional()
    .isMongoId().withMessage('معرف المعلم غير صحيح')
];