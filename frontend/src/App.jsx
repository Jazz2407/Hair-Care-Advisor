import { useState } from 'react';
import Assessment from './components/Assessment';
import Shop from './components/Shop';
import Clinics from './components/Clinics';
import UserDashboard from './components/UserDashboard';
import Admin from './components/Admin';

export default function App() {
  const [currentView, setCurrentView] = useState('assessment');
  // NEW: State to control if the dropdown menu is open or closed
  const [showDropdown, setShowDropdown] = useState(false);

  // Helper to change views and automatically close the dropdown
  const handleNavigate = (view) => {
    setCurrentView(view);
    setShowDropdown(false);
  };

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar" style={{ position: 'relative', zIndex: 10 }}>
        <h1 style={{ margin: 0, fontSize: '1.4rem', color: '#60a5fa', fontWeight: '600', whiteSpace: 'nowrap' }}>
          Hair Care Advisor
        </h1>
        
        <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <button onClick={() => handleNavigate('assessment')} style={{ background: 'none', border: 'none', color: currentView === 'assessment' ? '#60a5fa' : 'var(--text-muted)', cursor: 'pointer', fontWeight: '600' }}>Assessment</button>
          <button onClick={() => handleNavigate('shop')} style={{ background: 'none', border: 'none', color: currentView === 'shop' ? '#60a5fa' : 'var(--text-muted)', cursor: 'pointer', fontWeight: '600' }}>Shop</button>
          <button onClick={() => handleNavigate('clinics')} style={{ background: 'none', border: 'none', color: currentView === 'clinics' ? '#60a5fa' : 'var(--text-muted)', cursor: 'pointer', fontWeight: '600' }}>Clinics</button>
          
          {/* NEW: Dropdown "Thing" Container */}
          <div style={{ position: 'relative' }}>
            <button 
              onClick={() => setShowDropdown(!showDropdown)} 
              style={{ 
                background: showDropdown ? 'rgba(255,255,255,0.1)' : 'none', 
                border: '1px solid var(--border-subtle)', 
                color: 'var(--text-main)', 
                cursor: 'pointer', 
                fontWeight: '600',
                padding: '8px 16px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s'
              }}
            >
              Account {showDropdown ? '▲' : '▼'}
            </button>

            {/* The Floating Menu that appears when clicked */}
            {showDropdown && (
              <div style={{ 
                position: 'absolute', 
                top: '100%', 
                right: 0, 
                marginTop: '10px', 
                background: '#1e293b', 
                border: '1px solid var(--border-subtle)', 
                borderRadius: '12px', 
                padding: '10px', 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '5px', 
                minWidth: '160px', 
                boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
              }}>
                <button 
                  onClick={() => handleNavigate('dashboard')} 
                  style={{ background: currentView === 'dashboard' ? 'rgba(59, 130, 246, 0.1)' : 'none', border: 'none', color: currentView === 'dashboard' ? '#60a5fa' : 'var(--text-muted)', cursor: 'pointer', textAlign: 'left', fontWeight: '600', padding: '10px', borderRadius: '6px', width: '100%' }}
                >
                  My Profile
                </button>
                <button 
                  onClick={() => handleNavigate('admin')} 
                  style={{ background: currentView === 'admin' ? 'rgba(239, 68, 68, 0.1)' : 'none', border: 'none', color: '#ef4444', cursor: 'pointer', textAlign: 'left', fontWeight: '600', padding: '10px', borderRadius: '6px', width: '100%' }}
                >
                  Admin Panel
                </button>
              </div>
            )}
          </div>
          {/* END Dropdown Container */}

        </div>
      </nav>

      {/* Main Content Area */}
      <div style={{ padding: '40px 20px' }}>
        {currentView === 'assessment' && <Assessment onNavigate={handleNavigate} />}
        {currentView === 'shop' && <Shop />}
        {currentView === 'clinics' && <Clinics />}
        {currentView === 'dashboard' && <UserDashboard />}
        {currentView === 'admin' && <Admin />}
      </div>
    </div>
  );
}