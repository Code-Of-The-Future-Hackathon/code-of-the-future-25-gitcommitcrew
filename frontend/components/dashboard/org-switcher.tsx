"use client";

import { Organization, UserToOrganization } from "@/lib/db/schema";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";

interface OrganizationSwitcherProps {
	organizations: {
		organization: Organization;
		role: string;
	}[];
}

export function OrganizationSwitcher({
	organizations,
}: OrganizationSwitcherProps) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const currentOrgId =
		searchParams.get("org") || organizations[0].organization.id;

	return (
		<Select
			value={currentOrgId}
			onValueChange={(orgId) => {
				router.push(`/dashboard?org=${orgId}`);
			}}
		>
			<SelectTrigger className="w-[200px]">
				<SelectValue>
					{
						organizations.find((org) => org.organization.id === currentOrgId)
							?.organization.name
					}
				</SelectValue>
			</SelectTrigger>
			<SelectContent>
				{organizations.map((org) => (
					<SelectItem key={org.organization.id} value={org.organization.id}>
						{org.organization.name}
						<span className="text-muted-foreground ml-2 text-xs">
							({org.role})
						</span>
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}
