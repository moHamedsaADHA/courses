import express from 'express';
import { isAuthenticated } from '../middlewares/isAuthenticated.middleware.js';
import { isAuthorized } from '../middlewares/isAuthorized.middleware.js';
import { validationResult as expressValidationResult } from 'express-validator';
import { validateCreateSchedule, validateUpdateSchedule } from '../validations/schedule.js';
import { createScheduleHandler } from '../handlers/schedule/create-schedule.handler.js';
import { getSchedulesHandler } from '../handlers/schedule/get-schedules.handler.js';
import { getScheduleHandler } from '../handlers/schedule/get-schedule.handler.js';
import { updateScheduleHandler } from '../handlers/schedule/update-schedule.handler.js';
import { deleteScheduleHandler } from '../handlers/schedule/delete-schedule.handler.js';
import { getSchedulesByGradeHandler } from '../handlers/schedule/get-schedules-by-grade.handler.js';

export const scheduleRouter = express.Router();

const validationResult = (req, res, next) => {
  const errors = expressValidationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Public: list schedules with filters
scheduleRouter.get('/', getSchedulesHandler);

// Public: get single schedule
scheduleRouter.get('/:id', getScheduleHandler);

// Protected: create schedule (instructor or admin)
scheduleRouter.post('/', 
  isAuthenticated, 
  isAuthorized(['instructor', 'admin']), 
  validateCreateSchedule, 
  validationResult, 
  createScheduleHandler
);

// Protected: update schedule
scheduleRouter.put('/:id', 
  isAuthenticated, 
  isAuthorized(['instructor', 'admin']), 
  validateUpdateSchedule, 
  validationResult, 
  updateScheduleHandler
);

// Protected: delete schedule
scheduleRouter.delete('/:id', 
  isAuthenticated, 
  isAuthorized(['instructor', 'admin']), 
  deleteScheduleHandler
);

// Public: Schedule by Grade Routes
scheduleRouter.get('/grade/1st-secondary', 
  getSchedulesByGradeHandler('الصف الأول الثانوي')
);

scheduleRouter.get('/grade/2nd-secondary-science', 
  getSchedulesByGradeHandler('الصف الثاني الثانوي علمي')
);

scheduleRouter.get('/grade/2nd-secondary-arts', 
  getSchedulesByGradeHandler('الصف الثاني الثانوي ادبي')
);

scheduleRouter.get('/grade/3rd-secondary-science', 
  getSchedulesByGradeHandler('الصف الثالث الثانوي علمي')
);

scheduleRouter.get('/grade/3rd-secondary-arts', 
  getSchedulesByGradeHandler('الصف الثالث الثانوي ادبي')
);