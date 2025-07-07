import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.route.js';
import connectDB from './lib/db.js';
import cookieParser from 'cookie-parser';
import chatRoutes from './routes/chat.route.js';

dotenv.config();
const app = express();
app.use(express.json());
app.use(cookieParser());
const PORT = process.env.PORT;

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);

app.listen(PORT, () => {
  console.log('Server is running on port ' + PORT);
  connectDB();
});
// 1402301
