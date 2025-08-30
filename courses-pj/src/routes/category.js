
import express from "express";
import {
	createCategoryHandler,
} from "../handlers/category.handler/create-category.handler.js";
import { getAllCategoriesHandler } from "../handlers/category.handler/get-all-categories.handler.js";
import { getCategoryHandler } from "../handlers/category.handler/get-category.handler.js";
import { updateCategoryHandler } from "../handlers/category.handler/update-category.handler.js";
import { deleteCategoryHandler } from "../handlers/category.handler/delete-category.handler.js";

const router = express.Router();

router.post("/", createCategoryHandler);
router.get("/", getAllCategoriesHandler);
router.get("/:id", getCategoryHandler);
router.put("/:id", updateCategoryHandler);
router.delete("/:id", deleteCategoryHandler);

export const categoryRouter = router;

