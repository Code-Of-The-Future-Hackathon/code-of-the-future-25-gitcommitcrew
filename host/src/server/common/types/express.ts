import type { Request, Response, NextFunction } from "express";

type ExpressFunction = (
	req: Request,
	res: Response,
	next: NextFunction,
) => Promise<void> | void;

export type { ExpressFunction };
