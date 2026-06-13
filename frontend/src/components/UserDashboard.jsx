import { useState, useEffect } from 'react';
import styles from './Assessment.module.css';

export default function UserDashboard() {
  const [data, setData] = useState({ history: [], orders: [] });

  useEffect(() => {
    fetch('/api/user/dashboard').then(res => res.json()).then(setData);
  }, []);

  return (
    <div className={styles.container} style={{ maxWidth: '800px' }}>
      <h2 style={{ marginBottom: '20px' }}>My Dashboard</h2>
      
      <h3>Assessment History & Comparison</h3>
      {data.history.length === 0 ? <p>No assessments yet.</p> : (
        <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '20px' }}>
          {data.history.map((a, i) => (
            <div key={i} style={{ minWidth: '250px', background: 'rgba(0,0,0,0.2)', padding: '15px', borderRadius: '8px' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{new Date(a.date).toLocaleDateString()}</div>
              <h4>Risk Level: {a.severity}</h4>
              <p style={{ fontSize: '0.9rem' }}>Density: {a.imageAnalysis?.hairDensity}</p>
              <div style={{ fontSize: '0.8rem', color: '#fbbf24' }}>
                {i > 0 && a.severity !== data.history[i-1].severity ? 'Trend changed since last scan!' : 'Trend stable'}
              </div>
            </div>
          ))}
        </div>
      )}

      <hr style={{ borderColor: 'var(--border-subtle)', margin: '30px 0' }} />

      <h3>Order History</h3>
      {data.orders.length === 0 ? <p>No orders yet.</p> : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {data.orders.map((o, i) => (
            <li key={i} style={{ background: 'rgba(0,0,0,0.2)', padding: '15px', borderRadius: '8px', marginBottom: '10px' }}>
              <strong>Order #{o.id}</strong> - {new Date(o.date).toLocaleDateString()}
              <div style={{ color: 'var(--text-muted)', marginTop: '5px' }}>
                {o.items.map(item => item.name).join(', ')}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}