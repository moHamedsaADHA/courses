import express from 'express';
import { isAuthenticated } from '../middlewares/isAuthenticated.middleware.js';
import { isAuthorized } from '../middlewares/isAuthorized.middleware.js';
import { quizValidation } from '../validations/quiz.js';
import { quizUpdateValidation } from '../validations/quiz.update.js';

// استيراد handlers الكويزات
import { createQuiz } from '../handlers/quizzes/create-quiz.handler.js';
import { getAllQuizzes } from '../handlers/quizzes/get-all-quizzes.handler.js';
import { getQuiz } from '../handlers/quizzes/get-quiz.handler.js';
import { updateQuiz } from '../handlers/quizzes/update-quiz.handler.js';
import { deleteQuiz } from '../handlers/quizzes/delete-quiz.handler.js';

// استيراد handlers الكويزات حسب الصف
import { getQuizzesByGradeOne } from '../handlers/quizzes/get-quizzes-grade-1.handler.js';
import { getQuizzesByGradeTwoScience } from '../handlers/quizzes/get-quizzes-grade-2-science.handler.js';
import { getQuizzesByGradeTwoLiterature } from '../handlers/quizzes/get-quizzes-grade-2-literature.handler.js';
import { getQuizzesByGradeThreeScience } from '../handlers/quizzes/get-quizzes-grade-3-science.handler.js';
import { getQuizzesByGradeThreeLiterature } from '../handlers/quizzes/get-quizzes-grade-3-literature.handler.js';

// استيراد handlers حل الكويزات للطلاب
import { startQuizHandler } from '../handlers/quizzes/start-quiz.handler.js';
import { submitQuizHandler } from '../handlers/quizzes/submit-quiz.handler.js';
import { getStudentResultsHandler } from '../handlers/quizzes/get-student-results.handler.js';
import { getQuizResultDetailsHandler } from '../handlers/quizzes/get-quiz-result-details.handler.js';

const router = express.Router();

// CRUD العام للكويزات
// إنشاء كويز جديد (للمدرسين والإداريين فقط)
router.post(
  '/',
  isAuthenticated,
  isAuthorized(['instructor', 'admin']),
  quizValidation,
  createQuiz
);

// جلب جميع الكويزات
router.get(
  '/',
  isAuthenticated,
  getAllQuizzes
);

// === مسارات الكويزات حسب الصف ===
// يجب أن تأتي قبل المسار العام للـ ID لتجنب التضارب

// 1. كويزات الصف الأول الثانوي
router.get(
  '/grade/first-secondary',
  isAuthenticated,
  getQuizzesByGradeOne
);

// 2. كويزات الصف الثاني الثانوي علمي
router.get(
  '/grade/second-secondary-science',
  isAuthenticated,
  getQuizzesByGradeTwoScience
);

// 3. كويزات الصف الثاني الثانوي أدبي
router.get(
  '/grade/second-secondary-literature',
  isAuthenticated,
  getQuizzesByGradeTwoLiterature
);

// 4. كويزات الصف الثالث الثانوي علمي
router.get(
  '/grade/third-secondary-science',
  isAuthenticated,
  getQuizzesByGradeThreeScience
);

// 5. كويزات الصف الثالث الثانوي أدبي
router.get(
  '/grade/third-secondary-literature',
  isAuthenticated,
  getQuizzesByGradeThreeLiterature
);

// === مسارات حل الكويزات للطلاب ===

// بدء كويز (جلب الأسئلة للطالب)
router.get(
  '/:quizId/start',
  isAuthenticated,
  startQuizHandler
);

// إرسال إجابات الكويز
router.post(
  '/:quizId/submit',
  isAuthenticated,
  submitQuizHandler
);

// جلب نتائج الطالب في جميع الكويزات
router.get(
  '/results/my-results',
  isAuthenticated,
  getStudentResultsHandler
);

// جلب تفاصيل نتيجة كويز محددة
router.get(
  '/results/:resultId/details',
  isAuthenticated,
  getQuizResultDetailsHandler
);

// جلب كويز واحد
router.get(
  '/:id',
  isAuthenticated,
  getQuiz
);

// تحديث كويز (للمنشئ والإداريين فقط)
router.put(
  '/:id',
  isAuthenticated,
  quizUpdateValidation,
  updateQuiz
);

// حذف كويز (للمنشئ والإداريين فقط)
router.delete(
  '/:id',
  isAuthenticated,
  deleteQuiz
);

export default router;