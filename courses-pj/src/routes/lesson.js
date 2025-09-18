import express from 'express';
import { isAuthenticated } from '../middlewares/isAuthenticated.middleware.js';
import { isAuthorized } from '../middlewares/isAuthorized.middleware.js';
import { validationResult as expressValidationResult } from 'express-validator';
import { validateCreateLesson } from '../validations/lesson.js';
import { validateUpdateLesson } from '../validations/lesson.update.js';
import { createLessonHandler } from '../handlers/lessons/create-lesson.handler.js';
import { getLessonsHandler } from '../handlers/lessons/get-lessons.handler.js';
import { getLessonHandler } from '../handlers/lessons/get-lesson.handler.js';
import { updateLessonHandler } from '../handlers/lessons/update-lesson.handler.js';
import { deleteLessonHandler } from '../handlers/lessons/delete-lesson.handler.js';
import { getLessonsByGradeHandler } from '../handlers/lessons/get-lessons-by-grade.handler.js';

export const lessonRouter = express.Router();

const validationResult = (req, res, next) => {
  const errors = expressValidationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Public: list lessons with filters
lessonRouter.get('/', getLessonsHandler);

// Fixed grade endpoints (must be before :id route)
lessonRouter.get('/grade/1st-secondary', getLessonsByGradeHandler('الصف الأول الثانوي'));
lessonRouter.get('/grade/2nd-secondary-science', getLessonsByGradeHandler('الصف الثاني الثانوي علمي'));
lessonRouter.get('/grade/2nd-secondary-literary', getLessonsByGradeHandler('الصف الثاني الثانوي ادبي'));
lessonRouter.get('/grade/3rd-secondary-science', getLessonsByGradeHandler('الصف الثالث الثانوي علمي'));
lessonRouter.get('/grade/3rd-secondary-literary', getLessonsByGradeHandler('الصف الثالث الثانوي ادبي'));

// Public: get single lesson
lessonRouter.get('/:id', getLessonHandler);

// Protected: create lesson (instructor or admin)
lessonRouter.post('/', isAuthenticated, isAuthorized(['instructor','admin']), validateCreateLesson, validationResult, createLessonHandler);

// Protected: update lesson
lessonRouter.put('/:id', isAuthenticated, isAuthorized(['instructor','admin']), validateUpdateLesson, validationResult, updateLessonHandler);

// Protected: delete lesson
lessonRouter.delete('/:id', isAuthenticated, isAuthorized(['instructor','admin']), deleteLessonHandler);
