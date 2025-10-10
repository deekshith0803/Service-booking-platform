import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
const Hero = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  const navigate = useNavigate();

  // Array of background images
  const backgroundImages = [
    'https://media.istockphoto.com/id/2154752387/photo/real-estate-concept-business-home-insurance-and-real-estate-protection-real-estate-investment.jpg?s=612x612&w=0&k=20&c=r6Tmn31ZHHr-8ZuWfZaYIYdqM9nD4dMc6NfDXxwsZeo=',
    'https://media.istockphoto.com/id/1417833200/photo/happy-professional-cleaners-cleaning-a-bathroom-at-an-apartment.jpg?s=612x612&w=0&k=20&c=98suJNqwaQnlzReilcdcfGDz_G7QNGUmha2Gm-6Yzug=',
    'https://media.istockphoto.com/id/1291079851/photo/home-repairman-working-on-a-furnace.jpg?s=612x612&w=0&k=20&c=HM_1TAZ2zdzlssHUjpZ7TX2_lIP6Vqsedp1I0rOKNbo=',
    'https://media.istockphoto.com/id/2149275716/photo/close-up-air-conditioner-technician-hand-check-fill-refrigerant-liquid-and-maintenance.jpg?s=612x612&w=0&k=20&c=-TLrZuwh0oBtFioNVTavfxB-185XBLFW91usLegKCig=',
    'https://media.istockphoto.com/id/1516511531/photo/a-plumber-carefully-fixes-a-leak-in-a-sink-using-a-wrench.jpg?s=612x612&w=0&k=20&c=4WRY5lTezchQ5aLj9gXj0Gixq7Wq7b0tzvrCTt4jrrI='

  ];

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Change background image every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [backgroundImages.length]);


  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Background Images Carousel */}
      <div className="absolute inset-0">
        {backgroundImages.map((image, index) => (
          <div
            key={index}
            className="absolute inset-0 transition-opacity duration-1000"
            style={{
              backgroundImage: `url(${image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: index === currentImageIndex ? 1 : 0,
            }}
          ></div>
        ))}
      </div>

      {/* Gradient Overlay from original theme */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-white opacity-40"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>


      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>

      {/* Content Container */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        {/* Main Heading */}
        <div className={`mb-8 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
          <h1 className="text-5xl md:text-7xl font-black leading-tight text-white mb-4">
            Your Life,{' '}
            <span>
              Simplified
            </span>
          </h1>
          <h2 className="text-3xl md:text-4xl font-bold text-white/90 leading-relaxed">
            All Services, One Click.
          </h2>
        </div>

        {/* Subheading */}
        <p className={`text-xl md:text-2xl text-white/80 font-light leading-relaxed mb-10 max-w-2xl mx-auto transition-all duration-1000 delay-200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          Book trusted professionals for home services, repairs, and more —
          <span> anytime, anywhere.</span>
        </p>

        {/* CTA Buttons */}
        <div className={`flex flex-col sm:flex-row justify-center gap-4 mb-16 transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <button onClick={() => navigate('/service')} className="group relative px-10 py-4 rounded-full bg-gradient-to-r from-primary-dull to-primary text-white font-bold text-lg shadow-2xl hover:shadow-primary/50 transform hover:scale-105 transition-all duration-300 overflow-hidden">
            <span className="relative z-10">Let's Go</span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          </button>

          <button className="group px-10 py-4 rounded-full border-2 border-white/40 text-white font-bold text-lg backdrop-blur-sm bg-white/10 hover:bg-white/20 hover:border-white/60 transform hover:scale-105 transition-all duration-300">
            Learn More
          </button>
        </div>
      </div>

      {/* Bottom Decorative Element */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white via-white/80 to-transparent"></div>


    </section>
  );
};

export default Hero;