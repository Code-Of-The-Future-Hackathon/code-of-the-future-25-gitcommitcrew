export function formatSeconds(seconds: number) {
	if (seconds <= 60) {
		return seconds + "s";
	} else if (seconds < 3600) {
		// For values less than an hour, convert to minutes.
		return Math.floor(seconds / 60) + "m";
	} else if (seconds < 86400) {
		// For values less than a day, convert to hours.
		return Math.floor(seconds / 3600) + "h";
	} else {
		// For values one day or more, convert to days.
		return Math.floor(seconds / 86400) + "d";
	}
}

export function parseFormattedSeconds(formatted: string): number {
	// Match one or more digits followed by a single character: m, h, or d.
	const match = formatted.match(/^(\d+)([mhds])$/);
	if (!match) {
		throw new Error(`Invalid formatted string: ${formatted}`);
	}
	const [, numStr, unit] = match;
	const value = parseInt(numStr, 10);

	switch (unit) {
		case "s":
			return value;
		case "m":
			return value * 60;
		case "h":
			return value * 3600;
		case "d":
			return value * 86400;
		default:
			throw new Error(`Unsupported time unit: ${unit}`);
	}
}
