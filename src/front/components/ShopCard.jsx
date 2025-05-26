import { Link } from "react-router-dom";

export const ShopCard = ({ shop }) => {
    return (
        <>
            <div className="card" style={{width: "18rem"}}>
                <div className="card-body">
                    <h5 className="card-title">{shop.name} ({shop.id})</h5>
                    <h6 className="card-subtitle mb-2 text-body-secondary">{shop.location}</h6>
                    <Link to={`/${shop.id}/products`}>
                        <button className="btn btn-primary">Products</button>
                    </Link>
                </div>
            </div>
        </>
    );
}