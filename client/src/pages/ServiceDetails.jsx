import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { assets, dummyserviceData } from '../assets/assets';
import Loader from '../components/Loader';

const Servicedetails = () => {

  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const currency = import.meta.env.VITE_CURRENCY

  const handleSubmit = async (e) => {
    e.preventDefault();
  }

  useEffect(() => {
    const foundService = dummyserviceData.find((service) => service._id === id);
    setService(foundService);
  }, [id]);


  return service ? (
    <div className='px-6 md:px-16 lg:px-24 xl:px-32 mt-10'>
      <button onClick={() => navigate(-1)} className='flex items-center gap-2 mb-6 text-gray-500 cursor-pointer'>
        <img src={assets.arrow_icon} alt="" className='rotate-180 opacity-65' />
        Back
      </button>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12'>
        {/* left side: service image and details */}
        <div className='lg:col-span-2'>
          <img src={service.image} alt="service" className='w-full h-auto md:max-h-100 object-cover rounded-xl mb-6 shadow-md' />
          <div className='space-y-6'>
            <div>
              <h1 className='text-3xl font-bold'>{service.title}</h1>
              <p className='text-gray-500 text-lg'>{service.category}  </p>
            </div>
            <hr className='border-borderColor my-6' />
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {[
                { icon: assets.users_icon, text: `${service.staffCount} Staff` },
                { icon: assets.location_icon, text: service.service_area },
              ].map((item, index) => (
                <div key={index} className="flex flex-col items-center bg-light p-4 rounded-lg">
                  <img src={item.icon} alt="" className='mb-2 h-5' />
                  <p className="text-gray-600 text-sm">{item.text}</p>
                </div>
              ))}
            </div>
            {/* Discription */}
            <div>
              <h1 className='text-xl font-medium mb-3'>Description</h1>
              <p className='text-gray-500'>{service.description}</p>

            </div>
          </div>

        </div>

        {/* right side: booking form */}
        <form onSubmit={handleSubmit} className='shadow-lg h-max sticky top-15 rounded-xl p-6 space-y-6 text-gray-500'>
          <p className='flex items-center justify-between text-2xl text-gray-800 font-semibold'>{currency}{service.pricePerHour}<span className='text-base text-gray-500 font-medium'>Price per hour</span> </p>
          <hr className='border-borderColor my-6' />
          <div className='flex flex-col gap-2'>
            <label htmlFor="date">Select your date</label>
            <input type="date" className='border border-borderColor rounded-lg px-3 py-2' required id='date' min={new Date().toISOString().split('T')[0]} />
          </div>
          <div className='flex flex-col gap-2'>
            <label htmlFor="time">Select your time</label>
            <select
              required
              name="time"
              id="time"
              defaultValue=""
              className="border border-borderColor rounded-lg px-3 py-2"
            >
              <option value="" disabled>Select a time</option>
              <option value="9-11">9:00 AM - 11:00 AM</option>
              <option value="11-1">11:00 AM - 1:00 PM</option>
              <option value="2-4">2:00 PM - 4:00 PM</option>
              <option value="4-6">4:00 PM - 6:00 PM</option>
            </select>
          </div>

          <button className='w-full bg-primary hover:bg-primary-dull transition-all py-3 font-medium text-white rounded-lg cursor-pointer'>Book Now</button>
          <p className='text-sm text-center'>No credit card required to book</p>
        </form>
      </div>

    </div>
  ) : <Loader />

}

export default Servicedetails
