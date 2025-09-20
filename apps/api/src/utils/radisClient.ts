// src/utils/redisClient.ts
import {Redis} from "ioredis";

const redisClient = new Redis({
  host: "localhost", // or process.env.REDIS_HOST
  port: 6379,        // or process.env.REDIS_PORT
});

redisClient.on("connect", () => console.log("Redis connected"));
redisClient.on("error", (err) => console.error("Redis error:", err));

export default redisClient;
