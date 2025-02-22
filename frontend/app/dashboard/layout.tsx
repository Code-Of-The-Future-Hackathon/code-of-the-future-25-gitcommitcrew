import { getCurrentSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { userToOrganization, organizationTable } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { UserNav } from "@/components/dashboard/user-nav";
import { OrganizationSwitcher } from "@/components/dashboard/org-switcher";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const { user } = await getCurrentSession();
	if (!user) redirect("/auth");

	// Get user's organizations
	const userOrgs = await db
		.select({
			organization: organizationTable,
			role: userToOrganization.role,
		})
		.from(userToOrganization)
		.innerJoin(
			organizationTable,
			eq(userToOrganization.organizationId, organizationTable.id),
		)
		.where(eq(userToOrganization.userId, user.id));

	if (userOrgs.length === 0) {
		return (
			<div className="flex h-screen items-center justify-center">
				<div className="space-y-4 text-center">
					<h1 className="text-2xl font-bold">No Organization Access</h1>
					<p className="text-muted-foreground">
						You need to be a part of an organization to access the dashboard.
					</p>
					<p className="text-muted-foreground">
						Please contact your administrator for access.
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="bg-background min-h-screen">
			{/* Navigation */}
			<header className="border-b">
				<div className="container mx-auto px-4">
					<div className="flex h-16 items-center justify-between">
						<OrganizationSwitcher organizations={userOrgs} />

						<div className="flex items-center gap-4">
							<Button variant="ghost" size="icon">
								<Bell className="h-5 w-5" />
							</Button>
							<UserNav user={user} />
						</div>
					</div>
				</div>
			</header>

			{/* Main content */}
			<main className="container mx-auto px-4 py-6">{children}</main>
		</div>
	);
}
