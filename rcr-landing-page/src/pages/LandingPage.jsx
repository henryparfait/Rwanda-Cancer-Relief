// src/pages/LandingPage.jsx (New File)

import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Hero from '../sections/Hero';
import WhyChooseUs from '../sections/WhyChooseUs';
import Services from '../sections/Services';
import AllAboutCancer from '../sections/AllAboutCancer';
import Testimonials from '../sections/Testimonials';
import FAQ from '../sections/FAQ';

const LandingPage = () => {
  return (
    <>
      <Navbar />
      <Hero />
      <WhyChooseUs />
      <Services />
      <AllAboutCancer />
      <Testimonials />
      <FAQ />
      <Footer />
    </>
  );
};

export default LandingPage;