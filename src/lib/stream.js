import { StreamChat } from 'stream-chat';
import 'dotenv/config';

const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

if (!apiKey || !apiSecret) {
  console.error(
    'Stream API key or secret is missing. Please check your environment variables.'
  );
}

const streamClient = StreamChat.getInstance(apiKey, apiSecret);

const upsertStreamUser = async (userData) => {
  try {
    await streamClient.upsertUser(userData);
    return userData;
  } catch (error) {
    console.error(
      'Error creating Stream user:',
      error?.response?.data?.message || error.message
    );
  }
};

const getStreamToken = (userId) => {};

export { streamClient, upsertStreamUser, getStreamToken };
