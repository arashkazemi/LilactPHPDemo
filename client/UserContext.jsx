const { require, createContext, useContext, useEffect, useMemo, useState } = Lilact;
const usersApi = require("client/usersApi.jsx");

const UserContext = createContext(null);

function useUser() {
	const ctx = useContext(UserContext);
	if (!ctx) throw new Error("useUser must be used within UserProvider");
	return ctx;
}

function UserProvider({ children }) {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(false);
	const [ready, setReady] = useState(false);

	const value = useMemo(() => {
		async function status() {
			setLoading(true);
			try {
				const res = await usersApi("status", {});
				setUser(res?.user ?? null);
			} finally {
				setLoading(false);
				setReady(true);
			}
		}

		async function login({ username, password }) {
			setLoading(true);
			try {
				const res = await usersApi("login", { username, password });
				setUser(res?.user ?? null);
				return res;
			} finally {
				setLoading(false);
			}
		}

		async function register({ username, password }) {
			setLoading(true);
			try {
				const res = await usersApi("register", { username, password });
				setUser(res?.user ?? null);
				return res;
			} finally {
				setLoading(false);
			}
		}

		async function logout() {
			setLoading(true);
			try {
				await usersApi("logout", {});
				setUser(null);
			} finally {
				setLoading(false);
			}
		}

		async function changePassword({ oldPassword, newPassword }) {
			setLoading(true);
			try {
				return await usersApi("changePassword", { oldPassword, newPassword });
			} finally {
				setLoading(false);
			}
		}

		return { user, loading, ready, status, login, register, logout, changePassword };
	}, [user, loading, ready]);

	useEffect(() => {
		// prevent toolbar flash by waiting for status
		value.status();
	}, []);

	return (
		<UserContext.Provider value={value}>
			{children}
		</UserContext.Provider>
	);
}

module.exports = { useUser, UserProvider, UserContext };