import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { motion, AnimatePresence } from 'framer-motion';
import { EyeIcon, EyeSlashIcon, XMarkIcon } from '@heroicons/react/24/outline';

const Login = () => {
    const navigate = useNavigate();
    const { setShowLogin, axios, setToken } = useAppContext();

    const [state, setState] = useState("login");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            let url = "";
            let payload = {};

            if (state === "login") {
                url = "/api/user/login";
                payload = { email, password };
            } else if (state === "register") {
                url = "/api/user/register";
                payload = { name, email, password };
            }

            const { data } = await axios.post(url, payload);

            if (data.success) {
                localStorage.setItem("token", data.token);
                axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
                setToken(data.token);
                setShowLogin(false);
                if (email === "deekshithm321@gmail.com") {
                    navigate("/admin");
                }
                toast.success(state === "login" ? "Welcome back!" : "Account created successfully");
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Action failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowLogin(false)}
            className='fixed inset-0 flex items-center justify-center p-4 backdrop-blur-md bg-black/40 z-[100]'
        >
            <motion.div
                layout
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
                className="relative overflow-hidden w-full max-w-[400px] bg-white/90 backdrop-blur-xl rounded-[2rem] shadow-2xl border border-white/20 p-8 sm:p-10"
            >
                {/* Decorative background blobs */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />

                <button
                    onClick={() => setShowLogin(false)}
                    className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
                >
                    <XMarkIcon className="w-6 h-6" />
                </button>

                <div className="flex flex-col items-center mb-8">
                    <motion.div
                        key={state}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 text-primary"
                    >
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </motion.div>
                    <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
                        {state === "login" ? "Sign In" : "Join Us"}
                    </h2>
                    <p className="text-gray-500 mt-2 text-center text-sm">
                        {state === "login"
                            ? "Enter your credentials to access your account"
                            : "Create an account to start booking services"}
                    </p>
                </div>

                <form onSubmit={onSubmitHandler} className="space-y-5">
                    <AnimatePresence mode="popLayout">
                        {state === "register" && (
                            <motion.div
                                initial={{ opacity: 0, height: 0, y: -20 }}
                                animate={{ opacity: 1, height: "auto", y: 0 }}
                                exit={{ opacity: 0, height: 0, y: -20 }}
                                className="space-y-1.5"
                            >
                                <label className="text-xs font-semibold text-gray-600 ml-1">Full Name</label>
                                <input
                                    onChange={(e) => setName(e.target.value)}
                                    value={name}
                                    placeholder="John Doe"
                                    className="w-full px-4 py-3.5 bg-gray-50/50 border border-gray-100 rounded-2xl outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all text-gray-600 placeholder:text-gray-300"
                                    type="text"
                                    required
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-600 ml-1">Email Address</label>
                        <input
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            placeholder="name@example.com"
                            className="w-full px-4 py-3.5 bg-gray-50/50 border border-gray-100 rounded-2xl outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all text-gray-600 placeholder:text-gray-300"
                            type="email"
                            required
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-600 ml-1">Password</label>
                        <div className="relative group">
                            <input
                                onChange={(e) => setPassword(e.target.value)}
                                value={password}
                                placeholder="••••••••"
                                className="w-full px-4 py-3.5 bg-gray-50/50 border border-gray-100 rounded-2xl outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all text-gray-600 placeholder:text-gray-300"
                                type={showPassword ? "text" : "password"}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-primary transition-colors focus:outline-none"
                            >
                                {showPassword ? (
                                    <EyeSlashIcon className="w-5 h-5" />
                                ) : (
                                    <EyeIcon className="w-5 h-5" />
                                )}
                            </button>
                        </div>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={loading}
                        className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary/25 transition-all active:shadow-inner disabled:opacity-70 disabled:cursor-not-allowed mt-4"
                    >
                        {loading ? (
                            <div className="flex items-center justify-center gap-2">
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                <span>Processing...</span>
                            </div>
                        ) : (
                            state === "register" ? "Create Account" : "Sign In"
                        )}
                    </motion.button>
                </form>

                <div className="mt-8 space-y-4">
                    <div className="relative flex items-center justify-center">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-100"></div>
                        </div>
                        <span className="relative px-4 bg-white text-[10px] font-bold text-gray-400 uppercase tracking-widest transition-colors">
                            Secure social login
                        </span>
                    </div>

                    <div className="flex justify-center">
                        <GoogleLogin
                            theme="outline"
                            onSuccess={async (credentialResponse) => {
                                try {
                                    const { data } = await axios.post("/api/user/google-login", {
                                        credential: credentialResponse.credential,
                                    });

                                    if (data.success) {
                                        localStorage.setItem("token", data.token);
                                        axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
                                        setToken(data.token);
                                        setShowLogin(false);
                                        if (data.user?.email === "deekshithm321@gmail.com") {
                                            navigate("/admin");
                                        }
                                        toast.success("Signed in with Google");
                                    } else {
                                        toast.error(data.message);
                                    }
                                } catch (error) {
                                    toast.error("Google authentication failed");
                                }
                            }}
                            onError={() => toast.error("Google authentication failed")}
                        />
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-50 text-center space-y-3">
                    <p className="text-gray-500 text-sm transition-colors">
                        {state === "register" ? "Already have an account?" : "Don't have an account?"}{" "}
                        <button
                            onClick={() => setState(state === "login" ? "register" : "login")}
                            className="text-primary font-bold hover:underline underline-offset-4 decoration-2"
                        >
                            {state === "login" ? "Join now" : "Sign in"}
                        </button>
                    </p>

                    {state === "login" && (
                        <button
                            onClick={() => {
                                setShowLogin(false);
                                navigate("/forgot-password");
                            }}
                            className="text-xs font-semibold text-gray-400 hover:text-primary transition-colors"
                        >
                            Forgot your password?
                        </button>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
};

export default Login;
