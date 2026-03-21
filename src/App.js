import { useState } from 'react';
import ShapesTab from './ShapesTab';
import BuildingTab from './BuildingTab';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('shapes');

  const tabStyle = (tab) => ({
    padding: '10px 24px',
    border: 'none',
    borderBottom: activeTab === tab ? '3px solid white' : '3px solid transparent',
    background: activeTab === tab ? 'rgba(255,255,255,0.15)' : 'transparent',
    color: 'white',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: 15,
    textShadow: '0 1px 3px rgba(0,0,0,0.6)',
    transition: 'all 0.2s',
  });

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 2,
        display: 'flex',
        background: 'rgba(0,0,0,0.4)',
        backdropFilter: 'blur(8px)',
      }}>
        <button style={tabStyle('shapes')} onClick={() => setActiveTab('shapes')}>
          Shapes
        </button>
        <button style={tabStyle('building')} onClick={() => setActiveTab('building')}>
          Building
        </button>
      </div>

      {activeTab === 'shapes' && <ShapesTab />}
      {activeTab === 'building' && <BuildingTab />}
    </div>
  );
}

export default App;
