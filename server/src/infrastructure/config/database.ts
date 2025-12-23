import mongoose from "mongoose";
import { logger } from "./logger.js";
import { env } from "./env.js";

export const connectDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(env.MONGODB_URI);
    logger.info("Database connected successfully");
  } catch (error) {
    logger.error({ error }, "Database connection failed");
    throw error;
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    logger.info("Database disconnected successfully");
  } catch (error) {
    logger.error({ error }, "Database disconnection failed");
    throw error;
  }
};
