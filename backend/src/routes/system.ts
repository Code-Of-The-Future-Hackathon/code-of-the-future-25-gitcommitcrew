import { Router } from "express";
import {
	addNewHost,
	claimHost,
	getClaimedHosts,
	getLatestData,
	getUnclaimedHosts,
	getSystemData,
	getHistoryData,
} from "@controllers/system";
import { validateBodySchema } from "@middlewares/validation";
import { addNewHostValidation } from "@services/system/validations/addNewHost";
import { isAuth } from "@middlewares/auth";
import { claimHostValidation } from "@services/system/validations/claimHost";
import { getLatestDataValidation } from "@services/system/validations/getLatestData";

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

router.post(
	"/host/latest",
	isAuth,
	validateBodySchema(getLatestDataValidation),
	getLatestData,
);

router.post(
	"/host/system",
	isAuth,
	validateBodySchema(getLatestDataValidation),
	getSystemData,
);

router.post(
	"/host/history",
	isAuth,
	validateBodySchema(getLatestDataValidation),
	getHistoryData,
);

export default router;
