import { useEffect } from "react";
import { useState, useRef } from "react";
import SuperCard from "./SuperCard";
import { storage, db, auth } from "../../firebase.config";
import { getDownloadURL, uploadBytes, ref } from "firebase/storage";
import {
    addDoc,
    getDocs,
    collection,
    query,
    where,
    updateDoc,
    doc,
    deleteDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

function DashBoard() {
    const [AlertShow, setAlertShow] = useState(false);
    const [formButtonClicked, setFormButtonClicked] = useState(false);
    const [userProducts, setUserProducts] = useState([]);
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [price, setPrice] = useState("");
    const [address, setAddress] = useState("");
    const file = useRef();
    const [notes, setNotes] = useState("");
    const [isUpdate, setIsUpdate] = useState(false);
    const [currentPid, setCurrentPid] = useState("");
    function clearFormInput() {
        setName("");
        setAddress("");
        setPhone("");
        setPrice("");
        setNotes("");
    }
    function handlEvents(event) {
        if (event.key === "Escape") {
            setAlertShow(false);
            clearFormInput();
        }
    }
    async function handleTrashProduct(pid) {
        console.log("PID", pid);
        await deleteDoc(doc(db, "Products", pid));
        getUserProducts();
    }
    console.log("Dashboard Page")
    function handleUpdateForm(productData) {
        console.log(name, phone, price, address, notes, productData);
        setName(productData.title);
        setPhone(productData.phone);
        setPrice(productData.price);
        setAddress(productData.address);
        setNotes(productData.notes);
        setCurrentPid(productData.pid);
        setIsUpdate(true);
        setAlertShow(true);
    }

    async function getUserProducts() {
        const q = await query(
            collection(db, "Products"),
            where("uid", "==", `${auth.currentUser.uid}`)
        );
        const querySnapshot = await getDocs(q);
        const userItems = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            data["pid"] = doc.id;
            userItems.push(data);
            console.log(data);
        });
        setUserProducts(userItems);
    }
    async function fileFirebase(storageRef, fileType) {
        let dataUrl;
        await uploadBytes(storageRef, file.current.files[0], {
            contentType: fileType,
        })
            .then(async (snapshot) => {
                console.log("Uploaded a blob or file!");
                return await getDownloadURL(snapshot.ref);
            })
            .then((imageUrl) => {
                dataUrl = imageUrl;
            })
            .catch((error) => console.log("FILE error", error));
        return dataUrl;
    }

    async function handleFormUpdate(event) {
        event.preventDefault();
        setFormButtonClicked(true);
        const productData = {
            uid: auth.currentUser.uid,
            title: name,
            phone: phone,
            price: price,
            address: address,
            notes: notes,
        };
        const sendFirestoreData = async () => {
            await updateDoc(doc(db, "Products", currentPid), productData)
                .then((status) => {
                    console.log("Product Record Upload Success");
                    getUserProducts();
                    setAlertShow(false);
                    setFormButtonClicked(false);
                    setIsUpdate(false);
                    clearFormInput()
                })
                .catch((error) => {
                    console.log("Product Record error", error);
                    setIsUpdate(false);
                });
        };
        if (file.current.files.length === 1) {
            const storageRef = ref(
                storage,
                `products/${auth.currentUser.uid}_${file.current.files[0].name}`
            );
            productData["image"] = await fileFirebase(
                storageRef,
                file.current.files[0].type
            );
            sendFirestoreData();
        } else sendFirestoreData();
    }

    async function handleFormSubmit(event) {
        event.preventDefault();
        setFormButtonClicked(true);
        const productData = {
            uid: auth.currentUser.uid,
            title: name,
            phone: phone,
            price: price,
            address: address,
            notes: notes,
            user:auth.currentUser.displayName,
            userImage:auth.currentUser.photoURL,
            image: "https://firebasestorage.googleapis.com/v0/b/super-mart-b298a.appspot.com/o/assets%2Fnature.jpg?alt=media&token=0472fdcd-97b3-4011-a60c-1e98c0fb8c6d",
        };
        const sendFirestoreData = async () => {
            await addDoc(collection(db, "Products"), productData)
                .then((status) => {
                    console.log("Product Record Upload Success");
                    getUserProducts();
                    setAlertShow(false);
                    setFormButtonClicked(false);
                    clearFormInput();
                })
                .catch((error) => {
                    console.log("Product Record error", error);
                });
        };
        if (file.current.files.length === 1) {
            const storageRef = ref(
                storage,
                `products/${auth.currentUser.uid}_${file.current.files[0].name}`
            );
            productData["image"] = await fileFirebase(
                storageRef,
                file.current.files[0].type
            );
            sendFirestoreData();
        } else sendFirestoreData();
    }

    console.log(auth?.currentUser);

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                getUserProducts();
            } else {
            }
        });
    }, []);

    useEffect(() => {
        document.addEventListener("keydown", handlEvents);
        return () => document.removeEventListener("keydown", handlEvents);
    }, []);
    return (
        <>
            <div className="w-full h-full">
                <div className="m-10 w-11/12 mx-auto">
                    <div className="flex gap-3 items-center">
                        <h2 className="text-3xl mb-2 p-2">Our Products</h2>
                        <button
                            onClick={() => setAlertShow(true)}
                            className="bg-green-400 text-white rounded-md p-2 px-5  hover:bg-green-500"
                        >
                            Create
                        </button>
                    </div>
                    <div className=" p-2 flex gap-2 flex-wrap">
                        {userProducts.length === 0 && (
                            <div className="w-11/12 h-96 bg-gray-100 text-gray-600 flex justify-center items-center text-xl">
                                Your Products Empty
                            </div>
                        )}
                        {userProducts.map((item) => {
                            console.log("MAP", item);
                            return (
                                <SuperCard
                                    text={item}
                                    key={item.pid}
                                    props={handleUpdateForm}
                                    trashHandler={handleTrashProduct}
                                />
                            );
                        })}
                    </div>
                </div>
            </div>
            {AlertShow && (
                <div className="alertWapper absolute top-0 w-full h-full flex justify-center items-center">
                    <div className="bg-white rounded-lg min-w-[400px] w-[500px] flex flex-col p-2 pb-10 shadow-md gap-5 items-center">
                        <h2 className="text-4xl text-green-500">
                            Create Product
                        </h2>
                        <form
                            onSubmit={
                                isUpdate ? handleFormUpdate : handleFormSubmit
                            }
                            className="flex flex-col gap-2 items-center w-full p-3"
                        >
                            <span className="flex flex-col w-full">
                                <input
                                    className="text-lg p-2 bg-zinc-100 w-full rounded-md outline-none"
                                    type="text"
                                    placeholder="Product title"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </span>
                            <span className="flex flex-col w-full">
                                <input
                                    className="text-lg p-2 bg-zinc-100 w-full rounded-md outline-none"
                                    type="text"
                                    placeholder="price"
                                    required
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                />
                            </span>
                            <span className="flex flex-col w-full">
                                <input
                                    className="text-lg p-2 bg-zinc-100 w-full rounded-md outline-none"
                                    type="text"
                                    placeholder="Phone"
                                    required
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                            </span>
                            <span className="flex flex-col w-full">
                                <input
                                    className="text-lg p-2 bg-zinc-100 w-full rounded-md outline-none"
                                    type="text"
                                    placeholder="address"
                                    required
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                />
                            </span>
                            <span className="flex flex-col w-full">
                                <textarea
                                    className="text-lg p-2 bg-zinc-100 w-full rounded-md outline-none"
                                    type="text"
                                    placeholder="description"
                                    required
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                />
                            </span>
                            <span className="flex flex-col w-full">
                                <input
                                    className="text-lg p-2 bg-zinc-100 w-full rounded-md outline-none"
                                    type="file"
                                    required={!isUpdate}
                                    ref={file}
                                />
                            </span>
                            <span className="mt-2 w-full">
                                <button
                                    className={`${
                                        formButtonClicked
                                            ? "bg-stickButton text-buttonColor"
                                            : "shadow-md bg-[#1ba94c] text-white"
                                    } text-lg  p-2 w-full rounded-md font-semibold`}
                                >
                                    {formButtonClicked ? "Loading..." : "Done"}
                                </button>
                            </span>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}

export default DashBoard;
