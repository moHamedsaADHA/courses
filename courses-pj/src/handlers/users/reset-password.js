import { User } from "../../models/user.js";
import jwt from "jsonwebtoken";
import { environment } from "../../config/server.config.js";
import { emailService } from "../../services/email.service.js";


export const requestPasswordResetHandler = async (req, res, next) => {
	try {
		const { email } = req.body;
		if (!email) return res.status(400).json({ message: "البريد الإلكتروني مطلوب" });

		const user = await User.findOne({ email });
		if (!user) return res.status(404).json({ message: "المستخدم غير موجود" });

		const token = jwt.sign({ userId: user._id }, environment.JWT_SECRET, { expiresIn: '1h' });

		try {
			// إرسال رابط إعادة التعيين عبر البريد الإلكتروني
			await emailService.sendPasswordResetEmail(user.email, user.name, token);
			return res.status(200).json({ 
				message: "تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني",
				emailSent: true 
			});
		} catch (emailError) {
			console.error('Error sending password reset email:', emailError);
			// إرجاع الرمز في الاستجابة إذا فشل إرسال البريد
			return res.status(200).json({ 
				message: "تم إنشاء رمز إعادة تعيين كلمة المرور",
				token,
				emailSent: false,
				note: "فشل إرسال البريد الإلكتروني، يمكنك استخدام الرمز أدناه" 
			});
		}
	} catch (error) {
		return next(error);
	}
};

export const performPasswordResetHandler = async (req, res, next) => {
	try {
		const { token, newPassword } = req.body;
		if (!token || !newPassword) return res.status(400).json({ message: "token and newPassword are required" });

		let payload;
		try {
			payload = jwt.verify(token, environment.JWT_SECRET);
		} catch (err) {
			return res.status(400).json({ message: "Invalid or expired token" });
		}

		const user = await User.findById(payload.userId);
		if (!user) return res.status(404).json({ message: "User not found" });

		user.password = newPassword;
		await user.save();

		return res.status(200).json({ message: "Password has been reset" });
	} catch (error) {
		return next(error);
	}
};

