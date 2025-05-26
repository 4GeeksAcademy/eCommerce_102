import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

export const Register = () => {
    const [inputs, setInputs] = useState({});
    const navigate = useNavigate();
    
    function handleInput(event) {
        const name = event.target.name;
        const value = event.target.value;
        
        setInputs({ ...inputs, [name]: value });
    }

    async function register(event) {
        try {
            event.preventDefault();
            const backendUrl = import.meta.env.VITE_BACKEND_URL

            const resp = await fetch(`${backendUrl}/api/user`, { 
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(inputs) 
            })

            if(!resp.ok) throw Error("There was a problem in the login request")

            if(resp.status === 404){
                throw("Invalid data")
            }
            
            navigate("/login");
        } catch(error) {
            console.log(error)
        }
    }
    
    return (
        <>
            <div className="container text-center">
                <div className="row justify-content-md-center">
                    <h1>Register</h1>
                    <div className="col">
                        <form onSubmit={register} method="POST">
                            <div className="mb-6">
                                <label htmlFor="name_id" className="form-label">Name</label>
                                <input id="name_id" type="text" name="name" placeholder="Ingrese su nombre" onChange={handleInput} />
                            </div>
                            <div className="mb-6">
                                <label htmlFor="lastname_id" className="form-label">Lastname</label>
                                <input id="lastname_id" type="text" name="lastname" placeholder="Ingrese su apellido" onChange={handleInput} />
                            </div>
                            <div className="mb-6">
                                <label htmlFor="email_id" className="form-label">Email</label>
                                <input id="email_id" type="email" name="email" placeholder="Ingrese su correo" onChange={handleInput} />
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