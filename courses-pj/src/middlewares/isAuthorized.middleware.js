export const isAuthorized = (allowedRoles = []) => {
	return (req, res, next) => {
		const role = (req.user && req.user.role) || req.user?.role || null;

		if (!role) {
			return res.status(403).json({ message: "Forbidden: no role" });
		}

		if (allowedRoles.length === 0) return next();

		if (allowedRoles.includes(role)) return next();

		return res.status(403).json({ message: "Forbidden: insufficient permissions" });
	};
};


