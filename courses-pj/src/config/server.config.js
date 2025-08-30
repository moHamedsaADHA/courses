import dotenv from "dotenv";

dotenv.config();

const SERVER_PORT = process.env.PORT || 3000;

const DB_URL = process.env.DB_URL || "mongodb://localhost:27017/coursesdb";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

const CORS_ORIGIN = process.env.CORS_ORIGIN || "*";

const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

export const environment = {
  SERVER_PORT,
  DB_URL,
  JWT_SECRET,
  JWT_EXPIRES_IN,
  CORS_ORIGIN,
  EMAIL_USER,
  EMAIL_PASS,
};
