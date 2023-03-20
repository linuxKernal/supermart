import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../firebase.config";
import { onAuthStateChanged, signOut } from "firebase/auth";
import webLogo from "../assets/google_logo.png";
import searchIcon from "../assets/search.png";
import { useState, useEffect } from "react";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isPopUp, setIsPopUp] = useState(false);
    const [currentUserAuth, setCurrentUserAuth] = useState({});
    const navigate = useNavigate();
    console.log("Navbar component")
    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                const timeRef = setInterval(() => {
                    console.log("Login in", {
                        name: user.displayName,
                        profile: user.photoURL,
                    });

                    if (user.displayName !== null) {
                        setCurrentUserAuth({
                            name: user.displayName,
                            profile: user.photoURL,
                        });
                        clearInterval(timeRef);
                    }
                }, 1000);
            } else {
                setCurrentUserAuth({});
            }
        });
    }, [auth]);

    const handleLogOut = () => {
        signOut(auth)
            .then(() => {
                navigate("/");
            })
            .catch((error) => {
                console.log("user logout error", error);
            });
    };

    return (
        <div className="flex p-2 md:flex-row flex-col sticky top-0 bg-white z-10">
            <div className={`grow flex justify-between`}>
                <div className="flex items-center gap-2 grow">
                    <img className="w-10" src={webLogo} alt="logo" />
                    <h1 className="text-xl text-green-500 font-semibold">
                        Wallmart
                    </h1>
                </div>
                <button
                    onClick={() => setIsOpen((value) => !value)}
                    className="md:hidden  rounded-md"
                >
                    <div className="w-10 h-1.5 rounded-lg  bg-green-500 m-1"></div>
                    <div className="w-10 h-1.5 rounded-lg my-2 bg-green-500 m-1"></div>
                    <div className="w-10 h-1.5 rounded-lg  bg-green-500 m-1"></div>
                </button>
            </div>

            <div
                className={`${
                    !isOpen && "hidden md:visible"
                } w-full mt-3 md:mt-0 md:w-1/3 bg-zinc-50 flex md:flex items-center rounded-md pr-2 mr-12`}
            >
                <input
                    className="w-full bg-transparent outline-none text-lg p-1"
                    placeholder="Search"
                    type="text"
                />
                <img className="w-8 h-8" src={searchIcon} alt="searchImage" />
            </div>
            <div
                className={`${
                    !isOpen && "hidden md:visible"
                } text-white flex md:flex flex-col md:flex-row md:gap-5 items-center justify-center w-2/12`}
            >
                <span className="dropdown-menu">
                    <Link to="/">Home</Link>
                </span>
                {!currentUserAuth.name ? (
                    <>
                        <span className="dropdown-menu">
                            <Link to="/Login">Login</Link>
                        </span>
                        <span className="dropdown-menu">
                            <Link to="/signup">signup</Link>
                        </span>
                    </>
                ) : (
                    <button
                        onClick={() => setIsPopUp((value) => !value)}
                        className="flex flex-col relative"
                    >
                        <div className="flex items-center gap-2">
                            <img
                                className="w-9 h-9 rounded-full"
                                src={currentUserAuth.profile}
                                alt="userProfile"
                            />
                            <h2 className="font-semibold text-lime-500">
                                {currentUserAuth.name.split(" ")[0]}
                            </h2>
                        </div>
                        <ul
                            className={`${
                                isPopUp ? "visible" : "hidden"
                            } md:absolute top-11 z-10 bg-white rounded-md text-sky-800 shadow-lg p-3 w-32`}
                        >
                            <li className="popUpItem">
                                <Link to="/dashboard">Dashboard</Link>
                            </li>
                            <li className="popUpItem">
                                <Link to="/about-us">About us</Link>
                            </li>
                            <li onClick={handleLogOut} className="popUpItem">
                                Logout
                            </li>
                        </ul>
                    </button>
                )}
            </div>
        </div>
    );
}
