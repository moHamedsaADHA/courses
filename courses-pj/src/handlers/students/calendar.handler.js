import { Schedule } from "../../models/schedule.js";
import { Task } from "../../models/task.js";
import { Quiz } from "../../models/quiz.js";
import { Lesson } from "../../models/lesson.js";

// دالة لجلب التقويم الخاص بالطالب حسب الصف
export const getStudentCalendar = async (req, res) => {
  try {
    const { userId, grade } = req.user; // من الـ JWT token
    const { month, year } = req.query;

    // إعداد نطاق التاريخ
    let startDate, endDate;
    
    if (month && year) {
      // إذا تم تحديد شهر وسنة معينة
      startDate = new Date(year, month - 1, 1);
      endDate = new Date(year, month, 0);
    } else {
      // الشهر الحالي
      const now = new Date();
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    }

    console.log(`📅 جلب التقويم للطالب ${userId} - الصف: ${grade}`);
    console.log(`📆 الفترة: من ${startDate.toLocaleDateString('ar-EG')} إلى ${endDate.toLocaleDateString('ar-EG')}`);

    // جلب الحصص المجدولة
    const schedules = await Schedule.find({
      grade: grade,
      date: {
        $gte: startDate,
        $lte: endDate
      }
    })
    .populate('instructor', 'name email')
    .sort({ date: 1, timeFrom: 1 });

    // جلب المهام
    const tasks = await Task.find({
      grade: grade,
      dueDate: {
        $gte: startDate,
        $lte: endDate
      }
    })
    .populate('createdBy', 'name email')
    .sort({ dueDate: 1 });

    // جلب الكويزات
    const quizzes = await Quiz.find({
      grade: grade,
      createdAt: {
        $gte: startDate,
        $lte: endDate
      }
    })
    .populate('createdBy', 'name email')
    .sort({ createdAt: 1 });

    // جلب الدروس
    const lessons = await Lesson.find({
      grade: grade,
      createdAt: {
        $gte: startDate,
        $lte: endDate
      }
    })
    .populate('createdBy', 'name email')
    .sort({ createdAt: 1 });

    // تنسيق البيانات حسب التاريخ
    const calendar = {};
    
    // إضافة الحصص
    schedules.forEach(schedule => {
      const dateKey = schedule.date.toISOString().split('T')[0];
      
      if (!calendar[dateKey]) {
        calendar[dateKey] = {
          date: schedule.date,
          schedules: [],
          tasks: [],
          quizzes: [],
          lessons: [],
          totalItems: 0
        };
      }
      
      calendar[dateKey].schedules.push({
        id: schedule._id,
        type: 'schedule',
        title: schedule.subject,
        day: schedule.day,
        timeFrom: schedule.timeFrom,
        timeTo: schedule.timeTo,
        instructor: schedule.instructor,
        location: schedule.location || null,
        description: schedule.description || null,
        priority: 'medium'
      });
      
      calendar[dateKey].totalItems++;
    });

    // إضافة المهام
    tasks.forEach(task => {
      const dateKey = task.dueDate.toISOString().split('T')[0];
      
      if (!calendar[dateKey]) {
        calendar[dateKey] = {
          date: task.dueDate,
          schedules: [],
          tasks: [],
          quizzes: [],
          lessons: [],
          totalItems: 0
        };
      }
      
      // تحديد أولوية المهمة حسب الوقت المتبقي
      const now = new Date();
      const daysUntilDue = Math.ceil((task.dueDate - now) / (1000 * 60 * 60 * 24));
      let priority = 'low';
      
      if (daysUntilDue <= 1) priority = 'high';
      else if (daysUntilDue <= 3) priority = 'medium';
      
      calendar[dateKey].tasks.push({
        id: task._id,
        type: 'task',
        title: task.title,
        description: task.description,
        subject: task.subject,
        dueDate: task.dueDate,
        createdBy: task.createdBy,
        daysUntilDue: daysUntilDue,
        priority: priority,
        status: daysUntilDue < 0 ? 'overdue' : 'pending'
      });
      
      calendar[dateKey].totalItems++;
    });

    // إضافة الكويزات
    quizzes.forEach(quiz => {
      const dateKey = quiz.createdAt.toISOString().split('T')[0];
      
      if (!calendar[dateKey]) {
        calendar[dateKey] = {
          date: quiz.createdAt,
          schedules: [],
          tasks: [],
          quizzes: [],
          lessons: [],
          totalItems: 0
        };
      }
      
      calendar[dateKey].quizzes.push({
        id: quiz._id,
        type: 'quiz',
        title: quiz.title,
        description: quiz.description,
        subject: quiz.subject,
        duration: quiz.duration,
        questionsCount: quiz.questions ? quiz.questions.length : 0,
        createdBy: quiz.createdBy,
        createdAt: quiz.createdAt,
        priority: 'high'
      });
      
      calendar[dateKey].totalItems++;
    });

    // إضافة الدروس
    lessons.forEach(lesson => {
      const dateKey = lesson.createdAt.toISOString().split('T')[0];
      
      if (!calendar[dateKey]) {
        calendar[dateKey] = {
          date: lesson.createdAt,
          schedules: [],
          tasks: [],
          quizzes: [],
          lessons: [],
          totalItems: 0
        };
      }
      
      calendar[dateKey].lessons.push({
        id: lesson._id,
        type: 'lesson',
        title: lesson.lessonTitle,
        unitTitle: lesson.unitTitle,
        videoUrl: lesson.videoUrl,
        createdBy: lesson.createdBy,
        createdAt: lesson.createdAt,
        priority: 'medium'
      });
      
      calendar[dateKey].totalItems++;
    });

    // تحويل إلى مصفوفة مرتبة
    const sortedDates = Object.keys(calendar).sort();
    const calendarArray = sortedDates.map(dateKey => calendar[dateKey]);

    // إحصائيات إجمالية
    const stats = {
      totalSchedules: schedules.length,
      totalTasks: tasks.length,
      totalQuizzes: quizzes.length,
      totalLessons: lessons.length,
      totalItems: schedules.length + tasks.length + quizzes.length + lessons.length,
      overdueTasks: tasks.filter(task => new Date(task.dueDate) < new Date()).length,
      upcomingTasks: tasks.filter(task => {
        const daysUntil = Math.ceil((new Date(task.dueDate) - new Date()) / (1000 * 60 * 60 * 24));
        return daysUntil >= 0 && daysUntil <= 7;
      }).length
    };

    // الأيام التي تحتوي على أحداث
    const activeDates = sortedDates.map(dateKey => ({
      date: dateKey,
      itemsCount: calendar[dateKey].totalItems,
      hasSchedules: calendar[dateKey].schedules.length > 0,
      hasTasks: calendar[dateKey].tasks.length > 0,
      hasQuizzes: calendar[dateKey].quizzes.length > 0,
      hasLessons: calendar[dateKey].lessons.length > 0
    }));

    console.log(`✅ تم جلب ${stats.totalItems} عنصر في التقويم`);

    res.status(200).json({
      success: true,
      message: "تم جلب التقويم بنجاح",
      data: {
        calendar: calendarArray,
        stats: stats,
        activeDates: activeDates,
        period: {
          startDate: startDate,
          endDate: endDate,
          month: startDate.getMonth() + 1,
          year: startDate.getFullYear()
        },
        studentInfo: {
          grade: grade,
          userId: userId
        }
      }
    });

  } catch (error) {
    console.error('❌ خطأ في جلب التقويم:', error);
    res.status(500).json({
      success: false,
      message: "حدث خطأ أثناء جلب التقويم",
      error: error.message
    });
  }
};

