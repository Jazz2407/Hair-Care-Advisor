import { useState, useEffect } from 'react';
import styles from './Assessment.module.css';

export default function Clinics() {
  const [clinics, setClinics] = useState([]);
  const [cityFilter, setCityFilter] = useState('All');
  const [sortBy, setSortBy] = useState('rating');

  useEffect(() => {
    fetch('/api/clinics').then(res => res.json()).then(data => setClinics(data));
  }, []);

  const filtered = cityFilter === 'All' ? clinics : clinics.filter(c => c.city === cityFilter);
  const sorted = [...filtered].sort((a, b) => sortBy === 'price' ? a.price - b.price : b.rating - a.rating);

  return (
    <div className={styles.container} style={{ maxWidth: '800px' }}>
      <h2 style={{ marginBottom: '20px' }}>Clinic Directory</h2>
      
      <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
        <select className={styles.select} style={{ margin: 0 }} value={cityFilter} onChange={e => setCityFilter(e.target.value)}>
          <option value="All">All Cities</option>
          <option value="Tirunelveli">Tirunelveli</option>
          <option value="Thoothukudi">Thoothukudi</option>
          <option value="Tenkasi">Tenkasi</option>
        </select>

        <select className={styles.select} style={{ margin: 0 }} value={sortBy} onChange={e => setSortBy(e.target.value)}>
          <option value="rating">Sort by: Top Rated</option>
          <option value="price">Sort by: Lowest Price</option>
        </select>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {sorted.map(clinic => (
          <div key={clinic.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
            <div>
              <h3 style={{ margin: '0 0 5px 0' }}>{clinic.name}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>{clinic.city} • {clinic.specialty}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.2rem', color: '#fbbf24', fontWeight: 'bold' }}>★ {clinic.rating}</div>
              <div style={{ color: '#60a5fa', fontWeight: 'bold' }}>₹{clinic.price} / consultation</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}