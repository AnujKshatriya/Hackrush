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

export const updateClub = async (req, res) => {
    const { clubId,coordinatorEmail } = req.body; // single email
    try {
        // 1. Find the user by email
        const user = await User.findOne({ email: coordinatorEmail });
        if (!user) {
            return res.status(404).json({ error: "User not found with this email" });
        }
        if (user.role === "Admin") {
            return res.status(403).json({ error: "Admin cannot be made a Club Coordinator" });
        }
        // 2. Get the current club
        const club = await Club.findById(clubId);
        if (!club) {
            return res.status(404).json({ error: "Club not found" });
        }
        // 3. Check if already a coordinator
        const isAlreadyCoordinator = club.coordinators.includes(user._id);
        if (isAlreadyCoordinator) {
            return res.status(400).json({ error: "User is already a coordinator" });
        }
        // 4. Add the user to coordinators array
        club.coordinators.push(user._id);
        await club.save();
        user.clubAffiliations.push(clubId);
        user.role='ClubCoordinator';
        await user.save();

        res.json({ message: "Coordinator added successfully", club });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to update coordinator" });
    }
};

export const removeClubCoordinator = async (req, res) => {
    const { clubId, coordinatorEmail } = req.body;
  
    try {
      const user = await User.findOne({ email: coordinatorEmail });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Check if user is currently a coordinator of this club
      const club = await Club.findById(clubId);
      if (!club) {
        return res.status(404).json({ message: "Club not found" });
      }
      if (user.role === "Admin") {
        return res.status(403).json({ error: "Admin cannot be made a Club Coordinator" });
      }
      const isCoordinator = club.coordinators.some((id) => id.equals(user._id));
      if (!isCoordinator) {
        return res.status(400).json({ message: "User is not a coordinator of this club" });
      }
  
      // Remove the user from coordinators
      club.coordinators.pull(user._id);
      await club.save();
  
      // Optionally downgrade the role if user is not a coordinator elsewhere
      const stillCoordinator = await Club.findOne({ coordinators: user._id });
      if (!stillCoordinator) {
        user.role = "Student";
        user.clubAffiliations.pull(clubId);
        await user.save();
      }
  
      res.json({ message: "Coordinator removed successfully" });
    } catch (err) {
      console.error("Remove Coordinator Error:", err);
      res.status(500).json({ error: "Error removing coordinator" });
    }
  };
  
  
