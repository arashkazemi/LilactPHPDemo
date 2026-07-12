module.exports = function ModalDialog({ isOpen, onClose, title, children, error }) {
	if (!isOpen) return null;

	return (
		<div
			role="dialog"
			aria-modal="true"
			style={{
				position: "fixed",
				inset: 0,
				background: "rgba(0,0,0,0.5)",
				display: "grid",
				placeItems: "center",
				zIndex: 9999,
			}}
			onMouseDown={(e) => {
				if (e.target === e.currentTarget && onClose) onClose();
			}}
		>
			<div
				style={{
					width: "min(520px, 92vw)",
					background: "#fff",
					borderRadius: 10,
					padding: 16,
				}}
			>
				<div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
					<h3 style={{ margin: 0 }}>{title}</h3>
					{onClose && (
						<button type="button" onClick={onClose} aria-label="Close">
							✕
						</button>
					)}
				</div>

				{error && (
					<div style={{ marginTop: 10, color: "crimson" }}>
						{error}
					</div>
				)}

				<div style={{ marginTop: 12 }}>
					{children}
				</div>
			</div>
		</div>
	);
}
