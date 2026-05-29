import React from 'react';

const faqSections = [
  {
    title: 'Order',
    items: [
      {
        question: 'How do I place an order?',
        answer: 'Browse the collection, select your size and color, and proceed to checkout. Orders are confirmed instantly and you will receive an order number in your email.'
      },
      {
        question: 'Can I change my order after it is placed?',
        answer: 'Orders can be updated before processing. Please contact client relations as soon as possible if you need to adjust your selection.'
      },
      {
        question: 'Do you offer gift packaging?',
        answer: 'Yes. Gift wrapping and a complimentary note are available at checkout for qualifying orders.'
      }
    ]
  },
  {
    title: 'Delivery',
    items: [
      {
        question: 'What delivery options are available?',
        answer: 'We offer express, standard, and white-glove delivery for select pieces. Delivery windows are displayed at checkout.'
      },
      {
        question: 'Where do you ship?',
        answer: 'We ship across the United States and select international destinations. Shipping rates and timeframes are calculated during checkout.'
      },
      {
        question: 'How can I track my order?',
        answer: 'You will receive tracking details by email once the order ships. Track it in your order history or contact support for assistance.'
      }
    ]
  },
  {
    title: 'Return',
    items: [
      {
        question: 'What is your return policy?',
        answer: 'Unused pieces with their original packaging can be returned within 30 days of delivery for a refund or exchange.'
      },
      {
        question: 'How do I start a return?',
        answer: 'Visit your order page and select the item you want to return. Follow the instructions to schedule a pickup or drop-off.'
      },
      {
        question: 'Do you accept damaged items?',
        answer: 'Yes. If a product arrives damaged, we will replace or refund it once the item is inspected.'
      }
    ]
  }
];

export default function FAQ() {
  return (
    <div className="animate-fade-in" style={{ paddingTop: '120px', paddingBottom: '80px' }}>
      <div className="container">
        <div style={{ marginBottom: '36px' }}>
          <p style={{ fontSize: '11px', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>HELP CENTER</p>
          <h1 style={{ fontSize: '38px', fontWeight: 300, letterSpacing: '-0.02em', textTransform: 'uppercase', marginTop: '10px' }}>FAQ</h1>
          <p style={{ maxWidth: '760px', color: 'var(--text-secondary)', lineHeight: '1.7', fontSize: '15px', marginTop: '12px' }}>
            Answers to the most common questions about ordering, shipping, and returns.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {faqSections.map((section) => (
            <section key={section.title} style={{ border: '1px solid var(--border-light)', padding: '24px', backgroundColor: 'var(--bg-primary)' }}>
              <h2 style={{ fontSize: '16px', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '16px' }}>{section.title}</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {section.items.map((item) => (
                  <div key={item.question} style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>
                    <h3 style={{ fontSize: '14px', marginBottom: '8px', letterSpacing: '0.06em' }}>{item.question}</h3>
                    <p style={{ fontSize: '13px', lineHeight: '1.7', color: 'var(--text-secondary)' }}>{item.answer}</p>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
