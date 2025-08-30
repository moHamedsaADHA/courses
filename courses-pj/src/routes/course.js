
import express from "express";
import { getAllCourses } from "../handlers/courses.handler/get-all-courses.handler.js";
import { createCourseHandler } from "../handlers/courses.handler/create-course.handler.js";
import { validateCourse } from "../validations/course.js";
import { updateCourseHandler } from "../handlers/courses.handler/update-course.handler.js";
import { deleteCourseHandler } from "../handlers/courses.handler/delete-course.handler.js";
import { getCourses } from "../handlers/courses.handler/git-courses.handler.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.middleware.js";
import { isAuthorized } from "../middlewares/isAuthorized.middleware.js";

export const coursesRouter = express.Router();

coursesRouter.get("/", getAllCourses);

coursesRouter.post("/", isAuthenticated, isAuthorized(["instructor", "admin"]), validateCourse, createCourseHandler);
coursesRouter.put("/:id", isAuthenticated, isAuthorized(["instructor", "admin"]), validateCourse, updateCourseHandler);
coursesRouter.delete("/:id", isAuthenticated, isAuthorized(["instructor", "admin"]), validateCourse, deleteCourseHandler);

coursesRouter.get("/list", validateCourse, getCourses);

