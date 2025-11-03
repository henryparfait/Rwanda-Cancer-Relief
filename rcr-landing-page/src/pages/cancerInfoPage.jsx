// src/pages/CancerInfoPage.jsx
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { cancerData } from '../cancerData.jsx';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './CancerInfoPage.css';
import { FaInfoCircle, FaListUl, FaExclamationTriangle, FaSyringe, FaCommentDots } from 'react-icons/fa';

const ComingSoon = ({ slug }) => (
  <div className="info-content-container" style={{ textAlign: 'center', padding: '100px 20px' }}>
    <h1 style={{ textTransform: 'capitalize' }}>{slug.replace(/-/g, ' ')}</h1>
    <h2 style={{ fontSize: '24px', color: 'var(--color-secondary)', marginTop: '20px' }}>
      Information Page Coming Soon
    </h2>
    <p style={{ fontSize: '16px', lineHeight: 1.7, marginTop: '10px' }}>
      Our team is currently preparing the information for this page. Please check back soon.
    </p>
    <Link to="/" className="fab-book-session" style={{ position: 'static', marginTop: '30px' }}>
      Go Back Home
    </Link>
  </div>
);

const CancerInfoPage = () => {
  const { slug } = useParams();
  const data = cancerData[slug];

  return (
    <>
      <Navbar theme="light" />
      <div className="cancer-info-page">
        {data ? (
          <div className="info-content-container">
            {/* --- Header --- */}
            <div className="info-header">
              <h1>{data.title}</h1>
              <div className="info-banner-image">
                {/* THIS IS THE DYNAMIC CHANGE */}
                {data.bannerIcon}
              </div>
            </div>

            {/* --- Overview --- */}
            <section className="info-section">
              <div className="section-header">
                <FaInfoCircle />
                <h2>About {data.title} Overview</h2>
              </div>
              <p>{data.overview}</p>
            </section>

            {/* --- Symptoms --- */}
            <section className="info-section">
              <div className="section-header">
                <FaExclamationTriangle />
                <h2>Common Symptoms</h2>
              </div>
              <ul className="symptoms-list">
                {data.symptoms.map((symptom, index) => (
                  <li key={index}>
                    <span className="symptom-icon">{symptom.icon}</span>
                    {symptom.text}
                  </li>
                ))}
              </ul>
            </section>

            {/* --- Causes & Risks --- */}
            <section className="info-section">
              <div className="section-header">
                <FaListUl />
                <h2>Causes & Risks</h2>
              </div>
              <dl className="causes-list">
                {data.causes.map((cause, index) => (
                  <div key={index}>
                    <dt>{cause.name}</dt>
                    <dd>{cause.text}</dd>
                  </div>
                ))}
              </dl>
            </section>

            {/* --- Treatment Options --- */}
            <section className="info-section">
              <div className="section-header">
                <FaSyringe />
                <h2>Treatment Options Summary</h2>
              </div>
              <ul className="treatment-list">
                {data.treatments.map((treatment, index) => (
                  <li key={index}>
                    <strong>{treatment.name}</strong> {treatment.text}
                  </li>
                ))}
              </ul>
            </section>
          </div>
        ) : (
          <ComingSoon slug={slug} />
        )}
      </div>
      
      <Link to="/patient/sessions" className="fab-book-session">
        Book a Session
      </Link>
      <button className="fab-chat">
        <FaCommentDots />
      </button>

      <Footer />
    </>
  );
};

export default CancerInfoPage;