import { Schedule } from '../../models/schedule.js';

export const deleteScheduleHandler = async (req, res) => {
  try {
    if (!req.user || !['instructor', 'admin'].includes(req.user.role)) {
      return res.status(403).json({ message: 'غير مسموح' });
    }

    const { id } = req.params;
    const schedule = await Schedule.findById(id);
    
    if (!schedule) {
      return res.status(404).json({ message: 'لم يتم العثور على الجدولة' });
    }

    // التحقق من الصلاحية (صاحب الجدولة أو أدمن)
    if (req.user.role !== 'admin' && schedule.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'غير مصرح لك بحذف هذه الجدولة' });
    }

    await schedule.deleteOne();
    res.json({ message: 'تم حذف الجدولة بنجاح' });
  } catch (error) {
    console.error('Delete schedule error:', error);
    res.status(500).json({ message: 'خطأ أثناء حذف الجدولة', error: error.message });
  }
};