import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Package, ShoppingBag, Edit, Trash2, Plus, X, ChevronDown, ChevronUp, Calendar, DollarSign } from 'lucide-react';

export default function Admin({ setPath }) {
  const { user, token, API_URL } = useContext(AuthContext);

  // States
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' or 'products'
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(true);
  
  // Search & Filter States
  const [orderSearch, setOrderSearch] = useState('');
  const [productSearch, setProductSearch] = useState('');
  
  // Expanded states
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  // Modal / Form States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
  const [editingProductId, setEditingProductId] = useState(null);
  
  // Product Form Fields
  const [prodName, setProdName] = useState('');
  const [prodSku, setProdSku] = useState('');
  const [prodDescription, setProdDescription] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodCategory, setProdCategory] = useState('Outerwear');
  const [prodImages, setProdImages] = useState(''); // Comma-separated
  const [prodSizes, setProdSizes] = useState(''); // Comma-separated
  const [prodColors, setProdColors] = useState(''); // Comma-separated
  const [prodStock, setProdStock] = useState('');
  const [prodFeatured, setProdFeatured] = useState(false);
  
  const [formError, setFormError] = useState(null);
  const [formSuccess, setFormSuccess] = useState(null);
  const [globalError, setGlobalError] = useState(null);

  // Redirect if not admin
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      setPath('/auth');
    }
  }, [user, setPath]);

  // Fetch Orders
  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const res = await fetch(`${API_URL}/orders/all`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error('Failed to retrieve all customer orders.');
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      setGlobalError(err.message);
    } finally {
      setOrdersLoading(false);
    }
  };

  // Fetch Products
  const fetchProducts = async () => {
    setProductsLoading(true);
    try {
      const res = await fetch(`${API_URL}/products`);
      if (!res.ok) throw new Error('Failed to retrieve product catalog.');
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      setGlobalError(err.message);
    } finally {
      setProductsLoading(false);
    }
  };

  useEffect(() => {
    if (token && user?.role === 'admin') {
      fetchOrders();
      fetchProducts();
    }
  }, [token, user, API_URL]);

  // Update Order Status
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`${API_URL}/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update order status.');
      
      // Update state
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
      
      // Temporary inline success notification
      alert(`Order #LUM-${10000 + orderId} status updated to ${newStatus}`);
    } catch (err) {
      alert(err.message);
    }
  };

  // Open Modal for Create
  const openCreateModal = () => {
    setModalMode('create');
    setEditingProductId(null);
    setProdName('');
    setProdSku('');
    setProdDescription('');
    setProdPrice('');
    setProdCategory('Outerwear');
    setProdImages('');
    setProdSizes('S, M, L, XL');
    setProdColors('Black, Off-White');
    setProdStock('15');
    setProdFeatured(false);
    setFormError(null);
    setFormSuccess(null);
    setIsModalOpen(true);
  };

  // Open Modal for Edit
  const openEditModal = (product) => {
    setModalMode('edit');
    setEditingProductId(product.id);
    setProdName(product.name);
    setProdSku(product.sku);
    setProdDescription(product.description || '');
    setProdPrice(product.price.toString());
    setProdCategory(product.category);
    setProdImages(product.images.join(', '));
    setProdSizes(product.sizes.join(', '));
    setProdColors(product.colors.join(', '));
    setProdStock(product.stock.toString());
    setProdFeatured(product.featured || false);
    setFormError(null);
    setFormSuccess(null);
    setIsModalOpen(true);
  };

  // Delete Product
  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product from the inventory? This action is permanent.')) {
      return;
    }

    try {
      const res = await fetch(`${API_URL}/products/${productId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete product.');

      setProducts(prevProducts => prevProducts.filter(p => p.id !== productId));
      alert('Product deleted successfully.');
    } catch (err) {
      alert(err.message);
    }
  };

  // Submit Product Form (Create / Edit)
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    // Basic Validation
    if (!prodName || !prodSku || !prodPrice || !prodStock) {
      setFormError('Please fill out all required fields.');
      return;
    }

    const priceNum = parseFloat(prodPrice);
    const stockNum = parseInt(prodStock);

    if (isNaN(priceNum) || priceNum <= 0) {
      setFormError('Price must be a positive number.');
      return;
    }
    if (isNaN(stockNum) || stockNum < 0) {
      setFormError('Stock cannot be negative.');
      return;
    }

    // Process lists
    const imagesArr = prodImages.split(',').map(s => s.trim()).filter(Boolean);
    const sizesArr = prodSizes.split(',').map(s => s.trim()).filter(Boolean);
    const colorsArr = prodColors.split(',').map(s => s.trim()).filter(Boolean);

    if (imagesArr.length === 0) {
      // Add a fallback default image if none specified
      imagesArr.push('https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=600');
    }

    const payload = {
      name: prodName,
      sku: prodSku,
      description: prodDescription,
      price: priceNum,
      category: prodCategory,
      images: imagesArr,
      sizes: sizesArr,
      colors: colorsArr,
      stock: stockNum,
      featured: prodFeatured
    };

    try {
      let res, data;
      if (modalMode === 'create') {
        res = await fetch(`${API_URL}/products`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch(`${API_URL}/products/${editingProductId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
      }

      data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Submission failed.');

      // Refresh list
      await fetchProducts();
      setFormSuccess(modalMode === 'create' ? 'Product created successfully.' : 'Product updated successfully.');
      setTimeout(() => {
        setIsModalOpen(false);
      }, 1000);
    } catch (err) {
      setFormError(err.message);
    }
  };

  const toggleOrderExpand = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Filter lists
  const filteredOrders = orders.filter(order => 
    order.id.toString().includes(orderSearch) ||
    (order.user_email && order.user_email.toLowerCase().includes(orderSearch.toLowerCase())) ||
    (order.user_name && order.user_name.toLowerCase().includes(orderSearch.toLowerCase())) ||
    order.status.toLowerCase().includes(orderSearch.toLowerCase())
  );

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(productSearch.toLowerCase()) ||
    product.sku.toLowerCase().includes(productSearch.toLowerCase()) ||
    product.category.toLowerCase().includes(productSearch.toLowerCase())
  );

  return (
    <div className="container animate-fade-in" style={{ paddingTop: '120px', minHeight: '85vh', paddingBottom: '60px' }}>
      
      {/* Page Header */}
      <div style={{
        borderBottom: '1px solid var(--border-light)',
        paddingBottom: '24px',
        marginBottom: '40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div>
          <span style={{ fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--accent-gold)', fontWeight: 600 }}>
            Lumina Administrator Control Panel
          </span>
          <h1 style={{ fontSize: '32px', fontWeight: 300, textTransform: 'uppercase', marginTop: '8px' }}>
            System Dashboard
          </h1>
        </div>

        {/* Tab Controls */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            onClick={() => setActiveTab('orders')}
            className={activeTab === 'orders' ? 'btn-primary' : 'btn-secondary'}
            style={{ padding: '10px 20px', fontSize: '11px' }}
          >
            Manage Orders ({orders.length})
          </button>
          <button 
            onClick={() => setActiveTab('products')}
            className={activeTab === 'products' ? 'btn-primary' : 'btn-secondary'}
            style={{ padding: '10px 20px', fontSize: '11px' }}
          >
            Manage Products ({products.length})
          </button>
        </div>
      </div>

      {globalError && (
        <div style={{
          backgroundColor: 'rgba(211, 47, 47, 0.08)',
          borderLeft: '3px solid var(--accent-red)',
          padding: '12px 16px',
          marginBottom: '32px',
          fontSize: '12px',
          color: 'var(--accent-red)'
        }}>
          {globalError}
        </div>
      )}

      {/* ORDERS TAB */}
      {activeTab === 'orders' && (
        <div>
          {/* Filter Bar */}
          <div style={{ marginBottom: '24px', display: 'flex', gap: '16px' }}>
            <input 
              type="text" 
              placeholder="Search by Order ID, Client Email, Name, or Status..."
              value={orderSearch}
              onChange={(e) => setOrderSearch(e.target.value)}
              style={{
                flex: 1,
                padding: '12px 16px',
                border: '1px solid var(--border-light)',
                backgroundColor: 'transparent',
                outline: 'none',
                fontSize: '13px',
                fontFamily: 'var(--font-body)'
              }}
            />
          </div>

          {ordersLoading ? (
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Loading system order registry...</p>
          ) : filteredOrders.length === 0 ? (
            <div style={{
              backgroundColor: 'var(--bg-secondary)',
              padding: '60px 40px',
              textAlign: 'center',
              border: '1px solid var(--border-light)'
            }}>
              <ShoppingBag size={32} strokeWidth={1} style={{ color: 'var(--text-secondary)', marginBottom: '16px' }} />
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>NO CUSTOMER ORDERS RECORDED MATCHING THE CRITERIA.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {filteredOrders.map((order) => {
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
                    {/* Header Summary */}
                    <div 
                      onClick={() => toggleOrderExpand(order.id)}
                      style={{
                        padding: '20px 24px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        cursor: 'pointer',
                        flexWrap: 'wrap',
                        gap: '20px'
                      }}
                    >
                      <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
                        <div>
                          <span style={{ fontSize: '9px', color: 'var(--text-secondary)', display: 'block', letterSpacing: '0.05em' }}>ORDER ID</span>
                          <span style={{ fontSize: '13px', fontWeight: 600 }}>#LUM-{10000 + order.id}</span>
                        </div>
                        <div>
                          <span style={{ fontSize: '9px', color: 'var(--text-secondary)', display: 'block', letterSpacing: '0.05em' }}>CLIENT / BUYER</span>
                          <span style={{ fontSize: '13px', fontWeight: 500 }}>
                            {order.user_name || 'Guest Checkout'}
                            <span style={{ fontSize: '11px', color: 'var(--text-secondary)', marginLeft: '6px', fontWeight: 400 }}>
                              ({order.user_email || order.shipping_address.name})
                            </span>
                          </span>
                        </div>
                        <div>
                          <span style={{ fontSize: '9px', color: 'var(--text-secondary)', display: 'block', letterSpacing: '0.05em' }}>DATE PLACED</span>
                          <span style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Calendar size={11} /> {formatDate(order.created_at)}
                          </span>
                        </div>
                        <div>
                          <span style={{ fontSize: '9px', color: 'var(--text-secondary)', display: 'block', letterSpacing: '0.05em' }}>TOTAL</span>
                          <span style={{ fontSize: '13px', fontWeight: 600 }}>${order.total_amount.toFixed(2)}</span>
                        </div>
                      </div>

                      {/* Dropdown status update & chevron */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }} onClick={(e) => e.stopPropagation()}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '10px', color: 'var(--text-secondary)', letterSpacing: '0.05em' }}>STATUS:</span>
                          <select 
                            value={order.status}
                            onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                            style={{
                              border: '1px solid var(--border-light)',
                              backgroundColor: 'var(--bg-primary)',
                              padding: '6px 12px',
                              fontSize: '11px',
                              textTransform: 'uppercase',
                              fontWeight: 600,
                              outline: 'none',
                              cursor: 'pointer'
                            }}
                          >
                            <option value="pending">Pending</option>
                            <option value="shipped">Shipped</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </div>
                        <button onClick={() => toggleOrderExpand(order.id)}>
                          {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                      </div>
                    </div>

                    {/* Expanded details */}
                    {isOpen && (
                      <div style={{
                        padding: '24px',
                        borderTop: '1px solid var(--border-light)',
                        backgroundColor: 'var(--bg-primary)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '24px'
                      }}>
                        {/* Items list */}
                        <div>
                          <h4 style={{ fontSize: '11px', letterSpacing: '0.1em', marginBottom: '16px', color: 'var(--text-secondary)' }}>Purchased Items</h4>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {order.items.map((item, idx) => (
                              <div key={idx} style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                                <div style={{ width: '45px', height: '58px', flexShrink: 0, backgroundColor: 'var(--bg-secondary)', overflow: 'hidden' }}>
                                  <img src={item.product_images[0]} alt={item.product_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                                <div style={{ flex: 1 }}>
                                  <h5 style={{ fontSize: '12px', textTransform: 'uppercase', fontWeight: 500 }}>{item.product_name}</h5>
                                  <p style={{ fontSize: '10px', color: 'var(--text-secondary)', marginTop: '2px', textTransform: 'uppercase' }}>
                                    Size: {item.size} / Color: {item.color}
                                  </p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                  <span style={{ fontSize: '12px', fontWeight: 500 }}>{item.quantity} × ${item.price.toFixed(2)}</span>
                                  <span style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginTop: '2px' }}>${(item.quantity * item.price).toFixed(2)}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Customer Address Details */}
                        <div style={{
                          borderTop: '1px solid var(--border-light)',
                          paddingTop: '16px',
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr',
                          gap: '30px',
                          fontSize: '12px',
                          color: 'var(--text-secondary)'
                        }}>
                          <div>
                            <h5 style={{ textTransform: 'uppercase', color: 'var(--text-primary)', marginBottom: '6px', fontSize: '10px', fontWeight: 600 }}>Shipping Destination</h5>
                            <p style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{order.shipping_address.name}</p>
                            <p>{order.shipping_address.address_line}</p>
                            <p>{order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postal_code}</p>
                            <p>{order.shipping_address.country}</p>
                          </div>
                          <div>
                            <h5 style={{ textTransform: 'uppercase', color: 'var(--text-primary)', marginBottom: '6px', fontSize: '10px', fontWeight: 600 }}>Billing Information</h5>
                            <p style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{order.billing_address.name || order.shipping_address.name}</p>
                            <p>{order.billing_address.address_line || order.shipping_address.address_line}</p>
                            <p>{order.billing_address.city || order.shipping_address.city}, {order.billing_address.state || order.shipping_address.state} {order.billing_address.postal_code || order.shipping_address.postal_code}</p>
                            <p>{order.billing_address.country || order.shipping_address.country}</p>
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
      )}

      {/* PRODUCTS TAB */}
      {activeTab === 'products' && (
        <div>
          {/* Controls Bar */}
          <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
            <input 
              type="text" 
              placeholder="Search products by name, SKU, category..."
              value={productSearch}
              onChange={(e) => setProductSearch(e.target.value)}
              style={{
                flex: 1,
                minWidth: '280px',
                padding: '12px 16px',
                border: '1px solid var(--border-light)',
                backgroundColor: 'transparent',
                outline: 'none',
                fontSize: '13px',
                fontFamily: 'var(--font-body)'
              }}
            />
            <button 
              onClick={openCreateModal}
              className="btn-primary"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                fontSize: '12px'
              }}
            >
              <Plus size={14} /> Add Product
            </button>
          </div>

          {productsLoading ? (
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Loading catalog inventory...</p>
          ) : filteredProducts.length === 0 ? (
            <div style={{
              backgroundColor: 'var(--bg-secondary)',
              padding: '60px 40px',
              textAlign: 'center',
              border: '1px solid var(--border-light)'
            }}>
              <Package size={32} strokeWidth={1} style={{ color: 'var(--text-secondary)', marginBottom: '16px' }} />
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>NO CATALOG PRODUCTS IN INVENTORY MATCHING "{productSearch}".</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto', border: '1px solid var(--border-light)' }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                textAlign: 'left',
                fontSize: '13px'
              }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-light)' }}>
                    <th style={{ padding: '16px 20px', fontWeight: 600, textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.05em' }}>Item Details</th>
                    <th style={{ padding: '16px 20px', fontWeight: 600, textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.05em' }}>SKU</th>
                    <th style={{ padding: '16px 20px', fontWeight: 600, textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.05em' }}>Category</th>
                    <th style={{ padding: '16px 20px', fontWeight: 600, textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.05em' }}>Price</th>
                    <th style={{ padding: '16px 20px', fontWeight: 600, textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.05em' }}>Stock</th>
                    <th style={{ padding: '16px 20px', fontWeight: 600, textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.05em' }}>Featured</th>
                    <th style={{ padding: '16px 20px', fontWeight: 600, textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.05em', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((prod) => (
                    <tr 
                      key={prod.id} 
                      style={{ 
                        borderBottom: '1px solid var(--border-light)',
                        backgroundColor: 'var(--bg-primary)',
                        transition: 'background 0.2s'
                      }}
                    >
                      {/* Image + Name */}
                      <td style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ width: '40px', height: '52px', flexShrink: 0, overflow: 'hidden', backgroundColor: 'var(--bg-secondary)' }}>
                          <img src={prod.images[0]} alt={prod.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <div>
                          <span style={{ fontWeight: 600, display: 'block', textTransform: 'uppercase' }}>{prod.name}</span>
                          <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>ID: {prod.id}</span>
                        </div>
                      </td>
                      
                      <td style={{ padding: '16px 20px', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>{prod.sku}</td>
                      <td style={{ padding: '16px 20px', textTransform: 'uppercase', fontSize: '12px' }}>{prod.category}</td>
                      <td style={{ padding: '16px 20px', fontWeight: 600 }}>${prod.price.toFixed(2)}</td>
                      <td style={{ padding: '16px 20px' }}>
                        <span style={{
                          color: prod.stock <= 5 ? 'var(--accent-red)' : 'var(--text-primary)',
                          fontWeight: prod.stock <= 5 ? 600 : 400
                        }}>
                          {prod.stock} units
                        </span>
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <span style={{
                          fontSize: '11px',
                          textTransform: 'uppercase',
                          fontWeight: 600,
                          color: prod.featured ? 'var(--accent-gold)' : 'var(--text-secondary)'
                        }}>
                          {prod.featured ? 'Yes' : 'No'}
                        </span>
                      </td>
                      
                      {/* Actions */}
                      <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                          <button 
                            onClick={() => openEditModal(prod)}
                            title="Edit Product"
                            style={{ color: 'var(--text-secondary)' }}
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            onClick={() => handleDeleteProduct(prod.id)}
                            title="Delete Product"
                            style={{ color: 'var(--accent-red)' }}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* CREATE/EDIT PRODUCT MODAL */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0,0,0,0.4)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1500,
          padding: '20px'
        }} onClick={() => setIsModalOpen(false)}>
          
          <div style={{
            backgroundColor: 'var(--bg-primary)',
            width: '100%',
            maxWidth: '640px',
            maxHeight: '90vh',
            overflowY: 'auto',
            border: '1px solid var(--border-light)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
            display: 'flex',
            flexDirection: 'column'
          }} onClick={(e) => e.stopPropagation()}>
            
            {/* Modal Header */}
            <div style={{
              padding: '20px 30px',
              borderBottom: '1px solid var(--border-light)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h3 style={{ fontSize: '16px', letterSpacing: '0.05em' }}>
                {modalMode === 'create' ? 'ADD CATALOG PRODUCT' : 'EDIT CATALOG PRODUCT'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} style={{ color: 'var(--text-primary)' }}>
                <X size={20} />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleProductSubmit} style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {formError && (
                <div style={{
                  backgroundColor: 'rgba(211, 47, 47, 0.08)',
                  borderLeft: '3px solid var(--accent-red)',
                  padding: '12px 16px',
                  fontSize: '12px',
                  color: 'var(--accent-red)'
                }}>
                  {formError}
                </div>
              )}

              {formSuccess && (
                <div style={{
                  backgroundColor: 'rgba(76, 175, 80, 0.08)',
                  borderLeft: '3px solid green',
                  padding: '12px 16px',
                  fontSize: '12px',
                  color: 'green'
                }}>
                  {formSuccess}
                </div>
              )}

              {/* Grid block for details */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                
                {/* Product Name */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 600 }}>
                    Product Name *
                  </label>
                  <input 
                    type="text" 
                    required
                    value={prodName}
                    onChange={(e) => setProdName(e.target.value)}
                    style={{ padding: '10px', border: '1px solid var(--border-light)', backgroundColor: 'transparent', fontSize: '13px', outline: 'none' }}
                  />
                </div>

                {/* Product SKU */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 600 }}>
                    SKU Code *
                  </label>
                  <input 
                    type="text" 
                    required
                    placeholder="LF-CAT-XXX"
                    value={prodSku}
                    onChange={(e) => setProdSku(e.target.value)}
                    style={{ padding: '10px', border: '1px solid var(--border-light)', backgroundColor: 'transparent', fontSize: '13px', outline: 'none' }}
                  />
                </div>

              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                
                {/* Category Select */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 600 }}>
                    Category *
                  </label>
                  <select 
                    value={prodCategory}
                    onChange={(e) => setProdCategory(e.target.value)}
                    style={{ 
                      padding: '10px', 
                      border: '1px solid var(--border-light)', 
                      backgroundColor: 'var(--bg-primary)', 
                      fontSize: '13px', 
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="Outerwear">Outerwear</option>
                    <option value="Knitwear">Knitwear</option>
                    <option value="Trousers">Trousers</option>
                    <option value="Shirts">Shirts</option>
                    <option value="Shoes">Shoes</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>

                {/* Featured checkbox & Stock */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 600 }}>
                      Price ($) *
                    </label>
                    <input 
                      type="number" 
                      required
                      step="0.01"
                      min="0.01"
                      value={prodPrice}
                      onChange={(e) => setProdPrice(e.target.value)}
                      style={{ padding: '10px', border: '1px solid var(--border-light)', backgroundColor: 'transparent', fontSize: '13px', outline: 'none' }}
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 600 }}>
                      Stock *
                    </label>
                    <input 
                      type="number" 
                      required
                      min="0"
                      value={prodStock}
                      onChange={(e) => setProdStock(e.target.value)}
                      style={{ padding: '10px', border: '1px solid var(--border-light)', backgroundColor: 'transparent', fontSize: '13px', outline: 'none' }}
                    />
                  </div>
                </div>

              </div>

              {/* Description */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 600 }}>
                  Product Description
                </label>
                <textarea 
                  rows={3}
                  value={prodDescription}
                  onChange={(e) => setProdDescription(e.target.value)}
                  style={{ 
                    padding: '10px', 
                    border: '1px solid var(--border-light)', 
                    backgroundColor: 'transparent', 
                    fontSize: '13px', 
                    outline: 'none', 
                    resize: 'vertical',
                    fontFamily: 'var(--font-body)'
                  }}
                />
              </div>

              {/* Images (Comma Separated) */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 600 }}>
                  Image URLs (Comma separated list)
                </label>
                <textarea 
                  rows={2}
                  placeholder="https://images.unsplash.com/..., https://images.unsplash.com/..."
                  value={prodImages}
                  onChange={(e) => setProdImages(e.target.value)}
                  style={{ 
                    padding: '10px', 
                    border: '1px solid var(--border-light)', 
                    backgroundColor: 'transparent', 
                    fontSize: '11px', 
                    outline: 'none', 
                    resize: 'vertical',
                    fontFamily: 'monospace'
                  }}
                />
              </div>

              {/* Sizes & Colors (Comma Separated) */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 600 }}>
                    Sizes Available (Comma separated)
                  </label>
                  <input 
                    type="text" 
                    placeholder="S, M, L, XL"
                    value={prodSizes}
                    onChange={(e) => setProdSizes(e.target.value)}
                    style={{ padding: '10px', border: '1px solid var(--border-light)', backgroundColor: 'transparent', fontSize: '13px', outline: 'none' }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 600 }}>
                    Colors Available (Comma separated)
                  </label>
                  <input 
                    type="text" 
                    placeholder="Off-White, Oatmeal Beige, Navy"
                    value={prodColors}
                    onChange={(e) => setProdColors(e.target.value)}
                    style={{ padding: '10px', border: '1px solid var(--border-light)', backgroundColor: 'transparent', fontSize: '13px', outline: 'none' }}
                  />
                </div>

              </div>

              {/* Featured Checkbox */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input 
                  type="checkbox" 
                  id="featured"
                  checked={prodFeatured}
                  onChange={(e) => setProdFeatured(e.target.checked)}
                  style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                />
                <label htmlFor="featured" style={{ fontSize: '12px', userSelect: 'none', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Feature this product on homepage carousel
                </label>
              </div>

              {/* Form Actions */}
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', borderTop: '1px solid var(--border-light)', paddingTop: '20px', marginTop: '10px' }}>
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="btn-secondary"
                  style={{ padding: '10px 24px', fontSize: '12px' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-primary"
                  style={{ padding: '10px 24px', fontSize: '12px' }}
                >
                  {modalMode === 'create' ? 'Create Product' : 'Save Changes'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
