import { Schedule } from '../../models/schedule.js';

export const createScheduleHandler = async (req, res) => {
  try {
    if (!req.user || !['instructor', 'admin'].includes(req.user.role)) {
      return res.status(403).json({ message: 'غير مسموح: يجب أن تكون معلماً أو أدمن' });
    }

    const { day, subject, date, timeFrom, timeTo, grade, instructor } = req.body;

    // التحقق من تعارض الجدولة (نفس المعلم, نفس الوقت)
    const conflict = await Schedule.findOne({
      instructor,
      date: new Date(date),
      $or: [
        {
          timeFrom: { $lte: timeFrom },
          timeTo: { $gt: timeFrom }
        },
        {
          timeFrom: { $lt: timeTo },
          timeTo: { $gte: timeTo }
        }
      ]
    });

    if (conflict) {
      return res.status(400).json({ 
        message: 'يوجد تعارض في الجدولة - المعلم لديه حصة أخرى في هذا الوقت' 
      });
    }

    const schedule = await Schedule.create({
      day,
      subject,
      date: new Date(date),
      timeFrom,
      timeTo,
      grade,
      instructor,
      createdBy: req.user._id
    });

    const populatedSchedule = await Schedule.findById(schedule._id)
      .populate('instructor', 'name email')
      .populate('createdBy', 'name email');

    return res.status(201).json({
      message: 'تم إنشاء الجدولة بنجاح',
      schedule: populatedSchedule
    });
  } catch (error) {
    console.error('Create schedule error:', error);
    res.status(500).json({ message: 'حدث خطأ أثناء إنشاء الجدولة', error: error.message });
  }
};