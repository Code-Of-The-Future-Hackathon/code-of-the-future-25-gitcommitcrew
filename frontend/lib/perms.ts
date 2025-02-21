import { eq } from "drizzle-orm";
import { db } from "./db"; // your Drizzle db instance
import {
	permissionTable,
	rolePermissionTable,
	userRoleTable,
} from "./db/schema";

// Helper: checks if a single required permission is met by the user's permissions.
function permissionMatch(userPermissions: string[], required: string): boolean {
	if (required.includes("*")) {
		const prefix = required.replace("*", "");
		return userPermissions.some((perm) => perm.startsWith(prefix));
	}
	return userPermissions.includes(required);
}

/**
 * hasPerms checks if the given user has every permission from the required list.
 * It fetches the user's permissions by joining user_role, role_permission, and permission tables.
 */
export async function hasPerms(
	user: { id: string },
	requiredPermissions: string[]
): Promise<boolean> {
	// Query the permissions for the user
	const permsResult = await db
		.select({ name: permissionTable.name })
		.from(userRoleTable)
		.innerJoin(
			rolePermissionTable,
			eq(userRoleTable.roleId, rolePermissionTable.roleId)
		)
		.innerJoin(
			permissionTable,
			eq(rolePermissionTable.permissionId, permissionTable.id)
		)
		.where(eq(userRoleTable.userId, user.id));

	if (permsResult.length < 1 && requiredPermissions.length >= 1) {
		return false;
	}

	// Map the query result to an array of permission strings.
	const userPermissions = permsResult.map((row) => row.name);

	// Check each required permission using our helper.
	return requiredPermissions.every((req) =>
		permissionMatch(userPermissions, req)
	);
}
