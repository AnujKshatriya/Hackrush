import { Notice } from "../schema/noticeSchema.js";


export const createNotice = async (req, res) => {
  const { title, content, category } = req.body;

  if (!title || !content || !category) {
    return res.status(400).json({ message: 'Missing fields' });
  }
  console.log("1")
  try {
    const notice = new Notice({
      title,
      content,
      category,
      postedBy: req.user._id,
    });
    console.log("2")
    await notice.save();
    console.log("3")
    res.status(201).json(notice);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create notice' });
  }
};

export const getNotices = async (req, res) => {
  try {
    const notices = await Notice.find().populate('postedBy', 'name email role');
    res.json(notices);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteNotices = async (req, res) => {
  const noticeId = req.params.id;

  try {
    const deleted = await Notice.findByIdAndDelete(noticeId);
    if (!deleted) return res.status(404).json({ message: 'Notice not found' });

    res.json({ message: 'Notice deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete notice' });
  }
};
