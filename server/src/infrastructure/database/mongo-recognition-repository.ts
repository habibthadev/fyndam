import type { RecognitionRepository } from "../../domain/recognition-repository.js";
import type {
  Recognition,
  CreateRecognition,
} from "../../domain/recognition.js";
import { RecognitionModel } from "./recognition-model.js";

export class MongoRecognitionRepository implements RecognitionRepository {
  async create(recognition: CreateRecognition): Promise<Recognition> {
    const doc = await RecognitionModel.create(recognition);
    return this.toRecognition(doc);
  }

  async findById(id: string): Promise<Recognition | null> {
    const doc = await RecognitionModel.findById(id).lean();
    return doc ? this.toRecognition(doc) : null;
  }

  async findAll(limit = 50, offset = 0): Promise<Recognition[]> {
    const docs = await RecognitionModel.find()
      .sort({ timestamp: -1 })
      .skip(offset)
      .limit(limit)
      .lean();

    return docs.map((doc) => this.toRecognition(doc));
  }

  async count(): Promise<number> {
    return RecognitionModel.countDocuments();
  }

  private toRecognition(doc: any): Recognition {
    return {
      id: doc._id.toString(),
      timestamp: doc.timestamp,
      inputType: doc.inputType,
      auddResponse: doc.auddResponse,
      audioMetadata: doc.audioMetadata,
      confidence: doc.confidence,
    };
  }
}
