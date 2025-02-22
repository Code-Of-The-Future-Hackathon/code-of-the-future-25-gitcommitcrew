"use client";

import React, {
	createContext,
	useState,
	useContext,
	ReactNode,
	useEffect,
} from "react";
import type { User } from "../../backend/src/services/user/models/users";
import { api } from "@/lib/api";

interface IUserContext {
	user: User | null;
	setUser: (user: User | null) => void;
}

const UserContext = createContext<IUserContext | undefined>(undefined);

interface Props {
	children: ReactNode;
}

export const UserProvider: React.FC<Props> = ({ children }) => {
	const [user, setUser] = useState<User | null>(null);

	useEffect(() => {
		api.get("/user/me").then(({ data }) => {
			if (data.success) {
				setUser(data.data);
			}
		});
	}, []);

	return (
		<UserContext.Provider value={{ user, setUser }}>
			{children}
		</UserContext.Provider>
	);
};

export const useUser = (): IUserContext => {
	const context = useContext(UserContext);
	if (context === undefined) {
		throw new Error("useUser must be used within a UserProvider");
	}
	return context;
};
