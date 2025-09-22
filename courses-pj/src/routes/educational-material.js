import express from 'express';
import { createEducationalMaterialHandler } from '../handlers/educational-materials/create-educational-material.handler.js';
import { getAllEducationalMaterialsHandler } from '../handlers/educational-materials/get-all-educational-materials.handler.js';
import { getEducationalMaterialsByGradeHandler } from '../handlers/educational-materials/get-educational-materials-by-grade.handler.js';
import { updateEducationalMaterialHandler } from '../handlers/educational-materials/update-educational-material.handler.js';
import { deleteEducationalMaterialHandler } from '../handlers/educational-materials/delete-educational-material.handler.js';

const router = express.Router();

// إضافة مادة تعليمية جديدة
router.post('/', createEducationalMaterialHandler);

// جلب جميع المواد التعليمية
router.get('/', getAllEducationalMaterialsHandler);

// جلب المواد التعليمية حسب الصف
router.get('/grade/:grade', getEducationalMaterialsByGradeHandler);

// تحديث مادة تعليمية
router.put('/:id', updateEducationalMaterialHandler);

// حذف مادة تعليمية
router.delete('/:id', deleteEducationalMaterialHandler);

export default router;
