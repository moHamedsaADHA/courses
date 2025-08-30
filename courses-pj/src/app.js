import express from "express";
import { connectDB } from "./config/db.js";
import { environment } from "./config/server.config.js";

import { coursesRouter } from "./routes/course.js";
import { categoryRouter } from "./routes/category.js";
import { userRouter as usersRouter } from "./routes/auth-routes/user.js";

import { registerUserHandler } from "./handlers/users/register.js";
import { registerUserValidation } from "./validations/auth-register/user.js";

import { validateUserLogin } from "./validations/auth-login/user.js";
import { loginUserHandler } from "./handlers/users/login.js";
import { globalErrorHandler } from "./middlewares/globalError.middleware.js";

const app = express();
app.use(express.json());

connectDB();

app.use("/api/courses", coursesRouter); 
app.use("/api/categories", categoryRouter); 
app.use("/api/users", usersRouter); 

app.use("/api/register", registerUserValidation, registerUserHandler);
app.use("/api/login", validateUserLogin, loginUserHandler);

app.use(globalErrorHandler);

app.listen(environment.SERVER_PORT, () => {
  console.log(`Server is running on port ${environment.SERVER_PORT}`);
});
