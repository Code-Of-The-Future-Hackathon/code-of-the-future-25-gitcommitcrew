import type { Request, Response, NextFunction } from "express";

import asyncErrorHandler from "@/server/utils/asyncErrorHandler";
import { AppError } from "@/server/common/error/appError";
import { globalConfig } from "@/index";

const isAuth = asyncErrorHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		if (!req.cookies.auth) {
			throw new AppError("Unauthorized", 401);
		}

		const password = globalConfig?.password;

		if (password && !(await Bun.password.verify(password, req.cookies.auth))) {
			throw new AppError("Unauthorized", 401);
		}

		next();
	},
);

export { isAuth };
