import { EducationalMaterial } from '../../models/educational-material.js';

export const getEducationalMaterialsByGradeHandler = async (req, res) => {
  try {
    const { grade } = req.params;
    
    // إضافة pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // استعلام محسن مع فهرس grade
    const materials = await EducationalMaterial.find({ grade })
      .select('title link createdAt') // الحقول المطلوبة فقط
      .sort({ createdAt: -1 }) // استخدام الفهرس المركب
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await EducationalMaterial.countDocuments({ grade });

    res.status(200).json({ 
      success: true, 
      data: materials,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'حدث خطأ أثناء جلب المواد التعليمية للصف', error: error.message });
  }
};