import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ProductCard } from "./ProductCard"

export const Products = () => {
    const { shop_id } = useParams()
    const [products, setProducts] = useState([])

    async function loadShopProducts() {
        try {
			const backendUrl = import.meta.env.VITE_BACKEND_URL

			if (!backendUrl) throw new Error("VITE_BACKEND_URL is not defined in .env file")

			const response = await fetch(`${backendUrl}/api/shops/${shop_id}/products`)
			const data = await response.json()

			if (response.ok) setProducts(data.products)
		} catch (error) {
			if (error.message) throw new Error(
				`Could not fetch the message from the backend.
				Please check if the backend is running and the backend port is public.`
			);
		}
    }
    
    useEffect(() => {
        loadShopProducts();
    }, [])

    return (
        <div className="text-center mt-5">
            <h1 className="display-4">Shop Products</h1>
            <div className="d-flex flex-wrap justify-content-center">
                {products.length > 0 ? (
                    products.map((product, index) => {
                        return (<ProductCard product={product} shopId={shop_id} key={index} />)
                    })
                ) : (
                    <span className="text-danger">
                        Loading message from the backend (make sure your python 🐍 backend is running)...
                    </span>
                )}
            </div>
        </div>
    );
}