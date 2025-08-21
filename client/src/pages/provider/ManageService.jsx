import React, { useEffect, useState } from 'react'
import { assets, dummyserviceData } from '../../assets/assets'
import Title from '../../components/provider/Tittl'

const ManageService = () => {

    const currency = import.meta.env.VITE_CURRENCYb

    const [service, setService] = useState([])

    const fetchService = async () => {
        setService(dummyserviceData)
    }

    useEffect(() => {
        fetchService()
    }, [])

    return (
        <div className='px-4 pt-10 md:px-10 w-full'>
            <Title
                title="Manage Service"
                subtitle="Easily view, update, and organize all your available services in one place."
            />
            <div className='max-w-3xl w-full rounded-md overflow-hidden border border-borderColor mt-6'>
                <table className='w-full border-collapse text-left text-sm text-gray-600'>
                    <thead className='text-gray-500'>
                        <tr>
                            <th className='p-3 font-medium'>Service</th>
                            <th className='p-3 font-medium max-md:hidden'>Category</th>
                            <th className='p-3 font-medium'>Price</th>
                            <th className='p-3 font-medium max-md:hidden'>Status</th>
                            <th className='p-3 font-medium'>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {service.map((service, index) => (
                            <tr key={index} className='border-t border-borderColor'>
                                <td className='p-3 flex items-center gap-3'>
                                    <img src={service.image} alt="" className='w-12 h-12 aspect-square rounded-md object-cover' />
                                    <div className='max-md:hidden'>
                                        <p className='font-medium'>{service.title}</p>
                                        <p className='text-xs text-gray-500'>{service.service_area} • {service.staffCount}</p>
                                    </div>
                                </td>
                                <td className='p-3 max-md:hidden'>
                                    {service.category}
                                </td>
                                <td className='p-3 max-md:hidden'>
                                    {currency}{service.pricePerHour}/Hour
                                </td>
                                <td className='p-3 max-md:hidden'>
                                    <span className={`px-3 py-1 rounded-full text-xs ${service.isAvailable ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                        {service.isAvailable ? "Available" : "Unavailable"}
                                    </span>
                                </td>
                                <td className='flex items-center p-3'>
                                    <img src={service.isAvailable ? assets.eye_close_icon : assets.eye_icon} alt="" className='cursor-pointer' />
                                    <img src={assets.delete_icon} alt="" className='cursor-pointer' />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    )
}

export default ManageService
