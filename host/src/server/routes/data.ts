import { Router } from "express";

import { getGlobalConfig } from "@/server/controllers/data";
import { isAuth } from "@/server/middlewares/auth";

const router = Router();

router.get("/", isAuth, getGlobalConfig);

export default router;
