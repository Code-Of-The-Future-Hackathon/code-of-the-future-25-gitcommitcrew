import { useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";
import { nextEvents } from "../../nextEvents";
import { EventData } from "../../../events";

export const useSocket = () => {
	const [socket, setSocket] = useState<Socket | null>(null);
	const [isConnected, setIsConnected] = useState(false);
	const [messages, setMessages] = useState<string[]>([]);

	const [data, setData] = useState<EventData[]>([]);

	const [latestData, setLatestData] = useState<EventData[]>([]);

	useEffect(() => {
		const socketIo = io();

		socketIo.on("connect", () => {
			setIsConnected(true);
		});

		socketIo.on("disconnect", () => {
			setIsConnected(false);
		});

		socketIo.on("chat message", (msg: string) => {
			setMessages((prevMessages) => [...prevMessages, msg]);
		});

		socketIo.on(nextEvents.DATA_SEND, (data: EventData[]) => {
			console.log(data);
			setData(data);
		});

		socketIo.on(nextEvents.GET_LATEST_DATA, (data: EventData[]) => {
			setLatestData(data);
		});

		setSocket(socketIo);

		return () => {
			socketIo.disconnect();
		};
	}, []);

	const sendMessage = (message: string) => {
		if (socket) {
			socket.emit("chat message", message);
		}
	};

	const openHost = (hostId: string) => {
		if (socket) {
			socket.emit(nextEvents.HOST_OPEN, { hostId });
		}
	};

	const getLatestData = (mac: string) => {
		if (socket) {
			socket.emit(nextEvents.GET_LATEST_DATA, { mac });
		}
	};

	return {
		isConnected,
		messages,
		sendMessage,
		openHost,
		data,
		getLatestData,
		latestData,
	};
};
