import { Notice } from "../schema/noticeSchema.js";


export const createNotice = async (req, res) => {
  try {
    const { title, content, category } = req.body;
    const notice = new Notice({
      title,
      content,
      category,
      postedBy: req.user._id
    });
    await notice.save();
    res.status(201).json(notice);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getNotices = async (req, res) => {
  try {
    const now = new Date();
    const notices = await Notice.find({ visibleUntil: { $gte: now } }).sort({ createdAt: -1 });
    res.json(notices);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
