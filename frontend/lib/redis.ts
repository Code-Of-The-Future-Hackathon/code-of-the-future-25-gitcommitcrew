import { createClient } from "redis";

export const redis = await createClient()
	.on("error", (err) => console.error("Redis Client Error", err))
	.connect();
