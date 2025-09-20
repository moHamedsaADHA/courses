import express from "express";
import { getDashboardAnalytics } from "../handlers/analytics/dashboard-analytics.handler.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.middleware.js";
import { isAuthorized } from "../middlewares/isAuthorized.middleware.js";

export const analyticsRouter = express.Router();

/**
 * GET /api/analytics/dashboard
 * جلب جميع التحليلات والإحصائيات للوحة التحكم
 * الصلاحيات: admin أو instructor فقط
 */
analyticsRouter.get(
  "/dashboard",
  isAuthenticated,
  isAuthorized(["admin", "instructor"]),
  getDashboardAnalytics
);

/**
 * مثال على استخدام الـ endpoint:
 * 
 * Headers:
 * Authorization: Bearer your-access-token
 * 
 * Response للـ Admin:
 * {
 *   "success": true,
 *   "data": {
 *     "overview": {
 *       "users": { "total": 150, "byRole": {...}, "verified": 120 },
 *       "courses": { "total": 45, "recent": 5, "byCategory": [...] },
 *       "quizzes": { "total": 230, "byGrade": [...], "questions": {...} },
 *       "tasks": { "total": 180, "upcoming": 45, "overdue": 12 },
 *       "lessons": { "total": 320, "byGrade": [...] },
 *       "categories": { "total": 8, "withCourses": [...] }
 *     },
 *     "activity": {
 *       "daily": [...], // آخر 7 أيام
 *       "byGrade": [...] // إحصائيات حسب الصف
 *     },
 *     "metadata": {
 *       "generatedAt": "2025-01-20T10:30:00.000Z",
 *       "userRole": "admin",
 *       "timezone": "Africa/Cairo"
 *     }
 *   }
 * }
 * 
 * Response للـ Instructor:
 * {
 *   "success": true,
 *   "data": {
 *     "overview": {
 *       "users": { "total": 150, ... }, // إحصائيات عامة
 *       "courses": { "total": 8, ... }, // الكورسات الخاصة بالمعلم فقط
 *       "quizzes": { "total": 25, ... }, // الكويزات الخاصة بالمعلم فقط
 *       "tasks": { "total": 30, ... }, // المهام الخاصة بالمعلم فقط
 *       "lessons": { "total": 40, ... } // الدروس الخاصة بالمعلم فقط
 *     },
 *     "activity": {
 *       "daily": [...], // نشاط المعلم فقط
 *       "byGrade": [...] // محتوى المعلم حسب الصف
 *     },
 *     "metadata": { ... }
 *   }
 * }
 */