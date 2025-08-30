import { User } from "../../models/user.js";
import bcrypt from "bcryptjs";

export const changePasswordHandler = async (req, res, next) => {
	try {
		const { email, oldPassword, newPassword } = req.body;

		if (!email || !oldPassword || !newPassword) {
			return res.status(400).json({ message: "email, oldPassword and newPassword are required" });
		}

		const user = await User.findOne({ email });
		if (!user) return res.status(404).json({ message: "User not found" });

		const isMatch = await bcrypt.compare(oldPassword, user.password);
		if (!isMatch) return res.status(401).json({ message: "Incorrect old password" });

		user.password = newPassword;
		await user.save();

		return res.status(200).json({ message: "Password changed successfully" });
	} catch (error) {
		return next(error);
	}
};

