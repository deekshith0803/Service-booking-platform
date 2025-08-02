import { useEffect, useState } from 'react'
import { assets, dummyDashboardData } from '../../assets/assets'
import Title from '../../components/provider/Tittl'

const ProviderDashboard = () => {

    const currency = import.meta.env.VITE_CURRENCY

    const [data, setData] = useState({
        totalService: 0,
        totalBookings: 0,
        pendingBookings: 0,
        completedBookings: 0,
        recentBookings: [],
        monthlyRevenue: 0,
    })


    const dashboardcard = [
        { title: 'Total Services', value: data.totalService, icon: assets.serviceIconColored },
        { title: 'Total Bookings', value: data.totalBookings, icon: assets.listIconColored },
        { title: 'Pending Bookings', value: data.pendingBookings, icon: assets.cautionIconColored },
        { title: 'Completed Bookings', value: data.completedBookings, icon: assets.listIconColored },
    ]

    useEffect(() => {
        setData(dummyDashboardData)
    }, [])

    return (
        <div className='px-4 pt-10 md:px-10 flex-1'>
            <Title title="Admin Dashboard" subtitle="View a comprehensive summary of your offered services along with detailed information about bookings, including pending and completed ones." />
            <div className='grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 my-8 max-w-3xl'>
                {dashboardcard.map((card, index) => (
                    <div key={index} className='flex gap-2 items-center justify-between p-4 rounded-md border border-borderColor'>
                        <div>
                            <h1 className='text-xs text-gray-500'>{card.title}</h1>
                            <p className='text-lg font-semibold'>{card.value}</p>
                        </div>
                        <div className='flex items-center justify-center w-10 rounded-full bg-primary/10'>
                            <img src={card.icon} alt="icon" className='h-4 w-4' />
                        </div>
                    </div>
                ))}
            </div>
            <div className='flex flex-wrap items-start gap-6 mb-8 w-full'>
                {/* Recent Bookings Section */}
                <div className='p-4 md:p-6 border border-borderColor rounded-md max-w-lg w-full'>
                    <h1 className='text-lg font-medium' >Recent Bookings</h1>
                    <p className='text-gray-500'>Latest customer bookings</p>
                    {data.recentBookings.map((booking, index) => (
                        <div key={index} className='mt-4 flex items-center justify-between'>
                            <div className='flex items-center gap-2'>
                                <div className='hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-primary/10'>
                                    <img src={assets.listIconColored} className='h-5 w-5' alt="" />
                                </div>
                                <div>
                                    <h1 className='text-sm font-semibold'>{booking.service.title}</h1>
                                    <p className='text-sm text-gray-500'>{booking.bookedAt.split('T')[0]}</p>
                                </div>
                            </div>
                            <div className='flex items-center gap-2 font-medium'>
                                <p className='text-sm text-gray-500'>{currency}{booking.price}</p>
                                <p className='px-3 py-0.5 border border-borderColor rounded-full text-sm' >{booking.status}</p>
                            </div>
                        </div>
                    ))}
                </div>
                {/* Monthly Revenue Section */}
                <div className='p-4 md:p-6 mb-6 border border-borderColor rounded-md w-full md:max-w-xs'>
                    <h1 className='text-lg font-medium'>Monthly Revenue</h1>
                    <p className='text-gray-500'>Revenue for current month</p>
                    <p className='text-3xl mt-6 font-semibold text-primary'>{currency}{data.monthlyRevenue}</p>
                </div>
            </div>
        </div>
    )
}

export default ProviderDashboard

