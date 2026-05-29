import React from 'react';

export default function TermsOfService() {
  return (
    <div className="animate-fade-in" style={{ paddingTop: '120px', paddingBottom: '80px' }}>
      <div className="container">
        <div style={{ marginBottom: '24px' }}>
          <p style={{ fontSize: '11px', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>THE DETAILS</p>
          <h1 style={{ fontSize: '38px', fontWeight: 300, letterSpacing: '-0.02em', textTransform: 'uppercase', marginTop: '10px' }}>Terms of Service</h1>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', color: 'var(--text-secondary)', lineHeight: '1.8', fontSize: '14px' }}>
          <p>These terms govern your access to Lumina Fashion products, services, and website features. By using this platform, you agree to be bound by these conditions.</p>
          <p>Product descriptions, pricing, and availability are subject to change without notice. Orders are accepted when confirmation is issued by our system.</p>
          <p>You agree not to misuse communications, automated crawling tools, or account access. Lumina may suspend or terminate access when misuse is detected.</p>
          <p>All intellectual property, including imagery, copy, and design elements, remains protected under applicable copyright and brand protection statutes.</p>
        </div>
      </div>
    </div>
  );
}
