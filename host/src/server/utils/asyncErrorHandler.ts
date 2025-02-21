import type { Request, Response, NextFunction } from "express";

import type { ExpressFunction } from "@/server/common/types/express";
import { AppError } from "@/server/common/error/appError";

function asyncErrorHandler(fn: ExpressFunction) {
	return (req: Request, res: Response, next: NextFunction) => {
		Promise.resolve(fn(req, res, next)).catch((error: unknown) => {
			if (error instanceof AppError) {
				return res.status(error.statusCode).json({
					success: false,
					error: {
						message_error: error.message,
					},
				});
			}

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
