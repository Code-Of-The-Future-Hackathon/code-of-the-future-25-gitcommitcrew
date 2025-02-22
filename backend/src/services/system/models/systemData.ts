import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { jsonb, pgEnum, pgTable, timestamp, uuid } from "drizzle-orm/pg-core";
import { Host } from "./hosts";
import { EventData } from "../../../../../events";

export const dataEnum = pgEnum("dataEnum", [
	"cpu",
	"memory",
	"system",
	"battery",
	"network",
	"disk",
	"process",
]);

const SystemData = pgTable("system_data", {
	id: uuid("id").primaryKey().defaultRandom(),
	type: dataEnum("type").notNull(),
	data: jsonb("data").$type<EventData>().notNull(),
	hostId: uuid("host_id")
		.references(() => Host.id)
		.notNull(),
	createdAt: timestamp("created_at").defaultNow(),
});

type TSystemData = InferSelectModel<typeof SystemData>;
type NewSystemData = InferInsertModel<typeof SystemData>;

export { SystemData };

export type { TSystemData, NewSystemData };
