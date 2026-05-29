import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function Auth({ setPath }) {
  const { login, register } = useContext(AuthContext);

  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
      // Redirect to profile on success
      setPath('/profile');
    } catch (err) {
      setError(err.message || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container animate-fade-in" style={{
      paddingTop: '160px',
      minHeight: '80vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '440px',
        backgroundColor: 'var(--bg-secondary)',
        padding: '50px 40px',
        border: '1px solid var(--border-light)',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.02)'
      }}>
        
        {/* Toggle Title */}
        <h2 style={{
          textAlign: 'center',
          fontSize: '24px',
          letterSpacing: '0.1em',
          marginBottom: '8px'
        }}>
          {isLogin ? 'SIGN IN' : 'CREATE ACCOUNT'}
        </h2>
        
        <p style={{
          textAlign: 'center',
          fontSize: '12px',
          color: 'var(--text-secondary)',
          marginBottom: '32px',
          letterSpacing: '0.05em'
        }}>
          {isLogin ? 'Access your orders and account history' : 'Register to check out faster'}
        </p>

        {/* Error Alert */}
        {error && (
          <div style={{
            backgroundColor: 'rgba(211, 47, 47, 0.08)',
            borderLeft: `3px solid var(--accent-red)`,
            padding: '12px 16px',
            marginBottom: '24px',
            fontSize: '12px',
            color: 'var(--accent-red)',
            letterSpacing: '0.05em'
          }}>
            {error}
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {!isLogin && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 500 }}>FULL NAME</label>
              <input 
                type="text" 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  padding: '12px',
                  border: '1px solid var(--border-light)',
                  backgroundColor: 'var(--bg-primary)',
                  color: 'var(--text-primary)',
                  outline: 'none',
                  fontSize: '13px'
                }}
              />
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 500 }}>EMAIL ADDRESS</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                padding: '12px',
                border: '1px solid var(--border-light)',
                backgroundColor: 'var(--bg-primary)',
                color: 'var(--text-primary)',
                outline: 'none',
                fontSize: '13px'
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 500 }}>PASSWORD</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                padding: '12px',
                border: '1px solid var(--border-light)',
                backgroundColor: 'var(--bg-primary)',
                color: 'var(--text-primary)',
                outline: 'none',
                fontSize: '13px'
              }}
            />
          </div>

          <button 
            type="submit" 
            className="btn-primary" 
            disabled={loading}
            style={{ width: '100%', marginTop: '12px', padding: '16px' }}
          >
            {loading ? 'PROCESSING...' : isLogin ? 'SIGN IN' : 'REGISTER'}
          </button>
        </form>

        {/* Toggle Actions */}
        <div style={{ textAlign: 'center', marginTop: '30px', borderTop: '1px solid var(--border-light)', paddingTop: '24px' }}>
          <span 
            onClick={() => { setIsLogin(!isLogin); setError(null); }}
            style={{
              fontSize: '12px',
              letterSpacing: '0.05em',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            {isLogin ? "Don't have an account? Register" : "Already have an account? Sign In"}
          </span>
        </div>

      </div>
    </div>
  );
}
