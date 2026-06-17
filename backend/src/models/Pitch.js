import mongoose from 'mongoose';

const slideSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ['title', 'problem', 'solution', 'howItWorks', 'techStack', 'market', 'traction', 'roadmap', 'team', 'ask'],
    },
    order: { type: Number, required: true },
    // Generic content fields — each slide type uses a subset
    headline: String,
    subheadline: String,
    body: String,
    points: [String],
    items: [mongoose.Schema.Types.Mixed],
  },
  { _id: false }
);

const repoMetaSchema = new mongoose.Schema(
  {
    owner: String,
    repo: String,
    fullName: String,
    description: String,
    stars: Number,
    forks: Number,
    language: String,
    languages: mongoose.Schema.Types.Mixed,
    topics: [String],
    license: String,
    defaultBranch: String,
    homepage: String,
    createdAt: String,
    pushedAt: String,
  },
  { _id: false }
);

const pitchSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    tagline: {
      type: String,
      default: '',
      maxlength: 200,
    },
    repoUrl: {
      type: String,
      required: true,
    },
    repoMeta: repoMetaSchema,
    slides: [slideSchema],
    theme: {
      type: String,
      enum: ['dark', 'light', 'ocean', 'forest', 'sunset'],
      default: 'dark',
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    views: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['generating', 'ready', 'error'],
      default: 'generating',
    },
    slug: {
      type: String,
      unique: true,
      sparse: true,
    },
    exportedAt: Date,
  },
  { timestamps: true }
);

pitchSchema.index({ owner: 1, createdAt: -1 });
pitchSchema.index({ isPublic: 1, createdAt: -1 });
pitchSchema.index({ slug: 1 });

pitchSchema.set('toJSON', {
  transform(doc, ret) {
    delete ret.__v;
    return ret;
  },
});

export default mongoose.model('Pitch', pitchSchema);
