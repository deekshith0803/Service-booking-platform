import React, { useEffect, useState } from 'react'
import Title from '../../components/provider/Tittl'
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const ManageBookings = () => {

    const { isProvider, axios, currency } = useAppContext();

    const [booking, setBooking] = useState([])

    const fetchBookings = async () => {
        try {
            const { data } = await axios.get('/api/bookings/provider')
            data?.success ? setBooking(data.bookings) : toast.error(data.message)
        } catch (error) {
            toast.error(error?.response?.data?.message)
        }
    }

    const changeBookingStatus = async (bookingId, status) => {
        try {
            const { data } = await axios.post(`/api/bookings/change-status`, { bookingId, status })
            if (data?.success) {
                toast.success(data.message)
                fetchBookings()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error?.response?.data?.message)
        }
    }

    const markAsPaid = async (bookingId) => {
        try {
            const { data } = await axios.post(`/api/bookings/mark-paid`, { bookingId })
            if (data?.success) {
                toast.success(data.message)
                fetchBookings()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to update payment status")
        }
    }

    useEffect(() => {
        fetchBookings()
    }, [])

    return (
        <div className='px-4 pt-10 md:px-10 w-full'>
            <Title
                title="Manage Booking"
                subtitle="Easily view, update, and organize all your customer bookings in one place."
            />
            <div className='max-w-3xl w-full rounded-md overflow-hidden border border-borderColor mt-6'>
                <table className='w-full border-collapse text-left text-sm text-gray-600'>
                    <thead className='text-gray-500'>
                        <tr>
                            <th className='p-3 font-medium'>Service</th>
                            <th className='p-3 font-medium max-md:hidden'>Date</th>
                            <th className='p-3 font-medium'>Contact</th>
                            <th className='p-3 font-medium'>Total</th>
                            <th className='p-3 font-medium max-md:hidden'>Payment</th>
                            <th className='p-3 font-medium'>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {booking.map((booking, index) => (
                            <tr key={index} className='border-t border-borderColor text-gray-500'>
                                <td className='p-3 flex items-center gap-3'>
                                    <img src={booking.service.image} alt="" className='h-12 w-12 aspect-square rounded-md object-cover' />
                                    <div>
                                        <p className='font-medium max-md:hidden'>{booking.service.title} {booking.service.category}</p>
                                        {booking.notes && (
                                            <p className='text-[10px] text-gray-400 italic mt-1 line-clamp-1 max-w-[150px]'>
                                                "{booking.notes}"
                                            </p>
                                        )}
                                    </div>
                                </td>
                                <td className='p-3 max-md:hidden text-gray-400'>
                                    {booking.date.split('T')[0]}
                                </td>
                                <td className='p-3'>
                                    <div>
                                        <p className="text-gray-500">Contact & Location</p>
                                        <p className="font-medium text-gray-700">{booking.phone}</p>
                                        <p className="text-xs text-gray-400 mt-0.5">{booking.address}</p>
                                    </div>
                                </td>
                                <td className='p-3'>
                                    {currency} {booking.price}
                                </td>
                                <td className='p-3 max-md:hidden'>
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${booking.paymentMethod === 'cod' || booking.paymentId === 'COD' ? 'bg-gray-100 text-gray-700' : 'bg-blue-100 text-blue-700'}`}>
                                        {booking.paymentMethod === 'cod' || booking.paymentId === 'COD' ? 'COD' : 'Online'}
                                    </span>
                                </td>
                                <td className='p-3'>
                                    <div className="flex flex-col gap-2">
                                        {booking.status === 'pending' ? (
                                            <select onChange={(e) => changeBookingStatus(booking._id, e.target.value)} value={booking.status} className='px-2 py-1.5 text-gray-500 border border-borderColor rounded-md outline-none w-full'>
                                                <option value='pending'>Pending</option>
                                                <option value='confirmed'>Confirm</option>
                                                <option value='cancelled'>Cancel</option>
                                            </select>
                                        ) : (
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold text-center ${booking.status === "confirmed" ? 'bg-green-100 text-green-500' : 'bg-red-100 text-red-500'}`} >
                                                {booking.status}
                                            </span>
                                        )}

                                        {/* Mark as Paid Button for COD */}
                                        {(booking.paymentMethod === 'cod' || booking.paymentId === 'COD') && booking.paymentStatus !== 'paid' && booking.status !== 'cancelled' && (
                                            <button
                                                onClick={() => markAsPaid(booking._id)}
                                                className="px-3 py-1 bg-green-500 text-white rounded-md text-xs font-bold hover:bg-green-600 transition-colors"
                                            >
                                                Mark Paid
                                            </button>
                                        )}
                                        {booking.paymentStatus === 'paid' && (
                                            <span className="text-xs text-center text-green-600 font-bold bg-green-50 px-2 py-1 rounded-full border border-green-100">
                                                PAID
                                            </span>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default ManageBookings
