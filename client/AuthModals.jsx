const { require, useState } = Lilact;
const ModalDialog =  require("client/ModalDialog.jsx");
const { useUser } =  require("client/UserContext.jsx");

function LoginModal({ isOpen, onClose, onSuccess }) {
	const { login, loading } = useUser();
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");

	async function submit(e) {
		e.preventDefault();
		setError("");
		try {
			await login({ username, password });
			onSuccess?.();
			onClose?.();
		} catch (err) {
			setError(err.message || "Login failed");
		}
	}

	return (
		<ModalDialog isOpen={isOpen} onClose={onClose} title="Login" error={error}>
			<form onSubmit={submit} style={{ display: "grid", gap: 10 }}>
				<label style={{ display: "grid", gap: 6 }}>
					<span>Username</span>
					<input value={username} onInput={(e) => setUsername(e.target.value)} autoComplete="username" />
				</label>

				<label style={{ display: "grid", gap: 6 }}>
					<span>Password</span>
					<input
						type="password"
						value={password}
						onInput={(e) => setPassword(e.target.value)}
						autoComplete="current-password"
					/>
				</label>

				<button disabled={loading} type="submit">
					{loading ? "Logging in..." : "Log in"}
				</button>
			</form>
		</ModalDialog>
	);
}

function RegisterModal({ isOpen, onClose, onSuccess }) {
	const { register, loading } = useUser();
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");

	async function submit(e) {
		e.preventDefault();
		setError("");
		try {
			await register({ username, password });
			onSuccess?.();
			onClose?.();
		} catch (err) {
			setError(err.message || "Registration failed");
		}
	}

	return (
		<ModalDialog isOpen={isOpen} onClose={onClose} title="Register" error={error}>
			<form onSubmit={submit} style={{ display: "grid", gap: 10 }}>
				<label style={{ display: "grid", gap: 6 }}>
					<span>Username</span>
					<input value={username} onInput={(e) => setUsername(e.target.value)} autoComplete="username" />
				</label>

				<label style={{ display: "grid", gap: 6 }}>
					<span>Password</span>
					<input
						type="password"
						value={password}
						onInput={(e) => setPassword(e.target.value)}
						autoComplete="new-password"
					/>
				</label>

				<button disabled={loading} type="submit">
					{loading ? "Creating account..." : "Create account"}
				</button>
			</form>
		</ModalDialog>
	);
}

function ChangePasswordModal({ isOpen, onClose, onSuccess }) {
	const { changePassword, loading } = useUser();
	const [oldPassword, setOldPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [error, setError] = useState("");

	async function submit(e) {
		e.preventDefault();
		setError("");
		try {
			await changePassword({ oldPassword, newPassword });
			onSuccess?.();
			onClose?.();
		} catch (err) {
			setError(err.message || "Could not change password");
		}
	}

	return (
		<ModalDialog isOpen={isOpen} onClose={onClose} title="Change password" error={error}>
			<form onSubmit={submit} style={{ display: "grid", gap: 10 }}>
				<label style={{ display: "grid", gap: 6 }}>
					<span>Old password</span>
					<input
						type="password"
						value={oldPassword}
						onInput={(e) => setOldPassword(e.target.value)}
						autoComplete="current-password"
					/>
				</label>

				<label style={{ display: "grid", gap: 6 }}>
					<span>New password</span>
					<input
						type="password"
						value={newPassword}
						onInput={(e) => setNewPassword(e.target.value)}
						autoComplete="new-password"
					/>
				</label>

				<button disabled={loading} type="submit">
					{loading ? "Updating..." : "Update password"}
				</button>
			</form>
		</ModalDialog>
	);
}

module.exports = { LoginModal, RegisterModal, ChangePasswordModal };