import type { Application } from "express";
import { Server } from "socket.io";
import { Server as ServerHttp } from "http";

import { setIO, setupServerListeners } from "@/server/services/socket/socket";

import { setupUserMiddlewareForIO } from "@/server/middlewares/socket";
import { globalConfig } from "@/index";

const setupWS = (httpServer: ServerHttp, app: Application) => {
	const io = new Server(httpServer, {
		cors: {
			origin: globalConfig.serverUrl,
			credentials: true,
			methods: ["GET", "POST"],
			allowedHeaders: ["cookie"],
		},
		allowEIO3: true,
		transports: ["websocket", "polling"],
	});

	app.set("io", io);

	setupUserMiddlewareForIO(io);

	setIO(io);

	setupServerListeners(io);
};

export { setupWS };
