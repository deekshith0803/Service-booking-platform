import React, { useEffect, useState } from 'react'
import { assets, dummyMyBookingsData } from '../assets/assets'
import Title from '../components/Title'

const MyBooking = () => {

  const currency = import.meta.env.VITE_CURRENCY
  const [booking, setBooking] = useState([])

  const fetchMyBooking = async () => {
    setBooking(dummyMyBookingsData)
  }

  useEffect(() => {
    fetchMyBooking()
  }, [])

  return (
    <div className='px-6 md:px-16 lg:px-24 xl:px-32 2xl:px-40 mt-10 text-sm'>
      <Title title='My Bookings' subtitle='view and manage your bookings' align='left' />

      <div>
        {booking.map((booking, index) => (
          <div key={booking._id} className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 border border-borderColor rounded-lg mt-5 first:mt-12'>
            {/* service image + info */}
            <div className='md:col-span-1'>
              <div className='rounded-md overflow-hidden mb-3'>
                <img src={booking.service.image} alt="service" className='w-full h-auto aspect-video object-cover' />
              </div>
              <p>{booking.service.title}</p>
              <p className='text-gray-500'>{booking.service.category} {booking.service.service_area} {booking.service.staffCount}</p>
            </div>
            {/* booking info */}
            <div className='md:col-span-1'>
              <div className='flex items-center gap-2'>
                <p className='px-3 py-1.5 bg-light rounded'>Booking # {index + 1}</p>
                <p className={`px-3 py-1 rounded-full ${booking.status === 'confirmed' ? 'bg-green-400/15 text-green--400' : 'bg-red-400/15 text-red-600'}`}>{booking.status}</p>
              </div>

              <div className='flex items-start gap-2 mt-3'>
                <img src={assets.calendar_icon_colored} alt="calendar" className='w-4 h-4 mt-1' />
                <div>
                  <p className='text-gray-500'>Date picked</p>
                  <p>{booking.pickupDate.split('T')[0]} To {booking.returnDate.split('T')[0]}</p>
                </div>
              </div>

              <div className='flex items-start gap-2 mt-3'>
                <img src={assets.location_icon_colored} alt="calendar" className='w-4 h-4 mt-1' />
                <div>
                  <p className='text-gray-500'>Location</p>
                  <p>{booking.service.service_area}</p>
                </div>
              </div>

            </div>
            {/* price */}
            <div className='md:col-span-1 flex flex-col justify-between gap-6'>
              <div className='text-sm text-gray-500 md:text-right'>
                <p>Total Price</p>
                <h1 className='text-2xl font-semibold text-primary'>{currency} {booking.price}</h1>
                <p>Booking on {booking.bookedAt.split('T')[0]}</p>
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  )
}

export default MyBooking
