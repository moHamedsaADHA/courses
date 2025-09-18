import express from "express";
import { createCourseHandler } from "../handlers/users-instructor/instructor.handlers.js";
import { validateCourse } from "../validations/course.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.middleware.js";
import { isAuthorized } from "../middlewares/isAuthorized.middleware.js";
import { validationResult as expressValidationResult } from "express-validator";
import { validateCreateLesson } from '../validations/lesson.js';
import { createLessonHandler } from '../handlers/lessons/create-lesson.handler.js';

export const instractorRouter = express.Router();


const validationResult = (req, res, next) => {
  const errors = expressValidationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

instractorRouter.get("/", isAuthenticated, isAuthorized(["instructor","admin"]), validationResult, createCourseHandler);

// إنشاء حصة جديدة
instractorRouter.post(
  '/lessons',
  isAuthenticated,
  isAuthorized(['instructor','admin']),
  validateCreateLesson,
  validationResult,
  createLessonHandler
);
