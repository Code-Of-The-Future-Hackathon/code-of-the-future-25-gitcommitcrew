"use client";

import { useState } from "react";
import { useSocket } from "../hooks/useSocket";

export default function Home() {
	const [inputMessage, setInputMessage] = useState("");
	const { data, openHost } = useSocket();

	console.log(data);

	return (
		<div>
			<button
				onClick={() => {
					openHost("9bb5899d-f63e-4aa3-864c-3f0a82cce40e");
				}}
			>
				Open
			</button>
			{data.map((d, i) => {
				return (
					<div key={i}>
						{d.type === "cpu" && <h1>speed: {d.data.cpuCurrentSpeed.avg}</h1>}
					</div>
				);
			})}
		</div>
	);
}
