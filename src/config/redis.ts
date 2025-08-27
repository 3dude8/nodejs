import { createClient } from 'redis';

// Create Redis client instance
const redisClient = createClient({
  socket: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379')
  },
  password: process.env.REDIS_PASSWORD || undefined
});

// Handle connection events
redisClient.on('connect', () => {
  console.log('🔄 Attempting to connect to Redis...');
});

redisClient.on('ready', () => {
  console.log('✅ Redis Connected Successfully!');
});

redisClient.on('error', (err) => {
  console.error('❌ Redis Connection Error:', err.message);
});

redisClient.on('end', () => {
  console.log('🔌 Redis connection closed');
});

// Connect to Redis
const connectRedis = async () => {
  try {
    await redisClient.connect();
  } catch (error: any) {
    console.error('❌ Failed to connect to Redis:', error.message);
    process.exit(1);
  }
};

export { redisClient, connectRedis };
