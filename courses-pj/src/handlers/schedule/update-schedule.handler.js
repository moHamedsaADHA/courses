import { Schedule } from '../../models/schedule.js';

export const updateScheduleHandler = async (req, res) => {
  try {
    if (!req.user || !['instructor', 'admin'].includes(req.user.role)) {
      return res.status(403).json({ message: 'غير مسموح' });
    }

    const { id } = req.params;
    const allowed = ['day', 'subject', 'date', 'timeFrom', 'timeTo', 'grade', 'instructor'];
    const update = {};
    
    for (const key of allowed) {
      if (req.body[key] !== undefined) {
        update[key] = key === 'date' ? new Date(req.body[key]) : req.body[key];
      }
    }

    const schedule = await Schedule.findById(id);
    if (!schedule) {
      return res.status(404).json({ message: 'لم يتم العثور على الجدولة' });
    }

    // التحقق من الصلاحية (صاحب الجدولة أو أدمن)
    if (req.user.role !== 'admin' && schedule.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'غير مصرح لك بتعديل هذه الجدولة' });
    }

    // إذا تم تعديل المعلم أو الوقت، تحقق من التعارض
    if (update.instructor || update.date || update.timeFrom || update.timeTo) {
      const checkInstructor = update.instructor || schedule.instructor;
      const checkDate = update.date || schedule.date;
      const checkTimeFrom = update.timeFrom || schedule.timeFrom;
      const checkTimeTo = update.timeTo || schedule.timeTo;

      const conflict = await Schedule.findOne({
        _id: { $ne: id }, // استبعاد الجدولة الحالية
        instructor: checkInstructor,
        date: checkDate,
        $or: [
          {
            timeFrom: { $lte: checkTimeFrom },
            timeTo: { $gt: checkTimeFrom }
          },
          {
            timeFrom: { $lt: checkTimeTo },
            timeTo: { $gte: checkTimeTo }
          }
        ]
      });

      if (conflict) {
        return res.status(400).json({ 
          message: 'يوجد تعارض في الجدولة - المعلم لديه حصة أخرى في هذا الوقت' 
        });
      }
    }

    Object.assign(schedule, update);
    await schedule.save();

    const updatedSchedule = await Schedule.findById(id)
      .populate('instructor', 'name email')
      .populate('createdBy', 'name email');

    res.json({ message: 'تم تحديث الجدولة', schedule: updatedSchedule });
  } catch (error) {
    console.error('Update schedule error:', error);
    res.status(500).json({ message: 'خطأ أثناء التحديث', error: error.message });
  }
};