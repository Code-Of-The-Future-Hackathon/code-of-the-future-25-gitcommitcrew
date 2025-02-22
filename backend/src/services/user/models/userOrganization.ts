import { pgEnum, pgTable, primaryKey, uuid } from "drizzle-orm/pg-core";
import { Users } from "./users";
import { Organization } from "./organization";
import { InferInsertModel, InferSelectModel } from "drizzle-orm";

const RoleEnum = pgEnum("role_enum", ["admin", "user"]);

const UserOrganization = pgTable(
	"user_organization",
	{
		userId: uuid("user_id")
			.references(() => Users.id)
			.notNull(),
		organizationId: uuid("organization_id")
			.references(() => Organization.id)
			.notNull(),
		role: RoleEnum("role").notNull().default("user"),
	},
	(table) => [primaryKey({ columns: [table.userId, table.organizationId] })],
);

type TUserOrganization = InferSelectModel<typeof UserOrganization>;
type NewUserOrganization = InferInsertModel<typeof UserOrganization>;

export { UserOrganization, RoleEnum };

export type { TUserOrganization, NewUserOrganization };
