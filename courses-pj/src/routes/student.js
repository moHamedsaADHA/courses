import express from "express";
import { validationResult as expressValidationResult } from "express-validator";
import { isAuthenticated } from "../middlewares/isAuthenticated.middleware.js";

export const studentRouter = express.Router();

const validationResult = (req, res, next) => {
  const errors = expressValidationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

studentRouter.get("/", isAuthenticated, validationResult, (req, res) => res.json({ message: "student area" }));
