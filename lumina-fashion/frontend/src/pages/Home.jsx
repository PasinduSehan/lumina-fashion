import React, { useState, useEffect, useContext } from 'react';
import Hero from '../components/Hero';
import { AuthContext } from '../context/AuthContext';

export default function Home({ setPath }) {
  const { API_URL } = useContext(AuthContext);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await fetch(`${API_URL}/products?featured=true`);
        if (!res.ok) throw new Error('Failed to fetch collections.');
        const data = await res.json();
        setFeaturedProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, [API_URL]);

  return (
    <div className="animate-fade-in">
      {/* Hero Banner */}
      <Hero setPath={setPath} />

      {/* Featured Collection Section */}
      <section style={{ padding: '100px 0 60px 0' }}>
        <div className="container">
          
          {/* Section Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            marginBottom: '48px',
            borderBottom: '1px solid var(--border-light)',
            paddingBottom: '16px'
          }}>
            <div>
              <p style={{ fontSize: '11px', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                Curated Selection
              </p>
              <h2 style={{ fontSize: '24px', letterSpacing: '0.05em' }}>Featured Pieces</h2>
            </div>
            <span 
              onClick={() => setPath('/catalog')} 
              style={{ 
                fontSize: '12px', 
                letterSpacing: '0.1em', 
                textTransform: 'uppercase', 
                cursor: 'pointer',
                fontWeight: 500,
                borderBottom: '1px solid var(--text-primary)'
              }}
            >
              View All Shop
            </span>
          </div>

          {/* Grid Content */}
          {loading ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '40px 24px'
            }}>
              {[1, 2, 3, 4].map(n => (
                <div key={n} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ width: '100%', paddingBottom: '130%', backgroundColor: 'var(--bg-secondary)', borderRadius: '2px' }} />
                  <div style={{ height: '14px', width: '60%', backgroundColor: 'var(--bg-secondary)' }} />
                  <div style={{ height: '14px', width: '30%', backgroundColor: 'var(--bg-secondary)' }} />
                </div>
              ))}
            </div>
          ) : error ? (
            <p style={{ textAlign: 'center', color: 'var(--accent-red)', padding: '40px 0' }}>{error}</p>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '40px 24px'
            }}>
              {featuredProducts.slice(0, 4).map((product) => (
                <div 
                  key={product.id} 
                  className="product-card"
                  onClick={() => setPath(`/product/${product.id}`)}
                >
                  <div className="product-image-container">
                    <img src={product.images[0]} alt={product.name} />
                  </div>
                  <div className="product-card-details">
                    <div className="product-card-info">
                      <h3 className="product-card-name">{product.name}</h3>
                      <span className="product-card-category">{product.category}</span>
                    </div>
                    <span className="product-card-price">${product.price.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </section>

      {/* Studio & Location Section */}
      <section style={{ padding: '48px 0 24px 0' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 0.8fr',
            gap: '32px',
            alignItems: 'stretch'
          }}>
            <div style={{
              border: '1px solid rgba(0,0,0,0.08)',
              borderRadius: '12px',
              padding: '32px',
              backgroundColor: '#fafaf9',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px'
            }}>
              <div>
                <p style={{ fontSize: '11px', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#5f5f5a', marginBottom: '10px' }}>
                  Our Studio
                </p>
                <h2 style={{ fontSize: '30px', fontWeight: 500, letterSpacing: '-0.02em', marginBottom: '12px', color: '#161616' }}>
                  Crafted around light, rhythm, and quiet luxury.
                </h2>
              </div>
              <p style={{ fontSize: '15px', lineHeight: '1.75', color: '#4f4f4a' }}>
                Lumina Fashion is a slow-luxury studio built on tactile fabrics, refined silhouettes, and thoughtful production. Visit our flagship in SoHo for fittings, styling notes, and curated seasonal drops.
              </p>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <button onClick={() => setPath('/about')} className="btn-primary">
                  Meet the Brand
                </button>
                <button onClick={() => setPath('/catalog')} className="btn-secondary">
                  Shop the Edit
                </button>
              </div>
            </div>

            <div className="location-card-hover" style={{
              borderRadius: '12px',
              overflow: 'hidden',
              backgroundColor: '#121212',
              color: '#f8f8f5',
              padding: '28px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '18px'
            }}>
              <div>
                <p style={{ fontSize: '11px', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', marginBottom: '10px' }}>
                  Flagship Location
                </p>
                <h3 style={{ fontSize: '24px', fontWeight: 500, marginBottom: '12px', color: '#ffffff' }}>SoHo Flagship</h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px', lineHeight: '1.6', color: 'rgba(255,255,255,0.74)' }}>
                <div><strong style={{ display: 'block', color: 'white', marginBottom: '4px' }}>Address</strong> 88 Mercer Street, New York, NY 10012</div>
                <div><strong style={{ display: 'block', color: 'white', marginBottom: '4px' }}>Hours</strong> Mon–Sat 10:00 AM – 7:00 PM • Sun 12:00 PM – 5:00 PM</div>
                <div><strong style={{ display: 'block', color: 'white', marginBottom: '4px' }}>Contact</strong> appointments@luminafashion.com • (212) 555-0148</div>
              </div>

              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <span style={{ border: '1px solid rgba(255,255,255,0.2)', borderRadius: '999px', padding: '8px 10px', fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Private fittings</span>
                <span style={{ border: '1px solid rgba(255,255,255,0.2)', borderRadius: '999px', padding: '8px 10px', fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Styling sessions</span>
                <span style={{ border: '1px solid rgba(255,255,255,0.2)', borderRadius: '999px', padding: '8px 10px', fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Seasonal edits</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Editorial Lookbook Section */}
      <section style={{ padding: '60px 0 100px 0', backgroundColor: 'var(--bg-secondary)' }}>
        <div className="container">
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>
            
            {/* Visual Look */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div style={{ overflow: 'hidden', paddingBottom: '140%', position: 'relative' }}>
                <img 
                  src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=600" 
                  alt="Tailoring close-up" 
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div style={{ overflow: 'hidden', paddingBottom: '140%', position: 'relative', marginTop: '40px' }}>
                <img 
                  src="https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=600" 
                  alt="Linen lifestyle" 
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            </div>

            {/* Editorial Copy */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
              <p style={{ fontSize: '11px', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
                Editorial Issue 02
              </p>
              
              <h2 style={{
                fontSize: '36px',
                fontWeight: 300,
                letterSpacing: '-0.01em',
                lineHeight: '1.2',
                textTransform: 'uppercase'
              }}>
                The Art of Modern Craft.
              </h2>

              <p style={{
                fontSize: '15px',
                lineHeight: '1.8',
                color: 'var(--text-secondary)',
                fontWeight: 300
              }}>
                Our studio focuses on pure tailoring, using organic double-twisted yarns and high-grade fibers. Every garment goes through strict manufacturing oversight to ensure a garment that wears beautifully over a lifetime. 
              </p>

              <div>
                <button 
                  onClick={() => setPath('/catalog')} 
                  className="btn-primary"
                >
                  Explore the Lookbook
                </button>
              </div>
            </div>

          </div>

        </div>
      </section>
    </div>
  );
}
