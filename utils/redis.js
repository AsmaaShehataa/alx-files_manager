import { createClient } from 'redis';
import { promisify } from 'util';

class RedisClient {
  constructor() {
    this.myClient = createClient();
    this.myClient.on('error', (error) => console.log(error));
  }

  isAlive() {
    return this.myClient.connected;
  }

  async get(key) {
    const getAsync = promisify(this.myClient.get).bind(this.myClient);
    try {
      const value = await getAsync(key); // Use await to handle the promise
      return value;
    } catch (error) {
      console.error('Error getting key:', error); // Log error if any
      return null; // Return a default value or handle the error case
    }
  }

  async set(key, value, time) {
    const setAsync = promisify(this.myClient.set).bind(this.myClient);
    try {
      await setAsync(key, value, 'EX', time); // Use await to handle the promise
    } catch (error) {
      console.error('Error setting key:', error); // Log error if any
    }
  }

  async del(key) {
    const delAsync = promisify(this.myClient.del).bind(this.myClient);
    try {
      await delAsync(key); // Use await to handle the promise
    } catch (error) {
      console.error('Error deleting key:', error); // Log error if any
    }
  }
}

const redisClient = new RedisClient();
export default redisClient;
