import React from 'react';

export default function RefundPolicy() {
  return (
    <div className="animate-fade-in" style={{ paddingTop: '120px', paddingBottom: '80px' }}>
      <div className="container">
        <div style={{ marginBottom: '24px' }}>
          <p style={{ fontSize: '11px', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>THE DETAILS</p>
          <h1 style={{ fontSize: '38px', fontWeight: 300, letterSpacing: '-0.02em', textTransform: 'uppercase', marginTop: '10px' }}>Refund Policy</h1>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', color: 'var(--text-secondary)', lineHeight: '1.8', fontSize: '14px' }}>
          <p>Eligible products can be returned within 30 days of delivery for a refund or exchange, provided the item is unused and returned with its original packaging.</p>
          <p>Damaged, defective, or incorrect items are eligible for replacement or full refund once inspected by our client relations team.</p>
          <p>Refunds are processed back to the original payment method once the return has been received and approved.</p>
          <p>Custom or final-sale items may not be eligible for return unless otherwise specified at the time of purchase.</p>
        </div>
      </div>
    </div>
  );
}
