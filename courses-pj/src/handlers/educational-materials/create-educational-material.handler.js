import { EducationalMaterial } from '../../models/educational-material.js';

export const createEducationalMaterialHandler = async (req, res) => {
  try {
    const { title, link, grade } = req.body;
    if (!title || !link || !grade) {
      return res.status(400).json({ success: false, message: 'جميع الحقول مطلوبة' });
    }
    const material = await EducationalMaterial.create({ title, link, grade });
    res.status(201).json({ success: true, message: 'تم إضافة المادة التعليمية بنجاح', data: material });
  } catch (error) {
    res.status(500).json({ success: false, message: 'حدث خطأ أثناء إضافة المادة التعليمية', error: error.message });
  }
};