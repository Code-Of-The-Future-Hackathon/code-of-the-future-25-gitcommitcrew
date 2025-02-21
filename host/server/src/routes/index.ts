import { Router } from "express";
import { globalConfig } from "../../..";

const router = Router();

router.get("/", (req, res) => {
	res.json({
		message: globalConfig?.password,
	});
});

export default router;
