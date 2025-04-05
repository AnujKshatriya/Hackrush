import { Event } from '../schema/eventSchema.js';
import { Club } from '../schema/clubSchema.js';

// Create Event - Admin or ClubCoordinator
export const createEvent = async (req, res) => {
  try {
    const { title, description, date, time, venue, category, posterUrl} = req.body;

    if (!title || !description || !date || !time || !venue || !category) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const club1 = await Club.findById(req.user.clubAffiliations[0]);

    const newEvent = new Event({
      title,
      description,
      date,
      time,
      venue,
      category,
      posterUrl,
      createdBy: req.user._id,
      club: club1,
    });
    await newEvent.save();
    console.log(newEvent)
    club1.events.push(newEvent._id);
    await club1.save();
    
    
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

    const event = await Event.findByIdAndUpdate(id, { approved: true }, { new: true });
    res.json({ message: true ? 'Event approved' : 'Event rejected', event });
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

export const getUnapprovedEvents = async (req, res) => {
  try {
    const events = await Event.find({ approved: false }).populate('club createdBy', 'name email');
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching events' });
  }
};

export const getEvents = async (req, res) => {
  try {
    const events = await Event.find({}).populate('club createdBy', 'name email');
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching events' });
  }
};


// RSVP to Event - Student
export const rsvpEvent = async (req, res) => {
  try {
    console.log(1)
    const { eventId } = req.params;
    const event = await Event.findById(eventId);
    console.log(event)
    if (!event) return res.status(404).json({ message: 'Event not found' });
    if (!event.approved) return res.status(403).json({ message: 'Event not approved yet' });
    console.log("h1")
    if (event.registeredStudents.map(id => id.toString()).includes(req.user._id.toString())) {
      return res.status(400).json({ message: 'Already registered' });
    }      
    console.log("h")
    event.registeredStudents.push(req.user._id);
    await event.save();

    res.json({ message: 'RSVP successful', event });
  } catch (err) {
    res.status(500).json({ error: 'Failed to RSVP' });
  }
};
