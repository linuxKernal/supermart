import { useState } from "react";

function SuperCard({ text, props, trashHandler }) {
    const [isHover, setIsHover] = useState(false);
    const handeClick = () => {
        props(text);
    };
    return (
        <div className="w-96 bg-white shadow-lg">
            <div className="relative overflow-hidden">
                <img
                    className="w-full h-52 hover:scale-110 duration-700"
                    src={text.image}
                    alt=""
                />
            </div>
            <div className="p-3">
                <button
                    onClick={handeClick}
                    className="text-green-500  pl-0.5 hover:underline"
                >
                    Edit
                </button>
                <button
                    onClick={() => trashHandler(text.pid)}
                    className="text-red-600 px-2 hover:underline"
                >
                    Delete
                </button>
                <h2 className="text-xl pb-1">{text.title}</h2>
                <p className="flex gap-1">
                    <span className="font-semibold">Description:</span>
                    <span className="italic">{text.notes}</span>
                </p>
                <p className="flex gap-1">
                    <span className="font-semibold">Price:</span>
                    <span>${text.price}</span>
                </p>
                <p className="flex gap-1">
                    <span className="font-semibold">Phone:</span>
                    <span>{text.phone}</span>
                </p>
                <p className="flex gap-1">
                    <span className="font-semibold">Address:</span>
                    <span>{text.address}</span>
                </p>
            </div>
        </div>
    );
}

export default SuperCard;
