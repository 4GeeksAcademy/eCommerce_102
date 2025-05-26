import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Login = () => {
    const { store, dispatch } = useGlobalReducer();
    const [inputs, setInputs] = useState({});
    const navigate = useNavigate();

    function handleInput(event) {
        const name = event.target.name;
        const value = event.target.value;
        
        setInputs({ ...inputs, [name]: value });
    }

    const login = async (event) => {
        try {
            event.preventDefault();
            const backendUrl = import.meta.env.VITE_BACKEND_URL

            const resp = await fetch(`${backendUrl}/api/token`, { 
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(inputs) 
            })

            if(!resp.ok) throw Error("There was a problem in the login request")

            if(resp.status === 401){
                throw("Invalid credentials")
            }
            else if(resp.status === 400){
                throw ("Invalid email or password format")
            }
            const data = await resp.json()
            
            localStorage.setItem("token", data.token);
            dispatch({ type: "handle_login", payload: true })
            navigate("/")
        } catch(error) {
            console.log(error)
        }
    }

    return (
        <>
            <div className="container text-center">
                <div className="row justify-content-md-center">
                    <h1>Login</h1>
                    <div className="col">
                        <form onSubmit={login} method="POST">
                            <div className="mb-6">
                                <label htmlFor="email_id" className="form-label">Email</label>
                                <input id="email_id" type="text" name="email" placeholder="Ingrese su correo" onChange={handleInput} />
                            </div>
                            <div className="mb-6">
                                <label htmlFor="password_id" className="form-label">Password</label>
                                <input id="password_id" type="password" name="password" placeholder="Ingrese su contraseña" onChange={handleInput} />
                            </div>

                            <div className="container text-center mt-3">
                                <div className="row justify-content-md-center">
                                    <div className="col col-lg-2">
                                        <Link to="/">
                                            <button className="btn btn-secondary btn-sm">Volver</button>
                                        </Link>
                                    </div>
                                    <div className="col col-lg-2">
                                        <button type="submit" className="btn btn-primary btn-sm">Enviar</button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}