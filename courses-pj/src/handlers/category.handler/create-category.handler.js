import { Category } from "../../models/category.js";

export const createCategoryHandler = async (req, res, next) => {
	try {
		const { name } = req.body;
		if (!name) return res.status(400).json({ success: false, message: "name is required" });

		const category = await Category.create({ name });
		return res.status(201).json({ success: true, data: category });
	} catch (error) {
		return next(error);
	}
};