// دالة لجلب الأحداث في يوم معين
export const getStudentDayEvents = async (req, res) => {
  try {
    const { userId, grade } = req.user;
    const { date } = req.params; // YYYY-MM-DD format

    const targetDate = new Date(date);
    const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

    console.log(`📅 جلب أحداث يوم ${date} للطالب ${userId} - الصف: ${grade}`);

    // جلب جميع الأحداث في هذا اليوم
    const [schedules, tasks, quizzes, lessons] = await Promise.all([
      Schedule.find({
        grade: grade,
        date: { $gte: startOfDay, $lte: endOfDay }
      }).populate('instructor', 'name email'),

      Task.find({
        grade: grade,
        dueDate: { $gte: startOfDay, $lte: endOfDay }
      }).populate('createdBy', 'name email'),

      Quiz.find({
        grade: grade,
        createdAt: { $gte: startOfDay, $lte: endOfDay }
      }).populate('createdBy', 'name email'),

      Lesson.find({
        grade: grade,
        createdAt: { $gte: startOfDay, $lte: endOfDay }
      }).populate('createdBy', 'name email')
    ]);

    // تجميع جميع الأحداث
    const allEvents = [
      ...schedules.map(s => ({ ...s.toObject(), type: 'schedule' })),
      ...tasks.map(t => ({ ...t.toObject(), type: 'task' })),
      ...quizzes.map(q => ({ ...q.toObject(), type: 'quiz' })),
      ...lessons.map(l => ({ ...l.toObject(), type: 'lesson' }))
    ];

    res.status(200).json({
      success: true,
      message: "تم جلب أحداث اليوم بنجاح",
      data: {
        date: date,
        events: allEvents,
        summary: {
          totalEvents: allEvents.length,
          schedules: schedules.length,
          tasks: tasks.length,
          quizzes: quizzes.length,
          lessons: lessons.length
        }
      }
    });

  } catch (error) {
    console.error('❌ خطأ في جلب أحداث اليوم:', error);
    res.status(500).json({
      success: false,
      message: "حدث خطأ أثناء جلب أحداث اليوم",
      error: error.message
    });
  }
};