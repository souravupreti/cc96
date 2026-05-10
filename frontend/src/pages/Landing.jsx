import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import {
  Search, Calendar, CheckCircle, Star, Zap, Home, Wrench,
  Paintbrush, Bug, ArrowRight, Play, Shield, Clock, ThumbsUp,
  ChevronRight, MapPin, Phone, Mail
} from 'lucide-react';

const FacebookIcon = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const TwitterIcon = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const InstagramIcon = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const LinkedinIcon = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);


export default function Landing() {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState('');

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await api.get('/api/services');
        setServices(res.data.services || []);
      } catch {
        setServices([
          { _id: '1', name: 'Deep Cleaning', description: 'Intensive home cleaning', basePrice: 999, icon: 'Home' },
          { _id: '2', name: 'Plumbing', description: 'Expert repairs & fixes', basePrice: 499, icon: 'Wrench' },
          { _id: '3', name: 'Electrician', description: 'Wiring & appliance setup', basePrice: 399, icon: 'Zap' },
          { _id: '4', name: 'Painting', description: 'Interior & exterior painting', basePrice: 799, icon: 'Paintbrush' },
          { _id: '5', name: 'Pest Control', description: 'Complete pest management', basePrice: 899, icon: 'Bug' }
        ]);
      }
    };
    fetchServices();
  }, []);

  const handleServiceClick = (serviceId) => {
    if (auth.isAuthenticated && auth.userType === 'customer') {
      navigate('/booking', { state: { serviceId } });
    } else {
      navigate('/login');
    }
  };

  const getServiceIcon = (iconName) => {
    switch (iconName) {
      case 'Home': return <Home size={32} color="var(--purple)" />;
      case 'Wrench': return <Wrench size={32} color="var(--purple)" />;
      case 'Zap': return <Zap size={32} color="var(--purple)" />;
      case 'Paintbrush': return <Paintbrush size={32} color="var(--purple)" />;
      case 'Bug': return <Bug size={32} color="var(--purple)" />;
      default: return <Zap size={32} color="var(--purple)" />;
    }
  };

  return (
    <div className="page" style={{ paddingTop: 0 }}>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #1A1A2E 0%, #2D1B69 50%, #4B2ED4 100%)',
        padding: '160px 0 100px',
        color: 'white',
        overflow: 'hidden',
        position: 'relative'
      }}>
        <div className="container hero-container" style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '60px', alignItems: 'center' }}>
          <div className="hero-left">
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)',
              padding: '8px 20px',
              borderRadius: '50px',
              border: '1px solid rgba(255,255,255,0.2)',
              fontSize: '14px',
              fontWeight: '600',
              marginBottom: '24px'
            }}>
              <Shield size={16} /> Trusted by 10,000+ customers
            </div>
            <h1 className="hero-h1" style={{ fontSize: '64px', fontWeight: '800', lineHeight: '1.1', marginBottom: '24px' }}>
              Book Home Services <br />
              <span style={{
                background: 'linear-gradient(135deg, #FF6B35, #FFD93D)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>You Can Trust</span>
            </h1>
            <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.7)', maxWidth: '480px', marginBottom: '40px' }}>
              From cleaning to repairs, get expert professionals at your doorstep. Fast, reliable, and premium quality guaranteed.
            </p>
            <div className="hero-btns" style={{ display: 'flex', gap: '16px' }}>
              <button className="btn-premium-orange btn-premium" onClick={() => navigate('/services')}>
                Book a Service <ArrowRight size={20} />
              </button>
              <a href="#how-it-works" className="btn-outline" style={{ borderColor: 'white', color: 'white' }}>
                <Play size={20} fill="white" /> How it Works
              </a>
            </div>
            <div className="hero-stats" style={{ display: 'flex', gap: '40px', marginTop: '60px', opacity: '0.9' }}>
              <div><div style={{ fontSize: '24px', fontWeight: '800' }}>10K+</div><div style={{ fontSize: '14px', color: '#A0AEC0' }}>Customers</div></div>
              <div style={{ width: '1px', background: 'rgba(255,255,255,0.2)' }} className="geometric-shape"></div>
              <div><div style={{ fontSize: '24px', fontWeight: '800' }}>500+</div><div style={{ fontSize: '14px', color: '#A0AEC0' }}>Vendors</div></div>
              <div style={{ width: '1px', background: 'rgba(255,255,255,0.2)' }} className="geometric-shape"></div>
              <div><div style={{ fontSize: '24px', fontWeight: '800' }}>4.8</div><div style={{ fontSize: '14px', color: '#A0AEC0' }}>Rating</div></div>
            </div>
          </div>

          <div className="hero-right animate-float">
            <div className="card-glass" style={{ padding: '40px' }}>
              <h3 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '24px', color: 'var(--dark)' }}>Book a Service</h3>
              <div className="form-group">
                <label style={{ color: 'var(--dark)' }}>Select Service</label>
                <select
                  className="input-field"
                  style={{ paddingLeft: '18px' }}
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                >
                  <option value="">Choose service...</option>
                  {services.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label style={{ color: 'var(--dark)' }}>Preferred Date</label>
                <input type="date" className="input-field" style={{ paddingLeft: '18px' }} />
              </div>
              <button
                className="btn-premium-orange btn-premium"
                style={{ width: '100%', marginTop: '10px' }}
                onClick={() => selectedService && handleServiceClick(selectedService)}
              >
                Check Availability
              </button>
              <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--gray)', marginTop: '16px' }}>
                Free cancellation • No charges now
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section style={{ background: 'white', padding: '60px 0', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
        <div className="container stats-bar-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', textAlign: 'center' }}>
          <div className="stats-bar-item">
            <div className="text-gradient" style={{ fontSize: '32px', fontWeight: '800' }}>98%</div>
            <div style={{ color: 'var(--gray)', fontSize: '14px' }}>Satisfaction Rate</div>
          </div>
          <div className="stats-bar-item" style={{ borderLeft: '1px solid #EEE' }}>
            <div className="text-gradient" style={{ fontSize: '32px', fontWeight: '800' }}>24/7</div>
            <div style={{ color: 'var(--gray)', fontSize: '14px' }}>Customer Support</div>
          </div>
          <div className="stats-bar-item" style={{ borderLeft: '1px solid #EEE' }}>
            <div className="text-gradient" style={{ fontSize: '32px', fontWeight: '800' }}>50+</div>
            <div style={{ color: 'var(--gray)', fontSize: '14px' }}>Service Categories</div>
          </div>
          <div className="stats-bar-item" style={{ borderLeft: '1px solid #EEE' }}>
            <div className="text-gradient" style={{ fontSize: '32px', fontWeight: '800' }}>Verified</div>
            <div style={{ color: 'var(--gray)', fontSize: '14px' }}>Professional Staff</div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="section" style={{ background: '#F4F6FF' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <span style={{ color: 'var(--purple)', fontWeight: '700', fontSize: '14px', letterSpacing: '2px' }}>SIMPLE PROCESS</span>
            <h2 style={{ fontSize: '42px', fontWeight: '800', marginTop: '10px' }}>How It Works</h2>
          </div>
          <div className="how-it-works-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '40px', position: 'relative' }}>
            <div className="card-3d" style={{ textAlign: 'center', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '20px', right: '20px', background: 'var(--purple-light)', color: 'var(--purple)', padding: '4px 12px', borderRadius: '50px', fontSize: '12px', fontWeight: '700' }}>Step 01</div>
              <div className="icon-box"><Search size={32} color="var(--purple)" /></div>
              <h3 style={{ marginBottom: '12px' }}>Choose a Service</h3>
              <p style={{ color: 'var(--gray)', fontSize: '15px' }}>Browse through our verified services and pick what you need.</p>
            </div>
            <div className="card-3d" style={{ textAlign: 'center', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '20px', right: '20px', background: 'var(--purple-light)', color: 'var(--purple)', padding: '4px 12px', borderRadius: '50px', fontSize: '12px', fontWeight: '700' }}>Step 02</div>
              <div className="icon-box icon-box-orange"><Calendar size={32} color="var(--orange)" /></div>
              <h3 style={{ marginBottom: '12px' }}>Pick a Time</h3>
              <p style={{ color: 'var(--gray)', fontSize: '15px' }}>Schedule a visit at your convenience. We work around you.</p>
            </div>
            <div className="card-3d" style={{ textAlign: 'center', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '20px', right: '20px', background: 'var(--purple-light)', color: 'var(--purple)', padding: '4px 12px', borderRadius: '50px', fontSize: '12px', fontWeight: '700' }}>Step 03</div>
              <div className="icon-box icon-box-green"><CheckCircle size={32} color="#2E7D32" /></div>
              <h3 style={{ marginBottom: '12px' }}>Relax & Enjoy</h3>
              <p style={{ color: 'var(--gray)', fontSize: '15px' }}>Our pro arrives and handles everything while you sit back.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Services */}
      <section className="section" style={{ background: 'white' }}>
        <div className="container" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px' }}>
            <div>
              <h2 style={{ fontSize: '36px', fontWeight: '800' }}>Popular Services</h2>
              <p style={{ color: 'var(--gray)', marginTop: '8px' }}>Top-rated professional services for your home</p>
            </div>
            <Link to="/services" style={{ color: 'var(--purple)', fontWeight: '700', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
              View All Services <ChevronRight size={20} />
            </Link>
          </div>
          <div className="services-marquee-container">
            <div className="services-marquee-track">
              {[...services, ...services].map((service, index) => (
                <div 
                  key={`${service._id}-${index}`} 
                  className="card-3d service-card-premium marquee-card" 
                  style={{ 
                    padding: '24px', 
                    cursor: 'pointer', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '24px',
                    textAlign: 'left',
                    flexShrink: 0
                  }} 
                  onClick={() => handleServiceClick(service._id)}
                >
                  <div className="icon-box service-card-icon-box" style={{ margin: 0, flexShrink: 0 }}>{getServiceIcon(service.icon)}</div>
                  <div style={{ flex: 1 }}>
                    <h3 className="service-card-name" style={{ fontSize: '20px', marginBottom: '4px', fontWeight: '800' }}>{service.name}</h3>
                    <p style={{ color: 'var(--gray)', fontSize: '14px' }}>{service.description}</p>
                  </div>
                  <div style={{ textAlign: 'right', minWidth: '120px' }}>
                    <div className="text-gradient service-card-price" style={{ fontSize: '24px', fontWeight: '800', marginBottom: '8px' }}>₹{service.basePrice}</div>
                    <button className="btn-premium-orange btn-premium service-card-btn" style={{ padding: '10px 20px', fontSize: '13px' }}>Book Now</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section" style={{ background: '#1A1A2E', color: 'white' }}>
        <div className="container">
          <h2 style={{ fontSize: '42px', fontWeight: '800', textAlign: 'center', marginBottom: '60px' }}>Why Thousands Choose ServiceHub</h2>
          <div className="why-choose-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
            <div className="card-glass" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
              <Shield size={40} color="white" style={{ marginBottom: '20px' }} />
              <h3 style={{ fontSize: '20px', marginBottom: '12px' }}>Verified Pros</h3>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px' }}>Every professional is background checked and skill-tested.</p>
            </div>
            <div className="card-glass" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
              <Clock size={40} color="white" style={{ marginBottom: '20px' }} />
              <h3 style={{ fontSize: '20px', marginBottom: '12px' }}>On-Time Arrival</h3>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px' }}>We value your time. Our pros arrive exactly when scheduled.</p>
            </div>
            <div className="card-glass" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
              <Star size={40} color="white" style={{ marginBottom: '20px' }} />
              <h3 style={{ fontSize: '20px', marginBottom: '12px' }}>Quality Guaranteed</h3>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px' }}>Not happy with the service? We will make it right, guaranteed.</p>
            </div>
            <div className="card-glass" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
              <ThumbsUp size={40} color="white" style={{ marginBottom: '20px' }} />
              <h3 style={{ fontSize: '20px', marginBottom: '12px' }}>Transparent Pricing</h3>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px' }}>No hidden costs. See exactly what you pay for upfront.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section" style={{
        background: 'linear-gradient(135deg, var(--purple), var(--orange))',
        textAlign: 'center',
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: '-100px', left: '-100px', width: '300px', height: '300px', background: 'white', opacity: '0.1', borderRadius: '50%' }} className="bg-shape"></div>
        <div style={{ position: 'absolute', bottom: '-100px', right: '-100px', width: '300px', height: '300px', background: 'white', opacity: '0.1', borderRadius: '50%' }} className="bg-shape"></div>
        <div className="container" style={{ position: 'relative', zIndex: '1' }}>
          <h2 className="cta-h2" style={{ fontSize: '44px', fontWeight: '800', marginBottom: '20px' }}>Ready for a Better Home Experience?</h2>
          <p className="cta-p" style={{ fontSize: '18px', color: 'rgba(255,255,255,0.9)', maxWidth: '600px', margin: '0 auto 40px' }}>
            Join 10,000+ happy customers who trust ServiceHub for their professional home maintenance.
          </p>
          <button className="btn-premium cta-btn" style={{ background: 'white', color: 'var(--purple)', fontSize: '18px', padding: '16px 48px' }} onClick={() => navigate('/signup')}>
            Get Started Free
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#0F0F1E', color: 'white', padding: '80px 0 40px' }}>
        <div className="container">
          <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: '60px', marginBottom: '60px' }}>
            <div className="footer-col">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '24px', fontWeight: '800', marginBottom: '24px' }}>
                <Zap size={28} fill="var(--purple)" color="var(--purple)" /> ServiceHub
              </div>
              <p style={{ color: 'var(--gray)', lineHeight: '1.8', marginBottom: '24px' }}>
                Professional home services delivered by verified experts at your doorstep. Reliability and quality guaranteed.
              </p>
              <div className="footer-socials" style={{ display: 'flex', gap: '16px' }}>
                {[FacebookIcon, TwitterIcon, InstagramIcon, LinkedinIcon].map((Icon, i) => (
                  <div key={i} style={{
                    width: '36px', height: '36px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.3s'
                  }} onMouseOver={(e) => e.currentTarget.style.background = 'var(--purple)'} onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
                    <Icon size={18} />
                  </div>
                ))}
              </div>
            </div>
            <div className="footer-col">
              <h4 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '24px' }}>Services</h4>
              <ul style={{ listStyle: 'none', color: 'var(--gray)', display: 'grid', gap: '12px' }}>
                <li>Cleaning</li><li>Plumbing</li><li>Electrical</li><li>Painting</li><li>Pest Control</li>
              </ul>
            </div>
            <div className="footer-col">
              <h4 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '24px' }}>Company</h4>
              <ul style={{ listStyle: 'none', color: 'var(--gray)', display: 'grid', gap: '12px' }}>
                <li>About Us</li><li>How it Works</li><li>Careers</li><li>Press</li><li>Contact</li>
              </ul>
            </div>
            <div className="footer-col">
              <h4 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '24px' }}>Contact</h4>
              <ul style={{ listStyle: 'none', color: 'var(--gray)', display: 'grid', gap: '16px' }}>
                <li style={{ display: 'flex', gap: '10px' }}><MapPin size={20} color="var(--purple)" /> 123 Business Park, Mumbai</li>
                <li style={{ display: 'flex', gap: '10px' }}><Phone size={20} color="var(--purple)" /> +91 1234567890</li>
                <li style={{ display: 'flex', gap: '10px' }}><Mail size={20} color="var(--purple)" /> help@servicehub.com</li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '30px', display: 'flex', justifyContent: 'space-between', color: 'var(--gray)', fontSize: '14px' }}>
            <p>© 2026 ServiceHub Technologies Pvt Ltd. All rights reserved.</p>
            <div style={{ display: 'flex', gap: '24px' }}>
              <span>Privacy</span><span>Terms</span><span>Cookies</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
