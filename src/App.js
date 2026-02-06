import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import Vara from 'vara';
import './lightbox.js';

function App() {
  return (
    <div>
      <Navbar />
      <HomeSection />
      <OmbreDivider from="#fff9c4" to="#ffffff" />
      <AboutSection />
      <OmbreDivider from="#ffffff" to="#fff3e0" />
      <ExperiencesSection />
      <OmbreDivider from="#fff3e0" to="#f7faff" />
      <ContactSection/>
    </div>
  );
}

function OmbreDivider({ from, to, height = 140 }) {
  return <div className="ombre-divider" style={{ '--from': from, '--to': to, '--h': `${height}px` }} aria-hidden="true" />;
}

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-name">reeda shimaz huda</div>
      <div className="navbar-links">
        <a href="#home">HOME</a>
        <a href="#about">ABOUT</a>
        <a href="#experience">EXPERIENCE</a>
        <a href="#contact">CONTACT</a>
      </div>
    </nav>
  );
}

function HomeSection() {
  return (
    <section id="home" className="section home-section">
      <div className="note-polaroid-wrapper">
        <img src="/hi-welcome.png" alt="Top note" className="note note-top" />
        <div className="polaroid">
          <img src="/polaroid.jpg" alt="Polaroid of Reeda painting" className="polaroid-img" />
        </div>
        <img src="/scroll.png" alt="Bottom note" className="note note-bottom" />
      </div>
    </section>
  );
}

function AboutSection() {
  const varaContainerRef = useRef(null);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    if (!varaContainerRef.current) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated) {
          setAnimated(true);
          io.disconnect();
          new Vara(
            '#vara-container',
            'https://raw.githubusercontent.com/akzhy/Vara/master/fonts/Parisienne/Parisienne.json',
            [{ text: 'Reeda Shimaz Huda.', y: 10, delay: 500 }],
            { fontSize: 27, strokeWidth: 1.25, color: '#000', textAlign: 'left' }
          );
        }
      },
      { rootMargin: '0px 0px -100px 0px', threshold: 0.1 }
    );
    io.observe(varaContainerRef.current);
    return () => io.disconnect();
  }, [animated]);

  return (
    <section id="about" className="section about-section">
      <div className="intro-content">
        <p className="intro-text">My name is</p>
        <div id="vara-container" ref={varaContainerRef}></div>
      </div>
      <div className="school">
        <p className="school-intro">
          I'm a fourth-year undergraduate student at the <strong>Georgia Institute of Technology</strong> majoring in <strong>Computer Science</strong>. My academic and research interests are centered around <strong>Artificial Intelligence</strong> and <strong>Human-Computer Interaction</strong>. I'm passionate about designing and building responsible AI technologies that center human beings, as (hopefully) evidenced by my experiences below!
        </p>
      </div>
    </section>
  );
}

const EXPERIENCES = [
  {
    title: 'Research Intern, Microsoft Research',
    location: 'New York, NY',
    dates: 'May 2025 – Aug 2025',
    bullets: [
      'Worked on AI governance models for people with disabilities to improve representation in AI-generated images.',
      'Currently writing a publication (so more to come soon!)'
    ],
    images: ['/msr4.jpg', '/msr2.jpg', '/msr3.JPG', '/msr5.png', '/msr1.png', '/msr6.png']
  },
  {
    title: 'Undergraduate Researcher, Ubicomp Health and Wellness Lab',
    location: 'Atlanta, GA',
    dates: 'Dec 2023 – Present',
    bullets: [
      "Explored older adults' perceptions of medical mistrust and healthcare AI funded by the National Science Foundation (NSF).",
      'Organized and led weekly tech help workshops for older adults at a publicly subsidized housing site with site coordinators and undergraduate volunteers at community outreach lead.'
    ],
    images: ['/uroc.JPEG', '/uroc1.png']
  },
  {
    title: 'AI/Data Science Summer Analyst, JPMorgan Chase',
    location: 'New York, NY',
    dates: 'May 2024 – Jul 2024',
    bullets: [
      'Optimized clustering for CIB Applied AI/ML; implemented an alternative DBSCAN that improved silhouette score accuracy by 20%.',
      'Analyzed rising Los Angeles housing prices with linear regression (98% accuracy), contributing insights for the JPMorgan Chase Institute.'
    ],
    images: ['/jpmc2.png', '/jpmc.JPG', '/jpmc3.png', '/jpmc4.png']
  }
];

function ExperiencesSection() {
  const [openIndex, setOpenIndex] = useState(null);
  const [subOpen, setSubOpen] = useState({});

  const toggleSub = (expIndex, field) => {
    setSubOpen(prev => ({
      ...prev,
      [expIndex]: { ...prev[expIndex], [field]: !prev[expIndex]?.[field] }
    }));
  };

  return (
    <section id="experience" className="experiences-section">
      <div className="exp-columns">
        <div className="col-name">Name</div>
        <div className="col-meta">Last Modified</div>
      </div>
      {EXPERIENCES.map((exp, i) => (
        <div className="exp-item" key={i}>
          <div
            className="exp-header exp-row"
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
          >
            <div className="exp-name">
              <img src="/file-icon.png" alt="file" className="file-icon" />
              <span className="exp-title">{exp.title}</span>
              <span className="exp-arrow">{openIndex === i ? ' ▲' : ' ▼'}</span>
            </div>
            <div className="exp-meta">{exp.location} · {exp.dates}</div>
          </div>
          {openIndex === i && (
            <div className="exp-details exp-grid">
              <div className="exp-left">
                {Array.isArray(exp.bullets) && exp.bullets.length > 0 && (
                  <ul className="exp-bullets">
                    {exp.bullets.map((b, k) => <li key={k}>{b}</li>)}
                  </ul>
                )}
                <div
                  className="sub-header"
                  onClick={() => toggleSub(i, 'images')}
                >
                  <img src="/file-icon-green.png" alt="folder" className="file-icon" />
                  <span>Images</span>
                  <span className="exp-arrow">{subOpen[i]?.images ? '▲' : '▼'}</span>
                </div>
                {subOpen[i]?.images && exp.images.length > 0 && (
                  <div className="exp-images">
                    {exp.images.map((img, idx) => (
                      <img key={idx} src={img} alt={`${exp.title} ${idx}`} loading="lazy" />
                    ))}
                  </div>
                )}
              </div>
              <div />
            </div>
          )}
        </div>
      ))}
    </section>
  );
}

const CONTACTS = [
  { href: 'https://www.linkedin.com/in/reeda-shimaz-huda-257b381b6/', src: '/in-removebg-preview.png', alt: 'LinkedIn'},
  { href: 'https://www.instagram.com/reed.raw/', src: '/insta-removebg-preview.png', alt: 'Instagram' },
  { href: 'mailto:reedahuda@gmail.com', src: '/email-removebg-preview.png', alt: 'Email' },
  { href: 'https://github.com/reedashimaz', src: '/github-removebg-preview.png', alt: 'GitHub' },
  { href: '/Reeda-Shimaz-Huda-CV copy.pdf', src: '/cv-removebg-preview.png', alt: 'Resume' }
];

function ContactSection() {
  return (
    <section id="contact" className="contact-section">
      <div className="contact-icons">
        {CONTACTS.map((c, i) => (
          <a key={i} href={c.href} target="_blank" rel="noreferrer">
            <img src={c.src} alt={c.alt} loading="lazy" />
          </a>
        ))}
      </div>
    </section>
  );
}

export default App;
