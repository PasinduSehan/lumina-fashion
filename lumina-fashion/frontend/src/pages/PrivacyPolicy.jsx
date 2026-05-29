import React from 'react';

export default function PrivacyPolicy() {
  return (
    <div className="animate-fade-in" style={{ paddingTop: '120px', paddingBottom: '80px' }}>
      <div className="container">
        <div style={{ marginBottom: '24px' }}>
          <p style={{ fontSize: '11px', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>THE DETAILS</p>
          <h1 style={{ fontSize: '38px', fontWeight: 300, letterSpacing: '-0.02em', textTransform: 'uppercase', marginTop: '10px' }}>Privacy Policy</h1>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', color: 'var(--text-secondary)', lineHeight: '1.8', fontSize: '14px' }}>
          <p>Lumina collects information needed to process orders, support account access, and improve personalized shopping experiences.</p>
          <p>We use secure infrastructure to store customer contact information, order history, and payment details. Sensitive payment data is handled by trusted payment processors.</p>
          <p>Personal information may be used to send order updates, product recommendations, and marketing communications with consent.</p>
          <p>You may update your account preferences or request data access by contacting client relations.</p>
        </div>
      </div>
    </div>
  );
}
