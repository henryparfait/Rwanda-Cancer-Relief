// src/components/Partners.jsx

import React from 'react';
import './Partners.css';

// Import your partner logos from the assets folder
import rbcLogo from '../assets/partners/rbc.png';
import mohLogo from '../assets/partners/moh.png';
import rcrLogo from '../assets/partners/rcr.png';
// ...import other logos as you add them

// An array to easily manage the partners
const partnersList = [
  { name: 'RBC', logo: rbcLogo },
  { name: 'MOH', logo: mohLogo },
  { name: 'RCR', logo: rcrLogo },
  // Add more partners here
  // { name: 'Partner 4', logo: logo4 },
  // { name: 'Partner 5', logo: logo5 },
];

const Partners = () => {
  return (
    <div className="partners-section">
      <h2 className="partners-title">Our Partners</h2>
      <div className="partners-logos">
        {partnersList.map((partner) => (
          <img key={partner.name} src={partner.logo} alt={`${partner.name} Logo`} />
        ))}
      </div>
    </div>
  );
};

export default Partners;