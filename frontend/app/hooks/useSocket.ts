import { useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";
import { Data, EventData } from "../../../events";
const enum events {
	HOST_CONNECTION = "host:connection",
	HOST_NEW_DATA = "host:new:data",
	HOST_UPDATE_INTERVAL = "host:update:interval",
	HOST_UPDATE_QUERY = "host:update:query",
	HOST_STOP = "host:stop",
	HOST_START = "host:start",
	HOST_TERMINATE = "host:terminate",

	SERVER_NEW_DATA = "server:new:data",
	CLIENT_REQUEST_DATA = "client:request:data",
}

export const useSocket = () => {
	const [socket, setSocket] = useState<Socket | null>(null);
	const [isConnected, setIsConnected] = useState(false);
	const [data, setData] = useState([]);

	useEffect(() => {
		const socketIo = io("http://localhost:3005");

		socketIo.on("connect", () => {
			setIsConnected(true);
		});

		socketIo.on("disconnect", () => {
			setIsConnected(false);
		});

		socketIo.on(events.SERVER_NEW_DATA, (hostId: string, data: EventData[]) => {
			console.log(hostId, data);
		});

		setSocket(socketIo);

		return () => {
			socketIo.disconnect();
		};
	}, []);

	const changeRequestedData = (dataTypes: Data[]) => {
		if (socket) {
			socket.emit(events.CLIENT_REQUEST_DATA, { data: dataTypes });
		}
	};

	return {
		isConnected,
		data,
		changeRequestedData,
	};
};
