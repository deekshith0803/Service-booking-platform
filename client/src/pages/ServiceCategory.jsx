import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { serviceCategories } from '../assets/assets';
import Title from '../components/Title';
import ServiceCard from '../components/ServiceCard';
import { assets } from '../assets/assets';
import axios from 'axios';

const ServiceCategory = () => {

    const { category } = useParams();
    const navigate = useNavigate();

    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);

    // Find category name (for title)
    const currentCategory = serviceCategories.find(
        (item) => item.toLowerCase() === category.toLowerCase()
    );

    // FETCH SERVICES FROM BACKEND
    useEffect(() => {
        fetchServices();
    }, [category]);

    const fetchServices = async () => {
        try {
            const { data } = await axios.get(
                `/api/user/services?category=${category}`
            );

            if (data.success) {
                setServices(data.services);
            } else {
                setServices([]);
            }
        } catch (error) {
            console.error("Failed to fetch services", error);
            setServices([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="px-6 md:px-16 lg:px-24 xl:px-32 mt-10">

            {/* TITLE */}
            <div className="flex flex-col items-center w-full mb-8">
                <Title title={currentCategory || "Category"} />
            </div>

            {/* BACK BUTTON */}
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 mb-6 text-gray-500 cursor-pointer"
            >
                <img src={assets.arrow_icon} alt="" className="rotate-180 opacity-65" />
                Back
            </button>

            {/* CONTENT */}
            {loading ? (
                <div className="flex justify-center h-[40vh] items-center">
                    <p className="text-gray-500">Loading services...</p>
                </div>
            ) : services.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-6">
                    {services.map((service) => (
                        <ServiceCard key={service._id} service={service} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-[60vh]">
                    <p className="text-2xl font-medium text-blue-500 uppercase">
                        No services found
                    </p>
                </div>
            )}
        </div>
    );
};

export default ServiceCategory;
