import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ['Student', 'ClubCoordinator', 'Admin'], required: true },
  clubAffiliations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Club' }],
  googleId: String // For IITGN Google login
},{timestamps:true});


export const User = mongoose.model("User", userSchema)