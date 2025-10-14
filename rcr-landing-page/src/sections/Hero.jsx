// src/sections/Hero.jsx

import React from 'react';

// 1. IMPORT SWIPER REACT COMPONENTS AND MODULES
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';

// 2. IMPORT SWIPER STYLES
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import './Hero.css'; // Your existing Hero styles
import Partners from '../components/Partners';

// 3. IMPORT YOUR IMAGES
import heroImage from '../assets/hero-main-image.png'; // Nurse and patient
import doctor1 from '../assets/doctor-1.png';
import doctor2 from '../assets/doctor-2.png';
// Add more images here if you have them
const slideImages = [heroImage, doctor1, doctor2];

const Hero = () => {
  return (
    <section id="home" className="hero">
      <div className="hero-container">
        
        {/* Left Content (remains the same) */}
        <div className="hero-content">
          <h1 className="hero-headline">Ready to fight Cancer</h1>
          <p className="hero-subheadline">
            Meet our passionate team dedicated to supporting cancer patients and raising awareness across Rwanda.
          </p>
          <div className="hero-buttons">
            <a href="https://www.rwandacancer.org/donate" className="btn btn-primary">Donate Now</a>
            <a href="#about" className="btn btn-secondary">Learn more</a>
          </div>
        </div>

        {/* Right Images - NOW A SLIDER */}
        <div className="hero-images">
          <Swiper
            modules={[Autoplay, Pagination, Navigation]} // Enable modules
            spaceBetween={30}
            slidesPerView={1}
            loop={true} // Enable looping
            autoplay={{
              delay: 3000, // 3 seconds per slide
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true, // Allow clicking on dots
            }}
            navigation={true} // Show next/prev arrows
            className="mySwiper"
          >
            {/* Map over your images to create slides */}
            {slideImages.map((image, index) => (
              <SwiperSlide key={index}>
                <img src={image} alt={`Slide ${index + 1}`} />
              </SwiperSlide>
            ))}
          </Swiper>

        </div>
      </div>
        <Partners />
    </section>
  );
};

export default Hero;