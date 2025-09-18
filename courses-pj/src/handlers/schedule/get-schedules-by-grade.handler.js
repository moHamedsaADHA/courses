import { Schedule } from '../../models/schedule.js';

export const getSchedulesByGradeHandler = (fixedGrade) => async (req, res) => {
  try {
    const grade = fixedGrade || req.params.grade;
    if (!grade) {
      return res.status(400).json({ message: 'الصف مطلوب' });
    }

    const { day, instructor, date, page = 1, limit = 20 } = req.query;
    const query = { grade };

    // إضافة فلاتر إضافية إذا تم تمريرها
    if (day) query.day = day;
    if (instructor) query.instructor = instructor;
    if (date) {
      const targetDate = new Date(date);
      query.date = {
        $gte: new Date(targetDate.setHours(0, 0, 0, 0)),
        $lte: new Date(targetDate.setHours(23, 59, 59, 999))
      };
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [schedules, total] = await Promise.all([
      Schedule.find(query)
        .populate('instructor', 'name email')
        .populate('createdBy', 'name email')
        .sort({ date: 1, timeFrom: 1 })
        .skip(skip)
        .limit(Number(limit)),
      Schedule.countDocuments(query)
    ]);

    res.json({
      grade,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      total,
      schedules
    });
  } catch (error) {
    console.error('Get schedules by grade error:', error);
    res.status(500).json({ message: 'خطأ في جلب الجدول حسب الصف', error: error.message });
  }
};