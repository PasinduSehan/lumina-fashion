import React, { useState } from 'react';

export default function Hero({ setPath }) {
  const [shopEditHovered, setShopEditHovered] = useState(false);

  return (
    <div style={{
      position: 'relative',
      height: '92vh',
      width: '100vw',
      overflow: 'hidden',
      backgroundColor: '#0F0F0F'
    }}>
      
      {/* Background Image with Zoom Animation */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundImage: `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.5)), url('https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1200')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center 20%',
        animation: 'zoomIn 20s infinite alternate ease-in-out',
        opacity: 0.85
      }} />

      {/* Embedded style tag for local component keyframe */}
      <style>{`
        @keyframes zoomIn {
          0% { transform: scale(1.02); }
          100% { transform: scale(1.08); }
        }
      `}</style>

      {/* Hero Content */}
      <div className="container animate-fade-in-up" style={{
        position: 'relative',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        paddingBottom: '100px',
        color: 'var(--text-light)',
        zIndex: 2
      }}>
        <div style={{ maxWidth: '600px' }}>
          <p style={{
            fontSize: '12px',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            marginBottom: '16px',
            color: 'var(--accent-gold)'
          }}>
            Summer / Autumn Collection 2026
          </p>
          
          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'calc(2.5rem + 2vw)',
            fontWeight: 300,
            lineHeight: 1.1,
            textTransform: 'uppercase',
            letterSpacing: '-0.01em',
            marginBottom: '32px'
          }}>
            Sartorial <br />
            Redefined.
          </h1>

          <p style={{
            fontSize: '15px',
            lineHeight: 1.6,
            marginBottom: '40px',
            color: '#D8D8D3',
            fontWeight: 300
          }}>
            Explore our curated edit of lightweight linens, structured wool tailoring, and luxury Italian-made accessories. Designed for comfort, styled for distinction.
          </p>

          <div style={{ display: 'flex', gap: '20px' }}>
            <button 
              onClick={() => setPath('/catalog')} 
              className="btn-primary"
              onMouseEnter={() => setShopEditHovered(true)}
              onMouseLeave={() => setShopEditHovered(false)}
            style={{
  backgroundColor: shopEditHovered ? '#fdfafa' : '#0e0c0c',
  color: shopEditHovered ? '#0e0c0c' : '#faf3f3',
  borderColor: shopEditHovered ? '#000000' : 'rgba(7, 6, 6, 0.8)',
  transition: 'background-color 0.25s ease, border-color 0.25s ease, color 0.25s ease, transform 0.25s ease',
  transform: shopEditHovered ? 'translateY(-1px)' : 'translateY(0px)'
}}
            >
              Shop the Edit
            </button>
            
            <button 
              onClick={() => setPath('/catalog?category=Outerwear')} 
              className="btn-secondary"
              style={{
                color: 'var(--text-light)',
                borderColor: 'rgba(255,255,255,0.4)'
              }}
            >
              Explore Outerwear
            </button>
          </div>
        </div>
      </div>

      {/* Floating Scroll Indicator */}
      <div style={{
        position: 'absolute',
        bottom: '30px',
        left: '50%',
        transform: 'translateX(-50%)',
        color: 'var(--text-light)',
        fontSize: '10px',
        letterSpacing: '0.25em',
        textTransform: 'uppercase',
        opacity: 0.6,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px'
      }}>
        <span>Scroll Down</span>
        <div style={{
          width: '1px',
          height: '40px',
          backgroundColor: 'rgba(255,255,255,0.3)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            width: '100%',
            height: '15px',
            backgroundColor: 'var(--text-light)',
            position: 'absolute',
            top: 0,
            animation: 'scrollBar 2s infinite ease-in-out'
          }} />
          <style>{`
            @keyframes scrollBar {
              0% { top: -15px; }
              100% { top: 40px; }
            }
          `}</style>
        </div>
      </div>

    </div>
  );
}

