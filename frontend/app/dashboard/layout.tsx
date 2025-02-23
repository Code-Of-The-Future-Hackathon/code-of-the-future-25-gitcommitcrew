import { UserNav } from "@/components/dashboard/user-nav";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="bg-background min-h-screen">
			{/* Navigation */}
			<header className="border-b">
				<div className="container mx-auto px-4">
					<div className="flex h-16 items-center justify-between">
						<div className="flex w-full items-center justify-end gap-4">
							<Button variant="ghost" size="icon">
								<Bell className="h-5 w-5" />
							</Button>
							<UserNav />
						</div>
					</div>
				</div>
			</header>

			{/* Main content */}
			<main className="container mx-auto px-4 py-6">{children}</main>
		</div>
	);
}
