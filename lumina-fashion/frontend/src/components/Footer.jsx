import React from 'react';

export default function Footer({ setPath }) {
  const navigateTo = (path) => {
    setPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer style={{
      backgroundColor: 'var(--bg-dark)',
      color: 'var(--text-light)',
      padding: '80px 0 40px 0',
      marginTop: '120px',
      borderTop: '1px solid var(--border-dark)'
    }}>
      <div className="container">
        
        {/* Upper Footer Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '40px',
          marginBottom: '60px'
        }}>
          {/* Brand Info */}
          <div>
            <h4 style={{ fontSize: '14px', letterSpacing: '0.2em', fontWeight: 600, marginBottom: '24px' }}>LUMINA</h4>
            <p style={{ fontSize: '12px', color: '#A0A09A', lineHeight: '1.8', maxWidth: '240px' }}>
              Crafting contemporary silhouettes with timeless materials. Designed for the modern aesthete.
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 style={{ fontSize: '12px', letterSpacing: '0.15em', fontWeight: 500, marginBottom: '24px', color: '#E5E5E0' }}>SERVICES</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '12px', color: '#A0A09A' }}>
              <li><span onClick={() => navigateTo('/faq')} style={{ cursor: 'pointer' }}>Shipping & Returns</span></li>
              <li><span onClick={() => navigateTo('/about')} style={{ cursor: 'pointer' }}>Store Locator</span></li>
              <li><span onClick={() => navigateTo('/faq')} style={{ cursor: 'pointer' }}>Contact Client Relations</span></li>
              <li><span onClick={() => navigateTo('/size-guide')} style={{ cursor: 'pointer' }}>Care Guide</span></li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 style={{ fontSize: '12px', letterSpacing: '0.15em', fontWeight: 500, marginBottom: '24px', color: '#E5E5E0' }}>HELP</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '12px', color: '#A0A09A' }}>
              <li><span onClick={() => navigateTo('/faq')} style={{ cursor: 'pointer' }}>FAQ- Order, Delivery, Return</span></li>
              <li><span onClick={() => navigateTo('/size-guide')} style={{ cursor: 'pointer' }}>Size Guide</span></li>
              <li><span onClick={() => navigateTo('/careers')} style={{ cursor: 'pointer' }}>Careers</span></li>
            </ul>
          </div>

          {/* Details */}
          <div>
            <h4 style={{ fontSize: '12px', letterSpacing: '0.15em', fontWeight: 500, marginBottom: '24px', color: '#E5E5E0' }}>THE DETAILS</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '12px', color: '#A0A09A' }}>
              <li><span onClick={() => navigateTo('/terms-of-service')} style={{ cursor: 'pointer' }}>Terms of Service</span></li>
              <li><span onClick={() => navigateTo('/refund-policy')} style={{ cursor: 'pointer' }}>Refund Policy</span></li>
              <li><span onClick={() => navigateTo('/privacy-policy')} style={{ cursor: 'pointer' }}>Privacy Policy</span></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 style={{ fontSize: '12px', letterSpacing: '0.15em', fontWeight: 500, marginBottom: '24px', color: '#E5E5E0' }}>NEWSLETTER</h4>
            <p style={{ fontSize: '12px', color: '#A0A09A', marginBottom: '16px', lineHeight: '1.6' }}>
              Subscribe to receive private collection previews and editorial updates.
            </p>
            <form onSubmit={(e) => e.preventDefault()} style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
              <input 
                type="email" 
                placeholder="YOUR EMAIL" 
                style={{
                  flex: 1,
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: 'var(--text-light)',
                  fontSize: '11px',
                  padding: '10px 0',
                  outline: 'none',
                  letterSpacing: '0.05em'
                }}
              />
              <button type="submit" style={{ color: 'var(--text-light)', fontSize: '11px', letterSpacing: '0.1em', fontWeight: 600 }}>
                SUBMIT
              </button>
            </form>
          </div>
        </div>

        {/* Lower Footer */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.05)',
          paddingTop: '30px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px',
          fontSize: '11px',
          color: '#70706B'
        }}>
          <span>© 2026 LUMINA FASHION CO. ALL RIGHTS RESERVED.</span>
          <div style={{ display: 'flex', gap: '24px' }}>
            <span onClick={() => navigateTo('/privacy-policy')} style={{ cursor: 'pointer' }}>PRIVACY POLICY</span>
            <span onClick={() => navigateTo('/terms-of-service')} style={{ cursor: 'pointer' }}>TERMS & CONDITIONS</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
