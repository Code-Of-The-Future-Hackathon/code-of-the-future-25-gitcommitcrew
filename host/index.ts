import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { spawn } from "child_process";
import { dirname } from "node:path";
import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const configFilePath = `${
	process.env.HOME || process.env.USERPROFILE
}/.config/cliapp/settings.json`;
const defaultConfig = JSON.stringify(
	{
		initialized: true,
		lastRun: new Date().toISOString(),
	},
	null,
	2
);

async function ensureConfigDir() {
	const configDir = dirname(configFilePath);
	try {
		await mkdir(configDir, { recursive: true });
		return true;
	} catch (error: any) {
		console.error(`Failed to create config directory: ${error.message}`);
		return false;
	}
}

async function runSetup() {
	if (!(await ensureConfigDir())) {
		process.exit(1);
	}

	const file = Bun.file(configFilePath);

	if (await file.exists()) {
		try {
			const existingConfig = await file.json();
			console.log("Using existing configuration file");
			return existingConfig;
		} catch (error) {
			console.warn("Existing config file is corrupt, recreating it...");
		}
	}

	try {
		await Bun.write(configFilePath, defaultConfig);
		console.log("Created new configuration file");
		return JSON.parse(defaultConfig);
	} catch (error: any) {
		console.error(`Failed to write config file: ${error.message}`);
		process.exit(1);
	}
}

async function runMonitoringService() {
	setInterval(async () => {
		try {
			const file = Bun.file(configFilePath);
			if (await file.exists()) {
				let currentConfig;
				try {
					currentConfig = await file.json();
				} catch (error) {
					// If file exists but is not valid JSON, initialize it
					currentConfig = JSON.parse(defaultConfig);
				}

				// Update configuration
				currentConfig.lastUpdate = new Date().toISOString();
				currentConfig.updateCount =
					(currentConfig.updateCount || 0) + 1;

				await Bun.write(
					configFilePath,
					JSON.stringify(currentConfig, null, 2)
				);
			} else {
				await runSetup();
			}
		} catch (error: any) {
			console.error(`Error in monitoring service: ${error.message}`);
		}
	}, 1000);
}

yargs(hideBin(process.argv))
	.command(
		"setup",
		"Run one-time setup and start the background monitoring service",
		() => {},
		async (argv: any) => {
			await runSetup();

			try {
				const scriptPath = fileURLToPath(import.meta.url);
				const child = spawn(process.execPath, [scriptPath, "run"], {
					detached: true,
					stdio: "ignore",
					env: process.env,
				});

				child.unref();
				console.log(
					`Background monitoring service started with PID ${child.pid}`
				);
				process.exit(0);
			} catch (error: any) {
				console.error(
					`Failed to start background service: ${error.message}`
				);
				process.exit(1);
			}
		}
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
		}
	)
	.demandCommand(1, "You need to provide a valid command (setup or run).")
	.help().argv;
