import {
	pgTable,
	text,
	integer,
	timestamp,
	boolean,
	primaryKey,
} from "drizzle-orm/pg-core";
import type { InferSelectModel } from "drizzle-orm";
import { randomUUID } from "crypto";

export const userTable = pgTable("user", {
	id: text("id").primaryKey().$defaultFn(randomUUID),
	githubId: integer("githubId"),
	username: text("username"),
	email: text("email"),
});

export const hostToUser = pgTable("userToHost", {
	id: text("id").primaryKey().$defaultFn(randomUUID),
	userId: text("userId")
		.notNull()
		.references(() => userTable.id),
	hostId: text("hostId")
		.notNull()
		.references(() => hostTable.id),
});

export const hostTable = pgTable("host", {
	id: text("id").primaryKey().$defaultFn(randomUUID),
	ip: text("ip").notNull(),
	claimed: boolean("claimed").default(false),
	password: text("password").notNull(),
	mac: text("mac").notNull().unique(),
	hostname: text("hostname").notNull(),
	port: integer("port").notNull(),
	org: text("org").notNull(),
});

export const permissionTable = pgTable("permission", {
	id: text("id").primaryKey().$defaultFn(randomUUID),
	name: text("name").notNull().unique(), // e.g., "read:users", "write:orgs"
	description: text("description"),
});

export const roleTable = pgTable("role", {
	id: text("id").primaryKey().$defaultFn(randomUUID),
	name: text("name").notNull().unique(), // e.g., "admin"
	description: text("description"),
});

export const rolePermissionTable = pgTable(
	"role_permission",
	{
		roleId: text("role_id")
			.notNull()
			.references(() => roleTable.id),
		permissionId: text("permission_id")
			.notNull()
			.references(() => permissionTable.id),
	},
	(table) => [primaryKey({ columns: [table.roleId, table.permissionId] })],
);

export const userRoleTable = pgTable(
	"user_role",
	{
		userId: text("user_id")
			.notNull()
			.references(() => userTable.id),
		roleId: text("role_id")
			.notNull()
			.references(() => roleTable.id),
	},
	(table) => [primaryKey({ columns: [table.userId, table.roleId] })],
);

export const sessionTable = pgTable("session", {
	id: text("id").primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => userTable.id),
	expiresAt: timestamp("expires_at", {
		withTimezone: true,
		mode: "date",
	}).notNull(),
});

export type User = InferSelectModel<typeof userTable>;
export type Session = InferSelectModel<typeof sessionTable>;
export type Host = InferSelectModel<typeof hostTable>;
