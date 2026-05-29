import React from 'react';

const openings = [
  {
    title: 'Senior Stylist',
    type: 'Full-time · New York',
    copy: 'Lead in-person styling sessions, support curated fittings, and help shape evolving wardrobe concepts.'
  },
  {
    title: 'Operations Coordinator',
    type: 'Full-time · Remote',
    copy: 'Manage order fulfillment, client communications, and seamless inventory workflows.'
  },
  {
    title: 'Creative Producer',
    type: 'Contract · Hybrid',
    copy: 'Develop campaign assets, editorial layouts, and seasonal launch storytelling.'
  }
];

export default function Careers() {
  return (
    <div className="animate-fade-in" style={{ paddingTop: '120px', paddingBottom: '80px' }}>
      <div className="container">
        <div style={{ marginBottom: '30px' }}>
          <p style={{ fontSize: '11px', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>WORK WITH US</p>
          <h1 style={{ fontSize: '38px', fontWeight: 300, letterSpacing: '-0.02em', textTransform: 'uppercase', marginTop: '10px' }}>Careers</h1>
          <p style={{ maxWidth: '760px', color: 'var(--text-secondary)', lineHeight: '1.7', fontSize: '15px', marginTop: '12px' }}>
            Join a small team building a modern luxury wardrobe. We value precision, calm creativity, and thoughtful service.
          </p>
        </div>

        <section style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '24px', marginBottom: '26px' }}>
          <div style={{ border: '1px solid var(--border-light)', backgroundColor: 'var(--bg-secondary)', padding: '24px' }}>
            <h2 style={{ fontSize: '16px', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '12px' }}>Why Lumina</h2>
            <p style={{ fontSize: '14px', lineHeight: '1.8', color: 'var(--text-secondary)' }}>
              Our studio blends tactile craftsmanship, editorial direction, and thoughtful retail service. Every role contributes to a world that feels quiet, intentional, and beautifully made.
            </p>
          </div>

          <div style={{ border: '1px solid var(--border-light)', backgroundColor: 'var(--bg-primary)', padding: '24px' }}>
            <h2 style={{ fontSize: '16px', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '12px' }}>What we look for</h2>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: 'var(--text-primary)', paddingLeft: '18px' }}>
              <li>Strong attention to material, fit, and detail.</li>
              <li>Comfort leading clients through thoughtful retail moments.</li>
              <li>Ambition to grow within a design-led studio.</li>
            </ul>
          </div>
        </section>

        <section style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {openings.map((role) => (
            <article key={role.title} style={{ border: '1px solid var(--border-light)', padding: '20px', display: 'flex', justifyContent: 'space-between', gap: '20px', alignItems: 'center', backgroundColor: 'var(--bg-primary)' }}>
              <div>
                <p style={{ fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>{role.type}</p>
                <h3 style={{ fontSize: '16px', marginTop: '8px', marginBottom: '8px' }}>{role.title}</h3>
                <p style={{ fontSize: '13px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>{role.copy}</p>
              </div>
              <button className="btn-secondary">Apply</button>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}
