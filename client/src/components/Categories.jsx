import React from 'react';
import { useNavigate } from 'react-router-dom';
import { serviceCategories } from '../assets/assets';
import { HomeIcon, WrenchScrewdriverIcon, LightBulbIcon, PaintBrushIcon, BugAntIcon, CpuChipIcon, SunIcon, EllipsisHorizontalIcon } from '@heroicons/react/24/outline';
import Title from './Title';

const Categories = () => {
    const navigate = useNavigate();

    // Map categories to icons
    const categoryIcons = {
        Electrical: <LightBulbIcon className="w-8 h-8 text-blue-500 group-hover:text-blue-700" />,
        Plumbing: <WrenchScrewdriverIcon className="w-8 h-8 text-blue-500 group-hover:text-blue-700" />,
        Cleaning: <HomeIcon className="w-8 h-8 text-blue-500 group-hover:text-blue-700" />,
        'Appliance Repair': <CpuChipIcon className="w-8 h-8 text-blue-500 group-hover:text-blue-700" />,
        Painting: <PaintBrushIcon className="w-8 h-8 text-blue-500 group-hover:text-blue-700" />,
        Carpentry: <WrenchScrewdriverIcon className="w-8 h-8 text-blue-500 group-hover:text-blue-700" />,
        'Pest Control': <BugAntIcon className="w-8 h-8 text-blue-500 group-hover:text-blue-700" />,
        'AC Services': <CpuChipIcon className="w-8 h-8 text-blue-500 group-hover:text-blue-700" />,
        Gardening: <SunIcon className="w-8 h-8 text-blue-500 group-hover:text-blue-700" />,
        Other: <EllipsisHorizontalIcon className="w-8 h-8 text-blue-500 group-hover:text-blue-700" />,
    };

    return (
        <div className="mt-16 px-4 md:px-8 bg-gray-50 py-5">
            <Title
                title="Explore by Category"
                subtitle="Find trusted professionals for every type of service — from cleaning to electrical repairs."
                center={true}
            />


            <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-5 lg:grid-cols-10 gap-4 md:gap-6 pt-10">
                {serviceCategories.map((category, index) => (
                    <div
                        key={index}
                        className="group cursor-pointer p-4 rounded-xl flex flex-col items-center justify-center bg-white shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105 border border-gray-100"
                        onClick={() => {
                            navigate(`/service/${category.toLowerCase()}`);
                            window.scrollTo(0, 0);
                        }}
                    >
                        <div className="mb-3">{categoryIcons[category] || <EllipsisHorizontalIcon className="w-8 h-8 text-blue-500 group-hover:text-blue-700" />}</div>
                        <p className="text-sm font-semibold text-gray-700 text-center group-hover:text-blue-600">
                            {category}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Categories;