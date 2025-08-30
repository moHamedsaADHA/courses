import { environment } from "../../config/server.config.js";
import { User } from "../../models/user.js";
import jwt from "jsonwebtoken";

export const registerUserHandler = async (req, res, next) => {
  const user = await User.create({
    name: req.body.name,
    password: req.body.password,
    email: req.body.email,
    role: req.body.role,
    phone: req.body.phone,
  });

  const token = jwt.sign(
    {
      userId: user._id,
      role: user.role,
      courseId: user.courseId,
    },
    environment.JWT_SECRET,
    { expiresIn: environment.JWT_EXPIRES_IN }
  );

  const userObj = user.toObject ? user.toObject() : user;
  delete userObj.password;

  res.status(201).json({ user: userObj, token });
};
