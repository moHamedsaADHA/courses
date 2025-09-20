import { User } from "../../models/user.js";
import bcrypt from "bcryptjs";

export const changePasswordHandler = async (req, res, next) => {
	try {
		const { email, oldPassword, newPassword } = req.body;

		if (!email || !oldPassword || !newPassword) {
			return res.status(400).json({ 
				success: false, 
				message: "البريد الإلكتروني وكلمة المرور القديمة والجديدة مطلوبة" 
			});
		}

		// التحقق من طول كلمة المرور الجديدة
		if (newPassword.length < 6) {
			return res.status(400).json({ 
				success: false, 
				message: "كلمة المرور الجديدة يجب أن تكون أطول من 6 أحرف" 
			});
		}

		// البحث عن المستخدم
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(404).json({ 
				success: false, 
				message: "المستخدم غير موجود" 
			});
		}

		// التحقق من كلمة المرور القديمة
		const isMatch = await bcrypt.compare(oldPassword, user.password);
		if (!isMatch) {
			return res.status(401).json({ 
				success: false, 
				message: "كلمة المرور القديمة غير صحيحة" 
			});
		}

		// تشفير كلمة المرور الجديدة
		const saltRounds = 10;
		const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

		// تحديث كلمة المرور فقط باستخدام findOneAndUpdate لتجنب validation للحقول الأخرى
		await User.findOneAndUpdate(
			{ email },
			{ password: hashedNewPassword },
			{ runValidators: false } // عدم تشغيل validation للحقول الأخرى
		);

		return res.status(200).json({ 
			success: true, 
			message: "تم تغيير كلمة المرور بنجاح" 
		});
		
	} catch (error) {
		console.error('❌ خطأ في تغيير كلمة المرور:', error);
		return res.status(500).json({ 
			success: false, 
			message: "خطأ في الخادم أثناء تغيير كلمة المرور" 
		});
	}
};

