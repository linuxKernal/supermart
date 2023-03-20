import { auth } from "../../firebase.config";

import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

function Login() {
    const navigate = useNavigate();
    const [phone, setPhone] = useState("");
    const [showOTP, setShowOTP] = useState(false);
    const [OTP, setOTP] = useState("");

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

        signInWithPhoneNumber(auth, "+91" + phone, appVerifier)
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
    function verifyOTP() {
        confirmationResult
            .confirm(OTP)
            .then((result) => {
                // User signed in successfully.
                console.log("User Login Success");

                navigate("/dashboard");
            })
            .catch((error) => {
                alert(error);
            });
    }
    const handleSubmit = (event) => {
        event.preventDefault();
        if (showOTP) {
            verifyOTP();
            return;
        }
        if (Number.isFinite(+phone)) onSignInSubmit();
        else alert("invaid phone number");
    };
    useEffect(() => {
        if (auth.currentUser) {
            alert("User already Login");
            navigate("/dashboard");
        } else {
            generateRecaptcha();
            recaptchaVerifier.render().then((widgetId) => {
                window.recaptchaWidgetId = widgetId;
            });
        }
    }, []);
    return (
        <>
            <div className="flex items-center justify-center min-h-[92.53vh] bg-gradient-to-r from-green-400 to-blue-500">
                <div className="bg-white rounded-lg flex flex-col p-2 pb-10 shadow-md gap-5 items-center">
                    <h2 className="text-4xl text-sky-500">Login</h2>
                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-col gap-2 items-center w-full p-3"
                    >
                        <span className="flex flex-col w-96">
                            <label
                                className="text-lg text-gray-700"
                                htmlFor="phone number"
                            >
                                phone number
                            </label>
                            <input
                                className="text-lg p-1 bg-zinc-100 w-full rounded-md outline-none"
                                type="text"
                                id="phone number"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                required
                                readOnly={showOTP}
                            />
                        </span>
                        {showOTP && (
                            <span className="flex flex-col w-96">
                                <label
                                    className="text-lg text-gray-700"
                                    htmlFor="OTP"
                                >
                                    OTP
                                </label>
                                <input
                                    className="text-lg p-1 bg-zinc-100 w-full rounded-md outline-none"
                                    type="text"
                                    id="OTP"
                                    value={OTP}
                                    onChange={(e) => setOTP(e.target.value)}
                                />
                            </span>
                        )}
                        <span className="mt-2 w-96">
                            <button className="text-lg bg-sky-500 text-white p-1 w-full rounded-md hover:bg-sky-600">
                                Login
                            </button>
                        </span>
                    </form>
                </div>
            </div>
            <div id="recaptcha-container" className="justify-center flex"></div>
        </>
    );
}

export default Login;
