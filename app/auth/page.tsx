import { GithubIcon } from "lucide-react";
import Link from "next/link";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function Page() {
	return (
		<div className="min-h-screen flex items-center justify-center bg-background">
			<div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
				<Tabs defaultValue="login" className="w-full">
					<TabsList className="mb-6 flex">
						<TabsTrigger
							value="login"
							className="flex-1 px-4 py-2 border border-primary text-primary 
                         data-[state=active]:bg-primary data-[state=active]:text-white 
                         rounded-l-md transition-colors"
						>
							Login
						</TabsTrigger>
						<TabsTrigger
							value="register"
							className="flex-1 px-4 py-2 border border-primary text-primary 
                         data-[state=active]:bg-primary data-[state=active]:text-white 
                         rounded-r-md transition-colors"
						>
							Register
						</TabsTrigger>
					</TabsList>
					<TabsContent value="login" className="space-y-4">
						<form className="flex flex-col gap-4">
							<input
								type="email"
								placeholder="Email"
								className="w-full px-3 py-2 border border-secondary rounded 
                           focus:outline-none focus:border-tertiary"
							/>
							<input
								type="password"
								placeholder="Password"
								className="w-full px-3 py-2 border border-secondary rounded 
                           focus:outline-none focus:border-tertiary"
							/>
							<div className="flex justify-center">
								<Link
									href="/auth/github"
									className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-secondary 
                             text-white rounded transition-colors"
								>
									<GithubIcon /> Sign in with GitHub
								</Link>
							</div>
						</form>
					</TabsContent>
					<TabsContent value="register" className="space-y-4">
						<form className="flex flex-col gap-4">
							<input
								type="email"
								placeholder="Email"
								className="w-full px-3 py-2 border border-secondary rounded 
                           focus:outline-none focus:border-tertiary"
							/>
							<input
								type="password"
								placeholder="Password"
								className="w-full px-3 py-2 border border-secondary rounded 
                           focus:outline-none focus:border-tertiary"
							/>
							<input
								type="password"
								placeholder="Confirm Password"
								className="w-full px-3 py-2 border border-secondary rounded 
                           focus:outline-none focus:border-tertiary"
							/>
							<div className="flex justify-center">
								<Link
									href="/auth/github"
									className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-secondary 
                             text-white rounded transition-colors"
								>
									<GithubIcon /> Sign in with GitHub
								</Link>
							</div>
						</form>
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}
