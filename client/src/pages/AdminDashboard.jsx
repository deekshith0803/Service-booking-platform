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

    if (!token) {
        return (
            <div className="flex justify-center items-center h-screen flex-col gap-4">
                <p className="text-xl text-gray-600">Please log in to view the dashboard.</p>
            </div>
        );
    }

    if (error && !loading) {
        return <div className="text-center p-10 text-red-500">{error}</div>;
    }

    return (
        <div className="container mx-auto p-4 md:p-6 min-h-screen bg-gray-50">
            <div className="flex justify-between items-center mb-8 border-b pb-4">
                <h1 className="text-3xl font-bold text-gray-800">Admin Control Center</h1>
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
                    >
                        {activeTab === "stats" && stats && renderStats(stats)}
                        {activeTab === "users" && renderUsers(users, handleUpdateUser)}
                        {activeTab === "providers" && renderProviders(providers, handleUpdateUser, openChat, unreadCounts)}
                        {activeTab === "bookings" && renderBookings(bookings)}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// --- SECTION RENDERING FUNCTIONS ---

const renderStats = (stats) => (
    <div className="space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-gray-400 text-xs uppercase font-bold tracking-wider">Total Users</h2>
                <p className="text-3xl font-bold text-gray-800 mt-2">{stats.counts.users}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-gray-400 text-xs uppercase font-bold tracking-wider">Total Services</h2>
                <p className="text-3xl font-bold text-gray-800 mt-2">{stats.counts.services}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-gray-400 text-xs uppercase font-bold tracking-wider">Total Bookings</h2>
                <p className="text-3xl font-bold text-gray-800 mt-2">{stats.counts.bookings}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-gray-400 text-xs uppercase font-bold tracking-wider">Platform Rating</h2>
                <p className="text-3xl font-bold text-yellow-500 mt-2">★ {stats.counts.avgRating}</p>
            </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold mb-6 text-gray-700">Daily Booking Trends</h2>
                <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={stats.dailyBookings}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                            <XAxis dataKey="_id" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                            <Tooltip cursor={{ fill: '#f9fafb' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                            <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={20} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold mb-6 text-gray-700">Status Distribution</h2>
                <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={stats.statusSummary}
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="count"
                                nameKey="_id"
                            >
                                {stats.statusSummary.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend iconType="circle" />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>

        {/* Secondary Row: Categories & Recent Reviews */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Category Breakdown */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold mb-6 text-gray-700">Popular Categories</h2>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart layout="vertical" data={stats.categorySummary}>
                            <XAxis type="number" hide />
                            <YAxis dataKey="_id" type="category" axisLine={false} tickLine={false} width={100} tick={{ fontSize: 12 }} />
                            <Tooltip />
                            <Bar dataKey="count" fill="#10b981" radius={[0, 4, 4, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Recent Reviews */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold mb-6 text-gray-700">Recent Customer Reviews</h2>
                <div className="space-y-4 max-h-[300px] overflow-y-auto">
                    {stats.alerts.recentReviews.length > 0 ? (
                        stats.alerts.recentReviews.map((review) => (
                            <div key={review._id} className="p-4 bg-gray-50 rounded-lg">
                                <div className="flex justify-between items-start mb-1">
                                    <span className="font-semibold text-sm">{review.userId?.name || "Anonymous"}</span>
                                    <span className="text-yellow-500 text-xs">{"★".repeat(review.rating)}</span>
                                </div>
                                <p className="text-xs text-gray-500 italic mb-2">"{review.comment}"</p>
                                <div className="text-[10px] text-gray-400 flex justify-between">
                                    <span>{review.serviceId?.title}</span>
                                    <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-500 py-10">No reviews yet</p>
                    )}
                </div>
            </div>
        </div>

        {/* Booking Alerts Table */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold mb-6 text-gray-700">Recent Platform Activity</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full text-left">
                    <thead>
                        <tr className="text-gray-400 text-xs uppercase tracking-wider border-b border-gray-100">
                            <th className="pb-4 font-semibold px-2">Type</th>
                            <th className="pb-4 font-semibold px-2">Service</th>
                            <th className="pb-4 font-semibold px-2">User</th>
                            <th className="pb-4 font-semibold px-2">Status / Date</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm divide-y divide-gray-50">
                        {stats.alerts.recentBookings.map((booking) => (
                            <tr key={booking._id} className="hover:bg-gray-50 transition-colors">
                                <td className="py-4 px-2">
                                    <span className="text-blue-500 font-medium">New Booking</span>
                                </td>
                                <td className="py-4 px-2 font-medium text-gray-700">{booking.service?.title || "Deleted Service"}</td>
                                <td className="py-4 px-2 text-gray-600">{booking.user?.name}</td>
                                <td className="py-4 px-2">
                                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
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

const renderUsers = (users, onUpdate) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-700">User Management</h2>
            <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-500">{users.length} Total Users</span>
        </div>
        <div className="overflow-x-auto">
            <table className="min-w-full text-left">
                <thead className="bg-gray-50 text-gray-400 text-xs uppercase tracking-wider font-semibold">
                    <tr>
                        <th className="p-4">User</th>
                        <th className="p-4">Email</th>
                        <th className="p-4">Role</th>
                        <th className="p-4">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {users.map((u) => (
                        <tr key={u._id} className="hover:bg-gray-50 transition-colors">
                            <td className="p-4">
                                <div className="flex items-center gap-3">
                                    <img src={u.image || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"} className="w-8 h-8 rounded-full object-cover border" alt="" />
                                    <span className="font-medium text-gray-800">{u.name}</span>
                                </div>
                            </td>
                            <td className="p-4 text-gray-600">{u.email}</td>
                            <td className="p-4">
                                <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${u.role === 'provider' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                                    }`}>
                                    {u.role}
                                </span>
                            </td>
                            <td className="p-4">
                                <select
                                    className="bg-gray-50 border border-gray-200 rounded px-2 py-1 text-xs outline-none focus:ring-1 focus:ring-primary"
                                    value={u.role}
                                    onChange={(e) => onUpdate(u._id, { role: e.target.value })}
                                >
                                    <option value="user">User</option>
                                    <option value="provider">Provider</option>
                                </select>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

const renderProviders = (providers, onUpdate, onContact, unreadCounts) => (
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
                        {providers.filter(p => p.isProviderRequested).map(p => (
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
                        ))}
                        {providers.filter(p => p.isProviderRequested).length === 0 && (
                            <tr><td className="p-10 text-center text-gray-400 text-sm">No pending requests at the moment.</td></tr>
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
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
            <h2 className="text-lg font-bold text-gray-700">Global Booking History</h2>
            <div className="flex gap-4 text-xs font-bold">
                <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                    <span className="text-gray-500">Pending: {bookings.filter(b => b.status === 'pending').length}</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-gray-500">Confirmed: {bookings.filter(b => b.status === 'confirmed').length}</span>
                </div>
            </div>
        </div>
        <div className="overflow-x-auto">
            <table className="min-w-full text-left">
                <thead className="bg-gray-50 text-gray-400 text-xs uppercase font-semibold">
                    <tr>
                        <th className="p-4">Service</th>
                        <th className="p-4">Client</th>
                        <th className="p-4">Provider</th>
                        <th className="p-4">Total</th>
                        <th className="p-4">Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {bookings.map((b) => (
                        <tr key={b._id} className="hover:bg-gray-50 transition-colors">
                            <td className="p-4">
                                <p className="font-bold text-gray-800 text-sm">{b.service?.title || "Deleted"}</p>
                                <p className="text-[10px] text-gray-400 uppercase tracking-tighter">{b.service?.category} • {new Date(b.date).toLocaleDateString()}</p>
                            </td>
                            <td className="p-4 text-xs font-medium text-gray-600">{b.user?.name}</td>
                            <td className="p-4 text-xs font-medium text-gray-600">{b.provider?.name}</td>
                            <td className="p-4 font-bold text-primary">₹{b.price}</td>
                            <td className="p-4">
                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${b.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                    b.status === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                    {b.status}
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
