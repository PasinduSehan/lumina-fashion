import React, { useState, useEffect, useContext } from 'react';
import { ChevronDown, ChevronUp, ShoppingBag, ArrowLeft } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

export default function ProductDetail({ currentPath, setPath }) {
  const { API_URL } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // States for user selections
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isAccordionOpen, setIsAccordionOpen] = useState({ details: true, delivery: false });
  const [isAdded, setIsAdded] = useState(false);

  // Extract ID from path: "/product/:id"
  const productId = currentPath.split('/').pop();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/products/${productId}`);
        if (!res.ok) throw new Error('Product details could not be found.');
        const data = await res.json();
        setProduct(data);
        
        // Auto-select first options
        if (data.sizes.length > 0) setSelectedSize(data.sizes[0]);
        if (data.colors.length > 0) setSelectedColor(data.colors[0]);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (productId) fetchProduct();
  }, [productId, API_URL]);

  const handleAddToBag = () => {
    if (!selectedSize || !selectedColor) return;

    addToCart(product, 1, selectedSize, selectedColor);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const toggleAccordion = (section) => {
    setIsAccordionOpen(prev => ({ ...prev, [section]: !prev[section] }));
  };

  if (loading) {
    return (
      <div className="container animate-fade-in" style={{ paddingTop: '120px', minHeight: '80vh' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '60px' }}>
          <div style={{ paddingBottom: '130%', backgroundColor: 'var(--bg-secondary)', borderRadius: '2px' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ height: '30px', width: '70%', backgroundColor: 'var(--bg-secondary)' }} />
            <div style={{ height: '20px', width: '30%', backgroundColor: 'var(--bg-secondary)' }} />
            <div style={{ height: '100px', width: '100%', backgroundColor: 'var(--bg-secondary)' }} />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container" style={{ paddingTop: '120px', textAlign: 'center', minHeight: '80vh' }}>
        <p style={{ color: 'var(--accent-red)', marginBottom: '20px' }}>{error}</p>
        <button onClick={() => setPath('/catalog')} className="btn-secondary">
          Back to Shop
        </button>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="container animate-fade-in" style={{ paddingTop: '120px' }}>
      
      {/* Back link */}
      <button 
        onClick={() => setPath('/catalog')} 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px', 
          fontSize: '11px', 
          letterSpacing: '0.15em', 
          textTransform: 'uppercase', 
          color: 'var(--text-secondary)',
          marginBottom: '40px' 
        }}
      >
        <ArrowLeft size={14} /> Back to Catalog
      </button>

      {/* Grid Layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.1fr 0.9fr',
        gap: '80px',
        alignItems: 'start',
        position: 'relative'
      }}>
        
        {/* Left Side: Images */}
        <div style={{ display: 'flex', gap: '24px' }}>
          {/* Thumbnails list if multiple images exist */}
          {product.images.length > 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '80px', flexShrink: 0 }}>
              {product.images.map((img, i) => (
                <div 
                  key={i} 
                  onClick={() => setActiveImageIndex(i)}
                  style={{ 
                    width: '100%', 
                    paddingBottom: '130%', 
                    position: 'relative',
                    cursor: 'pointer',
                    border: activeImageIndex === i ? '1px solid var(--text-primary)' : '1px solid transparent',
                    transition: 'var(--transition-smooth)'
                  }}
                >
                  <img src={img} alt="" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          )}

          {/* Main Showcase Image */}
          <div style={{ 
            flex: 1, 
            paddingBottom: '130%', 
            position: 'relative', 
            overflow: 'hidden', 
            backgroundColor: 'var(--bg-secondary)',
            boxShadow: '0 4px 30px rgba(0,0,0,0.02)'
          }}>
            <img 
              src={product.images[activeImageIndex]} 
              alt={product.name} 
              style={{ 
                position: 'absolute', 
                top: 0, 
                left: 0, 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover' 
              }} 
            />
          </div>
        </div>

        {/* Right Side: details Panel */}
        <div style={{ position: 'sticky', top: '110px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {/* Product Header */}
          <div>
            <span style={{ fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
              {product.category}
            </span>
            
            <h1 style={{ 
              fontSize: '32px', 
              fontWeight: 400, 
              letterSpacing: '-0.01em', 
              marginTop: '8px', 
              marginBottom: '12px' 
            }}>
              {product.name}
            </h1>
            
            <span style={{ fontSize: '20px', fontWeight: 500 }}>
              ${product.price.toFixed(2)}
            </span>
          </div>

          {/* Description */}
          <p style={{ 
            fontSize: '14px', 
            lineHeight: '1.7', 
            color: 'var(--text-secondary)',
            fontWeight: 300 
          }}>
            {product.description}
          </p>

          {/* Options Selectors */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Color Selector */}
            {product.colors.length > 0 && (
              <div>
                <span style={{ fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: '12px', fontWeight: 500 }}>
                  COLOR: {selectedColor}
                </span>
                <div style={{ display: 'flex', gap: '12px' }}>
                  {product.colors.map(col => (
                    <button
                      key={col}
                      onClick={() => setSelectedColor(col)}
                      style={{
                        padding: '8px 16px',
                        border: selectedColor === col ? '1px solid var(--text-primary)' : '1px solid var(--border-light)',
                        fontSize: '12px',
                        textTransform: 'uppercase',
                        backgroundColor: selectedColor === col ? 'var(--text-primary)' : 'transparent',
                        color: selectedColor === col ? 'var(--bg-primary)' : 'var(--text-primary)',
                      }}
                    >
                      {col}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selector */}
            {product.sizes.length > 0 && (
              <div>
                <span style={{ fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: '12px', fontWeight: 500 }}>
                  SIZE: {selectedSize}
                </span>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {product.sizes.map(sz => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      style={{
                        width: '50px',
                        height: '50px',
                        border: selectedSize === sz ? '1px solid var(--text-primary)' : '1px solid var(--border-light)',
                        fontSize: '13px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: selectedSize === sz ? 'var(--text-primary)' : 'transparent',
                        color: selectedSize === sz ? 'var(--bg-primary)' : 'var(--text-primary)',
                      }}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Action Trigger */}
          <div>
            <button 
              onClick={handleAddToBag}
              className="btn-primary" 
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', padding: '18px' }}
            >
              <ShoppingBag size={18} />
              {isAdded ? 'ADDED TO BAG' : 'ADD TO BAG'}
            </button>
          </div>

          {/* Collapsible Fabric and Care Details */}
          <div style={{ borderTop: '1px solid var(--border-light)', marginTop: '20px' }}>
            
            {/* Fabric Details */}
            <div style={{ borderBottom: '1px solid var(--border-light)' }}>
              <div 
                onClick={() => toggleAccordion('details')}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 0', cursor: 'pointer' }}
              >
                <span style={{ fontSize: '12px', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 500 }}>Fabric & Material Details</span>
                {isAccordionOpen.details ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>
              
              {isAccordionOpen.details && (
                <div style={{ paddingBottom: '20px', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6', fontWeight: 300 }}>
                  <p style={{ marginBottom: '8px' }}>100% natural, premium fiber construction. Sourced responsibly from sustainable mills in northern Italy.</p>
                  <ul style={{ paddingLeft: '20px' }}>
                    <li>Dry clean only / Mild process.</li>
                    <li>Do not bleach or tumble dry.</li>
                    <li>Iron low heat if necessary.</li>
                  </ul>
                </div>
              )}
            </div>

            {/* Delivery Info */}
            <div style={{ borderBottom: '1px solid var(--border-light)' }}>
              <div 
                onClick={() => toggleAccordion('delivery')}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 0', cursor: 'pointer' }}
              >
                <span style={{ fontSize: '12px', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 500 }}>Shipping & Returns</span>
                {isAccordionOpen.delivery ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>
              
              {isAccordionOpen.delivery && (
                <div style={{ paddingBottom: '20px', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6', fontWeight: 300 }}>
                  <p>Free express courier delivery on orders over $200. Orders are packaged in premium custom editorial boxes. Easy returns within 30 days of receipt.</p>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
