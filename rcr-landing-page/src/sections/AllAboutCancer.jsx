// src/sections/AllAboutCancer.jsx

import React from 'react';
import './AllAboutCancer.css';

// Importing a variety of icons from different sets for the best match
import { FaLungs, FaBrain, FaRegDotCircle } from 'react-icons/fa';
// CORRECTED: Replaced GiThroat with GiHumanHead, and GiBladder with GiDrop
import { GiStomach, GiLiver, GiKidneys, GiDrop } from 'react-icons/gi';
import { RiGenderlessLine } from 'react-icons/ri';
import { BsBandaid } from 'react-icons/bs';

const cancerTypes = [
  { name: 'Breast Cancer', icon: <FaRegDotCircle />, href: '/cancer/breast' },
  { name: 'Head & Neck Cancer', icon: <FaBrain />, href: '/cancer/head-neck' }, // Corrected
  { name: 'Liver Cancer', icon: <GiLiver />, href: '/cancer/liver' },
  { name: 'Prostate Cancer', icon: <RiGenderlessLine />, href: '/cancer/prostate' },
  { name: 'Brain Cancer', icon: <FaBrain />, href: '/cancer/brain' },
  { name: 'Ovarian Cancer', icon: <FaRegDotCircle />, href: '/cancer/ovarian' },
  { name: 'Stomach Cancer', icon: <GiStomach />, href: '/cancer/stomach' },
  { name: 'Blood Cancer', icon: <BsBandaid />, href: '/cancer/blood' },
  { name: 'Gallbladder Cancer', icon: <GiKidneys />, href: '/cancer/gallbladder' },
  { name: 'Throat Cancer', icon: <FaBrain />, href: '/cancer/throat' }, // Corrected
  { name: 'Cervical Cancer', icon: <FaRegDotCircle />, href: '/cancer/cervical' },
  { name: 'Lung Cancer', icon: <FaLungs />, href: '/cancer/lung' },
  { name: 'Colon Cancer', icon: <GiStomach />, href: '/cancer/colon' },
  { name: 'Thyroid Cancer', icon: <FaBrain />, href: '/cancer/thyroid' }, // Corrected
  { name: 'Bladder Cancer', icon: <GiDrop />, href: '/cancer/bladder' },
];

const AllAboutCancer = () => {
  return (
    <section id="all-about-cancer" className="cancer-info">
      <div className="container">
        <div className="section-header">
          <h2>All About Cancer</h2>
          <p>Supporting patients and families with care that goes beyond treatment.</p>
        </div>
        <div className="cancer-grid">
          {cancerTypes.map((cancer, index) => (
            <a href={cancer.href} key={index} className="cancer-link">
              <span className="cancer-icon">{cancer.icon}</span>
              <span className="cancer-name">{cancer.name}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AllAboutCancer;