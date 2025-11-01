import React, { useEffect, useState } from "react";

const locations = [
  {
    city: "Mumbai, India",
    address: "123 Marine Drive, Mumbai, MH 400001",
    image:
      "https://i.pinimg.com/736x/fa/ce/24/face24ba58317e37bd80f11901be6a8d.jpg",
  },
  {
    city: "Delhi, India",
    address: "45 Connaught Place, Delhi 110001",
    image:
      "https://static.wixstatic.com/media/737f23_4275bbecacd64cd28f4a787b9b3d54bd~mv2.jpg/v1/fill/w_640,h_440,fp_0.50_0.50,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/737f23_4275bbecacd64cd28f4a787b9b3d54bd~mv2.jpg",
  },
  {
    city: "Bangalore, India",
    address: "78 MG Road, Bangalore 560001",
    image:
      "https://c0.wallpaperflare.com/preview/56/821/69/gold-desktop-celebration-jewelry.jpg",
  },
  {
    city: "Pune, India",
    address: "56 FC Road, Pune 411004",
    image:
      "https://e0.pxfuel.com/wallpapers/529/357/desktop-wallpaper-gold-jewellery-design-gold-jewelry.jpg",
  },
];

export default function AboutUs() {
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % locations.length);
        setFade(true);
      }, 500); // fade out, switch, fade in
    }, 2000);
    return () => clearInterval(interval);
  }, [paused]);

  const current = locations[index];

  return (
    <div className="font-sans text-gray-800">
      {/* Header Image */}
      <header
        className="relative h-[70vh] w-full opacity-70 bg-cover bg-center flex items-center justify-center text-white"
        style={{
          backgroundImage:
            "url('https://wallpapers.com/images/hd/jewellery-background-1920-x-1200-usm9vzukq0ufyqzx.jpg')",
        }}
      >
        <div className="absolute inset-0"></div>
        <h1 className="relative text-5xl font-bold tracking-wide">About Us</h1>
      </header>

      {/* Description */}
      <section className="max-w-4xl mx-auto py-10 px-6 text-center">
        <p className="text-lg text-justify leading-relaxed text-gray-700">
          Welcome to <span className="font-semibold text-pink-600">HOUSE OF SHRINGAR</span> — where elegance meets craftsmanship. 
          Our mission is to create timeless jewelry pieces that reflect beauty, love, and individuality. 
          Each creation is meticulously designed to celebrate life's precious moments and the brilliance within you.
        </p>
      </section>

      {/* Locations */}
      <section
        className="flex flex-col md:flex-row items-center justify-center py-12 bg-gray-50 transition-all duration-700 ease-in-out"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Image 50% */}
        <div className="w-full md:w-1/2 h-[60vh] overflow-hidden">
          <img
            src={current.image}
            alt={current.city}
            className={`w-full h-full object-cover transition-opacity duration-700 ${
              fade ? "opacity-100" : "opacity-0"
            }`}
          />
        </div>

        {/* Text 50% */}
        <div className="w-full md:w-1/2 h-[60vh] flex flex-col items-center justify-center text-center px-6">
          <h2
            className={`text-4xl font-semibold text-gray-800 mb-4 transition-opacity duration-700 ${
              fade ? "opacity-100" : "opacity-0"
            }`}
          >
            {current.city}
          </h2>
          <p
            className={`text-lg text-gray-600 mb-4 transition-opacity duration-700 ${
              fade ? "opacity-100" : "opacity-0"
            }`}
          >
            {current.address}
          </p>
          <p
            className={`max-w-md text-gray-700 text-justify transition-opacity duration-700 ${
              fade ? "opacity-100" : "opacity-0"
            }`}
          >
            Our {current.city.split(",")[0]} store welcomes you with exquisite jewelry crafted
            to perfection. Visit us to experience luxury, comfort, and timeless beauty.
          </p>
        </div>
      </section>

      {/* Contact */}
      <footer className="bg-yellow-50 text-gray-600 py-6 text-center">
        <p className="text-lg">
          📞 Contact Us: <span className="font-bold text-gray-600">+91 98765 43210</span>
        </p>
      </footer>
    </div>
  );
}