import { EducationalMaterial } from '../../models/educational-material.js';

export const updateEducationalMaterialHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, link, grade } = req.body;
    const material = await EducationalMaterial.findByIdAndUpdate(
      id,
      { title, link, grade },
      { new: true, runValidators: true }
    );
    if (!material) {
      return res.status(404).json({ success: false, message: 'المادة التعليمية غير موجودة' });
    }
    res.status(200).json({ success: true, message: 'تم تحديث المادة التعليمية بنجاح', data: material });
  } catch (error) {
    res.status(500).json({ success: false, message: 'حدث خطأ أثناء تحديث المادة التعليمية', error: error.message });
  }
};