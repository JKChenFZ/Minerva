import redis from "redis";
import { promisify } from "util";

const client = redis.createClient({
    host: process.env.REDIS
});

const rpushAsync = promisify(client.rpush).bind(client);
const getAllKeys = promisify(client.lrange).bind(client);
const mgetAsync = promisify(client.mget).bind(client);
const incrByAsync = promisify(client.incrby).bind(client);

export { getAllKeys, incrByAsync, mgetAsync, rpushAsync };
