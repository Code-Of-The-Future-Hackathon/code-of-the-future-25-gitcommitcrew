import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { spawn } from "child_process";
import { dirname } from "node:path";
import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { startServer } from "./server/app";
import type { Config } from "./types/config";
import axios from "axios";
import si, { networkInterfaces } from "systeminformation";

export let globalConfig: Config = {
	initialized: true,
	lastRun: new Date().toISOString(),
	lastUpdate: new Date().toISOString(),
	updateCount: 0,
	hostname: "",
	org: "",
	password: "",
	port: 3000,
	serverUrl: "",
};

const configFilePath = `${
	process.env.HOME || process.env.USERPROFILE
}/.config/cliapp/settings.json`;

async function ensureConfigDir() {
	const configDir = dirname(configFilePath);
	await mkdir(configDir, { recursive: true });
	return true;
}
async function runSetup() {
	await ensureConfigDir();
	const file = Bun.file(configFilePath);
	if (await file.exists()) {
		const existingConfig = await file.json();
		console.log("Using existing configuration file");
		globalConfig = existingConfig;
		return existingConfig;
	}

	let hostname: string | null = null;
	do {
		hostname = prompt("Enter a hostname for the host: ");
	} while (!hostname);

	let org: string | null = null;
	do {
		org = prompt("Enter an org name for the host: ");
	} while (!org);

	let password: string | null = null;
	do {
		password = prompt("Enter a password for the host (min 4 characters): ");
	} while (!password || password.length < 4);

	let serverUrl: string | null = null;
	do {
		serverUrl = prompt("Enter the main server's url: ");
	} while (!serverUrl);

	let port: number | null = null;
	do {
		port = Number(
			prompt("Enter the port on which the host's server will run on: "),
		);
	} while (!serverUrl || isNaN(port));

	globalConfig.org = org;
	globalConfig.password = password;
	globalConfig.serverUrl = serverUrl;
	globalConfig.port = port;

	await Bun.write(configFilePath, JSON.stringify(globalConfig));
	console.log("Created new configuration file");

	return globalConfig;
}
async function runMonitoringService() {
	const file = Bun.file(configFilePath);
	if (await file.exists()) {
		let currentConfig = await file.json();
		currentConfig.lastUpdate = new Date().toISOString();
		currentConfig.updateCount = (currentConfig.updateCount || 0) + 1;
		await Bun.write(configFilePath, JSON.stringify(currentConfig, null, 2));
		globalConfig = currentConfig;

		await startServer(globalConfig.port);

		const networkInterface = (await networkInterfaces(
			"default",
		)) as si.Systeminformation.NetworkInterfacesData;

		await axios
			.post(`${globalConfig.serverUrl}/hosts`, {
				hostname: globalConfig.hostname,
				org: globalConfig.org,
				password: await Bun.password.hash(globalConfig.password),
				port: globalConfig.port,
				ip: networkInterface.ip4,
				mac: networkInterface.mac,
			})
			.catch((err) => {});
	} else {
		globalConfig = await runSetup();
	}
}
yargs(hideBin(process.argv))
	.command(
		"setup",
		"Run one-time setup and start the monitoring service",
		(yargs) => {
			return yargs.option("detach", {
				alias: "d",
				type: "boolean",
				description: "Run the service in the background",
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
	.command(
		"run",
		"Run the monitoring service",
		(yargs) => {
			return yargs.option("detach", {
				alias: "d",
				type: "boolean",
				description: "Run the service in the background",
				default: false,
			});
		},
		async (argv: any) => {
			if (argv.detach) {
				// Self-detach if run with --detach flag
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
	.demandCommand(1, "You need to provide a valid command (setup or run).")
	.help().argv;
