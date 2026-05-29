import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import ProductDetail from './pages/ProductDetail';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import Checkout from './pages/Checkout';
import Admin from './pages/Admin';
import About from './pages/About';
import FAQ from './pages/FAQ';
import SizeGuide from './pages/SizeGuide';
import Careers from './pages/Careers';
import TermsOfService from './pages/TermsOfService';
import RefundPolicy from './pages/RefundPolicy';
import PrivacyPolicy from './pages/PrivacyPolicy';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

function AppContent() {
  const [path, setPath] = useState(window.location.pathname + window.location.search);

  // Sync state path with history back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setPath(window.location.pathname + window.location.search);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (newPath) => {
    window.history.pushState({}, '', newPath);
    setPath(newPath);
    // Scroll to top on navigation
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  // Basic custom routing logic
  const renderPage = () => {
    // Strip query parameters for routing check
    const basePath = path.split('?')[0];

    if (basePath === '/' || basePath === '') {
      return <Home setPath={navigateTo} />;
    }
    if (basePath === '/catalog') {
      return <Catalog currentPath={path} setPath={navigateTo} />;
    }
    if (basePath.startsWith('/product/')) {
      return <ProductDetail currentPath={path} setPath={navigateTo} />;
    }
    if (basePath === '/auth') {
      return <Auth setPath={navigateTo} />;
    }
    if (basePath === '/profile') {
      return <Profile setPath={navigateTo} />;
    }
    if (basePath === '/checkout') {
      return <Checkout setPath={navigateTo} />;
    }
    if (basePath === '/about') {
      return <About setPath={navigateTo} />;
    }
    if (basePath === '/faq') {
      return <FAQ setPath={navigateTo} />;
    }
    if (basePath === '/size-guide') {
      return <SizeGuide setPath={navigateTo} />;
    }
    if (basePath === '/careers') {
      return <Careers setPath={navigateTo} />;
    }
    if (basePath === '/terms-of-service') {
      return <TermsOfService setPath={navigateTo} />;
    }
    if (basePath === '/refund-policy') {
      return <RefundPolicy setPath={navigateTo} />;
    }
    if (basePath === '/privacy-policy') {
      return <PrivacyPolicy setPath={navigateTo} />;
    }
    if (basePath === '/admin') {
      return <Admin setPath={navigateTo} />;
    }

    // Default Fallback
    return (
      <div className="container" style={{ paddingTop: '160px', textAlign: 'center', minHeight: '80vh' }}>
        <h2>404 - Page Not Found</h2>
        <p style={{ margin: '20px 0', color: 'var(--text-secondary)' }}>The luxury piece you are looking for does not exist.</p>
        <button onClick={() => navigateTo('/')} className="btn-primary">Return Home</button>
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header currentPath={path} setPath={navigateTo} />
      <main style={{ flex: 1 }}>
        {renderPage()}
      </main>
      <Footer setPath={navigateTo} />

      {/* 
        WhatsApp Floating Chat Widget
        To change the WhatsApp phone number, edit the 'href' below.
        Format: https://wa.me/YOUR_PHONE_NUMBER (e.g. 1234567890)
        Do NOT include plus signs, spaces, or leading zeroes.
      */}
      <a 
        href="https://wa.me/1234567890" // <-- UPDATE THIS VALUE WITH YOUR ACTUAL PHONE NUMBER
        target="_blank" 
        rel="noopener noreferrer"
        style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          backgroundColor: '#25D366',
          color: '#FFF',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          zIndex: 9999,
          transition: 'transform 0.3s ease'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        aria-label="Chat with us on WhatsApp"
      >
        <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.863-9.73.001-2.595-1.013-5.035-2.855-6.878C16.636 2.155 14.197 1.14 11.602 1.14c-5.45 0-9.875 4.372-9.878 9.734-.002 1.778.48 3.514 1.396 5.105L2.1 21.03l5.047-1.309c-.254-.369-.504-.739-.5-.573zm11.758-7.791c-.08-.135-.301-.21-.635-.375-.335-.165-1.98-.975-2.285-1.085-.306-.11-.53-.165-.756.165-.226.335-.875 1.085-1.07 1.305-.195.225-.39.25-.724.085-.335-.165-1.415-.515-2.695-1.645-.995-.885-1.665-1.98-1.86-2.315-.195-.335-.02-.515.145-.68.15-.15.335-.39.5-.585.165-.195.22-.325.33-.54.11-.215.055-.405-.025-.57-.08-.165-.755-1.82-.1035-2.495-.27-.655-.53-.59-.756-.605-.22-.015-.475-.015-.731-.015-.255 0-.67.095-1.02.475-.35.385-1.335 1.3-1.335 3.17s1.37 3.68 1.56 3.93c.19.25 2.695 4.075 6.52 5.71.91.39 1.62.625 2.17.8.915.29 1.75.25 2.41.15.735-.11 2.285-.93 2.605-1.83.32-.9 0-.095-.91-.13-.08-.11-.27-.165-.33-.21zm0 0" />
        </svg>
      </a>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
}
