import { EducationalMaterial } from '../../models/educational-material.js';

export const getEducationalMaterialsByGradeHandler = async (req, res) => {
  try {
    const { grade } = req.params;
    const materials = await EducationalMaterial.find({ grade }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: materials });
  } catch (error) {
    res.status(500).json({ success: false, message: 'حدث خطأ أثناء جلب المواد التعليمية للصف', error: error.message });
  }
};