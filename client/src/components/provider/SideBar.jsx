import React, { useState } from 'react'
import { assets, providerMenuLinks } from '../../assets/assets'
import { NavLink, useLocation } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

import { useChat } from '../../context/ChatContext';

const SideBar = () => {

    const { user, axios, fetchUser } = useAppContext();
    const { unreadCounts } = useChat();
    const location = useLocation();
    const [image, setImage] = useState('');

    const updateImage = async () => {
        try {
            const formData = new FormData();
            formData.append('image', image);
            const { data } = await axios.post('/api/provider/update-image', formData);
            if (data?.success) {
                fetchUser();
                toast.success(data?.message);
                setImage('');
            } else {
                toast.error(data?.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    return (
        <div className='relative min-h-screen md:flex flex-col items-center pt-8 max-w-13 md:max-w-60 w-full border-r border-borderColor text-sm'>
            <div className='group relative'>
                <label htmlFor="image">
                    <img className='h-9 md:h-14 w-9 md:w-14 rounded-full mx-auto' src={image ? URL.createObjectURL(image) : user?.image || "https://i.pinimg.com/736x/59/af/9c/59af9cd100daf9aa154cc753dd58316d.jpg"} alt="" />
                    <input type="file" id='image' accept='image/*' hidden onChange={e => setImage(e.target.files[0])} />
                    <div className='absolute hidden top-0 left-0 bottom-0 bg-black/10 rounded-full group-hover:flex items-center justify-center cursor-pointer' >
                        <img src={assets.edit_icon} alt="" />
                    </div>
                </label>
            </div>
            {image && (
                <button className='absolute top-0 right-0 flex p-2 gap-1 bg-primary/10 text-primary cursor-pointer' >save <img src={assets.check_icon} width={13} alt="" onClick={updateImage} /></button>
            )}
            <p className='mt-2 text-base max-md:hidden'>{user?.name}</p>
            <div className='w-full'>
                <div className='w-full'>
                    {providerMenuLinks.map((link, index) => {
                        const isMessages = link.name.toLowerCase() === 'messages';
                        const unreadCount = isMessages ? Object.values(unreadCounts).reduce((a, b) => a + b, 0) : 0;

                        return (
                            <NavLink
                                key={index}
                                to={link.path}
                                className={`relative flex items-center gap-2 w-full py-3 pl-4 first:mt-6 ${link.path === location.pathname ? 'bg-primary/10 text-primary' : 'text-gray-600'
                                    }`}
                            >
                                <img
                                    src={link.path === location.pathname ? link.coloredIcon : link.icon}
                                    alt="service icon"
                                />
                                <div className="flex items-center gap-2">
                                    <span className='max-md:hidden'>{link.name}</span>
                                    {isMessages && unreadCount > 0 && (
                                        <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full flex items-center justify-center min-w-[18px] h-[18px]">
                                            {unreadCount}
                                        </span>
                                    )}
                                </div>
                                <div
                                    className={`${link.path === location.pathname && 'bg-primary'
                                        } w-1.5 h-8 rounded-1 right-0 absolute`}
                                ></div>
                            </NavLink>
                        )
                    })}
                </div>
            </div>
        </div >
    )
}

export default SideBar
