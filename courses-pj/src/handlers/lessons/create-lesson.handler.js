import { Lesson } from '../../models/lesson.js';

export const createLessonHandler = async (req, res) => {
  try {
    // السماح فقط للمعلم أو الأدمن
    if (!req.user || !['instructor','admin'].includes(req.user.role)) {
      return res.status(403).json({ message: 'غير مسموح: يجب أن تكون معلماً أو أدمن' });
    }

    const { grade, unitTitle, lessonTitle, videoUrl } = req.body;

    // ضمان عدم أخذ createdBy من العميل حتى لا يزور الهوية
    if (req.body.createdBy) {
      console.warn('[LESSON] تم تجاهل createdBy القادم من العميل. سيتم استخدام معرف المستخدم المصادق فقط.');
    }

    const creatorId = (req.user && (req.user._id || req.user.userId)) || null;
    if (!creatorId) {
      console.error('[LESSON] لا يوجد معرف مستخدم في req.user — تشخيص:', req.user);
      return res.status(500).json({ message: 'تعذر تحديد معرف المستخدم المنشئ للحصة، يرجى إعادة تسجيل الدخول' });
    }

    const lesson = await Lesson.create({
      grade,
      unitTitle,
      lessonTitle,
      videoUrl,
      createdBy: creatorId
    });

    return res.status(201).json({
      message: 'تم إنشاء الحصة بنجاح',
      lesson
    });
  } catch (error) {
    console.error('Create lesson error:', error);
    res.status(500).json({ message: 'حدث خطأ أثناء إنشاء الحصة', error: error.message });
  }
};
