import User from '../models/User.js';
import FriendRequest from '../models/FriendRequest.js';

const getRecommendedUsers = async (req, res) => {
  try {
    const currentUserId = req.user._id; // Get user ID from the request object
    const currentUser = req.user;

    const recommendedUsers = await User.find({
      $and: [
        { _id: { $ne: currentUserId } },
        { _id: { $nin: currentUser.friends } },
        { isOnBoarded: true },
      ],
    });
    res.status(200).json({ recommendedUsers });
  } catch (error) {
    console.error('Error fetching recommended users:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
const getMyFriends = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('friends')
      .populate(
        'friends',
        'fullName profilePicture   nativeLanguage learningLanguage  '
      );

    res.status(200).json(user.friends);
  } catch (error) {
    console.error('Error fetching friends:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const sendFriendRequest = async (req, res) => {
  try {
    const myId = req.user._id; // Get user ID from the request object

    // renamed id to recipientId for consistency
    const { id: recipientId } = req.params;

    //   Check if the recipientId is the same as myId, so as to prevent self-friend requests
    if (recipientId == myId) {
      return res
        .status(400)
        .json({ message: 'You cannot send a friend request to yourself.' });
    }

    //   Check if the recipient exists in the database
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ message: 'Recipient not found.' });
    }
    // check if the recipient is already a friend
    if (recipient.friends.includes(myId)) {
      return res
        .status(400)
        .json({ message: 'You are already friends with this user.' });
    }

    //   Check if a friend request already exists
    const existingRequest = await FriendRequest.findOne({
      $or: [
        { sender: myId, recipient: recipientId },
        { sender: recipientId, recipient: myId },
      ],
    });

    if (existingRequest) {
      return res
        .status(400)
        .json({ message: 'Friend request already exists.' });
    }

    //   Create a new friend request
    const friendRequest = await FriendRequest.create({
      sender: myId,
      recipient: recipientId,
    });

    res.status(200).json(friendRequest);
  } catch (error) {
    console.error('Error sending friend request:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};
const acceptFriendRequest = async (req, res) => {
  try {
    const { id: requestId } = req.params;
    const friendRequest = await FriendRequest.findById(requestId);
    // check if the friend request exists
    if (!friendRequest) {
      return res.status(404).json({ message: 'Friend request not found.' });
    }

    // check if the current user is the recipient of the friend request
    if (FriendRequest.recipient.toString() !== req.user.id) {
      return res.status(403).json({
        message: 'You are not authorized to accept this friend request.',
      });
    }

    // Add the sender to the recipient's friends list
    friendRequest.status = 'accepted';
    await friendRequest.save();

    // Add each other to friends list
    await User.findByIdAndUpdate(friendRequest.sender, {
      $addToSet: { friends: friendRequest.recipient },
    });
    await User.findByIdAndUpdate(friendRequest.recipient, {
      $addToSet: { friends: friendRequest.sender },
    });
  } catch (error) {
    console.error('Error accepting friend request:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getFriendRequests = async (req, res) => {
  try {
    const incomingRequests = await FriendRequest.find({
      recipient: req.user._id,
      status: 'pending',
    }).populate(
      'sender',
      'fullName profilePicture nativeLanguage learningLanguage'
    );

    const acceptedRequests = await FriendRequest.find({
      sender: req.user._id,
      status: 'accepted',
    }).populate(recipient, 'fullName profilePicture ');

    res.status(200).json({ incomingRequests, acceptedRequests });
  } catch (error) {
    console.error('Error fetching friend requests:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getOutgoingFriendRequests = async (req, res) => {
  try {
    const outgoingRequests = await FriendRequest.find({
      sender: req.user._id,
      status: 'pending',
    }).populate(
      'recipient',
      'fullName profilePicture nativeLanguage learningLanguage'
    );
    res.status(200).json(outgoingRequests);
  } catch (error) {
    console.error('Error fetching outgoing friend requests:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export {
  getRecommendedUsers,
  getMyFriends,
  sendFriendRequest,
  acceptFriendRequest,
  getFriendRequests,
  getOutgoingFriendRequests,
};
