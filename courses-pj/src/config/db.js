import mongoose from "mongoose";
import { environment } from "./server.config.js";


const DB_CONNECTION = environment.DB_URL;

export const connectDB = async () => {
  try {
    await mongoose.connect(DB_CONNECTION, {
      useNewUrlParser: true,   
      useUnifiedTopology: true 
    });

    console.log("MongoDB connected...");
  } catch (err) {
    console.error("MongoDB connection error:", err?.message || err);
    // In serverless (Vercel), avoid exiting the process. Continue and let routes handle lack of DB.
    // throw err; // optionally rethrow in local dev if needed
  }

  mongoose.connection.on("disconnected", () => {
    console.warn("MongoDB disconnected");
  });

  mongoose.connection.on("reconnected", () => {
    console.log("MongoDB reconnected");
  });

  mongoose.connection.on("error", (err) => {
    console.error("MongoDB error:", err);
  });
};

