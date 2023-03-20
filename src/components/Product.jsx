import picture from "../assets/placeholder.png";

import { Link } from "react-router-dom";

function Product({ text: data }) {
    return (
        <Link to={`/product/${data.pid}`} >
            <div className="w-80 shadow-lg rounded-md hover:scale-105 duration-700">
                <img className="w-full h-48 rounded-t-md" src={data.image} alt="" />
                <div className="bg-white p-3 rounded-b-md">
                    <span className="flex gap-1 items-center text-gray-600">
                        <img
                            className="w-4"
                            src={picture}
                            alt=""
                        />
                        <p className="italic">{data.address}</p>
                    </span>
                    <h4 className="text-xl font-normal">{data.title}</h4>
                    <h2 className="text-lg font-medium ">${data.price}</h2>
                    <h2 className="text-md font-medium ">phone: {data.phone}</h2>
                </div>
            </div>
        </Link>
    );
}

export default Product;
