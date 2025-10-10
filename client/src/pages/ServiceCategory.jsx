import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { dummyserviceData, serviceCategories } from '../assets/assets'
import Title from '../components/Title'
import ServiceCard from '../components/ServiceCard'
import { assets } from '../assets/assets'

const ServiceCategory = () => {

    const { category } = useParams();
    const navigate = useNavigate()

    // Find category in serviceCategories (case-insensitive)
    const currentCategory = serviceCategories.find(
        (item) => item.toLowerCase() === category.toLowerCase()
    )

    const filteredServices = dummyserviceData.filter(
        (service) => service.category.toLowerCase() === category.toLowerCase()
    )

    return (
        <div className="px-6 md:px-16 lg:px-24 xl:px-32 mt-10">
            {currentCategory ? (
                <div className="flex flex-col items-center w-full mb-8">
                    <Title title={currentCategory} /> {/* Pass category name to Title */}
                </div>
            ) : (
                <div className="flex flex-col items-center w-full mb-8">
                    <Title title="Category Not Found" />
                </div>
            )}
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 mb-6 text-gray-500 cursor-pointer"
            >
                <img src={assets.arrow_icon} alt="" className="rotate-180 opacity-65" />
                Back
            </button>

            {filteredServices.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-6">
                    {filteredServices.map((service) => (
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
    )
}

export default ServiceCategory
