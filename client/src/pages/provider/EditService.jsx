import React, { useEffect, useState } from 'react'
import Title from '../../components/provider/Tittl'
import { assets, serviceCategories } from '../../assets/assets'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'
import { useParams, useNavigate } from 'react-router-dom'

const EditService = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { axios, currency } = useAppContext();

    const [image, setImage] = useState(null)
    const [previewImage, setPreviewImage] = useState(null)
    const [service, setService] = useState({
        title: "",
        description: "",
        category: "",
        pricePerHour: "", // Total fixed price
        serviceArea: "",
        dailyCapacity: {
            monday: 1,
            tuesday: 1,
            wednesday: 1,
            thursday: 1,
            friday: 1,
            saturday: 1,
            sunday: 1
        },
    })
    const [isLoading, setIsLoading] = useState(false)
    const [isFetching, setIsFetching] = useState(true)

    const fetchServiceDetails = async () => {
        try {
            const { data } = await axios.get('/api/provider/services');
            if (data.success) {
                const s = data.service.find(item => item._id === id);
                if (s) {
                    setService({
                        title: s.title,
                        description: s.description,
                        category: s.category,
                        pricePerHour: s.price,
                        serviceArea: s.service_area,
                        dailyCapacity: s.dailyCapacity || {
                            monday: 1, tuesday: 1, wednesday: 1, thursday: 1, friday: 1, saturday: 1, sunday: 1
                        },
                    });
                    setPreviewImage(s.image);
                } else {
                    toast.error("Service not found");
                    navigate('/provider/manage-service');
                }
            }
        } catch (error) {
            toast.error("Failed to fetch service details");
        } finally {
            setIsFetching(false);
        }
    }

    useEffect(() => {
        fetchServiceDetails();
    }, [id]);

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        if (isLoading) return;

        setIsLoading(true);
        try {
            const formData = new FormData();

            if (image) {
                formData.append("image", image);
            }
            formData.append("service", JSON.stringify(service));

            const { data } = await axios.post(
                `/api/provider/update-service/${id}`,
                formData,
                { withCredentials: true }
            );

            if (data.success) {
                toast.success(data.message);
                navigate('/provider/manage-service');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(
                error?.response?.data?.message || "Something went wrong"
            );
        } finally {
            setIsLoading(false);
        }
    };

    if (isFetching) return <div className="p-10 text-center text-gray-400">Loading service details...</div>

    return (
        <div className="px-4 py-10 md:px-10 flex-1">
            <Title
                title="Edit Service"
                subtitle="Update your service details, pricing, and daily capacity."
            />

            <form
                onSubmit={onSubmitHandler}
                className="flex flex-col gap-6 text-gray-700 text-sm mt-6 max-w-3xl"
            >
                {/* Service Image */}
                <div className="flex items-center gap-4">
                    <label htmlFor="service-image" className="cursor-pointer group relative">
                        <img
                            src={image ? URL.createObjectURL(image) : (previewImage || assets.upload_icon)}
                            alt="Upload"
                            className="h-24 w-24 rounded-xl object-cover border-2 border-dashed border-gray-200 group-hover:border-primary/50 transition-all shadow-sm"
                        />
                        <div className="absolute inset-0 bg-black/20 rounded-xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                            <p className="text-[10px] text-white font-bold bg-primary/80 px-2 py-1 rounded">CHANGE</p>
                        </div>
                        <input
                            type="file"
                            id="service-image"
                            accept="image/*"
                            hidden
                            onChange={(e) => {
                                setImage(e.target.files[0])
                            }}
                        />
                    </label>
                    <div>
                        <p className="text-sm font-bold text-gray-700">Service Image</p>
                        <p className="text-xs text-gray-400">Click to upload a new image or keep the current one.</p>
                    </div>
                </div>

                {/* Title and Category */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col">
                        <label className="font-medium mb-1">Service Name</label>
                        <input
                            type="text"
                            value={service.title}
                            placeholder="e.g., Air Conditioner Repair"
                            onChange={(e) => setService({ ...service, title: e.target.value })}
                            className="px-3 py-2 border border-borderColor rounded-md outline-none focus:border-primary transition-all"
                            required
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="font-medium mb-1">Category</label>
                        <select
                            value={service.category}
                            onChange={(e) => setService({ ...service, category: e.target.value })}
                            className="px-3 py-2 border border-borderColor rounded-md outline-none bg-white focus:border-primary transition-all"
                            required
                        >
                            <option value="">Select a category</option>
                            {serviceCategories.map((cat, index) => (
                                <option key={index} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Description */}
                <div className="flex flex-col">
                    <label className="font-medium mb-1">Description</label>
                    <textarea
                        value={service.description}
                        placeholder="Describe your service..."
                        onChange={(e) => setService({ ...service, description: e.target.value })}
                        className="px-3 py-2 border border-borderColor rounded-md outline-none resize-none h-28 focus:border-primary transition-all"
                        required
                    />
                </div>

                {/* Price and Area */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col">
                        <label className="font-medium mb-1 text-primary">Fixed Price for Work ({currency})</label>
                        <input
                            type="number"
                            value={service.pricePerHour}
                            placeholder="e.g., 500"
                            onChange={(e) => setService({ ...service, pricePerHour: e.target.value })}
                            className="px-3 py-2 border border-borderColor rounded-md outline-none focus:border-primary transition-all"
                            required
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="font-medium mb-1">Service Area</label>
                        <input
                            type="text"
                            value={service.serviceArea}
                            placeholder="e.g., California"
                            onChange={(e) => setService({ ...service, serviceArea: e.target.value })}
                            className="px-3 py-2 border border-borderColor rounded-md outline-none focus:border-primary transition-all"
                            required
                        />
                    </div>
                </div>

                {/* Daily Capacity Setup */}
                <div className="mt-2">
                    <label className="font-medium mb-3 block text-gray-700">Daily Booking Capacity (Works per Day)</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
                        {Object.keys(service.dailyCapacity).map(day => (
                            <div key={day} className="flex flex-col items-center p-3 bg-gray-50 rounded-xl border border-gray-100 shadow-sm transition-all hover:bg-white hover:shadow-md">
                                <label className="text-[10px] uppercase font-bold text-gray-400 mb-2 truncate w-full text-center">{day}</label>
                                <input
                                    type="number"
                                    min="0"
                                    max="50"
                                    value={service.dailyCapacity[day]}
                                    onChange={(e) => setService({
                                        ...service,
                                        dailyCapacity: {
                                            ...service.dailyCapacity,
                                            [day]: parseInt(e.target.value) || 0
                                        }
                                    })}
                                    className="w-full text-center font-bold text-primary focus:outline-none bg-transparent"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                    <button
                        type="submit"
                        className="flex items-center gap-2 px-6 py-3 mt-4 bg-primary text-white rounded-xl font-bold w-max cursor-pointer shadow-lg shadow-primary/20 hover:bg-primary-dull transition-all active:scale-95"
                    >
                        {isLoading ? "Updating Service..." : "Update Service"}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default EditService
