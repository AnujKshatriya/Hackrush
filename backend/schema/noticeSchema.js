import mongoose from 'mongoose';

const noticeSchema = new mongoose.Schema({
    title: String,
    content: String,
    category: { type: String, enum: ['academic', 'fee', 'club', 'general'] },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now }
  });

  export const Notice = mongoose.model("Notice", noticeSchema)
  