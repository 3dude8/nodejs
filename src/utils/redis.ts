import { redisClient } from '../config/redis';

// Set a value in Redis with optional expiration (in seconds)
export const setCache = async (key: string, value: any, expireInSeconds?: number): Promise<void> => {
  try {
    const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
    
    if (expireInSeconds) {
      await redisClient.set(key, stringValue, { EX: expireInSeconds });
    } else {
      await redisClient.set(key, stringValue);
    }
  } catch (error) {
    console.error('Redis set error:', error);
    throw error;
  }
};

// Get a value from Redis
export const getCache = async <T>(key: string): Promise<T | null> => {
  try {
    const value = await redisClient.get(key);
    if (!value) return null;
    
    try {
      return JSON.parse(value.toString()) as T;
    } catch {
      return value.toString() as unknown as T;
    }
  } catch (error) {
    console.error('Redis get error:', error);
    throw error;
  }
};

// Delete a key from Redis
export const deleteCache = async (key: string): Promise<void> => {
  try {
    await redisClient.del(key);
  } catch (error) {
    console.error('Redis delete error:', error);
    throw error;
  }
};

// Check if a key exists in Redis
export const existsCache = async (key: string): Promise<boolean> => {
  try {
    const result = await redisClient.exists(key);
    return result === 1;
  } catch (error) {
    console.error('Redis exists error:', error);
    throw error;
  }
};

// Set expiration for an existing key
export const expireCache = async (key: string, seconds: number): Promise<void> => {
  try {
    await redisClient.expire(key, seconds);
  } catch (error) {
    console.error('Redis expire error:', error);
    throw error;
  }
};

// Get time to live for a key
export const getTTL = async (key: string): Promise<number> => {
  try {
    const ttl = await redisClient.ttl(key);
    return typeof ttl === 'string' ? parseInt(ttl) : ttl;
  } catch (error) {
    console.error('Redis TTL error:', error);
    throw error;
  }
};

// Clear all cache (use with caution!)
export const clearAllCache = async (): Promise<void> => {
  try {
    await redisClient.flushAll();
  } catch (error) {
    console.error('Redis flushAll error:', error);
    throw error;
  }
};

// Generate cache key patterns for different entities
export const cacheKeys = {
  user: (id: string) => `user:${id}`,
  post: (id: string) => `post:${id}`,
  posts: (page: number, limit: number) => `posts:page:${page}:limit:${limit}`,
  comments: (postId: string) => `comments:post:${postId}`,
  session: (token: string) => `session:${token}`
};
