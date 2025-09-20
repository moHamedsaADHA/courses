import dotenv from "dotenv";

dotenv.config();

const SERVER_PORT = process.env.PORT || 3000;

const DB_URL = process.env.DB_URL || "mongodb://localhost:27017/coursesdb";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "supersecret_refresh";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

const CORS_ORIGIN = process.env.CORS_ORIGIN || "*";

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_SMTP_HOST = process.env.BREVO_SMTP_HOST || "smtp-relay.brevo.com";
const BREVO_SMTP_PORT = process.env.BREVO_SMTP_PORT || 587;
const BREVO_SMTP_USER = process.env.BREVO_SMTP_USER;
const BREVO_SMTP_PASS = process.env.BREVO_SMTP_PASS;
const EMAIL_FROM = process.env.EMAIL_FROM;
const EMAIL_FROM_NAME = process.env.EMAIL_FROM_NAME || "منصة الكورسات";
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

// Gmail SMTP الجديد (المجرب)
const EMAILTEST = process.env.EMAILTEST;
const APIKE = process.env.APIKE;
const EMAIL = process.env.EMAIL || "courses";

export const environment = {
  SERVER_PORT,
  DB_URL,
  JWT_SECRET,
  JWT_REFRESH_SECRET,
  JWT_EXPIRES_IN,
  CORS_ORIGIN,
  BREVO_API_KEY,
  BREVO_SMTP_HOST,
  BREVO_SMTP_PORT,
  BREVO_SMTP_USER,
  BREVO_SMTP_PASS,
  EMAIL_FROM,
  EMAIL_FROM_NAME,
  FRONTEND_URL,
  // Gmail SMTP الجديد
  EMAILTEST,
  APIKE,
  EMAIL,
};
