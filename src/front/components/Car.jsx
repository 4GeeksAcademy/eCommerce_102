import useGlobalReducer from "../hooks/useGlobalReducer";

export const Car = () => {
    const { store, dispatch } = useGlobalReducer();

    async function handleSale() {
        const token = localStorage.getItem('token');
        const backendUrl = import.meta.env.VITE_BACKEND_URL

        const resp = await fetch(`${backendUrl}/api/sale`, {
            method: 'POST',
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({"products": store.products})
        });

        if(!resp.ok) {
            throw Error("There was a problem in the login request")
        } else if(resp.status === 404) {
            throw Error("Missing or invalid token");
        } else {
            const data = await resp.json();
            alert(data.message);      
            console.log(data);
        }
    }

    return (
        <>
            <div className="container text-center">
                <h1>Car</h1>
                {
                    store.products.length > 0 ? (
                        <>
                            <div className="row justify-content-md-center">
                                <div className="col col-lg-2">
                                    Product_Id
                                </div>
                                <div className="col-md-auto">
                                    Shop_id
                                </div>
                                <div className="col col-lg-2">
                                    Qty
                                </div>
                                <div className="col col-lg-2">
                                    Price
                                </div>
                            </div>
                            {
                                store.products.map((product, index) => {
                                    return (
                                        <div className="row justify-content-md-center" key={index}>
                                            <div className="col col-lg-2">
                                                {product.product_id}
                                            </div>
                                            <div className="col-md-auto">
                                                {product.shop_id}
                                            </div>
                                            <div className="col col-lg-2">
                                                {product.qty}
                                            </div>
                                            <div className="col col-lg-2">
                                                {product.price}
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </>
                    ) : (
                        <>
                            <h3>No hay productos en el carrito de compra</h3>
                        </>
                    )
                }
                <button type="button" onClick={handleSale} className="btn btn-primary">Comprar</button>
            </div>
        </>
    );
}