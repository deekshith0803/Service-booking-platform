import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from "recharts";
import { toast } from "react-hot-toast";
import { useAppContext } from "../context/AppContext";
import { useChat } from "../context/ChatContext";
import { motion, AnimatePresence } from "framer-motion";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"];

const AdminDashboard = () => {
    const { axios, token } = useAppContext();
    const { openChat, unreadCounts } = useChat();
    const [searchParams, setSearchParams] = useSearchParams();
    const activeTab = searchParams.get("tab") || "stats";

    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [providers, setProviders] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Password Reset States
    const [resetUser, setResetUser] = useState(null);
    const [newAdminPassword, setNewAdminPassword] = useState("");
    const [isResetting, setIsResetting] = useState(false);


    const fetchData = async () => {
        setLoading(true);
        try {
            if (activeTab === "stats") {
                const { data } = await axios.get("/api/admin/stats");
                if (data.success) setStats(data.data);
            } else if (activeTab === "users") {
                const { data } = await axios.get("/api/admin/users");
                if (data.success) setUsers(data.users);
            } else if (activeTab === "providers") {
                const { data } = await axios.get("/api/admin/providers");
                if (data.success) setProviders(data.providers);
            } else if (activeTab === "bookings") {
                const { data } = await axios.get("/api/admin/bookings");
                if (data.success) setBookings(data.bookings);
            }
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Failed to load data");
            toast.error("Error fetching data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) fetchData();
    }, [token, activeTab]);

    const handleUpdateUser = async (userId, update) => {
        try {
            const { data } = await axios.post("/api/admin/update-role", { userId, ...update });
            if (data.success) {
                toast.success(data.message);
                fetchData();
            }
        } catch (err) {
            toast.error("Failed to update user");
        }
    };

    const handleResetPassword = async () => {
        if (!newAdminPassword || newAdminPassword.length < 8) {
            toast.error("Password must be at least 8 characters");
            return;
        }

        setIsResetting(true);
        try {
            const { data } = await axios.post("/api/admin/update-password", {
                userId: resetUser._id,
                newPassword: newAdminPassword
            });

            if (data.success) {
                toast.success(data.message);
                setResetUser(null);
                setNewAdminPassword("");
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            toast.error("Failed to reset password");
        } finally {
            setIsResetting(false);
        }
    };

    if (!token) {
        return (
            <div className="flex justify-center items-center h-screen flex-col gap-4 bg-white">
                <p className="text-xl text-gray-600">Please log in to view the dashboard.</p>
            </div>
        );
    }

    if (error && !loading) {
        return <div className="text-center p-10 text-red-500">{error}</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto p-4 md:p-8">
                <div className="flex justify-between items-center mb-10 border-b border-gray-200 pb-6">
                    <h1 className="text-3xl font-black text-gray-800 tracking-tight italic">Admin <span className="text-primary tracking-normal not-italic">Control Center</span></h1>
                </div>

                <AnimatePresence mode="wait">
                    {loading ? (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex justify-center items-center h-64"
                        >
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="pb-20"
                        >
                            {activeTab === "stats" && stats && renderStats(stats)}
                            {activeTab === "users" && renderUsers(users, handleUpdateUser, setResetUser)}
                            {activeTab === "providers" && renderProviders(providers, handleUpdateUser, openChat, unreadCounts, setResetUser)}
                            {activeTab === "bookings" && renderBookings(bookings)}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Password Reset Modal */}
                {resetUser && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] px-4">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md border border-gray-100"
                        >
                            <h2 className="text-2xl font-black text-gray-800 mb-2">Reset Password</h2>
                            <p className="text-sm text-gray-500 mb-8 italic">Enter a new password for <span className="font-bold text-primary not-italic">{resetUser.name}</span></p>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">New Password</label>
                                    <input
                                        type="text"
                                        value={newAdminPassword}
                                        onChange={(e) => setNewAdminPassword(e.target.value)}
                                        placeholder="Minimum 8 characters"
                                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 outline-none focus:ring-4 focus:ring-primary/20 transition-all font-medium"
                                    />
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        onClick={() => { setResetUser(null); setNewAdminPassword(""); }}
                                        className="flex-1 px-4 py-4 border-2 border-gray-100 rounded-2xl text-gray-600 font-bold hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleResetPassword}
                                        disabled={isResetting}
                                        className="flex-1 px-4 py-3 bg-primary text-white rounded-xl font-bold hover:bg-blue-700 transition-colors disabled:opacity-50"
                                    >
                                        {isResetting ? "Updating..." : "Update Password"}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- SECTION RENDERING FUNCTIONS ---

const renderStats = (stats) => (
    <div className="space-y-10">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
                { label: "Total Users", val: stats.counts.users, color: "text-gray-800" },
                { label: "Total Services", val: stats.counts.services, color: "text-gray-800" },
                { label: "Total Bookings", val: stats.counts.bookings, color: "text-gray-800" },
                { label: "Platform Rating", val: `★ ${stats.counts.avgRating}`, color: "text-yellow-500" },
            ].map((s, i) => (
                <div key={i} className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 transition-all hover:scale-105 duration-300">
                    <h2 className="text-gray-400 text-[10px] uppercase font-black tracking-[0.2em] mb-3">{s.label}</h2>
                    <p className={`text-4xl font-black tracking-tight ${s.color}`}>{s.val}</p>
                </div>
            ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-xl border border-gray-100 transition-all">
                <h2 className="text-xl font-black mb-8 text-gray-700 tracking-tight uppercase">Daily Booking Trends</h2>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={stats.dailyBookings}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB33" />
                            <XAxis dataKey="_id" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 10, fontWeight: 700 }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 10, fontWeight: 700 }} />
                            <Tooltip cursor={{ fill: '#3b82f611' }} contentStyle={{ borderRadius: '20px', border: 'none', background: '#ffffff', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.25)', fontWeight: 700 }} />
                            <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} barSize={24} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 transition-all">
                <h2 className="text-xl font-black mb-8 text-gray-700 tracking-tight uppercase">Status Summary</h2>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={stats.statusSummary}
                                innerRadius={70}
                                outerRadius={100}
                                paddingAngle={8}
                                dataKey="count"
                                nameKey="_id"
                                stroke="none"
                            >
                                {stats.statusSummary.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{ borderRadius: '15px', border: 'none', background: '#ffffff', fontWeight: 700 }} />
                            <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '10px', textTransform: 'uppercase', fontWeight: 900, letterSpacing: '0.1em' }} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>

        {/* Secondary Row: Categories & Recent Reviews */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Category Breakdown */}
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
                <h2 className="text-xl font-black mb-8 text-gray-700 tracking-tight uppercase">Popular Categories</h2>
                <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart layout="vertical" data={stats.categorySummary}>
                            <XAxis type="number" hide />
                            <YAxis dataKey="_id" type="category" axisLine={false} tickLine={false} width={120} tick={{ fontSize: 10, fontWeight: 800, fill: '#9ca3af' }} />
                            <Tooltip contentStyle={{ borderRadius: '15px', border: 'none' }} />
                            <Bar dataKey="count" fill="#10b981" radius={[0, 10, 10, 0]} barSize={20} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Recent Reviews */}
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
                <h2 className="text-xl font-black mb-8 text-gray-700 tracking-tight uppercase">Recent Feedback</h2>
                <div className="space-y-5 max-h-[320px] overflow-y-auto pr-2 no-scrollbar">
                    {stats.alerts.recentReviews.length > 0 ? (
                        stats.alerts.recentReviews.map((review) => (
                            <div key={review._id} className="p-5 bg-gray-50 rounded-2xl border border-transparent hover:border-primary/10 transition-all">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="font-bold text-sm">{review.userId?.name || "Anonymous User"}</span>
                                    <span className="text-yellow-500 text-sm font-black tracking-widest">{"★".repeat(review.rating)}</span>
                                </div>
                                <p className="text-xs text-gray-500 italic mb-4 leading-relaxed font-medium">"{review.comment}"</p>
                                <div className="text-[10px] text-gray-400 flex justify-between uppercase font-black tracking-widest">
                                    <span className="text-primary/60">{review.serviceId?.title}</span>
                                    <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 opacity-40">
                            <p className="text-gray-500 font-black uppercase tracking-widest">No review alerts</p>
                        </div>
                    )}
                </div>
            </div>
        </div>

        {/* Activity Table */}
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
            <h2 className="text-xl font-black mb-8 text-gray-700 tracking-tight uppercase">Recent Platform Activity</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full text-left">
                    <thead>
                        <tr className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] border-b border-gray-50">
                            <th className="pb-6 px-4">Event</th>
                            <th className="pb-6 px-4">Subject</th>
                            <th className="pb-6 px-4">Associated User</th>
                            <th className="pb-6 px-4">Current Status</th>
                        </tr>
                    </thead>
                    <tbody className="text-xs divide-y divide-gray-50">
                        {stats.alerts.recentBookings.map((booking) => (
                            <tr key={booking._id} className="hover:bg-gray-50 transition-colors group">
                                <td className="py-6 px-4">
                                    <span className="text-primary font-bold tracking-tight">NEW_BOOKING</span>
                                </td>
                                <td className="py-6 px-4 font-black text-gray-800 group-hover:text-primary transition-colors">{booking.service?.title || "DELETED_SERVICE"}</td>
                                <td className="py-6 px-4 text-gray-500 font-bold">{booking.user?.name}</td>
                                <td className="py-6 px-4">
                                    <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider ${booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                                        booking.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                                        }`}>
                                        {booking.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
);


const renderUsers = (users, onUpdate, setResetUser) => (
    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden transition-all">
        <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/50 transition-colors">
            <h2 className="text-xl font-black text-gray-700 uppercase tracking-tight">System Users</h2>
            <span className="text-[10px] bg-primary/10 px-3 py-1.5 rounded-full text-primary font-black uppercase tracking-widest">{users.length} Registered</span>
        </div>
        <div className="overflow-x-auto">
            <table className="min-w-full text-left">
                <thead className="bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">
                    <tr>
                        <th className="p-6">Profile</th>
                        <th className="p-6">Identity</th>
                        <th className="p-6">Privilege</th>
                        <th className="p-6">Control</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {users.map((u) => (
                        <tr key={u._id} className="hover:bg-gray-50 transition-colors group">
                            <td className="p-6">
                                <div className="flex items-center gap-4">
                                    <img src={u.image || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"} className="w-10 h-10 rounded-2xl object-cover border-2 border-primary/20 transition-transform group-hover:scale-110" alt="" />
                                    <span className="font-black text-gray-800 text-sm">{u.name}</span>
                                </div>
                            </td>
                            <td className="p-6 text-xs text-gray-600 font-bold tracking-tight">{u.email}</td>
                            <td className="p-6">
                                <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${u.role === 'provider' ? 'bg-purple-400/10 text-purple-600' : 'bg-blue-400/10 text-blue-600'
                                    }`}>
                                    {u.role}
                                </span>
                            </td>
                            <td className="p-6">
                                <div className="flex gap-6 items-center">
                                    <div className="relative">
                                        <select
                                            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest outline-none focus:ring-4 focus:ring-primary/20 appearance-none cursor-pointer pr-10 hover:bg-white transition-all shadow-sm"
                                            value={u.role}
                                            onChange={(e) => onUpdate(u._id, { role: e.target.value })}
                                        >
                                            <option value="user">USER_ROLE</option>
                                            <option value="provider">PROV_ROLE</option>
                                        </select>
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"></path></svg>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setResetUser(u)}
                                        className="text-primary hover:text-blue-800 text-[10px] font-black uppercase tracking-widest underline decoration-2 underline-offset-4 decoration-primary/20"
                                    >
                                        RESET_PASS
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);


const renderProviders = (providers, onUpdate, onContact, unreadCounts, setResetUser) => (
    <div className="space-y-6">
        {/* Pending Requests */}
        <div className="bg-white rounded-xl shadow-md border-t-4 border-yellow-400 overflow-hidden">
            <div className="p-6 border-b border-gray-50">
                <h2 className="text-lg font-bold text-gray-700">Pending Provider Approvals</h2>
                <p className="text-sm text-gray-400">Review users requesting provider access</p>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full text-left">
                    <tbody className="divide-y divide-gray-50">
                        {providers.filter(p => p.isProviderRequested).length > 0 ? (
                            providers.filter(p => p.isProviderRequested).map(p => (
                                <tr key={p._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-6">
                                        <div className="flex items-center gap-4">
                                            <img src={p.image || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"} className="w-10 h-10 rounded-full border shadow-sm" alt="" />
                                            <div>
                                                <p className="font-bold text-gray-800">{p.name}</p>
                                                <p className="text-xs text-gray-400">{p.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-6 text-right">
                                        <div className="flex justify-end gap-3 items-center">
                                            <button
                                                onClick={() => onContact(p)}
                                                className="text-primary hover:text-primary-dull text-xs font-bold flex items-center gap-1 relative"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a.75.75 0 01-1.174-.694 5.955 5.955 0 01.52-2.313C3.523 16.634 3 14.39 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                                                </svg>
                                                Contact
                                                {unreadCounts[p._id] > 0 && (
                                                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[8px] font-bold px-1 py-0.5 rounded-full min-w-[14px] h-[14px] flex items-center justify-center animate-pulse">
                                                        {unreadCounts[p._id]}
                                                    </span>
                                                )}
                                            </button>
                                            <button
                                                onClick={() => onUpdate(p._id, { isApproved: true })}
                                                className="bg-green-500 text-white px-4 py-1.5 rounded-lg text-xs font-bold shadow-sm hover:bg-green-600 transition-colors"
                                            >
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => onUpdate(p._id, { isProviderRequested: false })}
                                                className="bg-white border border-gray-200 text-gray-600 px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-gray-50 transition-colors"
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td className="p-10 text-center text-gray-400 text-sm" colSpan="2">No pending requests at the moment.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>

        {/* All Providers */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-50">
                <h2 className="text-lg font-bold text-gray-700">Active Service Providers</h2>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full text-left">
                    <thead className="bg-gray-50 text-gray-400 text-xs uppercase font-semibold">
                        <tr>
                            <th className="p-4">Provider</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {providers.filter(p => p.role === 'provider').map(p => (
                            <tr key={p._id}>
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <img src={p.image || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"} className="w-8 h-8 rounded-full object-cover border" alt="" />
                                        <span className="font-medium text-gray-700">{p.name} ({p.email})</span>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${p.isApproved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                        }`}>
                                        {p.isApproved ? 'Approved' : 'Awaiting Approval'}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <div className="flex gap-4 items-center">
                                        <button
                                            onClick={() => onContact(p)}
                                            className="text-primary hover:text-primary-dull text-xs font-bold flex items-center gap-1 relative"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a.75.75 0 01-1.174-.694 5.955 5.955 0 01.52-2.313C3.523 16.634 3 14.39 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                                            </svg>
                                            Contact
                                            {unreadCounts[p._id] > 0 && (
                                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[8px] font-bold px-1 py-0.5 rounded-full min-w-[14px] h-[14px] flex items-center justify-center animate-pulse">
                                                    {unreadCounts[p._id]}
                                                </span>
                                            )}
                                        </button>
                                        <button
                                            onClick={() => onUpdate(p._id, { role: 'user', isApproved: false })}
                                            className="text-red-500 hover:text-red-700 text-xs font-bold underline"
                                        >
                                            Revoke Access
                                        </button>
                                        <button
                                            onClick={() => setResetUser(p)}
                                            className="text-primary hover:text-blue-800 text-xs font-bold underline"
                                        >
                                            Reset Pass
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
);

const renderBookings = (bookings) => (
    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden transition-all">
        <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
            <h2 className="text-xl font-black text-gray-700 uppercase tracking-tight">Master Ledger</h2>
            <div className="flex gap-6 text-[10px] font-black uppercase tracking-widest">
                <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-400 animate-pulse"></div>
                    <span className="text-gray-500">OPEN: {bookings.filter(b => b.status === 'pending').length}</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-sm shadow-green-400"></div>
                    <span className="text-gray-500">DONE: {bookings.filter(b => b.status === 'confirmed').length}</span>
                </div>
            </div>
        </div>
        <div className="overflow-x-auto">
            <table className="min-w-full text-left">
                <thead className="bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">
                    <tr>
                        <th className="p-6">Transaction</th>
                        <th className="p-6">Originator</th>
                        <th className="p-6">Fulfiller</th>
                        <th className="p-6">Valuation</th>
                        <th className="p-6">Lifecycle</th>
                        <th className="p-6">Payment</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {bookings.map((b) => (
                        <tr key={b._id} className="hover:bg-gray-50 transition-colors group">
                            <td className="p-6">
                                <p className="font-black text-gray-800 text-sm group-hover:text-primary transition-colors">{b.service?.title || "ARCHIVED_STUB"}</p>
                                <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1 font-bold">{b.service?.category} • {new Date(b.date).toLocaleDateString()}</p>
                            </td>
                            <td className="p-6 text-xs font-bold text-gray-700 group-hover:text-primary transition-colors">{b.user?.name}</td>
                            <td className="p-6 text-xs font-bold text-gray-500 italic">{b.provider?.name}</td>
                            <td className="p-6 font-black text-primary text-base">₹{b.price}</td>
                            <td className="p-6">
                                <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${b.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                    b.status === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                    {b.status}
                                </span>
                            </td>
                            <td className="p-6">
                                <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${b.paymentStatus === 'paid' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'
                                    }`}>
                                    {b.paymentStatus || 'pending'}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

export default AdminDashboard;
