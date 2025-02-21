import { Router } from "express";

import dataRouter from "@/server/routes/data";

const router = Router();

router.use("/data", dataRouter);

export default router;
