import { Lesson } from '../../models/lesson.js';

export const deleteLessonHandler = async (req, res) => {
  try {
    if (!req.user || !['instructor','admin'].includes(req.user.role)) {
      return res.status(403).json({ message: 'غير مسموح' });
    }
    const { id } = req.params;
    const lesson = await Lesson.findById(id);
    if (!lesson) return res.status(404).json({ message: 'لم يتم العثور على الحصة' });

    if (req.user.role !== 'admin' && lesson.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'غير مصرح لك بحذف هذه الحصة' });
    }

    await lesson.deleteOne();
    res.json({ message: 'تم حذف الحصة بنجاح' });
  } catch (error) {
    console.error('Delete lesson error:', error);
    res.status(500).json({ message: 'خطأ أثناء حذف الحصة', error: error.message });
  }
};
