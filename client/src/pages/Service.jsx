import React, { useState } from "react";
import Title from "../components/Title";
import { assets, dummyserviceData } from "../assets/assets";
import ServiceCard from "../components/ServiceCard";

const Service = () => {
  const [input, setInput] = useState("");

  return (
    <div>
      <div className="flex flex-col items-center py-20 bg-light max-md:px-4">
        <Title
          title="Services"
          subtitle="Discover the top-rated services from our trusted professionals."
        />

        <div className="flex items-center bg-white px-4 mt-6 max-w-140 w-full h-12 rounded-full shadow">
          <img
            src={assets.search_icon}
            alt="search"
            className="w-4.5 h-4.5 mr-2"
          />
          <input
            onChange={(e) => setInput(e.target.value)}
            value={input}
            type="text"
            placeholder="Search services"
            className="w-full outline-none h-full text-gray-500"
          />
          <img
            src={assets.filter_icon}
            alt="search"
            className="w-4.5 h-4.5 ml-2"
          />
        </div>
      </div>
      <div className="px-6 md:px-16 lg:px-24 xl:px-32 mt-10">
        <p className="text-gray-500 xl:px-10 max-w-7xl mx-auto">
          Showing {dummyserviceData.length} service
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-4 xl:px-10 max-w-7xl mx-auto">
          {dummyserviceData.map((service, index) => (
            <div key={index}>
              <ServiceCard service={service} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Service;
