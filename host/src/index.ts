import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { spawn } from "child_process";
import { dirname } from "node:path";
import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { startServer } from "./server/app";
import type { Config } from "./types/config";

export let globalConfig: Config | null = null;

const configFilePath = `${
	process.env.HOME || process.env.USERPROFILE
}/.config/cliapp/settings.json`;

const defaultConfig: Config = {
	initialized: true,
	lastRun: new Date().toISOString(),
	lastUpdate: new Date().toISOString(),
	updateCount: 0,
	password: null,
};

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

	const passwordInput = prompt("Enter a password for the host: ");
	defaultConfig.password = passwordInput;

	await Bun.write(configFilePath, JSON.stringify(defaultConfig));
	console.log("Created new configuration file");
	globalConfig = defaultConfig;
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

		await startServer(3000, "http://localhost:3000");
	} else {
		globalConfig = await runSetup();
	}
}

yargs(hideBin(process.argv))
	.command(
		"setup",
		"Run one-time setup and start the background monitoring service",
		() => {},
		async (argv: any) => {
			await runSetup();

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
		},
	)
	.command(
		"run",
		"Run the background monitoring service",
		() => {},
		async (argv: any) => {
			await runMonitoringService();

			const shutdown = () => {
				console.log("Shutting down monitoring service...");
				process.exit(0);
			};

			process.on("SIGINT", shutdown);
			process.on("SIGTERM", shutdown);
			process.stdin.resume();
		},
	)
	.demandCommand(1, "You need to provide a valid command (setup or run).")
	.help().argv;
