import { Router } from "express";

import { getStaticData } from "@/server/controllers/data";
import { isAuth } from "@/server/middlewares/auth";

const router = Router();

router.get("/", isAuth, getStaticData);

export default router;
