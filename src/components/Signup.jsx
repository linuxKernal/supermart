import { db, storage, auth } from "../../firebase.config";

import {
    updateProfile,
    signInWithPhoneNumber,
    RecaptchaVerifier,
} from "firebase/auth";

import { useEffect, useState, useRef } from "react";
import { getDownloadURL, uploadBytes, ref } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function Signup() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [gender, setGender] = useState("");
    const [address, setAddress] = useState("");
    const [dateOfBrith, setDateOfBrith] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [showOTP, setShowOTP] = useState(false);
    const [verifyOTP, setverifyOTP] = useState(false);
    const [OTP, setOTP] = useState("");

    const userProfile = useRef();
    const navigate = useNavigate();

    const defaultPersonProfile =
        "https://firebasestorage.googleapis.com/v0/b/super-mart-b298a.appspot.com/o/assets%2Fuser1.png?alt=media&token=9ea33f98-b091-4f86-ab29-8952c5b69a62";
    const defaultFemaleProfile =
        "https://firebasestorage.googleapis.com/v0/b/super-mart-b298a.appspot.com/o/assets%2Ffuser.png?alt=media&token=d37a078b-0cb8-41e9-8860-7c46ad471f3b";
    async function sendUserDetails(uid) {
        const userCredentials = {
            firstName,
            lastName,
            email,
            gender,
            address,
            dateOfBrith,
            phoneNumber,
            uid,
            image:
                gender === "male" ? defaultPersonProfile : defaultFemaleProfile,
        };

        const userImage = userProfile.current.files;

        const googleFirebase = async () => {
            console.log(userCredentials);

            await updateProfile(auth.currentUser, {
                displayName: `${firstName} ${lastName}`,
                photoURL: userCredentials.image,
            }).then(() => console.log("Auth Profile success"));

            await setDoc(doc(db, "users", uid), userCredentials)
                .then((status) => {
                    console.log("student Record Upload Success");
                    navigate("/dashboard");
                })
                .catch((error) => {
                    console.log("student Record error", error);
                });
        };

        if (userImage.length === 1) {
            const metadata = { contentType: userImage.type };

            const storageRef = ref(
                storage,
                `users/${uid}_${userImage[0].name}`
            );

            await uploadBytes(storageRef, userImage[0], metadata)
                .then(async (snapshot) => {
                    console.log("Uploaded a blob or file!");
                    return await getDownloadURL(snapshot.ref);
                })
                .then((imageUrl) => {
                    userCredentials["image"] = imageUrl;
                    googleFirebase();
                })
                .catch((error) => console.log("FILE error", error));
        } else googleFirebase();
    }
    const generateRecaptcha = () => {
        window.recaptchaVerifier = new RecaptchaVerifier(
            "recaptcha-container",
            {
                size: "invisible",
                callback: (response) => {
                    // reCAPTCHA solved, allow signInWithPhoneNumber.
                },
                "expired-callback": () => {
                    // Response expired. Ask user to solve reCAPTCHA again.
                    // ...
                },
            },
            auth
        );
    };
    function onSignInSubmit() {
        const appVerifier = window.recaptchaVerifier;

        signInWithPhoneNumber(auth, "+91" + phoneNumber, appVerifier)
            .then((confirmationResult) => {
                window.confirmationResult = confirmationResult;
                setShowOTP(true);
            })
            .catch((error) => {
                window.recaptchaVerifier.render().then(function (widgetId) {
                    grecaptcha.reset(widgetId);
                });
                console.log(error);
            });
    }
    useEffect(() => {
        generateRecaptcha();
        recaptchaVerifier.render().then((widgetId) => {
            window.recaptchaWidgetId = widgetId;
        });
    }, []);
    const handleSubmit = (e) => {
        e.preventDefault();
        onSignInSubmit();
    };
    const verifyUserOTP = (e) => {
        e.preventDefault();
        setverifyOTP(true);
        confirmationResult
            .confirm(OTP)
            .then((result) => {
                const user = result.user;
                sendUserDetails(user.uid);
                console.log("User Login Success");
            })
            .catch((error) => {
                alert(error);
            });
    };
    return (
        <>
            <div className="flex items-center justify-center min-h-[92.53vh] bg-gradient-to-r from-green-300 to-blue-300">
                <form
                    onSubmit={handleSubmit}
                    className={
                        showOTP
                            ? "hidden"
                            : "bg-white rounded-lg flex flex-col p-2 pb-10 shadow-md gap-5 items-center"
                    }
                >
                    <h2 className="text-4xl text-sky-500 ml-3">
                        Register - New User
                    </h2>
                    <div className="grid grid-cols-2 gap-5 w-full p-3">
                        <span className="flex flex-col w-80">
                            <label
                                className="asterisk text-lg text-gray-700"
                                htmlFor="firstName"
                            >
                                First Name
                            </label>
                            <input
                                required
                                onChange={(e) => setFirstName(e.target.value)}
                                value={firstName}
                                className="text-lg p-1 bg-zinc-100 w-full rounded-md outline-none"
                                type="text"
                                id="firstName"
                            />
                        </span>
                        <span className="flex flex-col w-80">
                            <label
                                className="asterisk text-lg text-gray-700"
                                htmlFor="lastName"
                            >
                                Last Name
                            </label>
                            <input
                                required
                                onChange={(e) => setLastName(e.target.value)}
                                value={lastName}
                                className="text-lg p-1 bg-zinc-100 w-full rounded-md outline-none"
                                type="text"
                                id="lastName"
                            />
                        </span>

                        <span className="flex flex-col w-80">
                            <label
                                className="asterisk text-lg text-gray-700"
                                htmlFor="email"
                            >
                                Email
                            </label>
                            <input
                                required
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                                className="text-lg p-1 bg-zinc-100 w-full rounded-md outline-none"
                                type="text"
                                id="email"
                            />
                        </span>
                        <span className="flex flex-col w-80">
                            <label className="asterisk text-lg text-gray-700">
                                Gender
                            </label>
                            <div className="flex gap-5">
                                <span className="flex gap-1 items-center">
                                    <input
                                        id="male"
                                        type="radio"
                                        name="gender"
                                        value="male"
                                        onChange={(e) =>
                                            setGender(e.target.value)
                                        }
                                        checked={gender === "male"}
                                    />
                                    <label htmlFor="male">Male</label>
                                </span>
                                <span className="flex gap-1 items-center">
                                    <input
                                        id="female"
                                        type="radio"
                                        name="gender"
                                        value="female"
                                        onChange={(e) =>
                                            setGender(e.target.value)
                                        }
                                        checked={gender === "female"}
                                    />
                                    <label htmlFor="female">Female</label>
                                </span>
                            </div>
                        </span>
                        <span className="flex flex-col w-80">
                            <label
                                className="asterisk text-lg text-gray-700"
                                htmlFor="phone"
                            >
                                Phone
                            </label>
                            <input
                                required
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                value={phoneNumber}
                                className="text-lg p-1 bg-zinc-100 w-full rounded-md outline-none"
                                type="text"
                                id="phone"
                            />
                        </span>
                        <span className="flex flex-col w-80">
                            <label
                                className="asterisk text-lg text-gray-700"
                                htmlFor="dateOfBrith"
                            >
                                Date of Brith
                            </label>
                            <input
                                required
                                onChange={(e) => setDateOfBrith(e.target.value)}
                                value={dateOfBrith}
                                className="text-lg p-1 bg-zinc-100 w-full rounded-md outline-none"
                                type="date"
                                id="dateOfBrith"
                            />
                        </span>
                        <span className="flex flex-col w-80">
                            <label
                                className="asterisk text-lg text-gray-700"
                                htmlFor="address"
                            >
                                Address
                            </label>
                            <textarea
                                required
                                onChange={(e) => setAddress(e.target.value)}
                                value={address}
                                className="text-lg p-1 bg-zinc-100 w-full rounded-md outline-none"
                                type="text"
                                id="address"
                            />
                        </span>
                        <span className="flex flex-col w-80">
                            <label
                                className="text-lg text-gray-700"
                                htmlFor="profile"
                            >
                                Profile
                            </label>
                            <input
                                ref={userProfile}
                                type="file"
                                accept=".jpg, .jpeg, .png"
                                className="text-lg p-1 bg-zinc-100 w-full rounded-md outline-none"
                                id="profile"
                            />
                        </span>

                        <span className="mt-2 col-span-2">
                            <button className="text-lg bg-sky-500 text-white p-1 w-full rounded-md hover:bg-sky-600">
                                Done
                            </button>
                        </span>
                    </div>
                </form>
                {showOTP && (
                    <div className="bg-white rounded-lg flex flex-col p-2 pb-10 shadow-md gap-5 items-center">
                        <h2 className="text-4xl text-sky-500">Verify</h2>
                        <form
                            onSubmit={verifyUserOTP}
                            className="flex flex-col gap-2 items-center w-full p-3"
                        >
                            <span className="flex flex-col w-96">
                                {/* <label
                                    className="text-lg text-gray-700"
                                    htmlFor="OTP"
                                >
                                    OTP
                                </label> */}
                                <input
                                    className="text-lg p-1 bg-zinc-100 w-full rounded-md outline-none"
                                    type="text"
                                    id="OTP"
                                    value={OTP}
                                    placeholder="OTP"
                                    onChange={(e) => setOTP(e.target.value)}
                                />
                            </span>

                            <span className="mt-2 w-96">
                                <button
                                    className={
                                        (verifyOTP
                                            ? "bg-stickButton text-gray-400 "
                                            : " bg-sky-500 text-white  hover:bg-sky-600") +
                                        "text-lg p-1 w-full rounded-md"
                                    }
                                >
                                    {verifyOTP ? "verifying...": "login"}
                                </button>
                            </span>
                        </form>
                    </div>
                )}
            </div>
            <div id="recaptcha-container" className="justify-center flex"></div>
        </>
    );
}

export default Signup;
