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
const setAsync = promisify(client.set).bind(client);
const watchAsync = promisify(client.watch).bind(client);

export {
    client,
    lrangeAsync,
    incrAsync,
    incrByAsync,
    keysAsync,
    mgetAsync,
    rpushAsync,
    setAsync,
    watchAsync
};
