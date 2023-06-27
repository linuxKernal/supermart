import { useState, useEffect } from "react";
import { db } from "../../firebase.config";
import { useParams } from "react-router-dom";
import { getDoc, doc } from "firebase/firestore";

import image from "../assets/nature.jpg";

function ViewProduct() {
    const { id } = useParams();
    const [userText, setUserText] = useState(false);
    async function getProductsView() {
        const q = await doc(db, "Products", id);
        const productData = await getDoc(q);
        const textData = productData.data();
        setUserText(textData);
    }
    useEffect(() => {
        getProductsView();
    }, []);
    return (
        <div className="h-[90vh]">
            <div className="h-52 relative">
                <img className="w-full h-full" src={image} alt="" />
                <div className="absolute top-2/4 left-10 flex items-center gap-3">
                    <div className="bg-white p-1 rounded-full">
                        <img
                            className="rounded-full w-40 h-40"
                            src={userText.userImage}
                            alt=""
                        />
                    </div>

                    <h2 className="font-semibold text-2xl text-white mb-5 capitalize">
                        {userText.user}
                    </h2>
                </div>
            </div>
            {userText ? (
                <div className="mx-auto w-8/12 max-w-max flex flex-wrap gap-2  mt-24 ">
                    <div className="">
                        <img
                            className="w-full max-w-[360px] h-full rounded-md"
                            src={userText.image}
                            alt=""
                        />
                    </div>

                    <div className=" h-full">
                        <h2 className="text-3xl font-semibold capitalize mb-1">
                            {userText.title}
                        </h2>
                        <p className="italic font-normal text-md">
                            {userText.notes}
                        </p>
                        <span className="flex gap-1">
                            ${userText.price} USD
                        </span>

                        <h2>{userText.address}</h2>
                        <h2>{userText.phone}</h2>
                    </div>
                </div>
            ) : (
                <div className="text-xl mt-1 ml-1">Loading...</div>
            )}
        </div>
    );
}

export default ViewProduct;
