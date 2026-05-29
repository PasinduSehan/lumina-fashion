import React, { useState, useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { CheckCircle2, ArrowRight } from 'lucide-react';

export default function Checkout({ setPath }) {
  const { cartItems, getSubtotal, clearCart } = useContext(CartContext);
  const { token, API_URL } = useContext(AuthContext);

  // Address State
  const [shippingName, setShippingName] = useState('');
  const [addressLine, setAddressLine] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('United States');

  // Credit Card State
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');

  // Process States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [orderConfirmed, setOrderConfirmed] = useState(null);

  const subtotal = getSubtotal();
  const shipping = subtotal > 200 || subtotal === 0 ? 0.00 : 15.00;
  const tax = subtotal * 0.08; // 8% sales tax estimate
  const total = subtotal + shipping + tax;

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    if (cartItems.length === 0) {
      setError('Your shopping bag is empty.');
      setIsSubmitting(false);
      return;
    }

    try {
      const shippingAddress = {
        name: shippingName,
        address_line: addressLine,
        city,
        state,
        postal_code: postalCode,
        country
      };

      const payload = {
        items: cartItems.map(item => ({
          product_id: item.product_id,
          size: item.size,
          color: item.color,
          quantity: item.quantity,
          price: item.price
        })),
        total_amount: total,
        shipping_address: shippingAddress,
        billing_address: shippingAddress
      };

      const headers = {
        'Content-Type': 'application/json'
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Checkout failed. Please check your inputs.');
      }

      // Success
      setOrderConfirmed(data.orderId);
      clearCart();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // If order was just placed successfully, display Premium Order Confirmation page
  if (orderConfirmed) {
    return (
      <div className="container animate-fade-in" style={{
        paddingTop: '160px',
        minHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '24px'
      }}>
        <CheckCircle2 size={64} style={{ color: 'var(--accent-gold)' }} strokeWidth={1} />
        
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '12px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
            Transaction Complete
          </p>
          <h1 style={{ fontSize: '28px', letterSpacing: '0.05em', marginTop: '8px', textTransform: 'uppercase' }}>
            Thank you for your order
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '12px' }}>
            Your order number is <strong style={{ color: 'var(--text-primary)' }}>#LUM-{10000 + orderConfirmed}</strong>. We have sent a confirmation details invoice to your email.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
          <button onClick={() => setPath('/catalog')} className="btn-primary">
            Continue Shopping
          </button>
          {token && (
            <button onClick={() => setPath('/profile')} className="btn-secondary">
              View Order History
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="container animate-fade-in" style={{ paddingTop: '120px', minHeight: '85vh' }}>
      
      <h1 style={{ fontSize: '24px', letterSpacing: '0.1em', marginBottom: '40px' }}>SECURE CHECKOUT</h1>

      {error && (
        <div style={{
          backgroundColor: 'rgba(211, 47, 47, 0.08)',
          borderLeft: '3px solid var(--accent-red)',
          padding: '12px 16px',
          marginBottom: '32px',
          fontSize: '12px',
          color: 'var(--accent-red)'
        }}>
          {error}
        </div>
      )}

      {/* Main Grid: Forms / Order Summary */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.2fr 0.8fr',
        gap: '60px',
        alignItems: 'start'
      }}>
        
        {/* Left Side: Address and Payment Info Forms */}
        <form onSubmit={handleCheckoutSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
          
          {/* Shipping Address Block */}
          <div>
            <h3 style={{ fontSize: '14px', letterSpacing: '0.15em', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px', marginBottom: '24px' }}>
              1. SHIPPING DETAILS
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 500 }}>Recipient Name</label>
                <input 
                  type="text" 
                  required
                  value={shippingName}
                  onChange={(e) => setShippingName(e.target.value)}
                  style={{ padding: '12px', border: '1px solid var(--border-light)', backgroundColor: 'transparent', outline: 'none', fontSize: '13px' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 500 }}>Street Address</label>
                <input 
                  type="text" 
                  required
                  value={addressLine}
                  onChange={(e) => setAddressLine(e.target.value)}
                  style={{ padding: '12px', border: '1px solid var(--border-light)', backgroundColor: 'transparent', outline: 'none', fontSize: '13px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 500 }}>City</label>
                  <input 
                    type="text" 
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    style={{ padding: '12px', border: '1px solid var(--border-light)', backgroundColor: 'transparent', outline: 'none', fontSize: '13px' }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 500 }}>State / Region</label>
                  <input 
                    type="text" 
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    style={{ padding: '12px', border: '1px solid var(--border-light)', backgroundColor: 'transparent', outline: 'none', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 500 }}>ZIP / Postal Code</label>
                  <input 
                    type="text" 
                    required
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    style={{ padding: '12px', border: '1px solid var(--border-light)', backgroundColor: 'transparent', outline: 'none', fontSize: '13px' }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 500 }}>Country</label>
                  <input 
                    type="text" 
                    required
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    style={{ padding: '12px', border: '1px solid var(--border-light)', backgroundColor: 'transparent', outline: 'none', fontSize: '13px' }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Payment Details Block */}
          <div>
            <h3 style={{ fontSize: '14px', letterSpacing: '0.15em', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px', marginBottom: '24px' }}>
              2. PAYMENT DETAILS
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 500 }}>Card Number</label>
                <input 
                  type="text" 
                  required
                  placeholder="•••• •••• •••• ••••"
                  maxLength={19}
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  style={{ padding: '12px', border: '1px solid var(--border-light)', backgroundColor: 'transparent', outline: 'none', fontSize: '13px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 500 }}>Expiry Date</label>
                  <input 
                    type="text" 
                    required
                    placeholder="MM / YY"
                    maxLength={5}
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    style={{ padding: '12px', border: '1px solid var(--border-light)', backgroundColor: 'transparent', outline: 'none', fontSize: '13px' }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 500 }}>CVV</label>
                  <input 
                    type="password" 
                    required
                    placeholder="•••"
                    maxLength={4}
                    value={cardCvc}
                    onChange={(e) => setCardCvc(e.target.value)}
                    style={{ padding: '12px', border: '1px solid var(--border-light)', backgroundColor: 'transparent', outline: 'none', fontSize: '13px' }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Trigger */}
          <button 
            type="submit" 
            className="btn-primary" 
            disabled={isSubmitting}
            style={{ width: '100%', padding: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
          >
            {isSubmitting ? 'PROCESSING TRANSACTION...' : `PLACE ORDER • $${total.toFixed(2)}`}
            <ArrowRight size={16} />
          </button>

        </form>

        {/* Right Side: Order Summary Panel */}
        <div style={{
          backgroundColor: 'var(--bg-secondary)',
          padding: '40px 30px',
          border: '1px solid var(--border-light)',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px'
        }}>
          <h3 style={{ fontSize: '14px', letterSpacing: '0.1em', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>
            ORDER SUMMARY
          </h3>

          {/* Items Summary list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '250px', overflowY: 'auto', paddingRight: '4px' }}>
            {cartItems.map((item, index) => (
              <div key={index} style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <div style={{ width: '50px', height: '65px', flexShrink: 0, overflow: 'hidden', backgroundColor: 'var(--bg-primary)' }}>
                  <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h4 style={{ fontSize: '12px', textTransform: 'uppercase', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</h4>
                  <p style={{ fontSize: '10px', color: 'var(--text-secondary)', marginTop: '2px', textTransform: 'uppercase' }}>
                    Size: {item.size} / Qty: {item.quantity}
                  </p>
                </div>
                <span style={{ fontSize: '13px', fontWeight: 500 }}>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          {/* Pricing breakdown */}
          <div style={{
            borderTop: '1px solid var(--border-light)',
            paddingTop: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            fontSize: '13px',
            color: 'var(--text-secondary)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Subtotal</span>
              <span style={{ color: 'var(--text-primary)' }}>${subtotal.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Shipping</span>
              <span style={{ color: 'var(--text-primary)' }}>
                {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Estimated Tax (8%)</span>
              <span style={{ color: 'var(--text-primary)' }}>${tax.toFixed(2)}</span>
            </div>
            
            <div style={{
              borderTop: '1px solid var(--border-light)',
              paddingTop: '16px',
              marginTop: '4px',
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '16px',
              fontWeight: 600,
              color: 'var(--text-primary)'
            }}>
              <span>Total Amount</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
          
        </div>

      </div>

    </div>
  );
}
