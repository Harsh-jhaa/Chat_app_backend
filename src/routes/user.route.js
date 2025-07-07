import express from 'express';
import protectedRoute from '../middleware/auth.middleware.js';

import {
  getRecommendedUsers,
  getMyFriends,
  sendFriendRequest,
  acceptFriendRequest,
  getFriendRequests,
  getOutgoingFriendRequests,
} from '../controller/user.controller.js';

const router = express.Router();

// below line implements the protected route middleware to all routes in this file
router.use(protectedRoute);

router.get('/', getRecommendedUsers);
router.get('/friends', getMyFriends);
router.post('/friend-request/:id', sendFriendRequest);
router.put('/friend-request/:id/accept', acceptFriendRequest);
router.get('/friend-requests', getFriendRequests);
router.get('/outgoing-friend-requests', getOutgoingFriendRequests);

export default router;
