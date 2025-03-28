import { createClient } from 'redis';
import { config } from '../config';

const redisClient = createClient({
  url: `redis://${config.redis.password ? `:${config.redis.password}@` : ''}${config.redis.host}:${config.redis.port}`,
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));

// Connect to Redis
redisClient.connect().catch(console.error);

// Helper functions for user tracking
export async function incrementActiveUsers() {
  try {
    await redisClient.incr('active_users_count');
  } catch (error) {
    console.error('Error incrementing active users:', error);
  }
}

export async function decrementActiveUsers() {
  try {
    const count = await redisClient.get('active_users_count');
    if (count && parseInt(count) > 0) {
      await redisClient.decr('active_users_count');
    }
  } catch (error) {
    console.error('Error decrementing active users:', error);
  }
}

export { redisClient }; 