import { EducationalMaterial } from '../../models/educational-material.js';

export const deleteEducationalMaterialHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const material = await EducationalMaterial.findByIdAndDelete(id);
    if (!material) {
      return res.status(404).json({ success: false, message: 'المادة التعليمية غير موجودة' });
    }
    res.status(200).json({ success: true, message: 'تم حذف المادة التعليمية بنجاح' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'حدث خطأ أثناء حذف المادة التعليمية', error: error.message });
  }
};