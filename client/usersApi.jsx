module.exports = async function usersApi(action, payload) {
	const res = await fetch("store/users.php", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ action, ...payload }),
	});

	let data = null;
	try {
		data = await res.json();
	} catch (_) {}

	if (!res.ok) {
		const msg = data?.error || `Request failed (${res.status})`;
		const err = new Error(msg);
		err.status = res.status;
		err.payload = data;
		console.log(err);
		throw err;
	}

	return data;
}
