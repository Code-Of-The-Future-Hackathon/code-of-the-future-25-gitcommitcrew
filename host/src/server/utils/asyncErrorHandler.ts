import type { Request, Response, NextFunction } from "express";

import type { ExpressFunction } from "@/server/common/types/express";
import { AppError } from "@/server/common/error/appError";

function asyncErrorHandler(fn: ExpressFunction) {
	return (req: Request, res: Response, next: NextFunction) => {
		Promise.resolve(fn(req, res, next)).catch((error: unknown) => {
			if (error instanceof AppError) {
				console.error({ error }, "Handled error in asyncErrorHandler");

				return res.status(error.statusCode).json({
					success: false,
					error: {
						message_error: error.message,
					},
				});
			}

			console.error({ error }, "Unhandled error in asyncErrorHandler");

			return res.status(500).json({
				success: false,
				error: {
					message_error: "Internal server error.",
				},
			});
		});
	};
}

export default asyncErrorHandler;
