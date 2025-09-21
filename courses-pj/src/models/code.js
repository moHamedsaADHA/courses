import mongoose from 'mongoose';

const codeSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  role: { type: String, enum: ['admin', 'instructor', 'student'], required: true },
  used: { type: Boolean, default: false },
  usedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

export const Code = mongoose.model('Code', codeSchema);
