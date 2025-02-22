"use client";

import { AddDeviceButton } from "@/components/dashboard/add-device-button";
import { HostGrid } from "@/components/dashboard/host-grid";
import { useEffect, useState } from "react";
import { THost } from "../../../backend/src/services/system/models/hosts";
import { api } from "@/lib/api";

export default function DashboardPage() {
	const [unclaimedHosts, setUnclaimedHosts] = useState<THost[] | null>();
	const [ownedHosts, setOwnedHosts] = useState<THost[] | null>();

	const fetchHosts = async () => {
		await Promise.all([
			api.get("/system/host/unclaimed").then(({ data }) => {
				if (data.success) {
					setUnclaimedHosts(data.data);
				}
			}),
			api.get("/system/host/claimed").then(({ data }) => {
				if (data.success) {
					setOwnedHosts(data.data);
				}
			}),
		]);
	};

	useEffect(() => {
		fetchHosts();
	}, []);

	return (
		<div className="space-y-8">
			{/* Header */}
			<div className="flex items-center justify-between">
				<h1 className="text-3xl font-bold">Devices</h1>
				{unclaimedHosts && <AddDeviceButton unclaimedHosts={unclaimedHosts} />}
			</div>

			{/* Host Grid */}
			{ownedHosts && <HostGrid hosts={ownedHosts} />}
		</div>
	);
}
