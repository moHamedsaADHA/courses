import express from 'express';
import { isAuthenticated } from '../middlewares/isAuthenticated.middleware.js';
import { isAuthorized } from '../middlewares/isAuthorized.middleware.js';
import { taskValidation } from '../validations/task.js';
import { taskUpdateValidation } from '../validations/task.update.js';

// استيراد handlers المهام
import { createTask } from '../handlers/tasks/create-task.handler.js';
import { getAllTasks } from '../handlers/tasks/get-all-tasks.handler.js';
import { getTask } from '../handlers/tasks/get-task.handler.js';
import { updateTask } from '../handlers/tasks/update-task.handler.js';
import { deleteTask } from '../handlers/tasks/delete-task.handler.js';

// استيراد handlers المهام حسب الصف
import { getTasksByGradeOne } from '../handlers/tasks/get-tasks-grade-1.handler.js';
import { getTasksByGradeTwoScience } from '../handlers/tasks/get-tasks-grade-2-science.handler.js';
import { getTasksByGradeTwoLiterature } from '../handlers/tasks/get-tasks-grade-2-literature.handler.js';
import { getTasksByGradeThreeScience } from '../handlers/tasks/get-tasks-grade-3-science.handler.js';
import { getTasksByGradeThreeLiterature } from '../handlers/tasks/get-tasks-grade-3-literature.handler.js';

const router = express.Router();

// CRUD العام للمهام
// إنشاء مهمة جديدة (للمدرسين والإداريين فقط)
router.post(
  '/',
  isAuthenticated,
  isAuthorized(['instructor', 'admin']),
  taskValidation,
  createTask
);

// جلب جميع المهام
router.get(
  '/',
  isAuthenticated,
  getAllTasks
);

// جلب مهمة واحدة
router.get(
  '/:id',
  isAuthenticated,
  getTask
);

// تحديث مهمة (للمنشئ والإداريين فقط)
router.put(
  '/:id',
  isAuthenticated,
  taskUpdateValidation,
  updateTask
);

// حذف مهمة (للمنشئ والإداريين فقط)
router.delete(
  '/:id',
  isAuthenticated,
  deleteTask
);

// === مسارات المهام حسب الصف ===

// 1. مهام الصف الأول الثانوي
router.get(
  '/grade/first-secondary',
  isAuthenticated,
  getTasksByGradeOne
);

// 2. مهام الصف الثاني الثانوي علمي
router.get(
  '/grade/second-secondary-science',
  isAuthenticated,
  getTasksByGradeTwoScience
);

// 3. مهام الصف الثاني الثانوي أدبي
router.get(
  '/grade/second-secondary-literature',
  isAuthenticated,
  getTasksByGradeTwoLiterature
);

// 4. مهام الصف الثالث الثانوي علمي
router.get(
  '/grade/third-secondary-science',
  isAuthenticated,
  getTasksByGradeThreeScience
);

// 5. مهام الصف الثالث الثانوي أدبي
router.get(
  '/grade/third-secondary-literature',
  isAuthenticated,
  getTasksByGradeThreeLiterature
);

export default router;