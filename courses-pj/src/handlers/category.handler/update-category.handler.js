import { Category } from "../../models/category.js";

export const updateCategoryHandler = async (req, res, next) => {
	try {
		const { id } = req.params;
		const { name } = req.body;
		const category = await Category.findByIdAndUpdate(id, { name }, { new: true });
		if (!category) return res.status(404).json({ success: false, message: "Category not found" });
		return res.status(200).json({ success: true, data: category });
	} catch (error) {
		return next(error);
	}
};

