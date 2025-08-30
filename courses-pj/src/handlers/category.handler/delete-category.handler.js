import { Category } from "../../models/category.js";

export const deleteCategoryHandler = async (req, res, next) => {
	try {
		const { id } = req.params;
		const category = await Category.findByIdAndDelete(id);
		if (!category) return res.status(404).json({ success: false, message: "Category not found" });
		return res.status(200).json({ success: true, data: category });
	} catch (error) {
		return next(error);
	}
};

