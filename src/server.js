import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import connectDB from './lib/db.js';

dotenv.config();
const app = express();
app.use(express.json());
const PORT = process.env.PORT;

app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
  console.log('Server is running on port ' + PORT);
  connectDB();
});
// 1402301
