import express from 'express';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const PORT = process.env.PORT;
app.get('/auth/signup', (req, res) => {
  res.send('Hello from the signup');
});
app.get('/auth/login', (req, res) => {
  res.send('Hello from login');
});
app.get('/auth/logout', (req, res) => {
  res.send('Hello from the logout');
});

app.listen(PORT, () => {
  console.log('Server is running on port ' + PORT);
});
