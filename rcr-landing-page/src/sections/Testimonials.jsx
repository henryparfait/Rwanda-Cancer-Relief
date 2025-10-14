// src/sections/Testimonials.jsx

import React from 'react';
import './Testimonials.css';

// Import Swiper React components and modules
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Import avatar images
// Use your actual avatar images here, e.g., import hannahAvatar from '../assets/avatars/hannah.png';
import profilePlaceholder from '../assets/avatars/profile-placeholder.png'; // Placeholder if you don't have them yet

const testimonialsData = [
  {
    avatar: profilePlaceholder, // Replace with hannahAvatar if you import it
    name: 'Hannah Schmitt',
    title: 'Lead designer',
    quote: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cursus nibh mauris, nec turpis orci lectus maecenas. Suspendisse sed magna eget nibh in turpis. Consequat duis diam lacus arcu. Faucibus venenatis felis id augue sit cursus pellentesque enim',
  },
  {
    avatar: profilePlaceholder, // Replace with hannahAvatar if you import it
    name: 'Hannah Schmitt',
    title: 'Lead designer',
    quote: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cursus nibh mauris, nec turpis orci lectus maecenas. Suspendisse sed magna eget nibh in turpis. Consequat duis diam lacus arcu. Faucibus venenatis felis id augue sit cursus pellentesque enim',
  },
  {
    avatar: profilePlaceholder, // Replace with hannahAvatar if you import it
    name: 'Hannah Schmitt',
    title: 'Lead designer',
    quote: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cursus nibh mauris, nec turpis orci lectus maecenas. Suspendisse sed magna eget nibh in turpis. Consequat duis diam lacus arcu. Faucibus venenatis felis id augue sit cursus pellentesque enim',
  },
  // If you need more slides, duplicate one of the above objects
];

const Testimonials = () => {
  return (
    <section id="testimonials" className="testimonials">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <h2>What Our Clients Say About Us</h2>
        </div>
        
        {/* Testimonials Slider */}
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={30} // Space between cards
          slidesPerView={3}  // Show 3 slides at a time by default
          loop={true}      // Enable looping
          pagination={{ clickable: true }} // Pagination dots
          navigation={true}  // Navigation arrows
          className="testimonials-slider"
          // Responsive breakpoints - adjusts slides per view for smaller screens
          breakpoints={{
            320: { // for mobile phones
              slidesPerView: 1,
              spaceBetween: 15,
            },
            768: { // for tablets
              slidesPerView: 2,
              spaceBetween: 25,
            },
            1024: { // for desktops
              slidesPerView: 3,
              spaceBetween: 30,
            },
          }}
        >
          {testimonialsData.map((testimonial, index) => (
            <SwiperSlide key={index}>
              <div className="testimonial-card">
                <div className="testimonial-avatar-wrapper">
                  <img src={testimonial.avatar} alt={testimonial.name} className="testimonial-avatar" />
                </div>
                <h3 className="testimonial-name">{testimonial.name}</h3>
                <p className="testimonial-title">{testimonial.title}</p>
                <p className="testimonial-quote">"{testimonial.quote}"</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Testimonials;