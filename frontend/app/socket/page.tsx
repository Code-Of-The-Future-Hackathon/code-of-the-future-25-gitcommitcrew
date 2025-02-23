"use client";

import { useSocket } from "../hooks/useSocket";

export default function Home() {
	const { changeRequestedData } = useSocket();

	return (
		<div>
			<button
				onClick={() => {
					changeRequestedData(["cpu", "battery"]);
				}}
			>
				Change data
			</button>
		</div>
	);
}
