import { Club } from "../schema/clubSchema.js";
import { User } from "../schema/userSchema.js";

// ✅ GET all clubs (public)
export const getClub = async (req, res) => {
  try {
    const clubs = await Club.find().populate("coordinators", "name email").populate("members", "name email");
    res.json(clubs);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch clubs" });
  }
};

// ✅ CREATE a club (Admin only)
export const createClub = async (req, res) => {
  const { name, description } = req.body;
  try {
    const club = new Club({ name, description });
    await club.save();
    res.status(201).json(club);
  } catch (err) {
    res.status(400).json({ error: "Failed to create club" });
  }
};

// ✅ DELETE a club (Admin only)
export const deleteClub = async (req, res) => {
  try {
    await Club.findByIdAndDelete(req.params.id);
    res.json({ message: "Club deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete club" });
  }
};

// ✅ UPDATE club coordinator (Admin only)
export const updateClub = async (req, res) =>{
  const { coordinatorEmails } = req.body; // pass an array of email IDs

  try {
    const coordinators = await User.find({ email: { $in: coordinatorEmails } });
    await Club.findByIdAndUpdate(req.params.id, { coordinators: coordinators.map(u => u._id) });

    res.json({ message: "Coordinators updated" });
  } catch (err) {
    res.status(400).json({ error: "Failed to update coordinators" });
  }
};

