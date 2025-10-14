// src/sections/Services.jsx

import React from 'react';
import './Services.css';

// Import the images for each service
import counselingImg from '../assets/service-counseling.jpg';
import consultingImg from '../assets/service-consulting.jpg';
import libraryImg from '../assets/service-library.jpg';
import schedulingImg from '../assets/service-scheduling.jpg';
import communityImg from '../assets/service-community.jpg';
import chatbotImg from '../assets/service-chatbot.jpg';

const servicesData = [
  {
    image: counselingImg,
    title: 'Counseling Modules',
    description: 'Guided sessions designed to provide emotional and psychological support.',
  },
  {
    image: consultingImg,
    title: 'One-on-One Consulting',
    description: 'Connect with trained counselors for personalized support, in-person or remotely.',
  },
  {
    image: libraryImg,
    title: 'Resource Library',
    description: 'Access culturally adapted audio, video, and reading materials for guidance and comfort.',
  },
  {
    image: schedulingImg,
    title: 'Session Scheduling',
    description: 'Book and manage counseling sessions at times that work for you.',
  },
  {
    image: communityImg,
    title: 'Community Connection',
    description: 'A safe digital space for patients and families to share experiences and support one another.',
  },
  {
    image: chatbotImg,
    title: 'Chatbot Service',
    description: 'Explore and understand more about cancer in a simple, conversational way.',
  },
];

const Services = () => {
  return (
    <section id="services" className="services">
      <div className="container">
        <div className="section-header">
          <h2>Services</h2>
          <p>Supporting patients and families with care that goes beyond treatment.</p>
        </div>
        <div className="services-grid">
          {servicesData.map((service, index) => (
            <div className="service-card" key={index}>
              <img src={service.image} alt={service.title} className="service-card-image" />
              <div className="service-card-content">
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;