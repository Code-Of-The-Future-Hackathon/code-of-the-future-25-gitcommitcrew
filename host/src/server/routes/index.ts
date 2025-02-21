import { Router } from "express";

import DataRouter from "@/server/routes/data";

const router = Router();

router.use("/data", DataRouter);

export default router;
