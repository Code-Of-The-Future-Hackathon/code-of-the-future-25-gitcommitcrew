import { Request, Response } from "express";

import { getUserById as getUserByIdService } from "@services/user";

import asyncErrorHandler from "@utils/asyncErrorHandler";

const getUserById = asyncErrorHandler(async (req: Request, res: Response) => {
  const user = await getUserByIdService(req.user.id);

  res.json({ success: true, data: user });
});

export { getUserById };
