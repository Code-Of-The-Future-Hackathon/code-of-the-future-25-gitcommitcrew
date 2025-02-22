import { Router } from "express";
import {
	addNewHost,
	claimHost,
	getClaimedHosts,
	getUnclaimedHosts,
} from "@controllers/system";
import { validateBodySchema } from "@middlewares/validation";
import { addNewHostValidation } from "@services/system/validations/addNewHost";
import { isAuth } from "@middlewares/auth";
import { claimHostValidation } from "@services/system/validations/claimHost";

const router = Router();

router.get("/host/claimed", isAuth, getClaimedHosts);

router.get("/host/unclaimed", isAuth, getUnclaimedHosts);

router.post("/host", validateBodySchema(addNewHostValidation), addNewHost);

router.post(
	"/host/claim",
	isAuth,
	validateBodySchema(claimHostValidation),
	claimHost,
);

export default router;
