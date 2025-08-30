import { User } from "../../models/user.js";
import jwt from "jsonwebtoken";
import { environment } from "../../config/server.config.js";


export const requestPasswordResetHandler = async (req, res, next) => {
	try {
		const { email } = req.body;
		if (!email) return res.status(400).json({ message: "email is required" });

		const user = await User.findOne({ email });
		if (!user) return res.status(404).json({ message: "User not found" });

		const token = jwt.sign({ userId: user._id }, environment.JWT_SECRET, { expiresIn: '1h' });

		// TODO: send token via email using email.service; for now return token in response
		return res.status(200).json({ message: "Password reset token generated", token });
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

