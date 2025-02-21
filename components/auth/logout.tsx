import { getCurrentSession, invalidateSession } from "@/lib/auth";
import { Button } from "../ui/button";
import { deleteSessionTokenCookie } from "@/lib/auth/cookie";
import { redirect } from "next/navigation";

export function LogOut() {
	return (
		<Button
			className="px-4 py-2 bg-red-500 text-white hover:bg-red-600"
			onClick={logout}
		>
			Log Out
		</Button>
	);
}

async function logout() {
	"use server";
	const { session } = await getCurrentSession();
	if (!session) {
		return;
	}

	await invalidateSession(session.id);
	await deleteSessionTokenCookie();
	return redirect("/login");
}
