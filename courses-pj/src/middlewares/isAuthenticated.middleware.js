
import jwt from "jsonwebtoken";
import { environment } from "../config/server.config.js";

export const isAuthenticated = (req, res, next) => {
	const header = req.headers.authorization || req.headers.Authorization;
	if (!header || !header.startsWith("Bearer ")) {
		return res.status(401).json({ message: "No token provided" });
	}

	const token = header.split(" ")[1];

	jwt.verify(token, environment.JWT_SECRET, (err, decoded) => {
		if (err) {
			return res.status(401).json({ message: "Invalid or expired token" });
		}

		req.user = decoded || {};
		next();
	});
};
