import { EducationalMaterial } from '../../models/educational-material.js';

export const getAllEducationalMaterialsHandler = async (req, res) => {
  try {
    // إضافة pagination للأداء الأفضل
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // استعلام محسن مع فهارس
    const materials = await EducationalMaterial.find()
      .select('title link grade createdAt') // تحديد الحقول المطلوبة فقط
      .sort({ createdAt: -1 }) // استخدام الفهرس
      .skip(skip)
      .limit(limit)
      .lean(); // استخدام lean للأداء الأفضل

    // عدد المواد الإجمالي
    const total = await EducationalMaterial.countDocuments();

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
    res.status(500).json({ success: false, message: 'حدث خطأ أثناء جلب المواد التعليمية', error: error.message });
  }
};