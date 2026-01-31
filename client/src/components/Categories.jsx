import React from "react";
import { useNavigate } from "react-router-dom";
import { serviceCategories } from "../assets/assets";
import {
    HomeIcon,
    WrenchScrewdriverIcon,
    LightBulbIcon,
    PaintBrushIcon,
    BugAntIcon,
    CpuChipIcon,
    SunIcon,
    EllipsisHorizontalIcon,
} from "@heroicons/react/24/outline";
import Title from "./Title";
import { motion } from "framer-motion";

const Categories = () => {
    const navigate = useNavigate();

    // Map categories to icons
    const categoryIcons = {
        Electrical: <LightBulbIcon className="w-8 h-8 text-blue-500" />,
        Plumbing: <WrenchScrewdriverIcon className="w-8 h-8 text-blue-500" />,
        Cleaning: <HomeIcon className="w-8 h-8 text-blue-500" />,
        "Appliance Repair": <CpuChipIcon className="w-8 h-8 text-blue-500" />,
        Painting: <PaintBrushIcon className="w-8 h-8 text-blue-500" />,
        Carpentry: <WrenchScrewdriverIcon className="w-8 h-8 text-blue-500" />,
        "Pest Control": <BugAntIcon className="w-8 h-8 text-blue-500" />,
        "AC Services": <CpuChipIcon className="w-8 h-8 text-blue-500" />,
        Gardening: <SunIcon className="w-8 h-8 text-blue-500" />,
        Other: <EllipsisHorizontalIcon className="w-8 h-8 text-blue-500" />,
    };

    // Motion variants
    const containerVariants = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: 0.06,
            },
        },
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.4, ease: "easeOut" },
        },
    };

    return (
        <motion.div
            className="mt-16 px-4 md:px-8 bg-gray-50 py-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
        >
            <Title
                title="Explore by Category"
                subtitle="Find trusted professionals for every type of service — from cleaning to electrical repairs."
                center={true}
            />

            <motion.div
                className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-5 lg:grid-cols-10 gap-4 md:gap-6 pt-16"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
            >
                {serviceCategories.map((category, index) => (
                    <motion.div
                        key={index}
                        variants={cardVariants}
                        whileHover={{ y: -6 }}
                        whileTap={{ scale: 0.97 }}
                        className="cursor-pointer p-5 rounded-2xl flex flex-col items-center justify-center
                          bg-white shadow-lg hover:shadow-xl border border-gray-100 transition-all duration-300"
                        onClick={() => {
                            navigate(`/service/${category.toLowerCase()}`);
                            window.scrollTo(0, 0);
                        }}
                    >
                        <div className="mb-4">
                            {categoryIcons[category] || (
                                <EllipsisHorizontalIcon className="w-8 h-8 text-blue-500" />
                            )}
                        </div>

                        <p className="text-sm font-bold text-gray-700 text-center">
                            {category}
                        </p>
                    </motion.div>
                ))}
            </motion.div>
        </motion.div>
    );
};

export default Categories;
