import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { spawn } from "child_process";

const configFilePath = "~/.config/cliapp/settings.json";

async function runSetup() {
	const file = Bun.file(configFilePath);
	if (await file.exists()) return;

	await Bun.write(configFilePath, "");
}

async function runMonitoringService() {
	const file = Bun.file(configFilePath);

	setInterval(async () => {
		await Bun.write(file, (await file.text()) + "test\n");
	}, 1000);
}

yargs(hideBin(process.argv))
	.command(
		"setup",
		"Run one-time setup and start the background monitoring service",
		() => {},
		async (argv: any) => {
			await runSetup();

			const child = spawn(process.execPath, [__filename, "run"], {
				detached: true,
				stdio: "ignore",
			});
			child.unref();

			console.log(
				`Background monitoring service started with PID ${child.pid}`
			);
		}
	)
	.command(
		"run",
		"Run the background monitoring service",
		() => {},
		async (argv: any) => {
			await runMonitoringService();

			process.stdin.resume();
		}
	)
	.demandCommand(1, "You need to provide a valid command (setup or run).")
	.help().argv;
