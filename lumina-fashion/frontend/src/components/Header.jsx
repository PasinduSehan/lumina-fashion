import React, { useState, useContext } from 'react';
import { ShoppingBag, User, Search, X, Plus, Minus, Trash2 } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

export default function Header({ currentPath, setPath }) {
  const { user, logout } = useContext(AuthContext);
  const { cartItems, updateQuantity, removeFromCart, getSubtotal, getCartCount } = useContext(CartContext);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setIsSearchOpen(false);
    // Direct to catalog with search param
    setPath(`/catalog?search=${encodeURIComponent(searchQuery)}`);
  };

  const navigateTo = (path) => {
    setPath(path);
    setIsCartOpen(false);
    setIsSearchOpen(false);
    setIsUserMenuOpen(false);
  };

  return (
    <>
      {/* Navigation Bar */}
      <header className="glass-nav">
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          
          {/* Logo */}
          <div 
            onClick={() => navigateTo('/')} 
            style={{ 
              fontFamily: 'var(--font-heading)', 
              fontSize: '22px', 
              fontWeight: 700, 
              letterSpacing: '0.15em', 
              cursor: 'pointer',
              textTransform: 'uppercase'
            }}
          >
            LUMINA
          </div>

          {/* Navigation Links */}
          <nav style={{ 
            display: 'flex', 
            gap: '16px', 
            textTransform: 'uppercase', 
            fontSize: '11px', 
            letterSpacing: '0.08em',
            flexWrap: 'wrap',
            justifyContent: 'center',
            maxWidth: '65%',
            lineHeight: '1.8'
          }}>
            <span onClick={() => navigateTo('/')} style={{ cursor: 'pointer', fontWeight: currentPath === '/' ? 600 : 400 }}>Home</span>
            <span onClick={() => navigateTo('/about')} style={{ cursor: 'pointer', fontWeight: currentPath === '/about' ? 600 : 400 }}>About</span>
            <span onClick={() => navigateTo('/catalog')} style={{ cursor: 'pointer', fontWeight: currentPath === '/catalog' && !window.location.search ? 600 : 400 }}>Shop All</span>
            <span onClick={() => navigateTo('/catalog?category=Outerwear')} style={{ cursor: 'pointer', fontWeight: currentPath.includes('category=Outerwear') ? 600 : 400 }}>Outerwear</span>
            <span onClick={() => navigateTo('/catalog?category=Knitwear')} style={{ cursor: 'pointer', fontWeight: currentPath.includes('category=Knitwear') ? 600 : 400 }}>Knitwear</span>
            <span onClick={() => navigateTo('/catalog?category=Office%20Wear')} style={{ cursor: 'pointer', fontWeight: currentPath.includes('category=Office%20Wear') ? 600 : 400 }}>Office Wear</span>
            <span onClick={() => navigateTo('/catalog?category=Tops')} style={{ cursor: 'pointer', fontWeight: currentPath.includes('category=Tops') ? 600 : 400 }}>Tops</span>
            <span onClick={() => navigateTo('/catalog?category=Dresses')} style={{ cursor: 'pointer', fontWeight: currentPath.includes('category=Dresses') ? 600 : 400 }}>Dresses</span>
            <span onClick={() => navigateTo('/catalog?category=Pants')} style={{ cursor: 'pointer', fontWeight: currentPath.includes('category=Pants') ? 600 : 400 }}>Pants</span>
            <span onClick={() => navigateTo('/catalog?category=Skirts')} style={{ cursor: 'pointer', fontWeight: currentPath.includes('category=Skirts') ? 600 : 400 }}>Skirts</span>
            <span onClick={() => navigateTo('/catalog?category=Gift%20Vouchers')} style={{ cursor: 'pointer', fontWeight: currentPath.includes('category=Gift%20Vouchers') ? 600 : 400 }}>Gift Vouchers</span>
          </nav>

          {/* Icons Menu */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            
            {/* Search Trigger */}
            <button onClick={() => setIsSearchOpen(true)} aria-label="Search" style={{ color: 'var(--text-primary)' }}>
              <Search size={18} />
            </button>

            {/* Profile Menu */}
            <div style={{ position: 'relative' }}>
              <button 
                onClick={() => user ? setIsUserMenuOpen(!isUserMenuOpen) : navigateTo('/auth')} 
                aria-label="User profile" 
                style={{ color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <User size={18} />
                {user && <span style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: 500 }}>{user.name.split(' ')[0]}</span>}
              </button>

              {user && isUserMenuOpen && (
                <div style={{
                  position: 'absolute',
                  top: '30px',
                  right: 0,
                  backgroundColor: 'var(--bg-primary)',
                  border: '1px solid var(--border-light)',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  width: '180px',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
                  zIndex: 1010
                }}>
                  {user.role === 'admin' && (
                    <span onClick={() => navigateTo('/admin')} style={{ cursor: 'pointer', fontSize: '12px', textTransform: 'uppercase', fontWeight: 600, color: 'var(--accent-gold)' }}>Admin Panel</span>
                  )}
                  <span onClick={() => navigateTo('/profile')} style={{ cursor: 'pointer', fontSize: '12px', textTransform: 'uppercase' }}>My Profile</span>
                  <span onClick={() => { logout(); navigateTo('/'); }} style={{ cursor: 'pointer', fontSize: '12px', textTransform: 'uppercase', color: 'var(--accent-red)' }}>Sign Out</span>
                </div>
              )}
            </div>

            {/* Cart Trigger */}
            <button 
              onClick={() => setIsCartOpen(true)} 
              aria-label="Shopping bag" 
              style={{ color: 'var(--text-primary)', position: 'relative' }}
            >
              <ShoppingBag size={18} />
              {getCartCount() > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '-8px',
                  backgroundColor: 'var(--bg-dark)',
                  color: 'var(--text-light)',
                  fontSize: '9px',
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 600
                }}>
                  {getCartCount()}
                </span>
              )}
            </button>

          </div>

        </div>
      </header>

      {/* Search Overlay */}
      {isSearchOpen && (
        <div className="animate-fade-in" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'var(--bg-glass)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          zIndex: 1200,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <button 
            onClick={() => setIsSearchOpen(false)} 
            style={{ position: 'absolute', top: '24px', right: '40px', color: 'var(--text-primary)' }}
          >
            <X size={24} />
          </button>
          
          <form onSubmit={handleSearchSubmit} style={{ width: '100%', maxWidth: '600px', padding: '0 20px' }}>
            <input 
              type="text" 
              placeholder="SEARCH PRODUCTS..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
              style={{
                width: '100%',
                backgroundColor: 'transparent',
                border: 'none',
                borderBottom: '2px solid var(--text-primary)',
                fontFamily: 'var(--font-heading)',
                fontSize: '28px',
                fontWeight: 300,
                color: 'var(--text-primary)',
                padding: '16px 0',
                outline: 'none',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}
            />
            <div style={{ marginTop: '12px', fontSize: '11px', color: 'var(--text-secondary)', letterSpacing: '0.1em' }}>
              PRESS ENTER TO SEARCH
            </div>
          </form>
        </div>
      )}

      {/* Slide-out Cart Drawer */}
      <div className={`drawer-overlay ${isCartOpen ? 'open' : ''}`} onClick={() => setIsCartOpen(false)}>
        <div className="drawer-content" onClick={(e) => e.stopPropagation()}>
          
          {/* Drawer Header */}
          <div style={{
            padding: '24px 40px',
            borderBottom: '1px solid var(--border-light)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <h3 style={{ fontSize: '16px', letterSpacing: '0.1em' }}>YOUR BAG ({getCartCount()})</h3>
            <button onClick={() => setIsCartOpen(false)} style={{ color: 'var(--text-primary)' }}>
              <X size={20} />
            </button>
          </div>

          {/* Drawer Body - Items */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '40px' }}>
            {cartItems.length === 0 ? (
              <div style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '24px'
              }}>
                <ShoppingBag size={48} strokeWidth={1} style={{ color: 'var(--text-secondary)' }} />
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', letterSpacing: '0.05em' }}>
                  YOUR SHOPPING BAG IS EMPTY.
                </p>
                <button 
                  onClick={() => navigateTo('/catalog')} 
                  className="btn-secondary"
                  style={{ width: '100%' }}
                >
                  SHOP NEW ARRIVALS
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                {cartItems.map((item, index) => (
                  <div key={`${item.product_id}-${item.size}-${item.color}`} style={{ display: 'flex', gap: '20px' }}>
                    {/* Item Image */}
                    <div style={{ width: '90px', height: '117px', flexShrink: 0, backgroundColor: 'var(--bg-secondary)', overflow: 'hidden' }}>
                      <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>

                    {/* Item Details */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <h4 style={{ fontSize: '13px', letterSpacing: '0.05em', fontWeight: 500, textTransform: 'uppercase', maxWidth: '180px' }}>
                            {item.name}
                          </h4>
                          <span style={{ fontSize: '14px', fontWeight: 500 }}>${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                        <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px', textTransform: 'uppercase' }}>
                          Size: {item.size} / Color: {item.color}
                        </p>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        {/* Quantity Selector */}
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          border: '1px solid var(--border-light)',
                          padding: '4px 8px'
                        }}>
                          <button onClick={() => updateQuantity(item.product_id, item.size, item.color, item.quantity - 1)} style={{ padding: '4px' }}>
                            <Minus size={12} />
                          </button>
                          <span style={{ fontSize: '12px', width: '28px', textAlign: 'center' }}>{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.product_id, item.size, item.color, item.quantity + 1)} style={{ padding: '4px' }}>
                            <Plus size={12} />
                          </button>
                        </div>

                        {/* Remove Button */}
                        <button 
                          onClick={() => removeFromCart(item.product_id, item.size, item.color)} 
                          style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Drawer Footer - Totals & Actions */}
          {cartItems.length > 0 && (
            <div style={{
              padding: '30px 40px',
              borderTop: '1px solid var(--border-light)',
              backgroundColor: 'var(--bg-secondary)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <span style={{ fontSize: '13px', letterSpacing: '0.15em', fontWeight: 500 }}>SUBTOTAL</span>
                <span style={{ fontSize: '16px', fontWeight: 600 }}>${getSubtotal().toFixed(2)}</span>
              </div>
              <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '24px' }}>
                Shipping and taxes calculated at checkout.
              </p>
              <button 
                onClick={() => navigateTo('/checkout')} 
                className="btn-primary" 
                style={{ width: '100%', textAlign: 'center' }}
              >
                PROCEED TO CHECKOUT
              </button>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
