import React, { useState } from 'react';
import { assets, menuLinks } from '../assets/assets';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Navbar = ({ setShowLogin }) => {
    const location = useLocation();
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    return (
        <div className={`flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 text-gray-600 border-b border-borderColor relative transition-all duration-300 z-50 ${location.pathname === '/' ? "bg-light" : "bg-white"}`}>
            {/* Logo */}
            <Link to="/">
                <img src={assets.logo} alt="logo" className="h-8" />
            </Link>

            {/* Menu */}
            <div className={`max-sm:fixed max-sm:h-screen max-sm:w-full max-sm:top-16 max-sm:border-t border-borderColor max-sm:right-0 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8 max-sm:p-4 transition-all duration-300 z-50 ${location.pathname === '/' ? "bg-light" : "bg-white"} ${open ? "max-sm:translate-x-0" : "max-sm:-translate-x-full"}`}>
                {
                    menuLinks.map((link, index) => (
                        <Link key={index} to={link.path}>
                            {link.name}
                        </Link>
                    ))
                }

                {/* Search Bar */}
                <div className="hidden lg:flex items-center gap-2 text-sm border border-borderColor px-4 py-1 rounded-full">
                    <input
                        type="text"
                        className="py-1.5 w-full bg-transparent outline-none placeholder-gray-600"
                        placeholder="Search"
                    />
                    <img src={assets.search_icon} alt="Search" />
                </div>

                {/* Buttons */}
                <div className='flex max-sm:flex-col items-start sm:items-center gap-6'>
                    <button onClick={() => navigate("/provider")} className='cursor-pointer'>
                        Dashboard
                    </button>

                    <button
                        onClick={() => setShowLogin(true)}
                        className='cursor-pointer px-8 py-2 bg-primary hover:bg-primary-dull transition-all duration-300 text-white rounded-full'
                    >
                        Login
                    </button>
                </div>
            </div>

            {/* Hamburger menu icon for mobile */}
            <button
                className='sm:hidden cursor-pointer'
                aria-label="Menu"
                onClick={() => setOpen(!open)}
            >
                <img src={open ? assets.close_icon : assets.menu_icon} alt="Menu" />
            </button>
        </div>
    );
};

export default Navbar;
