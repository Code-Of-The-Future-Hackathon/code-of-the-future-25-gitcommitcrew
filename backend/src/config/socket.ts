import { Application } from "express";
import { Server } from "socket.io";
import { Server as ServerHttp } from "http";

import config from "@config/env";

import { setIO, setupServerListeners } from "@services/socket/socket.service";

import { setupUserMiddlewareForIO } from "@middlewares/socket";
import logger from "@logger";

const setupWS = (httpServer: ServerHttp, app: Application) => {
	const io = new Server(httpServer, {
		cors: {
			origin: "http://localhost:3000",
			credentials: true,
		},
		allowEIO3: true,
		transports: ["websocket", "polling"],
	});

	logger.info("Socket.io server started");

	app.set("io", io);

	setupUserMiddlewareForIO(io);

	setIO(io);

	setupServerListeners(io);
};

export { setupWS };
