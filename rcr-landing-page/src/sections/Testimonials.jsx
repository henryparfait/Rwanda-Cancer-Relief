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

// Data is now simpler, without the 'avatar' property
const testimonialsData = [
  {
    name: 'Paul B.',
    title: 'Architect',
    quote: 'When I was diagnosed, I felt lost and overwhelmed. Finding Rwanda Cancer Relief gave me a community that understood my fears. The counseling sessions provided me with the strength and hope I needed to face my treatment, not as a victim, but as a fighter. They truly saved my spirit.',
},
  {
    name: 'Diana K.',
    title: 'Product designer',
    quote: 'Supporting a loved one through cancer is a journey you can not prepare for. RCR provided our family with invaluable resources and a safe space to ask questions and share our worries. They didn\'t just care for my mother; they supported all of us. We are eternally grateful.',
},
  {
    name: 'Clifford M.',
    title: 'CEO',
    quote: 'In my work, I see how vital emotional and psychological support is for recovery. Rwanda Cancer Relief fills this crucial gap with compassion and professionalism. Their dedication to providing accessible care that respects our cultural values is making a real, tangible difference in our community.',},
];

const Testimonials = () => {
  return (
    <section id="testimonials" className="testimonials">
      <div className="container">
        <div className="section-header">
          <h2>Testimonials</h2>
        </div>
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={30}
          slidesPerView={3}
          loop={true}
          pagination={{ clickable: true }}
          navigation={true}
          className="testimonials-slider"
          breakpoints={{
            320: { slidesPerView: 1, spaceBetween: 15 },
            768: { slidesPerView: 2, spaceBetween: 25 },
            1024: { slidesPerView: 3, spaceBetween: 30 },
          }}
        >
          {testimonialsData.map((testimonial, index) => (
            <SwiperSlide key={index}>
              <div className="testimonial-card">
                {/* The avatar wrapper and img tag have been removed */}
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