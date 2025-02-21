class AppError extends Error {
	public name: string;
	public stack: string | undefined;
	public message: string;
	public statusCode: number;

	constructor(message: string, statusCode: number) {
		super(message);

		this.name = "AppError";
		this.message = message;
		this.statusCode = statusCode;
	}
}

export { AppError };
