// Deck model -- 2026-06-30 11:49:35
import mongoose, { Document, Schema } from 'mongoose';

export interface IDeck extends Document {
  owner: string;
  repo: string;
  title: string;
  slides: Array<{ id: string; type: string; title: string; content: string[]; notes: string }>;
  analysis: Record<string, unknown>;
  format: 'pptx' | 'pdf' | 'html';
  downloadUrl?: string;
  createdAt: Date;
}

const SlideSchema = new Schema({ id: String, type: String, title: String, content: [String], notes: String }, { _id: false });

const DeckSchema = new Schema<IDeck>({
  owner: { type: String, required: true },
  repo: { type: String, required: true },
  title: { type: String, required: true },
  slides: [SlideSchema],
  analysis: Schema.Types.Mixed,
  format: { type: String, enum: ['pptx','pdf','html'], default: 'pptx' },
  downloadUrl: String,
}, { timestamps: true });

DeckSchema.index({ owner: 1, repo: 1 });

export const Deck = mongoose.model<IDeck>('Deck', DeckSchema);