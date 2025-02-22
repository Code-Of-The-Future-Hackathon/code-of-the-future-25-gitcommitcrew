import { Server, Socket } from "socket.io";

import type { RequestHandler, Request, Response } from "express";

import { isAuth } from "@/server/middlewares/auth";

const wrapExpressMiddlewareToSocketIO =
	(expressMiddleware: RequestHandler) => (socket: Socket, next: () => void) =>
		// eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
		expressMiddleware(socket.request as Request, {} as Response, next);

const setupUserMiddlewareForIO = (io: Server) => {
	io.use(wrapExpressMiddlewareToSocketIO(isAuth));
};

export { setupUserMiddlewareForIO, wrapExpressMiddlewareToSocketIO };
