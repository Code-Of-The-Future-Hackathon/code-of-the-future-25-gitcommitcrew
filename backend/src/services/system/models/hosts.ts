import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { boolean, integer, pgTable, text, uuid } from "drizzle-orm/pg-core";

const Host = pgTable("host", {
	id: uuid("id").primaryKey().defaultRandom(),
	ip: text("ip").notNull(),
	claimed: boolean("claimed").notNull().default(false),
	passwordHash: text("password_hash").notNull(),
	mac: text("mac").notNull().unique(),
	hostname: text("hostname").notNull(),
	port: integer("port").notNull(),
	org: text("org").notNull(),
});

type THost = InferSelectModel<typeof Host>;
type NewHost = InferInsertModel<typeof Host>;

export { Host };

export type { THost, NewHost };
