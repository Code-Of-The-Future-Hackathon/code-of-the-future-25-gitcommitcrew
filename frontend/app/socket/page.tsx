"use client";

import { useState } from "react";
import { useSocket } from "../hooks/useSocket";

export default function Home() {
	const { isConnected, messages, sendMessage } = useSocket();
	const [inputMessage, setInputMessage] = useState("");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (inputMessage.trim()) {
			sendMessage(inputMessage);
			setInputMessage("");
		}
	};

	return (
		<main className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-24">
			<div className="w-full max-w-md rounded-lg bg-white p-6 shadow-md">
				<h1 className="mb-4 text-center text-2xl font-bold">
					WebSocket Chat Demo
				</h1>
				<div
					className={`mb-4 text-center ${isConnected ? "text-green-500" : "text-red-500"}`}
				>
					{isConnected ? "Connected" : "Disconnected"}
				</div>
				<div className="mb-4 h-64 overflow-y-auto rounded border border-gray-300 p-2">
					{messages.map((msg, index) => (
						<p key={index} className="mb-2">
							{msg}
						</p>
					))}
				</div>
				<form onSubmit={handleSubmit} className="flex">
					<input
						type="text"
						value={inputMessage}
						onChange={(e) => setInputMessage(e.target.value)}
						className="mr-2 flex-grow rounded border border-gray-300 p-2"
						placeholder="Type a message..."
					/>
					<button
						type="submit"
						className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
						disabled={!isConnected}
					>
						Send
					</button>
				</form>
			</div>
		</main>
	);
}
