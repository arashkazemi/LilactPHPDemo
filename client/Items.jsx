const { useEffect, useState, useContext, Spinner } = Lilact;
const { useDispatch, useSelector, Provider, render } = Lilact;
const { UserContext } = require("client/UserContext.jsx");
const { store, itemsLoading, itemsLoaded, itemsError, itemAdded, itemUpdated, itemDeleted } = require("client/itemsStore.jsx");

const {css} = Lilact.emotion;

const ItemEditorModal = require("client/ItemEditorModal.jsx");

const API_PATH = "store/items.php";
const itemsBoxStyle = css({padding: 20});
const blogItemStyle = css( { marginBottom: 30, p: {whiteSpace: "pre-line"} } );


function Items() {

	const dispatch = useDispatch();
	const { items, loading, error } = useSelector((s) => s.items);
	const user = useContext(UserContext).user;

	const currentUserId = user?.id ?? null;

	const [editorOpen, setEditorOpen] = useState(false);
	const [editorMode, setEditorMode] = useState("add"); // "add" | "edit"
	const [editingItem, setEditingItem] = useState(null);

	function openAdd() {
		setEditorMode("add");
		setEditingItem(null);
		setEditorOpen(true);
	}

	function openEdit(item) {
		setEditorMode("edit");
		setEditingItem(item);
		setEditorOpen(true);
	}

	async function refresh() {
		dispatch(itemsLoading());

		try {
			const res = await fetch(API_PATH);
			const data = await res.json();
			dispatch(itemsLoaded(data.items));
		} catch (e) {
			dispatch(itemsError(e.message || "Request failed"));
		}
	}

	useEffect(() => {
		refresh();
	}, [dispatch]);

	async function addItem({ title, content }) {
		const res = await fetch(API_PATH, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ title, content }),
		});
		const data = await res.json();
		if (!res.ok && data?.error) throw new Error(data.error);
		dispatch(itemAdded(data.item));
	}

	async function saveItem({ title, content }) {
		const id = editingItem.id;

		const res = await fetch(`${API_PATH}?id=${id}`, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ title, content }),
		});
		const data = await res.json();
		if (!res.ok && data?.error) throw new Error(data.error);

		dispatch(itemUpdated(data.item));
	}

	async function deleteItem(item) {
		const res = await fetch(`${API_PATH}?id=${item.id}`, { method: "DELETE" });
		const data = await res.json();
		if (!res.ok && data?.error) throw new Error(data.error);
		dispatch(itemDeleted(item.id));
	}

	async function onSubmitEditor(payload) {
		if (editorMode === "add") return addItem(payload);
		return saveItem(payload);
	}

	return (
		<div className={itemsBoxStyle}>
			<h3>Posts</h3>
			{currentUserId &&
				<button type="button" onClick={openAdd}>
					Create Post
				</button>
			}
			<hr/>
			{loading && <Spinner/>}
			{error && <div style={{ color: "red" }}>{error}</div>}

			<>
				{items.map((it) => {

					const isOwner = currentUserId != null && it.owner_id == currentUserId;

					return (
						<div className={blogItemStyle} key={it.id}>
							<h3>{it.title} 
								{isOwner ? (
								<> {"  "}
									<button type="button" onClick={() => openEdit(it)}>
										Edit
									</button>{" "}
									<button
										type="button"
										onClick={async () => {deleteItem(it)}}
									>
										Delete
									</button>
								</>
							) : null}
							</h3>
							<p>{it.content}</p>
							<p><small>Created by {" "}<b>{it.username}</b>{" "}on{" "}<b>{it.created_at}</b></small></p>
							<hr/>
						</div>
					);
				})}
			</>

			<ItemEditorModal
				isOpen={editorOpen}
				mode={editorMode}
				onClose={() => setEditorOpen(false)}
				onSubmit={onSubmitEditor}
				initialTitle={editorMode === "edit" ? editingItem?.title : ""}
				initialContent={editorMode === "edit" ? editingItem?.content : ""}
			/>
		</div>
	);
}

module.exports = Items;
