import { environment } from "../../config/server.config.js";
import { User } from "../../models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const loginUserHandler = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return res.status(401).json({ message: "Incorrect email or password" });
  }

  const isPasswordCorrect = await bcrypt.compare(
    req.body.password,
    user.password
  );

  if (!isPasswordCorrect) {
    return res.status(401).json({ message: "Incorrect email or password" });
  }

  const token = jwt.sign(
    { userId: user._id, role: user.role, courseId: user.courseId },
    environment.JWT_SECRET,
    { expiresIn: environment.JWT_EXPIRES_IN }
  );

  res.status(200).json({
    message: "Login successful",
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      courseId: user.courseId,
    },
    token,
  });
};
