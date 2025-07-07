import express from 'express';
import { signup, login, logout } from '../controller/auth.controller.js';
import { onboard } from '../controller/auth.controller.js';
import protectedRoute from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);

router.get('/me', protectedRoute, (req, res) => {
  res.status(200).json({ authorized: true, user: req.user });
});

router.post('/onboarding', protectedRoute, onboard);

export default router;
