import { Event } from '../schema/eventSchema.js';
import { Club } from '../schema/clubSchema.js';

// Create Event - Admin or ClubCoordinator
export const createEvent = async (req, res) => {
  try {
    const { title, description, date, time, venue, category, posterUrl} = req.body;

    if (!title || !description || !date || !time || !venue || !category) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newEvent = new Event({
      title,
      description,
      date,
      time,
      venue,
      category,
      posterUrl,
      createdBy: req.user._id,
      club: req.user.clubAffiliations.name,
    });
    await newEvent.save();

    res.status(201).json({ message: "Event created", event: newEvent });
  } catch (err) {
    res.status(500).json({ error: "Error creating event" });
  }
};

// Delete Event - Admin or Coordinator who created it
export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    await event.remove();
    res.json({ message: 'Event deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: "Error deleting event" });
  }
};

// Approve or Reject Event - Only Admin
export const approveEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { approve } = req.body; // approve = true/false

    const event = await Event.findByIdAndUpdate(id, { approved: approve }, { new: true });
    res.json({ message: approve ? 'Event approved' : 'Event rejected', event });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update event approval' });
  }
};

// Get All Approved Events (visible to students)
export const getApprovedEvents = async (req, res) => {
  try {
    const events = await Event.find({ approved: true }).populate('club createdBy', 'name email');
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching events' });
  }
};

// RSVP to Event - Student
export const rsvpEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const event = await Event.findById(eventId);

    if (!event) return res.status(404).json({ message: 'Event not found' });
    if (!event.approved) return res.status(403).json({ message: 'Event not approved yet' });

    if (event.registeredStudents.includes(req.user._id)) {
      return res.status(400).json({ message: 'Already registered' });
    }

    event.registeredStudents.push(req.user._id);
    await event.save();

    res.json({ message: 'RSVP successful', event });
  } catch (err) {
    res.status(500).json({ error: 'Failed to RSVP' });
  }
};
