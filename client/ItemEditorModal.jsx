const { useEffect, useState } = Lilact;

const ModalDialog = require("client/ModalDialog.jsx");

module.exports = function ItemEditorModal({
	isOpen,
	mode, // "add" | "edit"
	onClose,
	onSubmit, // async ({title, content}) => void
	initialTitle = "",
	initialContent = "",
}) {
	const [title, setTitle] = useState(initialTitle);
	const [content, setContent] = useState(initialContent);
	const [error, setError] = useState("");

	useEffect(() => {
		if (!isOpen) return;
		setTitle(initialTitle || "");
		setContent(initialContent || "");
		setError("");
	}, [isOpen, initialTitle, initialContent]);

	async function submit(e) {
		e.preventDefault();
		setError("");
		try {
			await onSubmit({ title, content });
			onClose?.();
		} catch (err) {
			setError(err?.message || "Request failed");
		}
	}

	return (
		<ModalDialog
			isOpen={isOpen}
			onClose={onClose}
			title={mode === "edit" ? "Edit item" : "Add item"}
			error={error}
		>
			<form onSubmit={submit} style={{ display: "grid", gap: 10 }}>
				<label style={{ display: "grid", gap: 6 }}>
					<span>Title</span>
					<input value={title} onInput={(e) => setTitle(e.target.value)} />
				</label>

				<label style={{ display: "grid", gap: 6 }}>
					<span>Content</span>
					<textarea value={content} onInput={(e) => setContent(e.target.value)} />
				</label>

				<button type="submit">
					{mode === "edit" ? "Save changes" : "Add"}
				</button>
			</form>
		</ModalDialog>
	);
};
