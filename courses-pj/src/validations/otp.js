import Joi from "joi";

// Validation للتحقق من OTP
export const verifyOTPValidation = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      'string.email': 'يرجى إدخال بريد إلكتروني صالح',
      'any.required': 'البريد الإلكتروني مطلوب'
    }),
  otp: Joi.string()
    .length(6)
    .pattern(/^[0-9]{6}$/)
    .required()
    .messages({
      'string.length': 'رمز التحقق يجب أن يكون 6 أرقام',
      'string.pattern.base': 'رمز التحقق يجب أن يحتوي على أرقام فقط',
      'any.required': 'رمز التحقق مطلوب'
    })
});

// Validation لإعادة إرسال OTP
export const resendOTPValidation = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      'string.email': 'يرجى إدخال بريد إلكتروني صالح',
      'any.required': 'البريد الإلكتروني مطلوب'
    })
});

// Middleware للتحقق من صحة البيانات
export const validateVerifyOTP = (req, res, next) => {
  const { error } = verifyOTPValidation.validate(req.body);
  if (error) {
    return res.status(400).json({
      message: 'بيانات غير صالحة',
      errors: error.details.map(detail => detail.message)
    });
  }
  next();
};

export const validateResendOTP = (req, res, next) => {
  const { error } = resendOTPValidation.validate(req.body);
  if (error) {
    return res.status(400).json({
      message: 'بيانات غير صالحة',
      errors: error.details.map(detail => detail.message)
    });
  }
  next();
};