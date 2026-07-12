const { combineReducers, createStore } = Lilact.redux;

const itemsLoading = () => ({ type: "items/loading" });
const itemsLoaded = (items) => ({ type: "items/loaded", items });
const itemsError = (message) => ({ type: "items/error", message });

const itemAdded = (item) => ({ type: "items/added", item });
const itemUpdated = (item) => ({ type: "items/updated", item });
const itemDeleted = (id) => ({ type: "items/deleted", id });

const initialState = { items: [], loading: false, error: null };

function itemsReducer(state = initialState, action) {
	switch (action.type) {
		
		case "items/loading":
			return { ...state, loading: true, error: null };
		case "items/loaded":
			return { ...state, loading: false, items: action.items };
		case "items/error":
			return { ...state, loading: false, error: action.message };

		case "items/added":
			return { ...state, items: [action.item, ...state.items] };

		case "items/updated":
			return {
				...state,
				items: state.items.map((x) => (x.id === action.item.id ? action.item : x)),
			};

		case "items/deleted":
			return { ...state, items: state.items.filter((x) => x.id !== action.id) };

		default:
			return state;
	}
}

const rootReducer = combineReducers({ items: itemsReducer });
const store = createStore(rootReducer);

module.exports = {
	store,
	itemsLoading,
	itemsLoaded,
	itemsError,
	itemAdded,
	itemUpdated,
	itemDeleted,
};
