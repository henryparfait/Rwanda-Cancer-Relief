// src/App.jsx

import React from 'react';
import Navbar from './components/Navbar';
import Hero from './sections/Hero';
import WhyChooseUs from './sections/WhyChooseUs';
import Services from './sections/Services';
import AllAboutCancer from './sections/AllAboutCancer';
import Testimonials from './sections/Testimonials';
import FAQ from './sections/FAQ';
import Footer from './components/Footer';
// We'll import other sections here as we build them

function App() {
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
      {/* The Hero section will go right here */}
    </>
  );
}

export default App;

