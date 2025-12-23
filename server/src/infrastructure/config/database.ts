import mongoose from "mongoose";
import { logger } from "./logger.js";
import { env } from "./env.js";

let isConnected = false;

export const connectDatabase = async (): Promise<void> => {
  if (isConnected && mongoose.connection.readyState === 1) {
    logger.info("Using existing database connection");
    return;
  }

  try {
    mongoose.set("strictQuery", false);

    await mongoose.connect(env.MONGODB_URI, {
      bufferCommands: false,
      maxPoolSize: 10,
    });

    isConnected = true;
    logger.info("Database connected successfully");
  } catch (error) {
    isConnected = false;
    logger.error({ error }, "Database connection failed");
    throw error;
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    isConnected = false;
    logger.info("Database disconnected successfully");
  } catch (error) {
    logger.error({ error }, "Database disconnection failed");
    throw error;
  }
};

export const getDatabaseStatus = (): {
  isConnected: boolean;
  readyState: string;
  readyStateCode: number;
} => {
  const readyStateMap: Record<number, string> = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting",
  };

  const readyStateCode = mongoose.connection.readyState;

  return {
    isConnected: isConnected && readyStateCode === 1,
    readyState: readyStateMap[readyStateCode] || "unknown",
    readyStateCode,
  };
};
