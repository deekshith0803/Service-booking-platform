import React, { useEffect, useState } from "react";
import { assets } from "../../assets/assets";
import Title from "../../components/provider/Tittl";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const ManageService = () => {
    const { isProvider, axios, currency } = useAppContext();

    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchService = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(
                "/api/provider/services",
                { withCredentials: true }
            );

            if (data?.success && Array.isArray(data.service)) {
                setServices(data.service);
            } else {
                setServices([]);
                toast.error("No services found");
            }
        } catch (error) {
            setServices([]);
            toast.error(
                error?.response?.data?.message || "Failed to fetch services"
            );
        } finally {
            setLoading(false);
        }
    };

    const toggleAvailability = async (serviceId) => {
        try {
            const { data } = await axios.post(
                `/api/provider/toggle-service`,
                { serviceId },
                { withCredentials: true }
            );

            if (data?.success) {
                toast.success(data.message);
                fetchService();
            } else {
                toast.error(data.message || "Failed to toggle service");
            }
        } catch (error) {
            setServices([]);
            toast.error(
                error?.response?.data?.message || "Failed to toggle service"
            );
        }
    };

    const deleteService = async (serviceId) => {
        try {
            const confirmDelete = window.confirm("Are you sure you want to delete this service?");
            if (!confirmDelete) return null;

            const { data } = await axios.post(
                `/api/provider/delete-service`,
                { serviceId },
                { withCredentials: true }
            );

            if (data?.success) {
                toast.success(data.message);
                fetchService();
            } else {
                toast.error(data.message || "Failed to delete service");
            }
        } catch (error) {
            setServices([]);
            toast.error(
                error?.response?.data?.message || "Failed to delete service"
            );
        }
    };

    useEffect(() => {
        if (isProvider) {
            fetchService();
        }
    }, [isProvider]);

    return (
        <div className="px-4 pt-10 md:px-10 w-full">
            <Title
                title="Manage Service"
                subtitle="View, manage, and control all your listed services."
            />

            <div className="max-w-3xl w-full rounded-md overflow-hidden border border-borderColor mt-6">
                <table className="w-full border-collapse text-left text-sm text-gray-600">
                    <thead className="text-gray-500">
                        <tr>
                            <th className="p-3 font-medium">Service</th>
                            <th className="p-3 font-medium max-md:hidden">Category</th>
                            <th className="p-3 font-medium">Price</th>
                            <th className="p-3 font-medium max-md:hidden">Status</th>
                            <th className="p-3 font-medium">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {services?.map((service, index) => (
                            <tr
                                key={service._id || index}
                                className="border-t border-borderColor"
                            >
                                <td className="p-3 flex items-center gap-3">
                                    <img
                                        src={service.image || assets.upload_icon}
                                        alt=""
                                        className="w-12 h-12 rounded-md object-cover"
                                    />
                                    <div className="max-md:hidden">
                                        <p className="font-medium">{service.title}</p>
                                        <p className="text-xs text-gray-500">
                                            {service.service_area} • {service.staffCount} staff
                                        </p>
                                    </div>
                                </td>

                                <td className="p-3 max-md:hidden">
                                    {service.category}
                                </td>

                                <td className="p-3">
                                    {currency}
                                    {service.price}/hour
                                </td>

                                <td className="p-3 max-md:hidden">
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs ${service.availability
                                            ? "bg-green-100 text-green-600"
                                            : "bg-red-100 text-red-600"
                                            }`}
                                    >
                                        {service.availability ? "Available" : "Unavailable"}
                                    </span>
                                </td>

                                <td className="flex items-center gap-3 p-3">
                                    <img
                                        onClick={() => toggleAvailability(service._id)}
                                        src={
                                            service.availability
                                                ? assets.eye_close_icon
                                                : assets.eye_icon
                                        }
                                        alt=""
                                        className="cursor-pointer"
                                    />
                                    <img
                                        onClick={() => deleteService(service._id)}
                                        src={assets.delete_icon}
                                        alt=""
                                        className="cursor-pointer"
                                    />
                                </td>
                            </tr>
                        ))}

                        {/* ✅ EMPTY STATE */}
                        {!loading && services.length === 0 && (
                            <tr>
                                <td
                                    colSpan="5"
                                    className="text-center text-gray-400 py-6"
                                >
                                    No services found
                                </td>
                            </tr>
                        )}

                        {/* ✅ LOADING STATE */}
                        {loading && (
                            <tr>
                                <td
                                    colSpan="5"
                                    className="text-center text-gray-400 py-6"
                                >
                                    Loading services...
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageService;
