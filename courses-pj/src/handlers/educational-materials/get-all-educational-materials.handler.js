import { EducationalMaterial } from '../../models/educational-material.js';

export const getAllEducationalMaterialsHandler = async (req, res) => {
  try {
    const materials = await EducationalMaterial.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: materials });
  } catch (error) {
    res.status(500).json({ success: false, message: 'حدث خطأ أثناء جلب المواد التعليمية', error: error.message });
  }
};