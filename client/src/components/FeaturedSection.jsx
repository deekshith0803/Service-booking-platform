import React from 'react'
import Title from './Title'
import { assets, dummyserviceData } from '../assets/assets'
import ServiceCard from './ServiceCard'
import { useNavigate } from 'react-router-dom'

const FeaturedSection = () => {

    const navigate = useNavigate();

    return (
        <div className='flex flex-col items-center py-24 px-6 md:px-16 lg:px-24 xl:px-32'>
            <div>
                <Title title='Featured Services' subtitle='Discover the top-rated services from our trusted professionals.' align='center' />
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-18'>
                {
                    dummyserviceData.slice(0, 3).map((service) => (
                        <div key={service._id}>
                            <ServiceCard service={service} />
                        </div>
                    ))
                }
            </div>
            <button onClick={() => {
                navigate('/services');
                scrollTop(0, 0);
            }} className='flex items-center justify-center gap-2 py-2 border border-borderColor hower:bg-gray-100 rounded-md mt-18 curser-pointer'>
                Explore all services <img src={assets.arrow_icon} alt="arrow" />
            </button>
        </div>
    )
}

export default FeaturedSection
