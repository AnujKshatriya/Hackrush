import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import authRoutes from "./route/auth.js";
import noticeRoutes from "./route/notice.js";
import clubRoutes from "./route/club.js";
import { authenticate } from './middleware/auth.js';
// import eventRoutes from "./route/event.js";

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT ;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});
app.get('/me', authenticate, (req, res) => {
  const {name,email,role} =req.user
  res.json({name,email,role})
});

app.use("/api/auth", authRoutes);

// Routes
app.use('/api/clubs', clubRoutes);
// app.use('/api/events', eventRoutes);
app.use('/api/notices', noticeRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});