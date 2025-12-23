import mongoose, { Schema, Document } from "mongoose";
import type { Recognition } from "../../domain/recognition.js";

interface RecognitionDocument extends Omit<Recognition, "id">, Document {}

const recognitionSchema = new Schema<RecognitionDocument>(
  {
    timestamp: { type: Date, required: true, default: Date.now },
    inputType: { type: String, enum: ["upload", "live"], required: true },
    auddResponse: {
      type: Schema.Types.Mixed,
      required: true,
    },
    audioMetadata: {
      duration: { type: Number, required: true },
      format: { type: String, enum: ["mp3", "wav", "m4a"], required: true },
      size: { type: Number, required: true },
    },
    confidence: { type: Number, min: 0, max: 1 },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

recognitionSchema.index({ timestamp: -1 });

export const RecognitionModel = mongoose.model<RecognitionDocument>(
  "Recognition",
  recognitionSchema
);
