
import jwt from "jsonwebtoken";
import { User } from "../models/user.js";
import { environment } from "../config/server.config.js";

export const isAuthenticated = async (req, res, next) => {
	try {
		const header = req.headers.authorization || req.headers.Authorization;
		if (!header || !header.startsWith("Bearer ")) {
			return res.status(401).json({ message: "لا يوجد رمز مصادقة" });
		}

		const token = header.split(" ")[1];

		jwt.verify(token, environment.JWT_SECRET, async (err, decoded) => {
			if (err) {
				return res.status(401).json({ message: "رمز المصادقة غير صالح أو منتهي الصلاحية" });
			}

			// التحقق من وجود المستخدم في قاعدة البيانات
			const user = await User.findById(decoded.userId);
			if (!user) {
				return res.status(404).json({ message: "المستخدم غير موجود" });
			}

			// التحقق من تفعيل الحساب (إلا إذا كان توكن مؤقت)
			if (!decoded.isTemporary && !user.isVerified) {
				return res.status(403).json({ 
					message: "يجب تفعيل الحساب أولاً",
					requiresVerification: true,
					userEmail: user.email
				});
			}

			req.user = decoded || {};
			req.userDoc = user; // إضافة معلومات المستخدم الكاملة
			next();
		});
	} catch (error) {
		console.error('Authentication middleware error:', error);
		res.status(500).json({ message: "خطأ في التحقق من المصادقة" });
	}
};
