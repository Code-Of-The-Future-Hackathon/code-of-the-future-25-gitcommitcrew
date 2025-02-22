import { useEffect, useRef } from "react";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import { WebLinksAddon } from "xterm-addon-web-links";
import "xterm/css/xterm.css";

interface SSHTerminalProps {
	hostId: string;
	accessToken: string;
}

export function SSHTerminal({ hostId, accessToken }: SSHTerminalProps) {
	const terminalRef = useRef<HTMLDivElement>(null);
	const terminal = useRef<Terminal | null>(null);
	const wsRef = useRef<WebSocket | null>(null);

	useEffect(() => {
		if (!terminalRef.current) return;

		// Initialize terminal
		terminal.current = new Terminal({
			cursorBlink: true,
			fontSize: 14,
			fontFamily: 'Menlo, Monaco, "Courier New", monospace',
			theme: {
				background: "#1a1b26",
			},
		});

		const fitAddon = new FitAddon();
		terminal.current.loadAddon(fitAddon);
		terminal.current.loadAddon(new WebLinksAddon());

		terminal.current.open(terminalRef.current);
		fitAddon.fit();

		// Connect to WebSocket
		const ws = new WebSocket(
			`ws://${process.env.NEXT_PUBLIC_JUMP_SERVER_HOST}:2223?hostId=${hostId}&token=${accessToken}`,
		);
		wsRef.current = ws;

		ws.onopen = () => {
			terminal.current!.write("Connecting...\r\n");
		};

		ws.onmessage = (event) => {
			if (typeof event.data === "string") {
				const msg = JSON.parse(event.data);
				if (msg.type === "ready") {
					terminal.current!.clear();
				}
			} else {
				terminal.current!.write(new Uint8Array(event.data));
			}
		};

		ws.onclose = () => {
			terminal.current!.write("\r\nConnection closed.\r\n");
		};

		// Handle terminal input
		terminal.current.onData((data) => {
			if (ws.readyState === WebSocket.OPEN) {
				ws.send(data);
			}
		});

		// Handle window resize
		const handleResize = () => fitAddon.fit();
		window.addEventListener("resize", handleResize);

		return () => {
			window.removeEventListener("resize", handleResize);
			terminal.current?.dispose();
			ws.close();
		};
	}, [hostId, accessToken]);

	return <div ref={terminalRef} className="h-[500px]" />;
}
