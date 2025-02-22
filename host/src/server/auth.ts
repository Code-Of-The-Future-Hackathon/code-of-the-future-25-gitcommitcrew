import { config } from "@/index";

const isAuth = async (passwordHash: string) => {
	const password = config?.password;

	if (password && !(await Bun.password.verify(password, passwordHash))) {
		return false
	}

	return true
}

export { isAuth };
