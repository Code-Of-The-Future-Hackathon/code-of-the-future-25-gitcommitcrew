import { Router } from "express";

import authRouter from "@routes/auth";

import userRouter from "@routes/user";

import systemRouter from "@routes/system";

const mainRouter = Router();

mainRouter.use("/auth", authRouter);

mainRouter.use("/user", userRouter);

mainRouter.use("/system", systemRouter);

export default mainRouter;
