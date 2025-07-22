import React from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";

const ServiceCard = ({ service }) => {
  const currency = import.meta.env.VITE_CURRENCY;
  const navigate = useNavigate();

  return (
    <div
      onClick={() => {
        navigate(`/service-details/${service._id}`);
        scrollTo(0, 0);
      }}
      className="group rounded-lg overflow-hidden shadow-lg hover:translate-y-1 transition-all duration-500 cursor-pointer"
    >
      <div className="relative h-50 overflow-hidden">
        <img
          src={service.image}
          alt="service"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {service.isAvailable && (
          <p className="absolute top-4 left-4 bg-primary/90 text-white text-xs px-2.5 py-1 rounded-full">
            Available now
          </p>
        )}
        <div className="absolute bottom-4  right-4 bg-black/80 backdrop-blur-sm text-white px-3 py-2 rounded-full">
          <span className="font-semibold">
            {currency}
            {service.pricePerHour}
          </span>
          <span className="text-sm text-white/80"> / Hour</span>
        </div>
      </div>
      <div className="p-4 sm:p-5">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-lg font-semibold">{service.title}</h3>
            <p className="text-muted-foreground text-sm">{service.category} </p>
          </div>
        </div>
        <div className="mt-2 grid grid-cols-2 gap-y-2 text-gra-600">
          <div className="flex items-center text-sm text-muted-foreground">
            <img src={assets.users_icon} alt="" className="h-4 mr-2" />
            <span>{service.staffCount} Staff</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <img src={assets.location_icon} alt="" className="h-4 mr-2" />
            <span>{service.service_area}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
