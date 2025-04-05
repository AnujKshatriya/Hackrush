import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
    title: String,
    description: String,
    date: Date,
    time: String,
    venue: String,
    category: { type: String, enum: ['technical', 'cultural', 'sports', 'academic'] },
    posterUrl: String,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    club: { type: mongoose.Schema.Types.ObjectId, ref: 'Club' },
    approved: { type: Boolean, default: false },
    registeredStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
  });
  
  export const Event = mongoose.model("Event", eventSchema)