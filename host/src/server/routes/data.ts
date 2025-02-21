import { Router } from "express";

import { getStaticData } from "@/server/controllers/data";

const router = Router();

router.get("/data", getStaticData);

export default router;
