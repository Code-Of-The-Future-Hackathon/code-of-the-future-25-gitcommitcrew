import { Request, Response } from "express";

import {
	addNewHost as addNewHostService,
	claimHost as claimHostService,
	getHosts,
	getLatestData as getLatestDataService,
} from "@services/system/system.service";

import asyncErrorHandler from "@utils/asyncErrorHandler";
import { TNewHost } from "@services/system/validations/addNewHost";
import { TClaimHost } from "@services/system/validations/claimHost";
import { TGetLatestData } from "@services/system/validations/getLatestData";

const addNewHost = asyncErrorHandler(async (req: Request, res: Response) => {
	const host = req.body as TNewHost;

	const createdHost = await addNewHostService(host);

	res.json({ success: true, data: createdHost });
});

const claimHost = asyncErrorHandler(async (req: Request, res: Response) => {
	const { hostId, password } = req.body as TClaimHost;

	const claimedHost = await claimHostService(req.user.id, password, hostId);

	res.json({ success: true, data: claimedHost });
});

const getClaimedHosts = asyncErrorHandler(
	async (req: Request, res: Response) => {
		const claimedHosts = await getHosts(req.user.id, true);

		res.json({ success: true, data: claimedHosts });
	},
);

const getUnclaimedHosts = asyncErrorHandler(
	async (req: Request, res: Response) => {
		const unclaimedHosts = await getHosts(req.user.id, false);

		res.json({ success: true, data: unclaimedHosts });
	},
);

const getLatestData = asyncErrorHandler(async (req: Request, res: Response) => {
	const { hostId, types } = req.body as TGetLatestData;

	const latestData = await getLatestDataService(req.user.id, hostId, types);

	res.json({ success: true, data: latestData });
});

export {
	addNewHost,
	claimHost,
	getClaimedHosts,
	getUnclaimedHosts,
	getLatestData,
};
