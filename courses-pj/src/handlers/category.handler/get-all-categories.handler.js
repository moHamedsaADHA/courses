import { Category } from "../../models/category.js";

export const getAllCategoriesHandler = async (req, res, next) => {
	try {
		const categories = await Category.find();
		return res.status(200).json({ success: true, data: categories });
	} catch (error) {
		return next(error);
	}
};

