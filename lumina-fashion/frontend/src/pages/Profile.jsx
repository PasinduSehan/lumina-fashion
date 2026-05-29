import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Package, Calendar, ChevronDown, ChevronUp } from 'lucide-react';

export default function Profile({ setPath }) {
  const { user, token, API_URL } = useContext(AuthContext);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  useEffect(() => {
    // Redirect if not authenticated
    if (!user && !token) {
      setPath('/auth');
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await fetch(`${API_URL}/orders`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (!res.ok) throw new Error('Could not retrieve orders list.');
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchOrders();
  }, [user, token, API_URL, setPath]);

  const toggleOrderExpand = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="container animate-fade-in" style={{ paddingTop: '120px', minHeight: '80vh' }}>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Loading your profile data...</p>
      </div>
    );
  }

  return (
    <div className="container animate-fade-in" style={{ paddingTop: '120px', minHeight: '85vh' }}>
      
      {/* Profile Header */}
      <div style={{
        borderBottom: '1px solid var(--border-light)',
        paddingBottom: '30px',
        marginBottom: '50px'
      }}>
        <span style={{ fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
          Client Dashboard
        </span>
        <h1 style={{ fontSize: '32px', fontWeight: 300, textTransform: 'uppercase', marginTop: '8px' }}>
          Welcome back, {user?.name}
        </h1>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
          Registered email: {user?.email}
        </p>
      </div>

      {/* Orders Section */}
      <div>
        <h2 style={{ fontSize: '18px', letterSpacing: '0.1em', marginBottom: '32px' }}>ORDER HISTORY ({orders.length})</h2>

        {error ? (
          <p style={{ color: 'var(--accent-red)' }}>{error}</p>
        ) : orders.length === 0 ? (
          <div style={{
            backgroundColor: 'var(--bg-secondary)',
            padding: '60px 40px',
            textAlign: 'center',
            border: '1px solid var(--border-light)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '20px'
          }}>
            <Package size={36} strokeWidth={1} style={{ color: 'var(--text-secondary)' }} />
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', letterSpacing: '0.05em' }}>
              YOU HAVE NOT PLACED ANY ORDERS YET.
            </p>
            <button onClick={() => setPath('/catalog')} className="btn-primary">
              Shop Collections
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {orders.map((order) => {
              const isOpen = expandedOrderId === order.id;
              return (
                <div 
                  key={order.id}
                  style={{
                    border: '1px solid var(--border-light)',
                    backgroundColor: 'var(--bg-secondary)',
                    transition: 'var(--transition-smooth)'
                  }}
                >
                  {/* Order Overview Header */}
                  <div 
                    onClick={() => toggleOrderExpand(order.id)}
                    style={{
                      padding: '24px 30px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      cursor: 'pointer',
                      flexWrap: 'wrap',
                      gap: '20px'
                    }}
                  >
                    <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
                      <div>
                        <span style={{ fontSize: '10px', color: 'var(--text-secondary)', display: 'block', letterSpacing: '0.05em' }}>ORDER NUMBER</span>
                        <span style={{ fontSize: '13px', fontWeight: 600 }}>#LUM-{10000 + order.id}</span>
                      </div>
                      <div>
                        <span style={{ fontSize: '10px', color: 'var(--text-secondary)', display: 'block', letterSpacing: '0.05em' }}>DATE PLACED</span>
                        <span style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Calendar size={12} /> {formatDate(order.created_at)}
                        </span>
                      </div>
                      <div>
                        <span style={{ fontSize: '10px', color: 'var(--text-secondary)', display: 'block', letterSpacing: '0.05em' }}>TOTAL AMOUNT</span>
                        <span style={{ fontSize: '13px', fontWeight: 600 }}>${order.total_amount.toFixed(2)}</span>
                      </div>
                      <div>
                        <span style={{ fontSize: '10px', color: 'var(--text-secondary)', display: 'block', letterSpacing: '0.05em' }}>STATUS</span>
                        <span style={{
                          fontSize: '11px',
                          textTransform: 'uppercase',
                          fontWeight: 600,
                          color: order.status === 'completed' ? 'green' : 'var(--text-primary)'
                        }}>
                          {order.status}
                        </span>
                      </div>
                    </div>

                    <button style={{ display: 'flex', alignItems: 'center' }}>
                      {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  </div>

                  {/* Order Items Expanded */}
                  {isOpen && (
                    <div style={{
                      padding: '30px',
                      borderTop: '1px solid var(--border-light)',
                      backgroundColor: 'var(--bg-primary)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '24px'
                    }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {order.items.map((item, idx) => (
                          <div key={idx} style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                            <div style={{ width: '60px', height: '78px', flexShrink: 0, backgroundColor: 'var(--bg-secondary)', overflow: 'hidden' }}>
                              <img src={item.product_images[0]} alt={item.product_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                            <div style={{ flex: 1 }}>
                              <h4 style={{ fontSize: '13px', textTransform: 'uppercase', fontWeight: 500 }}>{item.product_name}</h4>
                              <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px', textTransform: 'uppercase' }}>
                                Size: {item.size} / Color: {item.color}
                              </p>
                              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                                Qty: {item.quantity} × ${item.price.toFixed(2)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Delivery Details */}
                      <div style={{
                        borderTop: '1px solid var(--border-light)',
                        paddingTop: '20px',
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '40px',
                        fontSize: '12px',
                        color: 'var(--text-secondary)'
                      }}>
                        <div>
                          <h5 style={{ textTransform: 'uppercase', color: 'var(--text-primary)', marginBottom: '8px', fontSize: '11px', fontWeight: 600 }}>Shipping Address</h5>
                          <p>{order.shipping_address.name}</p>
                          <p>{order.shipping_address.address_line}</p>
                          <p>{order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postal_code}</p>
                          <p>{order.shipping_address.country}</p>
                        </div>
                        <div>
                          <h5 style={{ textTransform: 'uppercase', color: 'var(--text-primary)', marginBottom: '8px', fontSize: '11px', fontWeight: 600 }}>Shipping Method</h5>
                          <p>DHL Premium Express Delivery (Estimated 2-3 Business Days)</p>
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
