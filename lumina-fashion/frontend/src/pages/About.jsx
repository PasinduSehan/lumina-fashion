import React from 'react';

export default function About({ setPath }) {
  return (
    <div className="animate-fade-in" style={{ paddingTop: '120px', paddingBottom: '80px' }}>
      <div className="container">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '40px' }}>
          <p style={{ fontSize: '11px', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>ABOUT LUMINA</p>
          <h1 style={{ fontSize: '42px', fontWeight: 300, letterSpacing: '-0.02em', textTransform: 'uppercase', maxWidth: '800px' }}>
            Minimal silhouettes, sculpted with intention.
          </h1>
          <p style={{ maxWidth: '760px', fontSize: '16px', lineHeight: '1.8', color: 'var(--text-secondary)' }}>
            Lumina is a luxury menswear studio shaping refined essentials with tactile fabrics, architectural tailoring, and understated color palettes. Every release is designed to bridge effortless daywear and elevated evening presence.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '28px', marginBottom: '36px' }}>
          <section style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-light)', padding: '28px' }}>
            <h2 style={{ fontSize: '18px', letterSpacing: '0.1em', marginBottom: '12px', textTransform: 'uppercase' }}>Our philosophy</h2>
            <p style={{ fontSize: '14px', lineHeight: '1.8', color: 'var(--text-secondary)', marginBottom: '14px' }}>
              We build wardrobe anchors from pure fibers, clean finishing, and precise proportions. The result is a concise collection that feels elevated without excess.
            </p>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: 'var(--text-primary)', paddingLeft: '18px' }}>
              <li>Premium natural fibers and low-impact production partners.</li>
              <li>Tailoring inspired by sculptural proportions and quiet detail.</li>
              <li>Private styling service and concierge-level customer support.</li>
            </ul>
          </section>

          <section style={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-light)', padding: '28px' }}>
            <h2 style={{ fontSize: '18px', letterSpacing: '0.1em', marginBottom: '12px', textTransform: 'uppercase' }}>Our location</h2>
            <p style={{ fontSize: '13px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '10px' }}>Flagship studio</p>
            <p style={{ fontSize: '15px', lineHeight: '1.7', color: 'var(--text-primary)', marginBottom: '12px' }}>29 Mercer Street<br />New York, NY 10013</p>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '12px' }}>Mon–Sat: 10:00 AM – 7:00 PM<br />Sun: 11:00 AM – 5:00 PM</p>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>hello@luminafashion.com<br />+1 (212) 555-0117</p>
          </section>
        </div>

        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '18px', marginBottom: '24px' }}>
          {[
            { title: 'Craft', copy: 'Slow-made essentials with soft structure and premium finishes.' },
            { title: 'Service', copy: 'Personal styling, careful packaging, and concierge order support.' },
            { title: 'Atmosphere', copy: 'A quiet luxury gallery designed around tactile, lived-in elegance.' }
          ].map((item) => (
            <div key={item.title} style={{ border: '1px solid var(--border-light)', padding: '22px', backgroundColor: 'var(--bg-primary)' }}>
              <h3 style={{ fontSize: '13px', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '12px' }}>{item.title}</h3>
              <p style={{ fontSize: '14px', lineHeight: '1.7', color: 'var(--text-secondary)' }}>{item.copy}</p>
            </div>
          ))}
        </section>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button onClick={() => setPath('/catalog')} className="btn-primary">Shop the collection</button>
          <button onClick={() => setPath('/faq')} className="btn-secondary">View help center</button>
        </div>
      </div>
    </div>
  );
}
