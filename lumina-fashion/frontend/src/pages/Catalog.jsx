import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Filter, X, ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';

export default function Catalog({ currentPath, setPath }) {
  const { API_URL } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Accordion Toggle States for Sidebar Filters
  const [openSections, setOpenSections] = useState({
    categories: true,
    availability: true,
    size: true,
    color: true,
    price: true
  });

  const toggleSection = (section) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Extract query parameters from paths like "/catalog?category=Outerwear&search=wool"
  const getQueryParams = () => {
    const params = {};
    const queryIndex = currentPath.indexOf('?');
    if (queryIndex === -1) return params;

    const queryString = currentPath.substring(queryIndex + 1);
    const pairs = queryString.split('&');
    
    for (const pair of pairs) {
      const [key, value] = pair.split('=');
      if (key) {
        params[decodeURIComponent(key)] = decodeURIComponent(value || '');
      }
    }
    return params;
  };

  const queryParams = getQueryParams();
  const activeCategory = queryParams.category || '';
  const activeSearch = queryParams.search || '';
  const activeSort = queryParams.sort || '';
  const activeMinPrice = queryParams.minPrice || '';
  const activeMaxPrice = queryParams.maxPrice || '';
  const activeAvailability = queryParams.availability || '';
  const activeSize = queryParams.size || '';
  const activeColor = queryParams.color || '';

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let url = `${API_URL}/products?`;
        if (activeCategory) url += `category=${encodeURIComponent(activeCategory)}&`;
        if (activeSearch) url += `search=${encodeURIComponent(activeSearch)}&`;
        if (activeSort) url += `sort=${encodeURIComponent(activeSort)}&`;
        if (activeMinPrice) url += `minPrice=${encodeURIComponent(activeMinPrice)}&`;
        if (activeMaxPrice) url += `maxPrice=${encodeURIComponent(activeMaxPrice)}&`;
        if (activeAvailability) url += `availability=${encodeURIComponent(activeAvailability)}&`;
        if (activeSize) url += `size=${encodeURIComponent(activeSize)}&`;
        if (activeColor) url += `color=${encodeURIComponent(activeColor)}&`;

        const res = await fetch(url);
        if (!res.ok) throw new Error('Could not fetch catalog items.');
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [activeCategory, activeSearch, activeSort, activeMinPrice, activeMaxPrice, activeAvailability, activeSize, activeColor, API_URL]);

  const updateFilters = (newParams) => {
    const merged = { ...queryParams, ...newParams };
    
    // Clean up empty params
    Object.keys(merged).forEach(key => {
      if (merged[key] === undefined || merged[key] === null || merged[key] === '') {
        delete merged[key];
      }
    });

    const queryString = Object.entries(merged)
      .map(([key, val]) => `${encodeURIComponent(key)}=${encodeURIComponent(val)}`)
      .join('&');

    setPath(`/catalog${queryString ? '?' + queryString : ''}`);
  };

  const clearAllFilters = () => {
    setPath('/catalog');
  };

  // Filter Options Data
  const categories = [
    { label: 'ALL COLLECTIONS', value: '' },
    { label: 'OFFICE WEAR', value: 'Office Wear' },
    { label: 'TOPS', value: 'Tops' },
    { label: 'DRESSES', value: 'Dresses' },
    { label: 'PANTS', value: 'Pants' },
    { label: 'SKIRTS', value: 'Skirts' },
    { label: 'OUTERWEAR', value: 'Outerwear' },
    { label: 'KNITWEAR', value: 'Knitwear' },
    { label: 'SHOES', value: 'Shoes' },
    { label: 'ACCESSORIES', value: 'Accessories' },
    { label: 'GIFT VOUCHERS', value: 'Gift Vouchers' }
  ];

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'One Size', '30', '32', '34', '36', '38', '40', '42', '41', '43', '45'];
  
  const colors = [
    { name: 'Black', hex: '#0F0F0F' },
    { name: 'White', hex: '#FFFFFF', border: true },
    { name: 'Navy', hex: '#0A192F' },
    { name: 'Grey', hex: '#808080' },
    { name: 'Beige', hex: '#F5F5DC', border: true },
    { name: 'Gold', hex: '#C5A880' },
    { name: 'Red', hex: '#8B0000' },
    { name: 'Green', hex: '#1E4620' },
    { name: 'Camel', hex: '#C19A6B' },
    { name: 'Blue', hex: '#4682B4' },
    { name: 'Burgundy', hex: '#800020' },
    { name: 'Terracotta', hex: '#C2B280', border: true }
  ];

  const prices = [
    { label: 'All Prices', min: '', max: '' },
    { label: 'Under $100', min: '0', max: '100' },
    { label: '$100 - $250', min: '100', max: '250' },
    { label: '$250 - $500', min: '250', max: '500' },
    { label: 'Over $500', min: '500', max: '' }
  ];

  const currentPriceLabel = () => {
    if (!activeMinPrice && !activeMaxPrice) return 'All Prices';
    const matched = prices.find(p => p.min === activeMinPrice && p.max === activeMaxPrice);
    return matched ? matched.label : 'Custom Price';
  };

  return (
    <div className="container animate-fade-in" style={{ paddingTop: '120px', paddingBottom: '80px' }}>
      
      {/* Search Header Info */}
      {activeSearch && (
        <div style={{ marginBottom: '30px' }}>
          <span style={{ fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
            Search Results For
          </span>
          <h1 style={{ fontSize: '32px', fontWeight: 300, textTransform: 'uppercase', marginTop: '4px' }}>
            "{activeSearch}"
          </h1>
        </div>
      )}

      {/* Main Layout Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '260px 1fr',
        gap: '48px',
        alignItems: 'start'
      }} className="catalog-layout">
        
        {/* LEFT COLUMN: SIDEBAR FILTERS */}
        <aside style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          position: 'sticky',
          top: '110px',
          maxHeight: 'calc(100vh - 140px)',
          overflowY: 'auto',
          paddingRight: '10px',
          scrollbarGutter: 'stable'
        }}>
          {/* Sidebar Title & Reset */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid var(--border-light)',
            paddingBottom: '14px'
          }}>
            <h2 style={{ fontSize: '14px', letterSpacing: '0.1em', fontWeight: 600 }}>CATEGORIES & FILTERS</h2>
            {(activeCategory || activeMinPrice || activeMaxPrice || activeAvailability || activeSize || activeColor) && (
              <button 
                onClick={clearAllFilters}
                style={{ 
                  fontSize: '10px', 
                  color: 'var(--text-secondary)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '4px',
                  letterSpacing: '0.05em' 
                }}
              >
                <RotateCcw size={10} /> Reset
              </button>
            )}
          </div>

          {/* 1. CATEGORIES FILTER */}
          <div style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '16px' }}>
            <div 
              onClick={() => toggleSection('categories')} 
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', marginBottom: openSections.categories ? '12px' : 0 }}
            >
              <h3 style={{ fontSize: '11px', letterSpacing: '0.1em', color: 'var(--text-primary)', fontWeight: 600 }}>PRODUCT TYPE</h3>
              {openSections.categories ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </div>
            
            {openSections.categories && (
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
                {categories.map((cat) => (
                  <li key={cat.label}>
                    <span 
                      onClick={() => updateFilters({ category: cat.value })}
                      style={{ 
                        cursor: 'pointer', 
                        fontWeight: activeCategory === cat.value ? 600 : 400,
                        color: activeCategory === cat.value ? 'var(--text-primary)' : 'var(--text-secondary)',
                        textDecoration: activeCategory === cat.value ? 'underline' : 'none',
                        textUnderlineOffset: '4px'
                      }}
                    >
                      {cat.label}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* 2. AVAILABILITY FILTER */}
          <div style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '16px' }}>
            <div 
              onClick={() => toggleSection('availability')} 
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', marginBottom: openSections.availability ? '12px' : 0 }}
            >
              <h3 style={{ fontSize: '11px', letterSpacing: '0.1em', color: 'var(--text-primary)', fontWeight: 600 }}>AVAILABILITY</h3>
              {openSections.availability ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </div>

            {openSections.availability && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input 
                    type="radio" 
                    name="availability"
                    checked={activeAvailability === ''}
                    onChange={() => updateFilters({ availability: '' })}
                    style={{ accentColor: 'var(--bg-dark)' }}
                  />
                  <span>All Items</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input 
                    type="radio" 
                    name="availability"
                    checked={activeAvailability === 'in-stock'}
                    onChange={() => updateFilters({ availability: 'in-stock' })}
                    style={{ accentColor: 'var(--bg-dark)' }}
                  />
                  <span>In Stock</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input 
                    type="radio" 
                    name="availability"
                    checked={activeAvailability === 'out-of-stock'}
                    onChange={() => updateFilters({ availability: 'out-of-stock' })}
                    style={{ accentColor: 'var(--bg-dark)' }}
                  />
                  <span>Out of Stock</span>
                </label>
              </div>
            )}
          </div>

          {/* 3. SIZE FILTER */}
          <div style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '16px' }}>
            <div 
              onClick={() => toggleSection('size')} 
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', marginBottom: openSections.size ? '12px' : 0 }}
            >
              <h3 style={{ fontSize: '11px', letterSpacing: '0.1em', color: 'var(--text-primary)', fontWeight: 600 }}>SIZE</h3>
              {openSections.size ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </div>

            {openSections.size && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {sizes.map((s) => (
                  <button 
                    key={s}
                    onClick={() => updateFilters({ size: activeSize === s ? '' : s })}
                    style={{
                      border: '1px solid',
                      borderColor: activeSize === s ? 'var(--text-primary)' : 'var(--border-light)',
                      backgroundColor: activeSize === s ? 'var(--bg-dark)' : 'transparent',
                      color: activeSize === s ? 'var(--text-light)' : 'var(--text-primary)',
                      padding: '6px 10px',
                      fontSize: '11px',
                      fontWeight: activeSize === s ? 600 : 400,
                      minWidth: '38px',
                      textAlign: 'center'
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 4. COLOR FILTER */}
          <div style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '16px' }}>
            <div 
              onClick={() => toggleSection('color')} 
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', marginBottom: openSections.color ? '12px' : 0 }}
            >
              <h3 style={{ fontSize: '11px', letterSpacing: '0.1em', color: 'var(--text-primary)', fontWeight: 600 }}>COLOR</h3>
              {openSections.color ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </div>

            {openSections.color && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {colors.map((c) => (
                  <button 
                    key={c.name}
                    onClick={() => updateFilters({ color: activeColor === c.name ? '' : c.name })}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '4px 8px',
                      border: '1px solid',
                      borderColor: activeColor === c.name ? 'var(--text-primary)' : 'var(--border-light)',
                      backgroundColor: activeColor === c.name ? 'rgba(15, 15, 15, 0.04)' : 'transparent',
                      fontSize: '11px',
                      color: 'var(--text-primary)'
                    }}
                    title={c.name}
                  >
                    <span style={{
                      display: 'inline-block',
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      backgroundColor: c.hex,
                      border: c.border ? '1px solid #CCC' : 'none'
                    }} />
                    <span style={{ fontWeight: activeColor === c.name ? 600 : 400 }}>{c.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 5. PRICE FILTER */}
          <div style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '16px' }}>
            <div 
              onClick={() => toggleSection('price')} 
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', marginBottom: openSections.price ? '12px' : 0 }}
            >
              <h3 style={{ fontSize: '11px', letterSpacing: '0.1em', color: 'var(--text-primary)', fontWeight: 600 }}>PRICE</h3>
              {openSections.price ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </div>

            {openSections.price && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                {prices.map((p, idx) => (
                  <label key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input 
                      type="radio" 
                      name="price"
                      checked={activeMinPrice === p.min && activeMaxPrice === p.max}
                      onChange={() => updateFilters({ minPrice: p.min, maxPrice: p.max })}
                      style={{ accentColor: 'var(--bg-dark)' }}
                    />
                    <span>{p.label}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </aside>

        {/* RIGHT COLUMN: PRODUCT LISTING */}
        <main>
          {/* Catalog Top control / Sorter selection */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid var(--border-light)',
            paddingBottom: '20px',
            marginBottom: '40px',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            <div>
              <p style={{ fontSize: '11px', letterSpacing: '0.1em', color: 'var(--text-secondary)' }}>
                SHOWING <strong style={{ color: 'var(--text-primary)' }}>{products.length}</strong> PRODUCTS
              </p>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)', letterSpacing: '0.05em' }}>SORT BY:</span>
              <select 
                value={activeSort}
                onChange={(e) => updateFilters({ sort: e.target.value })}
                style={{
                  border: 'none',
                  backgroundColor: 'transparent',
                  fontFamily: 'var(--font-heading)',
                  fontSize: '11px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  outline: 'none',
                  cursor: 'pointer',
                  fontWeight: 600
                }}
              >
                <option value="">Default</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="newest">Newest Order</option>
              </select>
            </div>
          </div>

          {/* Product Grid Content */}
          {loading ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '40px 24px'
            }}>
              {[1, 2, 3, 4, 5, 6].map(n => (
                <div key={n} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ width: '100%', paddingBottom: '130%', backgroundColor: 'var(--bg-secondary)', borderRadius: '2px' }} />
                  <div style={{ height: '14px', width: '65%', backgroundColor: 'var(--bg-secondary)' }} />
                  <div style={{ height: '14px', width: '25%', backgroundColor: 'var(--bg-secondary)' }} />
                </div>
              ))}
            </div>
          ) : error ? (
            <p style={{ textAlign: 'center', color: 'var(--accent-red)', padding: '60px 0' }}>{error}</p>
          ) : products.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '100px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', letterSpacing: '0.05em' }}>
                NO PRODUCTS FOUND MATCHING THE SELECTED FILTER CRITERIA.
              </p>
              <button onClick={clearAllFilters} className="btn-secondary">
                Clear Filters
              </button>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '40px 24px'
            }}>
              {products.map((product) => (
                <div 
                  key={product.id} 
                  className="product-card"
                  onClick={() => setPath(`/product/${product.id}`)}
                >
                  <div className="product-image-container">
                    <img src={product.images[0]} alt={product.name} />
                    {product.stock === 0 && (
                      <span style={{
                        position: 'absolute',
                        top: '12px',
                        left: '12px',
                        backgroundColor: 'var(--bg-dark)',
                        color: 'var(--text-light)',
                        fontSize: '9px',
                        fontWeight: 600,
                        padding: '4px 8px',
                        letterSpacing: '0.05em'
                      }}>
                        SOLD OUT
                      </span>
                    )}
                  </div>
                  <div className="product-card-details">
                    <div className="product-card-info">
                      <h3 className="product-card-name">{product.name}</h3>
                      <span className="product-card-category">{product.category}</span>
                    </div>
                    <span className="product-card-price">${product.price.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>

      </div>

    </div>
  );
}
