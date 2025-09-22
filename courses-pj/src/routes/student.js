import express from "express";
import { validationResult as expressValidationResult } from "express-validator";
import { isAuthenticated } from "../middlewares/isAuthenticated.middleware.js";
import { isAuthorized } from "../middlewares/isAuthorized.middleware.js";

import { getStudentCalendarHandler } from '../handlers/students/get-student-calendar.handler.js';
import { getOverallProgressHandler } from '../handlers/students/get-overall-progress.handler.js';

export const studentRouter = express.Router();

const validationResult = (req, res, next) => {
  const errors = expressValidationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

studentRouter.get("/", isAuthenticated, validationResult, (req, res) => res.json({ message: "student area" }));

// Calendar Routes - يتطلب دور طالب فقط
// جلب التقويم الشخصي للطالب
// GET /api/students/calendar
studentRouter.get('/calendar', isAuthenticated, isAuthorized(['student']), getStudentCalendarHandler);

// Overall Progress Route - متاح لكل المستخدمين المسجلين
// GET /api/students/overall-progress
studentRouter.get('/overall-progress', isAuthenticated, getOverallProgressHandler);
