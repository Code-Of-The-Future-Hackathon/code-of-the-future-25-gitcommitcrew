"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Terminal } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { SSHTerminal } from "../ssh-terminal";

interface SSHConnectProps {
	deviceId: string;
	deviceName: string;
}

export function SSHConnect({ deviceId, deviceName }: SSHConnectProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [accessToken, setAccessToken] = useState<string | null>(null);

	const handleConnect = async () => {
		try {
			const response = await fetch(`/api/devices/${deviceId}/ssh`, {
				method: "POST",
			});

			if (!response.ok) {
				throw new Error("Failed to establish SSH connection");
			}

			const { accessToken } = await response.json();
			setAccessToken(accessToken);
			setIsOpen(true);
		} catch (error) {
			console.error("SSH connection error:", error);
		}
	};

	return (
		<>
			<Button onClick={handleConnect}>
				<Terminal className="mr-2 h-4 w-4" />
				SSH Connect
			</Button>

			<Dialog open={isOpen} onOpenChange={setIsOpen}>
				<DialogContent className="sm:max-w-[800px]">
					{accessToken && (
						<SSHTerminal hostId={deviceId} accessToken={accessToken} />
					)}
				</DialogContent>
			</Dialog>
		</>
	);
}
