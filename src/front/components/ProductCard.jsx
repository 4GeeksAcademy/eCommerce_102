import { useState } from "react"
import useGlobalReducer from "../hooks/useGlobalReducer";
import { useNavigate } from "react-router-dom"

export const ProductCard = ({ product, shopId }) => {
    const [inputs, setInputs] = useState({});
    const { store, dispatch } = useGlobalReducer();
    const navigate = useNavigate();

    function handleInput(event) {
        const name = event.target.name;
        const value = event.target.value;
        
        setInputs({ ...inputs, [name]: value });
    }

    function handleAddProduct() {
        if(!store.logged) {
            navigate("/login")
        } else {
            if(inputs && inputs['qty'] > 0) {
                dispatch({ type: "add_product", payload: { product_id: product.id, shop_id: parseInt(shopId), qty: parseInt(inputs['qty']), price: product.price } })
            } else {
                alert("La cantidad debe ser mayor a 0")
            }
        }
    }

    return (
        <>
            <div className="card" style={{width: "18rem"}}>
                <div className="card-body">
                    <h5 className="card-title">{product.name} ({product.id})</h5>
                    <h6 className="card-subtitle mb-2 text-body-secondary">{product.price}</h6>
                    <input type="number" name="qty" placeholder="Cantidad" onChange={handleInput} />
                    <button type="button" onClick={handleAddProduct} className="btn btn-primary">+ Add to cart</button>
                </div>
            </div>
        </>
    );
}