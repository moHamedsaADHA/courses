import express from "express";
import { registerUserValidation } from "../../validations/auth-register/user.js";
import { registerUserHandler } from "../../handlers/users/register.js";
import { loginUserHandler } from "../../handlers/users/login.js";
import { validateUserLogin } from "../../validations/auth-login/user.js";
import { changePasswordHandler } from "../../handlers/users/change-password.js";
import {
  requestPasswordResetHandler,
  performPasswordResetHandler,
} from "../../handlers/users/reset-password.js";
import {
  forgotPasswordHandler,
  resetPasswordHandler
} from "../../handlers/users/forgot-password.js";
import {
  verifyOTPHandler,
  resendOTPHandler,
} from "../../handlers/users/verify-otp.js";
import {
  validateVerifyOTP,
  validateResendOTP,
} from "../../validations/otp.js";
import {
  refreshTokenHandler,
  logoutHandler,
} from "../../handlers/users/refresh-token.js";
import { getAllUsersHandler } from "../../handlers/users/get-all-users.handler.js";
import { isAuthenticated } from "../../middlewares/isAuthenticated.middleware.js";
import { isAuthorized } from "../../middlewares/isAuthorized.middleware.js";

export const userRouter = express.Router();

import { validationResult as expressValidationResult } from "express-validator";

const validationResult = (req, res, next) => {
  const errors = expressValidationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

userRouter.post(
  "/",
  registerUserValidation,
  validationResult,
  registerUserHandler
);

userRouter.post(
  "/login",
  validateUserLogin,
  validationResult,
  loginUserHandler
);


userRouter.post("/change-password", changePasswordHandler);
userRouter.post("/reset-password/request", requestPasswordResetHandler);
userRouter.post("/reset-password/perform", performPasswordResetHandler);

// Forgot Password Routes (New Implementation)
userRouter.post("/forgot-password", forgotPasswordHandler);
userRouter.post("/reset-password", resetPasswordHandler);

// OTP Routes
userRouter.post("/verify-otp", validateVerifyOTP, verifyOTPHandler);
userRouter.post("/resend-otp", validateResendOTP, resendOTPHandler);

// Refresh Token Routes
userRouter.post("/refresh-token", refreshTokenHandler);
userRouter.post("/logout", logoutHandler);

// Get All Users Route - للإداريين فقط
userRouter.get(
  "/all", 
  isAuthenticated, 
  isAuthorized(['admin']), 
  getAllUsersHandler
);
