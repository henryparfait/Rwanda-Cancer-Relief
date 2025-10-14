// src/sections/WhyChooseUs.jsx

import React from 'react';
import './WhyChooseUs.css';

// Import icons from the library
import { FaStar, FaCrosshairs, FaUsers, FaUserCheck } from 'react-icons/fa';
import videoThumbnail from '../assets/video-thumbnail.jpg'; // Add a placeholder image in your assets

const stats = [
  {
    icon: <FaStar />,
    number: '6+',
    label: 'Successful Projects',
  },
  {
    icon: <FaCrosshairs />,
    number: '10+',
    label: 'Outreach Programs',
  },
  {
    icon: <FaUsers />,
    number: '200+',
    label: 'Mentorship Sessions',
  },
  {
    icon: <FaUserCheck />,
    number: '550+',
    label: 'Supported Patients',
  },
];

const WhyChooseUs = () => {
  return (
    <section id="about" className="why-choose-us">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <h2>Why Choose Us</h2>
        </div>

        {/* Hexagon Stats */}
        <div className="stats-container">
          {stats.map((stat, index) => (
            <div className="stat-box" key={index}>
              <div className="stat-icon">{stat.icon}</div>
              <div className="stat-number">{stat.number}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Details Section */}
        <div className="details-container">
          <div className="details-text">
            <h3>Rwanda Cancer Relief (RCR) is dedicated to supporting cancer patients and their families beyond medical care.</h3>
            <p>
              Our counseling program blends evidence-based practices with Rwandan cultural wisdom, offering compassionate, accessible, and meaningful support.
            </p>
            <a href="https://www.rwandacancer.org/" className="learn-more-link">
              Learn more &gt;
            </a>
          </div>
          <div className="details-video">
            <img src={videoThumbnail} alt="RCR Program Video Thumbnail" />
            <a href="https://www.facebook.com/RadissonBluHotelConventionCentreKigali/videos/last-year-the-walkwithchallenge-was-a-powerful-reminder-of-what-community-compas/1735231117388918/" target="_blank" rel="noopener noreferrer" className="play-button">
              ▶
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;