import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { timestamp, pgTable, text, uuid } from "drizzle-orm/pg-core";

const Organization = pgTable("organization", {
	id: uuid("id").primaryKey().defaultRandom(),
	name: text("name").notNull(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
});

type TOrganization = InferSelectModel<typeof Organization>;
type NewOrganization = InferInsertModel<typeof Organization>;

export { Organization };

export type { TOrganization, NewOrganization };
