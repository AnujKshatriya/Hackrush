import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import authRoutes from "./route/auth.js";

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
app.use("/api/auth", authRoutes);

// Routes
app.use('/api/clubs', clubRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/notices', noticeRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});