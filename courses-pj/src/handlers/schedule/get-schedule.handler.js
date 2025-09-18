import { Schedule } from '../../models/schedule.js';

export const getScheduleHandler = async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.id)
      .populate('instructor', 'name email')
      .populate('createdBy', 'name email');
    
    if (!schedule) {
      return res.status(404).json({ message: 'لم يتم العثور على الجدولة' });
    }
    
    res.json({ schedule });
  } catch (error) {
    console.error('Get schedule error:', error);
    res.status(500).json({ message: 'خطأ في جلب الجدولة', error: error.message });
  }
};