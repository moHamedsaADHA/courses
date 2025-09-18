import { Lesson } from '../../models/lesson.js';

export const updateLessonHandler = async (req, res) => {
  try {
    if (!req.user || !['instructor','admin'].includes(req.user.role)) {
      return res.status(403).json({ message: 'غير مسموح' });
    }

    const { id } = req.params;
    const allowed = ['grade','unitTitle','lessonTitle','videoUrl'];
    const update = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) update[key] = req.body[key];
    }

    const lesson = await Lesson.findById(id);
    if (!lesson) return res.status(404).json({ message: 'لم يتم العثور على الحصة' });

    // لو ليس أدمن تأكد أنه صاحب الحصة
    if (req.user.role !== 'admin' && lesson.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'غير مصرح لك بتعديل هذه الحصة' });
    }

    Object.assign(lesson, update);
    await lesson.save();

    res.json({ message: 'تم تحديث الحصة', lesson });
  } catch (error) {
    console.error('Update lesson error:', error);
    res.status(500).json({ message: 'خطأ أثناء التحديث', error: error.message });
  }
};
