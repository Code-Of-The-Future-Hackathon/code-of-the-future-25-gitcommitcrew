import type { Request, Response } from "express";

import asyncErrorHandler from "@/server/utils/asyncErrorHandler";
import { globalConfig } from "@/index";
import { AppError } from "../common/error/appError";

const getStaticData = asyncErrorHandler((req: Request, res: Response) => {
	const data = globalConfig;

	throw new AppError("Error message", 400);

	res.json({ success: true, data });
});

export { getStaticData };
