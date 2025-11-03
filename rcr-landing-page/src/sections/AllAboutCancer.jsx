// src/sections/AllAboutCancer.jsx

import React from 'react';
import './AllAboutCancer.css';

// Importing a variety of icons from different sets for the best match
import { FaLungs, FaBrain, FaRegDotCircle, FaBone } from 'react-icons/fa';
// CORRECTED: Replaced GiThroat with GiHumanHead, and GiBladder with GiDrop
import { GiStomach, GiLiver, GiKidneys, GiDrop } from 'react-icons/gi';
import { RiGenderlessLine } from 'react-icons/ri';
import { BsBandaid } from 'react-icons/bs';

const cancerTypes = [
  { name: 'Breast Cancer', icon: <FaRegDotCircle />, href: '/cancer/breast-cancer' },
  { name: 'Head & Neck Cancer', icon: <FaBrain />, href: '/cancer/head-neck-cancer' }, // Corrected
  { name: 'Liver Cancer', icon: <GiLiver />, href: '/cancer/liver-cancer' },
  { name: 'Prostate Cancer', icon: <RiGenderlessLine />, href: '/cancer/prostate-cancer' },
  { name: 'Brain Cancer', icon: <FaBrain />, href: '/cancer/brain-cancer' },
  { name: 'Ovarian Cancer', icon: <FaRegDotCircle />, href: '/cancer/ovarian-cancer' },
  { name: 'Stomach Cancer', icon: <GiStomach />, href: '/cancer/stomach-cancer' },
  { name: 'Blood Cancer', icon: <BsBandaid />, href: '/cancer/blood-cancer' },
  { name: 'Gallbladder Cancer', icon: <GiKidneys />, href: '/cancer/gallbladder-cancer' },
  { name: 'Throat Cancer', icon: <FaBrain />, href: '/cancer/throat-cancer' },
  { name: 'Cervical Cancer', icon: <FaRegDotCircle />, href: '/cancer/cervical-cancer' },
  { name: 'Lung Cancer', icon: <FaLungs />, href: '/cancer/lung-cancer' },
  { name: 'Colon Cancer', icon: <GiStomach />, href: '/cancer/colon-cancer' },
  { name: 'Thyroid Cancer', icon: <FaBrain />, href: '/cancer/thyroid-cancer' }, // Corrected
  { name: 'Bladder Cancer', icon: <GiDrop />, href: '/cancer/bladder-cancer' },
  { name: 'Bone Cancer', icon: <FaBone />, href: '/cancer/bone-cancer' },
];

const AllAboutCancer = () => {
  return (
    <section id="all-about-cancer" className="cancer-info">
      <div className="container">
        <div className="section-header">
          <h2>All About Cancer</h2>
          <p>Everything you need to know about cancer types.</p>
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