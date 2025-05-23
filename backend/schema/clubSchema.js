import mongoose from "mongoose";

const clubSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    coordinators: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    events: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }]
  });
  
export const Club = mongoose.model("Club", clubSchema)