import Header from "./Header.jsx";
import Product from "./Product.jsx";
import { useState, useEffect } from "react";
import { db } from "../../firebase.config";

import { getDocs, collection, query } from "firebase/firestore";

export default function Home({search}) {
    const [userProducts, setUserProducts] = useState([]);

    async function getProductsView() {
        const q = await query(collection(db, "Products"));
        const querySnapshot = await getDocs(q);
        const userItems = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            data["pid"] = doc.id;
            userItems.push(data);
        });
        setUserProducts(userItems);
    }
    useEffect(() => {
        getProductsView();
    }, []);
    return (
        <>
            <Header />

            <div className="xl:mt-80 mb-40  w-11/12 mx-auto">
                <h2 className="text-4xl p-3 text-green-600 font-semibold">
                    Our Products
                </h2>
                <div className="p-3 flex flex-wrap gap-5">
                    {userProducts.length > 0 &&  userProducts.filter((item) => {

                        if( !search || item["title"].toLowerCase().includes(search.toLowerCase())) return true
                        
                    }).map(item=>{
                        return (
                            <Product
                                key={Date.now() + item.title}
                                text={item}
                            />
                        );
                    })}
                </div>
            </div>
            <div className="bg-green-600 p-4">
                <p className="text-white">
                    © 2023 National Engineering College kovilpatti, Information
                    Technology Inc. All rights reserved.
                </p>
            </div>
        </>
    );
}
