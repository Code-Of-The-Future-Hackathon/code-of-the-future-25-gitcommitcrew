import { createSession } from "@/lib/auth";
import { github } from "@/lib/oauth";
import { cookies } from "next/headers";

import type { OAuth2Tokens } from "arctic";
import { randomUUID } from "crypto";
import { setSessionTokenCookie } from "@/lib/auth/cookie";
import { db } from "@/lib/db";
import { userTable } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: Request): Promise<Response> {
	const url = new URL(request.url);
	const code = url.searchParams.get("code");
	const state = url.searchParams.get("state");
	const cookieStore = await cookies();
	const storedState = cookieStore.get("github_oauth_state")?.value ?? null;
	if (code === null || state === null || storedState === null) {
		return new Response(null, {
			status: 400,
		});
	}
	if (state !== storedState) {
		return new Response(null, {
			status: 400,
		});
	}

	let tokens: OAuth2Tokens;
	try {
		tokens = await github.validateAuthorizationCode(code);
	} catch (e) {
		// Invalid code or client credentials
		return new Response(null, {
			status: 400,
		});
	}
	const githubUserResponse = await fetch("https://api.github.com/user", {
		headers: {
			Authorization: `Bearer ${tokens.accessToken()}`,
		},
	});
	const githubUser = await githubUserResponse.json();
	console.log(githubUser);
	const githubUserId = githubUser.id;
	const githubUsername = githubUser.login;

	const response = await fetch("https://api.github.com/user/emails", {
		headers: {
			Authorization: `Bearer ${tokens.accessToken()}`,
		},
	});
	const emails = await response.json();
	console.log(emails);

	const existingUser = await db
		.select()
		.from(userTable)
		.where(eq(userTable.githubId, githubUserId))
		.then((arr) => arr[0]);

	if (existingUser) {
		const sessionToken = randomUUID();
		const session = await createSession(sessionToken, existingUser.id);
		await setSessionTokenCookie(sessionToken, session.expiresAt);

		await db
			.update(userTable)
			.set({ username: githubUsername, email: emails[0].email })
			.where(eq(userTable.id, existingUser.id));

		return new Response(null, {
			status: 302,
			headers: {
				Location: "/",
			},
		});
	}

	const user = await db
		.insert(userTable)
		.values({
			githubId: githubUserId,
			username: githubUsername,
			email: emails[0].email,
		})
		.returning()
		.then((arr) => arr[0]);

	const sessionToken = randomUUID();
	const session = await createSession(sessionToken, user.id);
	await setSessionTokenCookie(sessionToken, session.expiresAt);
	return new Response(null, {
		status: 302,
		headers: {
			Location: "/",
		},
	});
}
