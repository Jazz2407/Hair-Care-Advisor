import { useState, useEffect } from 'react';
import styles from './Assessment.module.css';

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [orderPlaced, setOrderPlaced] = useState(false);

  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error("Error loading products:", err));
  }, []);

  const checkout = async () => {
    if (cart.length === 0) return;
    try {
      const res = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cart })
      });
      if (res.ok) {
        setOrderPlaced(true);
        setCart([]);
      }
    } catch (err) {
      alert("Checkout failed. Check if backend is running.");
    }
  };

  if (orderPlaced) {
    return (
      <div className={styles.container} style={{ textAlign: 'center' }}>
        <h2>Order Placed Successfully!</h2>
        <p style={{ color: 'var(--text-muted)' }}>Thank you for your mock order. Check the backend terminal for logs.</p>
        <button className={`${styles.btn} ${styles.btnPrimary}`} style={{ marginTop: '20px' }} onClick={() => setOrderPlaced(false)}>Back to Shop</button>
      </div>
    );
  }

  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', maxWidth: '950px', margin: '0 auto', padding: '20px 0' }}>
      
      {/* Product Grid Catalog */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
        {products.map(p => (
          <div key={p.id} className={styles.container} style={{ margin: 0, padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', minHeight: '400px' }}>
            
            {/* Image Container with contain and padding so the whole bottle shows */}
            <div style={{ width: '100%', height: '180px', position: 'relative', overflow: 'hidden', background: '#e2e8f0' }}>
              <img 
                src={p.image} 
                alt={p.name} 
                style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '16px' }} 
              />
              <span style={{ position: 'absolute', top: '12px', left: '12px', fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', background: 'rgba(11, 17, 32, 0.85)', color: '#60a5fa', padding: '4px 10px', borderRadius: '99px', backdropFilter: 'blur(4px)' }}>
                {p.category}
              </span>
            </div>

            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '1.2rem', lineHeight: '1.3' }}>{p.name}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '0 0 20px 0', flex: 1 }}>{p.description}</p>
              
              {/* Price & Button Container (With the Mobile Wrap Fix) */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                marginTop: 'auto', 
                borderTop: '1px solid rgba(255,255,255,0.05)', 
                paddingTop: '14px',
                gap: '16px',        /* <-- Forces space between text and button */
                flexWrap: 'wrap'    /* <-- Drops button below price if screen is too thin */
              }}>
                <strong style={{ fontSize: '1.4rem', color: 'var(--text-main)' }}>₹{p.price}</strong>
                <button 
                  className={`${styles.btn} ${styles.btnPrimary}`} 
                  style={{ padding: '8px 16px', margin: 0, fontSize: '0.9rem', minWidth: '110px' }} 
                  onClick={() => setCart([...cart, p])}
                >
                  Add to Cart
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* Cart Summary Block */}
      <div className={styles.container} style={{ margin: 0, width: '100%', padding: '30px' }}>
        <h2 style={{ marginBottom: '20px' }}>Your Cart ({cart.length})</h2>
        {cart.length === 0 ? <p style={{ color: 'var(--text-muted)' }}>Cart is empty.</p> : (
          <>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px 0' }}>
              {cart.map((item, i) => (
                <li key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '15px', marginBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {/* Cart item thumbnail */}
                    <img src={item.image} alt={item.name} style={{ width: '45px', height: '45px', objectFit: 'contain', padding: '4px', borderRadius: '6px', background: '#e2e8f0' }} />
                    <span style={{ color: 'var(--text-muted)', fontSize: '1rem', fontWeight: '500' }}>{item.name}</span>
                  </div>
                  <span style={{ fontWeight: '600', fontSize: '1rem' }}>₹{item.price}</span>
                </li>
              ))}
            </ul>
            <hr style={{ borderColor: 'var(--border-subtle)', margin: '20px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '1.3rem', marginBottom: '24px' }}>
              <strong>Total:</strong>
              <strong style={{ color: '#60a5fa', marginLeft: 'auto' }}>₹{cartTotal}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button className={`${styles.btn} ${styles.btnPrimary}`} style={{ padding: '12px 36px', fontSize: '1rem' }} onClick={checkout}>Mock Checkout</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}