import React, { useState } from "react";
import { assets, cityList } from "../assets/assets";

const Hero = () => {
  const [city, setCity] = useState("");

  return (
    <div className="h-screen flex flex-col items-center justify-center gap-14 bg-light text-center">
      <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold mt-30">
        Your Life, Simplified All Services, One Click.
      </h1>
      <form
        action=""
        className="flex flex-col md:flex-row items-start md:items-center justify-between p-3  px-10 rounded-lg md:rounded-full w-full max-w-60 md:max-w-180 bg-white shadow-[0px_8px_20px_rgb(0,0,0,0.1)]"
      >
        <div className="flex flex-col items-start gap-2 md:gap-4 md:gap-4 w-full py-4">
          <select
            className=" bg-transparent rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            required
            value={city}
            onChange={(e) => setCity(e.target.value)}
          >
            <option value="">places</option>
            {cityList.map((city, index) => (
              <option key={index}>{city}</option>
            ))}
          </select>
          <p className="text-sm text-gray-500">
            {city ? city : "Select your city"}
          </p>
        </div>
        <div className="flex flex-col items-start gap-2 md:gap-4 md:gap-4 w-full">
          <label htmlFor="date">Select your date</label>
          <input
            type="date"
            id="date"
            required
            min={new Date().toISOString().split("T")[0]}
            className="text-sm text-gray-500"
          />
        </div>
        <button className="flex items-center justify-center gap-1 px-8 py-3 max-sm:mt-4 bg-primary hover:bg-primary-dull rounded-full text-white curser-pointer">
          <img
            src={assets.search_icon}
            alt="Search"
            className="brightness-300"
          />
          Search
        </button>
      </form>
      <img
        src={assets.main_service}
        alt="service"
        className="max-h-70 w-auto mb-25"
      />
    </div>
  );
};

export default Hero;
