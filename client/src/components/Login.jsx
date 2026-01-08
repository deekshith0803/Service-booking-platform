import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const Login = () => {

    const { setShowLogin, axios, setToken } = useAppContext();

    // 🔧 MISSING STATES (FIXED)
    const [state, setState] = useState("login");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const onSubmitHandler = async (e) => {
        e.preventDefault();

        try {
            const url =
                state === "login"
                    ? "/api/user/login"
                    : "/api/user/register";

            const payload =
                state === "login"
                    ? { email, password }
                    : { name, email, password };

            const { data } = await axios.post(url, payload);

            if (data.success) {
                // SAVE TOKEN
                localStorage.setItem("token", data.token);

                // ✅ SET AUTH HEADER (CRITICAL)
                axios.defaults.headers.common["Authorization"] =
                    `Bearer ${data.token}`;

                setToken(data.token);
                setShowLogin(false);
                toast.success(
                    state === "login" ? "Login successful" : "Account created"
                );
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            toast.error(
                err.response?.data?.message || "Authentication failed"
            );
        }
    };

    return (
        <div
            onClick={() => setShowLogin(false)}
            className='fixed top-0 bottom-0 left-0 right-0 flex items-center text-sm text-gray-600 bg-black/50 z-60'
        >
            <form
                onSubmit={onSubmitHandler}
                onClick={(e) => e.stopPropagation()}
                className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] text-gray-500 rounded-lg shadow-xl border border-gray-200 bg-white"
            >
                <p className="text-2xl font-medium m-auto">
                    <span className="text-primary-500">User</span>{" "}
                    {state === "login" ? "Login" : "Sign Up"}
                </p>

                {state === "register" && (
                    <div className="w-full">
                        <p>Name</p>
                        <input
                            onChange={(e) => setName(e.target.value)}
                            value={name}
                            placeholder="type here"
                            className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
                            type="text"
                            required
                        />
                    </div>
                )}

                <div className="w-full">
                    <p>Email</p>
                    <input
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        placeholder="type here"
                        className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
                        type="email"
                        required
                    />
                </div>

                <div className="w-full">
                    <p>Password</p>
                    <input
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                        placeholder="type here"
                        className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
                        type="password"
                        required
                    />
                </div>

                {state === "register" ? (
                    <p>
                        Already have account?{" "}
                        <span
                            onClick={() => setState("login")}
                            className="text-primary cursor-pointer"
                        >
                            click here
                        </span>
                    </p>
                ) : (
                    <p>
                        Create an account?{" "}
                        <span
                            onClick={() => setState("register")}
                            className="text-primary cursor-pointer"
                        >
                            click here
                        </span>
                    </p>
                )}

                <button className="bg-primary hover:bg-blue-800 transition-all text-white w-full py-2 rounded-md cursor-pointer">
                    {state === "register" ? "Create Account" : "Login"}
                </button>
            </form>
        </div>
    );
};

export default Login;
