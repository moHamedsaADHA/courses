import { User } from '../../models/user.js';
import { Lesson } from '../../models/lesson.js';
import { Task } from '../../models/task.js';
import { Quiz } from '../../models/quiz.js';
import { Schedule } from '../../models/schedule.js';

export const getStudentCalendarHandler = async (req, res) => {
  try {
    const userId = req.user._id || req.user.userId;

    // جلب بيانات المستخدم
    const user = await User.findById(userId).select('name grade role');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "المستخدم غير موجود"
      });
    }

    if (user.role !== 'student') {
      return res.status(403).json({
        success: false,
        message: "هذه الميزة متاحة للطلاب فقط"
      });
    }

    const studentGrade = user.grade;
    const today = new Date();
    const oneMonthFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

    // جلب الحصص المجدولة
    const lessons = await Lesson.find({
      grade: studentGrade
    })
    .populate('createdBy', 'name email')
    .sort({ createdAt: -1 })
    .limit(20);

    // جلب المهام القادمة
    const tasks = await Task.find({
      grade: studentGrade,
      dueDate: { $gte: today, $lte: oneMonthFromNow }
    })
    .populate('createdBy', 'name email')
    .sort({ dueDate: 1 });

    // جلب الكويزات المتاحة
    const quizzes = await Quiz.find({
      grade: studentGrade,
      isActive: true
    })
    .populate('createdBy', 'name email')
    .select('-questions.correctAnswer -questions.options.isCorrect')
    .sort({ createdAt: -1 });

    // جلب الجدول الزمني إن وجد
    const schedule = await Schedule.find({
      grade: studentGrade
    })
    .populate('createdBy', 'name email')
    .sort({ createdAt: -1 })
    .limit(10);

    // تنسيق البيانات للتقويم
    const calendarEvents = [];

    // إضافة الدروس كأحداث
    lessons.forEach(lesson => {
      calendarEvents.push({
        id: lesson._id,
        type: 'lesson',
        title: lesson.lessonTitle,
        description: lesson.unitTitle,
        subject: lesson.unitTitle,
        date: lesson.createdAt,
        instructor: lesson.createdBy?.name || 'غير محدد',
        url: lesson.videoUrl,
        color: '#3498db',
        icon: '📚'
      });
    });

    // إضافة المهام كأحداث
    tasks.forEach(task => {
      const daysUntilDue = Math.ceil((new Date(task.dueDate) - today) / (1000 * 60 * 60 * 24));
      let priority = 'low';
      let color = '#27ae60';
      
      if (daysUntilDue <= 1) {
        priority = 'urgent';
        color = '#e74c3c';
      } else if (daysUntilDue <= 3) {
        priority = 'high';
        color = '#f39c12';
      } else if (daysUntilDue <= 7) {
        priority = 'medium';
        color = '#f1c40f';
      }

      calendarEvents.push({
        id: task._id,
        type: 'task',
        title: task.title,
        description: task.description,
        subject: task.subject,
        date: task.dueDate,
        createdDate: task.createdAt,
        instructor: task.createdBy?.name || 'غير محدد',
        daysUntilDue,
        priority,
        color,
        icon: '📝'
      });
    });

    // إضافة الكويزات كأحداث
    quizzes.forEach(quiz => {
      calendarEvents.push({
        id: quiz._id,
        type: 'quiz',
        title: quiz.title,
        description: quiz.description,
        subject: quiz.subject,
        date: quiz.createdAt,
        instructor: quiz.createdBy?.name || 'غير محدد',
        totalQuestions: quiz.questions?.length || 0,
        totalPoints: quiz.questions?.reduce((sum, q) => sum + (q.points || 0), 0) || 0,
        timeLimit: quiz.timeLimit,
        color: '#9b59b6',
        icon: '📊'
      });
    });

    // إضافة الجدول الزمني كأحداث
    schedule.forEach(scheduleItem => {
      calendarEvents.push({
        id: scheduleItem._id,
        type: 'schedule',
        title: scheduleItem.subject || 'حصة دراسية',
        description: scheduleItem.description,
        subject: scheduleItem.subject,
        date: scheduleItem.date,
        startTime: scheduleItem.startTime,
        endTime: scheduleItem.endTime,
        location: scheduleItem.location,
        instructor: scheduleItem.createdBy?.name || 'غير محدد',
        color: '#34495e',
        icon: '🗓️'
      });
    });

    // ترتيب الأحداث حسب التاريخ
    calendarEvents.sort((a, b) => new Date(a.date) - new Date(b.date));

    // إحصائيات سريعة
    const stats = {
      totalLessons: lessons.length,
      totalTasks: tasks.length,
      totalQuizzes: quizzes.length,
      totalSchedule: schedule.length,
      urgentTasks: tasks.filter(task => {
        const daysUntilDue = Math.ceil((new Date(task.dueDate) - today) / (1000 * 60 * 60 * 24));
        return daysUntilDue <= 1;
      }).length,
      upcomingDeadlines: tasks.filter(task => {
        const daysUntilDue = Math.ceil((new Date(task.dueDate) - today) / (1000 * 60 * 60 * 24));
        return daysUntilDue <= 7 && daysUntilDue > 1;
      }).length
    };

    res.status(200).json({
      success: true,
      message: "تم جلب التقويم بنجاح",
      data: {
        student: {
          name: user.name,
          grade: user.grade
        },
        calendar: {
          events: calendarEvents,
          totalEvents: calendarEvents.length
        },
        stats,
        breakdown: {
          lessons: lessons.map(lesson => ({
            id: lesson._id,
            title: lesson.lessonTitle,
            unit: lesson.unitTitle,
            date: lesson.createdAt,
            instructor: lesson.createdBy?.name || 'غير محدد',
            url: lesson.videoUrl
          })),
          tasks: tasks.map(task => ({
            id: task._id,
            title: task.title,
            subject: task.subject,
            dueDate: task.dueDate,
            instructor: task.createdBy?.name || 'غير محدد',
            daysUntilDue: Math.ceil((new Date(task.dueDate) - today) / (1000 * 60 * 60 * 24))
          })),
          quizzes: quizzes.map(quiz => ({
            id: quiz._id,
            title: quiz.title,
            subject: quiz.subject,
            questions: quiz.questions?.length || 0,
            timeLimit: quiz.timeLimit,
            instructor: quiz.createdBy?.name || 'غير محدد',
            createdAt: quiz.createdAt
          })),
          schedule: schedule.map(item => ({
            id: item._id,
            subject: item.subject,
            date: item.date,
            startTime: item.startTime,
            endTime: item.endTime,
            location: item.location,
            instructor: item.createdBy?.name || 'غير محدد'
          }))
        }
      }
    });

  } catch (error) {
    console.error('خطأ في جلب التقويم:', error);
    res.status(500).json({
      success: false,
      message: "حدث خطأ أثناء جلب التقويم",
      error: error.message
    });
  }
};