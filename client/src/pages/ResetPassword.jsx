import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

const ResetPassword = () => {
    const { token } = useParams();
    const { axios } = useAppContext();
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            return toast.error("Passwords do not match");
        }
        if (password.length < 8) {
            return toast.error("Password must be at least 8 characters");
        }

        setLoading(true);
        try {
            const { data } = await axios.post(`/api/user/reset-password/${token}`, { password });
            if (data.success) {
                toast.success(data.message);
                navigate("/");
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 transition-colors duration-300">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-10 border border-gray-100 transition-all"
            >
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight uppercase">Reset Password</h2>
                    <p className="text-gray-500 mt-3 text-sm leading-relaxed font-medium italic">Create a new secure password for your account.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">New Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Min 8 characters"
                            className="w-full px-5 py-4 rounded-2xl border-2 border-gray-100 bg-gray-50/50 focus:border-primary/50 focus:ring-4 focus:ring-primary/5 outline-none transition-all text-gray-700 placeholder:text-gray-300 font-medium"
                        />
                    </div>

                    <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Confirm New Password</label>
                        <input
                            type="password"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Repeat password"
                            className="w-full px-5 py-4 rounded-2xl border-2 border-gray-100 bg-gray-50/50 focus:border-primary/50 focus:ring-4 focus:ring-primary/5 outline-none transition-all text-gray-700 placeholder:text-gray-300 font-medium"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full bg-primary hover:bg-primary-dull py-5 font-black text-white rounded-2xl shadow-xl shadow-primary/25 transition-all active:scale-95 ${loading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer hover:scale-[1.02]'}`}
                    >
                        {loading ? "RESETTING..." : "RESET PASSWORD"}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default ResetPassword;
