import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
    return (
        <div className='px-6 md:px-16 lg:px-26 xl:px-32 mt-60 text-sm text-gray-500'>
            <div className='flex flex-wrap justify-between items-start gap-8 pb-6 border-borderColor border-b'>
                <div>
                    <img src={assets.logo} alt="logo" className='h-8 md:h-9' />
                    <p className='max-w-80 mt-3'>
                        Fixora connects you with trusted professionals for every service you need — fast, reliable, and hassle-free.
                    </p>
                    <div className='flex items-center gap-3 mt-6'>
                        <a href="#"><img src={assets.facebook_logo} className='w-5 h-5' alt="" /></a>
                        <a href="#"><img src={assets.instagram_logo} className='w-5 h-5' alt="" /></a>
                        <a href="#"><img src={assets.twitter_logo} className='w-5 h-5' alt="" /></a>
                        <a href="#"><img src={assets.gmail_logo} className='w-5 h-5' alt="" /></a>
                    </div>
                </div>

                <div>
                    <h2 className='text-base font-medium text-gray-800'>Quick Links</h2>
                    <ul className='mt-3 flex flex-col gap-1.5 text-sm'>
                        <li><a href="#">Home</a></li>
                        <li><a href="#">Browse Services</a></li>
                        <li><a href="#">List Your Service</a></li>
                        <li><a href="#">About Us</a></li>
                    </ul>
                </div>

                <div>
                    <h2 className='text-base font-medium text-gray-800'>Contact</h2>
                    <ul className='mt-3 flex flex-col gap-1.5 text-sm'>
                        <li>870-990 fixora</li>
                        <li>India, Kerala</li>
                        <li>+91 87889-8988</li>
                        <li>Fixora@gmail.com</li>
                    </ul>
                </div>

                <div>
                    <h2 className='text-base font-medium text-gray-800'>Resources</h2>
                    <ul className='mt-3 flex flex-col gap-1.5 text-sm'>
                        <li><a href="#">Help</a></li>
                        <li><a href="#">Terms of Service</a></li>
                        <li><a href="#">Privacy Policy</a></li>
                        <li><a href="#">Insurance</a></li>
                    </ul>
                </div>

                <div className='w-full flex flex-col md:flex-row items-center justify-between py-5'>
                    <p className='text-center md:text-left'>
                        © {new Date().getFullYear()} Brand. All rights reserved.
                    </p>
                    <ul className='flex items-center gap-4 md:ml-auto'>
                        <li><a href="#">Privacy</a></li>
                        <li>|</li>
                        <li><a href="#">Terms</a></li>
                        <li>|</li>
                        <li><a href="#">Cookies</a></li>
                    </ul>
                </div>

            </div>
        </div>
    )
}

export default Footer
