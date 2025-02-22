"use client";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { User } from "@/lib/db/schema";
import { Plus, Server } from "lucide-react";
import { useState } from "react";

export interface UnclaimedHost {
	id: string;
	hostname: string;
	mac: string;
	ip: string;
	org: string;
	claimed: boolean;
}

export function AddDeviceButton({
	user,
	unclaimedHosts,
}: {
	user: User;
	unclaimedHosts: UnclaimedHost[];
}) {
	const [open, setOpen] = useState(false);
	const [selectedHost, setSelectedHost] = useState<UnclaimedHost | null>(null);
	const [password, setPassword] = useState("");

	const handleClaim = async () => {
		if (!selectedHost) return;

		const { data, status } = await api.post("/hosts", {
			password,
			hostId: selectedHost.id,
		});

		if (status != 200) {
			console.error("Bad");
		}

		console.log(data);

		setOpen(false);
		setSelectedHost(null);
		setPassword("");
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button>
					<Plus className="mr-2 h-4 w-4" />
					Add Device
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Add New Device</DialogTitle>
					<DialogDescription>
						Select an available device to claim
					</DialogDescription>
				</DialogHeader>
				<div className="space-y-4 py-4">
					{selectedHost ? (
						<div className="space-y-4">
							<div className="flex items-center space-x-2">
								<Server className="h-4 w-4" />
								<span>{selectedHost.hostname}</span>
								<Button
									variant="ghost"
									size="sm"
									onClick={() => setSelectedHost(null)}
								>
									Change
								</Button>
							</div>
							<div className="space-y-2">
								<label className="text-sm font-medium">Device Password</label>
								<Input
									type="password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									placeholder="Enter device password"
								/>
							</div>
							<Button
								className="w-full"
								onClick={handleClaim}
								disabled={!password}
							>
								Claim Device
							</Button>
						</div>
					) : (
						<div className="space-y-4">
							{unclaimedHosts.map((host) => (
								<div
									key={host.id}
									className="hover:bg-accent flex cursor-pointer items-center justify-between rounded-lg border p-4"
									onClick={() => setSelectedHost(host)}
								>
									<div className="flex items-center space-x-4">
										<Server className="h-4 w-4" />
										<div>
											<p className="font-medium">{host.hostname}</p>
											<p className="text-muted-foreground text-sm">
												{host.ip} • {host.mac}
											</p>
										</div>
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
}
