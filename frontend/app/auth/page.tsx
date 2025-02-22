"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Page() {
	const router = useRouter();

	const onClick = async () => {
		const {
			data: { data, success },
		} = await api.get("/auth/google");

		if (success) {
			router.push(data);
		}
	};

	return (
		<div className="bg-background flex min-h-screen items-center justify-center">
			<div className="w-full max-w-md rounded-lg bg-white p-8 shadow-xl">
				<Tabs defaultValue="login" className="w-full">
					<TabsList className="mb-6 flex">
						<TabsTrigger
							value="login"
							className="border-primary text-primary data-[state=active]:bg-primary flex-1 rounded-l-md border px-4 py-2 transition-colors data-[state=active]:text-white"
						>
							Login
						</TabsTrigger>
						<TabsTrigger
							value="register"
							className="border-primary text-primary data-[state=active]:bg-primary flex-1 rounded-r-md border px-4 py-2 transition-colors data-[state=active]:text-white"
						>
							Register
						</TabsTrigger>
					</TabsList>
					<TabsContent value="login" className="space-y-4">
						<form className="flex flex-col gap-4">
							<input
								type="email"
								placeholder="Email"
								className="border-secondary focus:border-tertiary w-full rounded border px-3 py-2 focus:outline-none"
							/>
							<input
								type="password"
								placeholder="Password"
								className="border-secondary focus:border-tertiary w-full rounded border px-3 py-2 focus:outline-none"
							/>
						</form>
						<div className="flex justify-center">
							<Button
								onClick={onClick}
								className="hover:bg-secondary flex w-full items-center gap-2 rounded bg-red-500 px-4 py-2 text-white transition-colors"
							>
								Sign in with Google
							</Button>
						</div>
					</TabsContent>
					<TabsContent value="register" className="space-y-4">
						<form className="flex flex-col gap-4">
							<input
								type="email"
								placeholder="Email"
								className="border-secondary focus:border-tertiary w-full rounded border px-3 py-2 focus:outline-none"
							/>
							<input
								type="password"
								placeholder="Password"
								className="border-secondary focus:border-tertiary w-full rounded border px-3 py-2 focus:outline-none"
							/>
							<input
								type="password"
								placeholder="Confirm Password"
								className="border-secondary focus:border-tertiary w-full rounded border px-3 py-2 focus:outline-none"
							/>
						</form>
						<div className="flex justify-center">
							<Button
								onClick={onClick}
								className="hover:bg-secondary flex w-full items-center gap-2 rounded bg-red-500 px-4 py-2 text-white transition-colors"
							>
								Sign in with Google
							</Button>
						</div>
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}
