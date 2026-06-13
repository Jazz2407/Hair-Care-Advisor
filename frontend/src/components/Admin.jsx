import { useState, useEffect } from 'react';
import styles from './Assessment.module.css';

export default function Admin() {
  const [data, setData] = useState({ assessments: [], orders: [] });

  useEffect(() => {
    fetch('/api/admin/data').then(res => res.json()).then(setData);
  }, []);

  return (
    <div className={styles.container} style={{ maxWidth: '900px' }}>
      <h2 style={{ color: '#ef4444' }}>Admin Panel</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
        <div style={{ background: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: '12px' }}>
          <h3>Global Assessments ({data.assessments.length})</h3>
          {data.assessments.map(a => (
            <div key={a.id} style={{ fontSize: '0.9rem', marginBottom: '10px', borderBottom: '1px solid #333', paddingBottom: '10px' }}>
              User: {a.userId} | Severity: {a.severity}
            </div>
          ))}
        </div>

        <div style={{ background: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: '12px' }}>
          <h3>Global Orders ({data.orders.length})</h3>
          {data.orders.map(o => (
            <div key={o.id} style={{ fontSize: '0.9rem', marginBottom: '10px', borderBottom: '1px solid #333', paddingBottom: '10px' }}>
              Order #{o.id} | User: {o.userId} | Items: {o.items.length}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}