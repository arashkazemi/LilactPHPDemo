const { require, render, useState, Provider, Spinner } = Lilact;
const { css, injectGlobal } = Lilact.emotion;

const { UserProvider, useUser } = require("client/UserContext.jsx");
const { LoginModal, RegisterModal, ChangePasswordModal } = require("client/AuthModals.jsx");

const { store } = require("client/itemsStore.jsx");
const Items = require("client/Items.jsx");

const toolbarStyle = css( { 
						display: "flex", 
						gap: 8, 
						flexWrap: "wrap",
						background: "rgb(238, 225, 236) url(icon.png) center",
						padding: 16,
						lineHeight: "32px",
						height: 36,
						textShadow: "0 0 5px #fff"

					} );

const toolbarWrapStyle = css({
	display: "block",
	position: "sticky",
	top:0,
	left:0,
	right:0,
	boxShadow: "0 0 10px #0003"
});

function Main() {
	const { user, logout, loading } = useUser();
	const [loginOpen, setLoginOpen] = useState(false);
	const [registerOpen, setRegisterOpen] = useState(false);
	const [pwOpen, setPwOpen] = useState(false);


	injectGlobal( {
		body: { 
			margin: 0,
			fontFamily: "Ubuntu, 'Segoe UI', 'Noto Sans', helvetica, sans", 
			fontSize: "14px",
		}
	});

	return (
		<>
			<div  className={toolbarWrapStyle}>
				<div  className={toolbarStyle}>
				{user ? <>
							<div>Logged in as: <b>{" " + user.username}</b></div>
							<div>
								<button onClick={() => setPwOpen(true)} disabled={loading}>Change password</button>
								<button
									onClick={async () => {
										await logout();
									}}
									disabled={loading}
								>
									{loading ? "Logging out..." : "Logout"}
								</button>
							</div>
						</>
				 : loading ? <Spinner size="36"/> : 
							<>
								<button onClick={() => setLoginOpen(true)}>Login</button>
								<button onClick={() => setRegisterOpen(true)}>Register</button>
							</>
					
				}
				</div>
			</div>
			<Items />

			<LoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} />
			<RegisterModal isOpen={registerOpen} onClose={() => setRegisterOpen(false)} />
			<ChangePasswordModal isOpen={pwOpen} onClose={() => setPwOpen(false)} />
		</>
	);
}

module.exports = function App() {
	return (
		<UserProvider>
			<Provider store={store}>				
				<Main />
			</Provider>				
		</UserProvider>
	);
}
