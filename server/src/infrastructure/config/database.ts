import mongoose from "mongoose";
import { logger } from "./logger.js";
import { env } from "./env.js";

// Global cache for serverless environments
let isConnected = false;
let connectionPromise: Promise<void> | null = null;

export const connectDatabase = async (): Promise<void> => {
  if (isConnected && mongoose.connection.readyState === 1) {
    logger.info("Using existing database connection");
    return;
  }

  if (connectionPromise) {
    logger.info("Waiting for existing connection attempt");
    return connectionPromise;
  }

  if (
    mongoose.connection.readyState === 2 ||
    mongoose.connection.readyState === 3
  ) {
    logger.warn("Connection in transitional state, resetting...");
    try {
      await mongoose.disconnect();
    } catch (error) {
      logger.error({ error }, "Error disconnecting stale connection");
    }
    isConnected = false;
  }

  connectionPromise = (async () => {
    try {
      mongoose.set("strictQuery", false);

      const options = {
              maxPoolSize: 10,
      minPoolSize: 2,
      serverSelectionTimeoutMS: 3000,
      socketTimeoutMS: 30000,
      connectTimeoutMS: 3000,
      waitQueueTimeoutMS: 5000,
      retryWrites: true,
      retryReads: true,
      };

      logger.info("Initiating database connection...");
      await mongoose.connect(env.MONGODB_URI, options);

      isConnected = true;
      logger.info("Database connected successfully");

      mongoose.connection.on("disconnected", () => {
        logger.warn("Database disconnected");
        isConnected = false;
        connectionPromise = null;
      });

      mongoose.connection.on("error", (error) => {
        logger.error({ error }, "Database connection error");
        isConnected = false;
        connectionPromise = null;
      });
    } catch (error) {
      isConnected = false;
      connectionPromise = null;
      logger.error(
        {
          error,
          errorMessage:
            error instanceof Error ? error.message : "Unknown error",
          mongoUri: env.MONGODB_URI.replace(
            /\/\/([^:]+):([^@]+)@/,
            "//$1:****@"
          ), // Hide password in logs
        },
        "Database connection failed"
      );
      throw error;
    }
  })();

  return connectionPromise;
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
