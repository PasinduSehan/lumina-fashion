import React from 'react';

const sizeRows = [
  ['XS', '0-2', '28-30', '32-34'],
  ['S', '4-6', '30-32', '34-36'],
  ['M', '8-10', '32-34', '36-38'],
  ['L', '12-14', '34-36', '38-40'],
  ['XL', '16-18', '36-38', '40-42']
];

export default function SizeGuide() {
  return (
    <div className="animate-fade-in" style={{ paddingTop: '120px', paddingBottom: '80px' }}>
      <div className="container">
        <div style={{ marginBottom: '28px' }}>
          <p style={{ fontSize: '11px', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>FIT REFERENCE</p>
          <h1 style={{ fontSize: '38px', fontWeight: 300, letterSpacing: '-0.02em', textTransform: 'uppercase', marginTop: '10px' }}>Size Guide</h1>
          <p style={{ maxWidth: '760px', color: 'var(--text-secondary)', lineHeight: '1.7', fontSize: '15px', marginTop: '12px' }}>
            Use this chart as a general fit guide. For best results, measure at the chest, waist, and hips, then compare to the chart below.
          </p>
        </div>

        <div style={{ border: '1px solid var(--border-light)', overflow: 'hidden', backgroundColor: 'var(--bg-primary)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                <th style={{ padding: '14px', textAlign: 'left', borderBottom: '1px solid var(--border-light)' }}>Size</th>
                <th style={{ padding: '14px', textAlign: 'left', borderBottom: '1px solid var(--border-light)' }}>US</th>
                <th style={{ padding: '14px', textAlign: 'left', borderBottom: '1px solid var(--border-light)' }}>Chest</th>
                <th style={{ padding: '14px', textAlign: 'left', borderBottom: '1px solid var(--border-light)' }}>Waist</th>
              </tr>
            </thead>
            <tbody>
              {sizeRows.map((row) => (
                <tr key={row[0]} style={{ borderBottom: '1px solid var(--border-light)' }}>
                  {row.map((cell) => (
                    <td key={cell} style={{ padding: '14px', color: 'var(--text-primary)' }}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: '24px', padding: '20px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-light)' }}>
          <h2 style={{ fontSize: '14px', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '10px' }}>Need help?</h2>
          <p style={{ fontSize: '13px', lineHeight: '1.7', color: 'var(--text-secondary)' }}>
            If you are unsure about fit, contact our styling concierge for personalized recommendations before ordering.
          </p>
        </div>
      </div>
    </div>
  );
}
