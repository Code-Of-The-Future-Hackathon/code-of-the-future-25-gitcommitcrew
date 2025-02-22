import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { pgTable, primaryKey, uuid } from "drizzle-orm/pg-core";
import { Host } from "./hosts";
import { Organization } from "@services/user/models";

const OrganizationHost = pgTable(
	"organization_host",
	{
		organizationId: uuid("organization_id")
			.notNull()
			.references(() => Organization.id),
		hostId: uuid("host_id")
			.notNull()
			.references(() => Host.id),
	},
	(table) => [primaryKey({ columns: [table.organizationId, table.hostId] })],
);

type TOrganizationHost = InferSelectModel<typeof OrganizationHost>;
type NewOrganizationHost = InferInsertModel<typeof OrganizationHost>;

export { OrganizationHost };

export type { TOrganizationHost, NewOrganizationHost };
