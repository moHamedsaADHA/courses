import { User } from "../models/user.js";
import { jwtService } from "../services/jwt.service.js";

export const isAuthenticated = async (req, res, next) => {
	try {
		const header = req.headers.authorization || req.headers.Authorization;
		if (!header || !header.startsWith("Bearer ")) {
			return res.status(401).json({ message: "لا يوجد رمز مصادقة" });
		}

		const token = header.split(" ")[1];
		
		// استخدام JWT Service الجديد للتحقق من الـ Access Token
		const verificationResult = jwtService.verifyAccessToken(token);
		if (!verificationResult.valid) {
			if (verificationResult.expired) {
				return res.status(401).json({ 
					message: "رمز المصادقة منتهي الصلاحية", 
					expired: true 
				});
			}
			return res.status(401).json({ message: "رمز المصادقة غير صالح أو منتهي الصلاحية" });
		}
		
		const decoded = verificationResult.decoded;

		// استخراج معرف المستخدم
		const userId = decoded.userId || decoded._id;
		if (!userId) {
			return res.status(401).json({ message: "رمز المصادقة لا يحتوي على معرف مستخدم" });
		}

		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({ message: "المستخدم غير موجود" });
		}

		if (!decoded.isTemporary && !user.isVerified) {
			return res.status(403).json({
				message: "يجب تفعيل الحساب أولاً",
				requiresVerification: true,
				userEmail: user.email
			});
		}

		// بناء كائن مستخدم موحد لضمان توفر _id دائماً
		req.user = {
			_id: user._id,               // مهم للـ handlers
			userId: user._id,            // تناسق مع التوكن الحالي
			role: user.role,
			grade: user.grade,
			isVerified: user.isVerified,
			courseId: user.courseId
		};
		// احتفاظ بالنسخة الأصلية لمن قد يحتاج باقي الحقول
		req.userDoc = user;

		// تشخيص اختياري (يمكن تعطيله لاحقاً)
		// console.log('[AUTH] Authenticated user:', { id: user._id.toString(), role: user.role });

		next();
	} catch (error) {
		console.error('Authentication middleware error:', error);
		res.status(500).json({ message: "خطأ في التحقق من المصادقة" });
	}
};
