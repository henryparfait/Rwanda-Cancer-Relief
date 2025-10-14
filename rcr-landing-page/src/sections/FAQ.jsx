// src/sections/FAQ.jsx

import React, { useState } from 'react';
import './FAQ.css';
import { FaChevronDown } from 'react-icons/fa'; // Using a chevron for the icon

const faqData = [
  {
    question: '1. Who can use this platform?',
    answer: 'The platform is open to cancer patients, their families, and caregivers in Rwanda. Counselors and RCR staff also use it to provide support.',
  },
  {
    question: '2. Do I need to pay to access the services?',
    answer: 'No. Rwanda Cancer Relief counseling services and resources are provided free of charge.',
  },
  {
    question: '3. What languages are available?',
    answer: 'Content and counseling are available in Kinyarwanda, with additional support in English and French.',
  },
  {
    question: '4. Can I use the platform without internet?',
    answer: 'Yes. Many resources can be downloaded for offline use, and SMS reminders ensure you stay connected even with limited internet.',
  },
  {
    question: '5. Is my information private?',
    answer: 'Absolutely. Your personal information and counseling records are kept strictly confidential and secure.',
  },
];

const FAQ = () => {
  // State to keep track of the currently open FAQ item index
  const [openIndex, setOpenIndex] = useState(null);

  // Function to handle toggling
  const handleToggle = (index) => {
    // If the clicked item is already open, close it. Otherwise, open the new one.
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="faq">
      <div className="container">
        <div className="section-header">
          <h2>Frequently Asked Questions</h2>
        </div>
        <div className="faq-accordion">
          {faqData.map((item, index) => (
            <div
              className={`faq-item ${openIndex === index ? 'open' : ''}`}
              key={index}
            >
              <div className="faq-question" onClick={() => handleToggle(index)}>
                <span>{item.question}</span>
                <FaChevronDown className="faq-icon" />
              </div>
              <div className="faq-answer">
                <p>{item.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;