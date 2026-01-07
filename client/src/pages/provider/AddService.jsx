import React, { useState } from 'react'
import Title from '../../components/provider/Tittl'
import { assets } from '../../assets/assets'
import { serviceCategories } from '../../assets/assets'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'

const AddService = () => {

    const { axios, currency } = useAppContext();

    const [image, setImage] = useState(null)
    const [service, setService] = useState({
        title: "",
        description: "",
        category: "",
        pricePerHour: "",
        serviceArea: "",
        staffCount: 1,
        duration: "",
        toolsProvided: false,
    })
    const [isLoading, setIsLoading] = useState(false)
    const onSubmitHandler = async (e) => {
        e.preventDefault();
        if (isLoading) return;

        if (!image) {
            toast.error("Please upload an image");
            return;
        }

        setIsLoading(true);
        try {
            const formData = new FormData();

            formData.append("image", image);
            formData.append("service", JSON.stringify(service));
            const { data } = await axios.post(
                "/api/provider/add-service",
                formData,
                { withCredentials: true }
            );

            if (data.success) {
                toast.success(data.message);

                setImage(null);
                setService({
                    title: "",
                    description: "",
                    category: "",
                    pricePerHour: "",
                    serviceArea: "",
                    staffCount: 1,
                    duration: "",
                    toolsProvided: false,
                });
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


    return (
        <div className="px-4 py-10 md:px-10 flex-1">
            <Title
                title="Add Service"
                subtitle="Please provide all the necessary details about the service you wish to offer, including its name, description, pricing, and availability, so that it can be accurately displayed to users and managed effectively within the platform."
            />

            <form
                onSubmit={onSubmitHandler}
                className="flex flex-col gap-6 text-gray-700 text-sm mt-6 max-w-3xl"
            >
                {/* Service Image */}
                <div className="flex items-center gap-4">
                    <label htmlFor="service-image" className="cursor-pointer">
                        <img
                            src={image ? URL.createObjectURL(image) : assets.upload_icon}
                            alt="Upload"
                            className="h-20 w-20 rounded object-cover border"
                        />
                        <input
                            type="file"
                            id="service-image"
                            accept="image/*"
                            hidden
                            onChange={(e) => {
                                setImage(e.target.files[0])
                                setService({ ...service, image: e.target.files[0] })
                            }}
                        />
                    </label>
                    <p className="text-sm text-gray-500">Upload a clear image representing your service</p>
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
                            className="px-3 py-2 border border-borderColor rounded-md outline-none"
                            required
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="font-medium mb-1">Category</label>
                        <select
                            value={service.category}
                            onChange={(e) => setService({ ...service, category: e.target.value })}
                            className="px-3 py-2 border border-borderColor rounded-md outline-none bg-white"
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
                        className="px-3 py-2 border border-borderColor rounded-md outline-none resize-none h-28"
                        required
                    />
                </div>

                {/* Price Per Hour and Duration */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col">
                        <label className="font-medium mb-1">Price Per Hour ({currency})</label>
                        <input
                            type="number"
                            value={service.pricePerHour}
                            placeholder="e.g., 80"
                            onChange={(e) => setService({ ...service, pricePerHour: e.target.value })}
                            className="px-3 py-2 border border-borderColor rounded-md outline-none"
                            required
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="font-medium mb-1">Estimated Duration</label>
                        <input
                            type="text"
                            value={service.duration}
                            placeholder="e.g., 2-5 hours"
                            onChange={(e) => setService({ ...service, duration: e.target.value })}
                            className="px-3 py-2 border border-borderColor rounded-md outline-none"
                        />
                    </div>
                </div>

                {/* Service Area and Staff Count */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col">
                        <label className="font-medium mb-1">Service Area</label>
                        <input
                            type="text"
                            value={service.serviceArea}
                            placeholder="e.g., Los Angeles"
                            onChange={(e) => setService({ ...service, serviceArea: e.target.value })}
                            className="px-3 py-2 border border-borderColor rounded-md outline-none"
                            required
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="font-medium mb-1">Number of Staff</label>
                        <input
                            type="number"
                            value={service.staffCount}
                            min="1"
                            onChange={(e) => setService({ ...service, staffCount: e.target.value })}
                            className="px-3 py-2 border border-borderColor rounded-md outline-none"
                        />
                    </div>
                </div>

                {/* Tools Provided */}
                <div className="flex items-center gap-3 mt-2">
                    <input
                        type="checkbox"
                        checked={service.toolsProvided}
                        onChange={(e) => setService({ ...service, toolsProvided: e.target.checked })}
                        className="w-4 h-4 accent-primary"
                    />
                    <label className="text-gray-700">Tools Provided by Provider</label>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                    <button
                        type="submit"
                        className="flex items-center gap-2 px-4 py-2.5 mt-4 bg-primary text-white rounded-md font-medium w-max cursor-pointer"
                    >
                        <img src={assets.tick_icon} alt="" />
                        {isLoading ? "Listing Your Service..." : "List Your Service"}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default AddService
