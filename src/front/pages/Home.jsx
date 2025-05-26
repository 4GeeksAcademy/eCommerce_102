import React, { useEffect, useState } from "react"
import { ShopCard } from "../components/ShopCard"

export const Home = () => {

	const [shops, setShops] = useState([])

	const loadShops = async () => {
		try {
			const backendUrl = import.meta.env.VITE_BACKEND_URL

			if (!backendUrl) throw new Error("VITE_BACKEND_URL is not defined in .env file")

			const response = await fetch(backendUrl + "/api/shops")
			const data = await response.json()

			if (response.ok) setShops(data.shops)

			return data

		} catch (error) {
			if (error.message) throw new Error(
				`Could not fetch the message from the backend.
				Please check if the backend is running and the backend port is public.`
			);
		}

	}

	useEffect(() => {
		loadShops()
	}, [])

	return (
		<div className="text-center mt-5">
			<h1 className="display-4">Shops</h1>
			<div className="d-flex flex-wrap justify-content-center">
				{shops.length > 0 ? (
					shops.map((shop, index) => {
						return (<ShopCard shop={shop} key={index} />)
					})
				) : (
					<span className="text-danger">
						Loading message from the backend (make sure your python 🐍 backend is running)...
					</span>
				)}
			</div>
		</div>
	);
}; 