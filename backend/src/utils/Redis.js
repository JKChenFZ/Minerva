import redis from "redis";
import { promisify } from "util";

const client = redis.createClient({
    host: process.env.REDIS
});

const rpushAsync = promisify(client.rpush).bind(client);
const lrangeAsync = promisify(client.lrange).bind(client);
const mgetAsync = promisify(client.mget).bind(client);
const incrAsync = promisify(client.incr).bind(client);
const incrByAsync = promisify(client.incrby).bind(client);
const keysAsync = promisify(client.keys).bind(client);

export { lrangeAsync, incrAsync, incrByAsync, keysAsync, mgetAsync, rpushAsync };
