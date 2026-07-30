import { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './LandingPage.css'

const LandingPage = () => {
  const [openFAQ, setOpenFAQ] = useState(null)
  const courses = [
    { title: 'English & Personality Development' },
    { title: 'Basic Computer' },
    { title: 'AI Technology' },
    { title: 'Digital Marketing' },
    { title: 'Full Stack Development' },
    { title: 'Data Science' },
    { title: 'Python Programming' },
  ]

  return (
    <div className="landing-page">
      <Navbar />
      <main>
        <section className="hero">
          <div className="container">
            <h1 className="hero-title">Welcome to Skill.AI Training</h1>
            <p className="hero-subtitle">
              Transform your career with our comprehensive courses
            </p>
            <div className="hero-buttons">
              <Link to="/courses" className="btn btn-primary">
                Explore Courses
              </Link>
              <Link to="/register" className="btn btn-outline">
                Get Started
              </Link>
            </div>
          </div>
        </section>

        <section className="courses-preview">
          <div className="container">
            <h2 className="section-title">Our Courses</h2>
            <div className="courses-grid">
              {courses.map((course, index) => (
                <div key={index} className="course-card-preview">
                  <h3>{course.title}</h3>
                  <Link to="/courses" className="btn btn-outline btn-small">
                    Learn More
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="why-choose">
          <div className="container">
            <h2 className="section-title">Why Choose Skill.AI Training?</h2>
            <div className="why-choose-grid">
              <div className="why-choose-card">
                <div className="why-choose-icon">👨‍🏫</div>
                <h3>Industry Expert Mentors</h3>
                <p>Learn directly from working professionals</p>
              </div>
              <div className="why-choose-card">
                <div className="why-choose-icon">🎯</div>
                <h3>Job-Oriented Training</h3>
                <p>Focus on real skills, not theory</p>
              </div>
              <div className="why-choose-card">
                <div className="why-choose-icon">💰</div>
                <h3>Affordable Pricing</h3>
                <p>Quality education at low cost</p>
              </div>
              <div className="why-choose-card">
                <div className="why-choose-icon">💼</div>
                <h3>Practical Projects</h3>
                <p>Hands-on learning with real use cases</p>
              </div>
              <div className="why-choose-card">
                <div className="why-choose-icon">🚀</div>
                <h3>Career Support</h3>
                <p>Guidance for jobs, freelancing & growth</p>
              </div>
            </div>
          </div>
        </section>

        <section className="team">
          <div className="container">
            <h2 className="section-title">Leadership</h2>
            <div className="team-grid">
              <div className="team-card">
                <div className="team-avatar">
                  <div className="team-avatar-placeholder">DJ</div>
                </div>
                <h3 className="team-name">Deepak Jangir</h3>
                <p className="team-role">Founder</p>
                <div className="team-description">
                  <ul>
                    <li>Cyber Security Expert</li>
                    <li>Business Associate</li>
                    <li>Digital Marketing Expert</li>
                  </ul>
                </div>
              </div>
              <div className="team-card">
                <div className="team-avatar">
                  <div className="team-avatar-placeholder">PA</div>
                </div>
                <h3 className="team-name">Piyush Ameta</h3>
                <p className="team-role">Co-Founder</p>
                <div className="team-description">
                  <ul>
                    <li>AI/ML Engineer</li>
                    <li>Data Analyst Expert</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="learning-journey">
          <div className="container">
            <h2 className="section-title">Your Learning Journey at Skill.AI Training</h2>
            <div className="journey-timeline">
              <div className="journey-step">
                <div className="journey-step-icon">
                  <span>📚</span>
                </div>
                <div className="journey-step-number">1</div>
                <h3 className="journey-step-title">Choose a Course</h3>
                <p className="journey-step-description">Select from our range of industry-relevant courses</p>
              </div>
              <div className="journey-connector"></div>
              <div className="journey-step">
                <div className="journey-step-icon">
                  <span>👨‍🏫</span>
                </div>
                <div className="journey-step-number">2</div>
                <h3 className="journey-step-title">Learn from Expert Mentors</h3>
                <p className="journey-step-description">Get guided by experienced industry professionals</p>
              </div>
              <div className="journey-connector"></div>
              <div className="journey-step">
                <div className="journey-step-icon">
                  <span>💻</span>
                </div>
                <div className="journey-step-number">3</div>
                <h3 className="journey-step-title">Work on Real Projects</h3>
                <p className="journey-step-description">Build practical skills with hands-on projects</p>
              </div>
              <div className="journey-connector"></div>
              <div className="journey-step">
                <div className="journey-step-icon">
                  <span>🏆</span>
                </div>
                <div className="journey-step-number">4</div>
                <h3 className="journey-step-title">Get Certified</h3>
                <p className="journey-step-description">Earn a certificate upon course completion</p>
              </div>
              <div className="journey-connector"></div>
              <div className="journey-step">
                <div className="journey-step-icon">
                  <span>🚀</span>
                </div>
                <div className="journey-step-number">5</div>
                <h3 className="journey-step-title">Build Your Career</h3>
                <p className="journey-step-description">Launch your career with our support and guidance</p>
              </div>
            </div>
          </div>
        </section>

        <section className="features">
          <div className="container">
            <h2 className="section-title">Why Choose Us?</h2>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">🎓</div>
                <h3>Expert Instructors</h3>
                <p>Learn from industry experts with years of experience</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">📚</div>
                <h3>Comprehensive Curriculum</h3>
                <p>Well-structured courses covering all essential topics</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🏆</div>
                <h3>Certificates</h3>
                <p>Get certified upon course completion</p>
              </div>
            </div>
          </div>
        </section>

        <section className="testimonials">
          <div className="container">
            <h2 className="section-title">What Our Students Say</h2>
            <div className="testimonials-grid">
              <div className="testimonial-card">
                <div className="testimonial-stars">
                  <span className="star">⭐</span>
                  <span className="star">⭐</span>
                  <span className="star">⭐</span>
                  <span className="star">⭐</span>
                  <span className="star">⭐</span>
                </div>
                <p className="testimonial-text">
                  "This training helped me gain real skills and confidence. The mentors are excellent and the practical approach really made a difference."
                </p>
                <div className="testimonial-author">
                  <span className="testimonial-name">Student</span>
                </div>
              </div>
              <div className="testimonial-card">
                <div className="testimonial-stars">
                  <span className="star">⭐</span>
                  <span className="star">⭐</span>
                  <span className="star">⭐</span>
                  <span className="star">⭐</span>
                  <span className="star">⭐</span>
                </div>
                <p className="testimonial-text">
                  "Best investment in my career! The course material is up-to-date and the projects are industry-relevant. Highly recommended!"
                </p>
                <div className="testimonial-author">
                  <span className="testimonial-name">Student</span>
                </div>
              </div>
              <div className="testimonial-card">
                <div className="testimonial-stars">
                  <span className="star">⭐</span>
                  <span className="star">⭐</span>
                  <span className="star">⭐</span>
                  <span className="star">⭐</span>
                  <span className="star">⭐</span>
                </div>
                <p className="testimonial-text">
                  "The learning journey here is amazing. From choosing the course to getting certified, everything was smooth and well-structured."
                </p>
                <div className="testimonial-author">
                  <span className="testimonial-name">Student</span>
                </div>
              </div>
              <div className="testimonial-card">
                <div className="testimonial-stars">
                  <span className="star">⭐</span>
                  <span className="star">⭐</span>
                  <span className="star">⭐</span>
                  <span className="star">⭐</span>
                  <span className="star">⭐</span>
                </div>
                <p className="testimonial-text">
                  "Affordable pricing with quality education. The mentors go above and beyond to help you succeed. Truly job-oriented training!"
                </p>
                <div className="testimonial-author">
                  <span className="testimonial-name">Student</span>
                </div>
              </div>
              <div className="testimonial-card">
                <div className="testimonial-stars">
                  <span className="star">⭐</span>
                  <span className="star">⭐</span>
                  <span className="star">⭐</span>
                  <span className="star">⭐</span>
                  <span className="star">⭐</span>
                </div>
                <p className="testimonial-text">
                  "I got my dream job after completing the course! The practical projects and career support really made all the difference."
                </p>
                <div className="testimonial-author">
                  <span className="testimonial-name">Student</span>
                </div>
              </div>
              <div className="testimonial-card">
                <div className="testimonial-stars">
                  <span className="star">⭐</span>
                  <span className="star">⭐</span>
                  <span className="star">⭐</span>
                  <span className="star">⭐</span>
                  <span className="star">⭐</span>
                </div>
                <p className="testimonial-text">
                  "The expert mentors made complex topics easy to understand. Great learning experience with real-world applications!"
                </p>
                <div className="testimonial-author">
                  <span className="testimonial-name">Student</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="certificate-section">
          <div className="container">
            <h2 className="section-title">Get Industry-Recognized Certificate</h2>
            <div className="certificate-section-content">
              <div className="certificate-image-wrapper">
                <div className="certificate-image-container">
                  <img
                    src="https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&h=600&fit=crop"
                    alt="Certificate Preview"
                    className="certificate-image"
                  />
                </div>
              </div>
              <div className="certificate-benefits">
                <ul className="certificate-benefits-list">
                  <li className="certificate-benefit-item">
                    <span className="benefit-icon">✓</span>
                    <div className="benefit-content">
                      <h3>Shareable Certificate</h3>
                      <p>Earn a certificate you can share on LinkedIn, resumes, and job applications</p>
                    </div>
                  </li>
                  <li className="certificate-benefit-item">
                    <span className="benefit-icon">✓</span>
                    <div className="benefit-content">
                      <h3>Valid for Jobs & Internships</h3>
                      <p>Industry-recognized certificate accepted by employers and internship programs</p>
                    </div>
                  </li>
                  <li className="certificate-benefit-item">
                    <span className="benefit-icon">✓</span>
                    <div className="benefit-content">
                      <h3>Skill-based Verification</h3>
                      <p>Certificate validates your practical skills and knowledge in the field</p>
                    </div>
                  </li>
                </ul>
                <p className="certificate-trust-note">
                  Certificates are issued only after successful course completion.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="faq-section">
          <div className="container">
            <h2 className="section-title">Frequently Asked Questions</h2>
            <div className="faq-container">
              <div className="faq-item">
                <button
                  className={`faq-question ${openFAQ === 0 ? 'active' : ''}`}
                  onClick={() => setOpenFAQ(openFAQ === 0 ? null : 0)}
                >
                  <span>Are these courses beginner friendly?</span>
                  <span className="faq-icon">{openFAQ === 0 ? '−' : '+'}</span>
                </button>
                <div className={`faq-answer ${openFAQ === 0 ? 'open' : ''}`}>
                  <p>Yes, all our courses are designed to be beginner-friendly. We start from the basics and gradually progress to advanced topics, ensuring that even complete beginners can follow along and succeed.</p>
                </div>
              </div>
              <div className="faq-item">
                <button
                  className={`faq-question ${openFAQ === 1 ? 'active' : ''}`}
                  onClick={() => setOpenFAQ(openFAQ === 1 ? null : 1)}
                >
                  <span>Will I get lifetime access?</span>
                  <span className="faq-icon">{openFAQ === 1 ? '−' : '+'}</span>
                </button>
                <div className={`faq-answer ${openFAQ === 1 ? 'open' : ''}`}>
                  <p>Yes, once you enroll in a course, you get lifetime access to the course materials, including any future updates and additions to the course content.</p>
                </div>
              </div>
              <div className="faq-item">
                <button
                  className={`faq-question ${openFAQ === 2 ? 'active' : ''}`}
                  onClick={() => setOpenFAQ(openFAQ === 2 ? null : 2)}
                >
                  <span>Is there placement assistance?</span>
                  <span className="faq-icon">{openFAQ === 2 ? '−' : '+'}</span>
                </button>
                <div className={`faq-answer ${openFAQ === 2 ? 'open' : ''}`}>
                  <p>Yes, we provide career support and placement assistance. Our mentors guide you with resume building, interview preparation, and job opportunities in the industry. We also help with freelancing guidance and career growth strategies.</p>
                </div>
              </div>
              <div className="faq-item">
                <button
                  className={`faq-question ${openFAQ === 3 ? 'active' : ''}`}
                  onClick={() => setOpenFAQ(openFAQ === 3 ? null : 3)}
                >
                  <span>How is payment done?</span>
                  <span className="faq-icon">{openFAQ === 3 ? '−' : '+'}</span>
                </button>
                <div className={`faq-answer ${openFAQ === 3 ? 'open' : ''}`}>
                  <p>Payment is done securely through Razorpay. We accept multiple payment methods including UPI, Credit/Debit Cards, Net Banking, Wallets, and QR Code Scanner. All transactions are secure and encrypted.</p>
                </div>
              </div>
              <div className="faq-item">
                <button
                  className={`faq-question ${openFAQ === 4 ? 'active' : ''}`}
                  onClick={() => setOpenFAQ(openFAQ === 4 ? null : 4)}
                >
                  <span>Can I learn at my own pace?</span>
                  <span className="faq-icon">{openFAQ === 4 ? '−' : '+'}</span>
                </button>
                <div className={`faq-answer ${openFAQ === 4 ? 'open' : ''}`}>
                  <p>Absolutely! All our courses are self-paced. You can learn at your own convenience and speed. There are no deadlines, so you can take as much time as you need to complete the course and master the skills.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="cta-section">
          <div className="container">
            <div className="cta-content">
              <h2 className="cta-title">Start Learning Today with Skill.AI Training</h2>
              <Link to="/courses" className="btn cta-button">
                Explore Courses
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default LandingPage

