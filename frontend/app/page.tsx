import { LogOut } from "@/components/auth/logout";
import { Button } from "@/components/ui/button";
import { getCurrentSession } from "@/lib/auth";
import Link from "next/link";

export default async function Home() {
	const { user } = await getCurrentSession();

	console.log(user);

	return (
		<div>
			{user ? (
				<div>
					<h1>Welcome</h1>
					<Button>
						<Link href={"/data"}>Data</Link>
					</Button>
				</div>
			) : (
				<div>
					<h1>Not registered</h1>
					<Button>
						<Link href={"/auth"}>Register</Link>
					</Button>
				</div>
			)}
		</div>
	);
}
