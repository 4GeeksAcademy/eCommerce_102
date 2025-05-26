import { Link, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Navbar = () => {

	const { store, dispatch } = useGlobalReducer()
	const navigate = useNavigate();

	function handleLogout() {
		localStorage.removeItem("token");
		dispatch({ type: "handle_login", payload: false });
		navigate("/");
	}

	return (
		<nav className="navbar navbar-light bg-light">
			<div className="container">
				<Link to="/">
					<span className="navbar-brand mb-0 h1">Home</span>
				</Link>
				{
					store.logged ? (
						<>
							<div className="ml-auto">
								<button type="button" onClick={handleLogout} className="btn btn-primary">Logout</button>
							</div>
						</>
					) : (
						<>
							<div className="ml-auto">
								<Link to="/login">
									<button className="btn btn-primary">Login</button>
								</Link>
							</div>
							<div className="ml-auto">
								<Link to="/register">
									<button className="btn btn-secondary">Register</button>
								</Link>
							</div>
						</>
					)
				}
				<div className="ml-auto">
					<Link to="/car">
						<button className="btn btn-primary">Car</button>
					</Link>
				</div>
			</div>
		</nav>
	);
};