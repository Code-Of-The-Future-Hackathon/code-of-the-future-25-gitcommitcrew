import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { spawn } from "child_process";
import { dirname } from "node:path";
import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { startServer } from "./server/server";
import type { Config } from "./type";
import axios from "axios";
import si, { networkInterfaces, osInfo } from "systeminformation";
// import { exec } from "child_process";
// import { promisify } from "util";
import { connectToSocket } from "./server/socket";
import { startScrapers } from "@/scraper/scraper";

export let config: Config = {
	initialized: true,
	lastRun: new Date().toISOString(),
	lastUpdate: new Date().toISOString(),
	updateCount: 0,
	hostname: "",
	org: "",
	password: "",
	passwordHash: "",
	port: 3000,
	serverUrl: "",
	ip: "",
	localIp: "",
	mac: "",
};

// const execAsync = promisify(exec);

const configFilePath = `${
	process.env.HOME || process.env.USERPROFILE
}/.config/cliapp/settings.json`;

async function ensureConfigDir() {
	const dir = dirname(configFilePath);
	await mkdir(dir, { recursive: true });

	return true;
}

async function runSetup() {
	await ensureConfigDir();

	const file = Bun.file(configFilePath);
	if (await file.exists()) {
		const existingConfig = await file.json();
		console.log("Using existing configuration file");
		config = existingConfig;
		return;
	}

	console.log("=== Host Configuration ===");

	// Organisation
	let org: string | null = null;
	do {
		org = prompt("Enter organisation name: ");
	} while (!org);

	// Password
	let password: string | null = null;
	do {
		password = prompt("Enter a password: ");
		if (!password || password?.length < 4)
			console.log("Provide a longer password");
	} while (!password || password.length < 4);

	// Server Url
	let serverUrl: string | null = null;
	do {
		serverUrl = prompt("Enter main server's url: ");
	} while (!serverUrl);

	// Port
	let port: number | null = null;
	do {
		port = Number(prompt("Enter host server's port: "));
	} while (isNaN(port));

	// Network
	type NetworkInterface = si.Systeminformation.NetworkInterfacesData;
	const networkInterface = (await networkInterfaces(
		"default",
	)) as NetworkInterface;

	// Ip
	const { ip } = await axios
		.get<{ ip: string }>("https://api.ipify.org?format=json")
		.then((res) => res.data);

	config.hostname = (await osInfo()).hostname;
	config.org = org;
	config.password = password;
	config.passwordHash = await Bun.password.hash(password);
	config.serverUrl = serverUrl;
	config.port = port;
	config.localIp = networkInterface.ip4;
	config.ip = ip;
	config.mac = networkInterface.mac;

	await Bun.write(configFilePath, JSON.stringify(config));
	console.log("Created new configuration file");

	return config;
}

async function runMonitoringService() {
	const file = Bun.file(configFilePath);
	if (await file.exists()) {
		let currentConfig = await file.json();
		currentConfig.lastUpdate = new Date().toISOString();
		currentConfig.updateCount = (currentConfig.updateCount || 0) + 1;
		await Bun.write(configFilePath, JSON.stringify(currentConfig, null, 2));
		config = currentConfig;

		await startServer(config.port);

		await axios
			.post(`${config.serverUrl}/system/host`, {
				hostname: config.hostname,
				org: config.org,
				passwordHash: config.passwordHash,
				port: config.port,
				ip: config.ip,
				mac: config.mac,
			})
			.catch((err) => {
				console.error(err);
			});

		connectToSocket();
		startScrapers();
	} else {
		await runSetup();
	}
}

// Cli helper
yargs(hideBin(process.argv))
	.command(
		"setup",
		"Configure host and start the monitoring service",
		(yargs) => {
			return yargs.option("detach", {
				alias: "d",
				type: "boolean",
				description: "Run monitoring service in the background",
				default: false,
			});
		},
		async (argv: any) => {
			await runSetup();

			if (argv.detach) {
				// Run in background if --detach flag is provided
				const scriptPath = fileURLToPath(import.meta.url);
				const child = spawn(process.execPath, [scriptPath, "run"], {
					detached: true,
					stdio: "ignore",
					env: process.env,
				});
				child.unref();
				console.log(
					`Background monitoring service started with PID ${child.pid}`,
				);
				process.exit(0);
			} else {
				// Run in foreground if no --detach flag
				console.log("Starting monitoring service in foreground");
				await runMonitoringService();
				const shutdown = () => {
					console.log("Shutting down monitoring service...");
					process.exit(0);
				};
				process.on("SIGINT", shutdown);
				process.on("SIGTERM", shutdown);
				process.stdin.resume();
			}
		},
	)
	.demandCommand(1, "You need to provide a valid command (setup).")
	.help().argv;
