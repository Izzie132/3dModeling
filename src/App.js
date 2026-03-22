import { Routes, Route, useNavigate, useParams, Navigate } from 'react-router-dom';
import ShapesTab from './ShapesTab';
import BuildingTab from './BuildingTab';
import BeamDetailPage from './BeamDetailPage';
import './App.css';

function HomePage() {
  const { tab } = useParams();
  const navigate = useNavigate();

  const tabStyle = (t) => ({
    padding: '10px 24px',
    border: 'none',
    borderBottom: tab === t ? '3px solid white' : '3px solid transparent',
    background: tab === t ? 'rgba(255,255,255,0.15)' : 'transparent',
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
        <button style={tabStyle('shapes')} onClick={() => navigate('/shapes')}>
          Shapes
        </button>
        <button style={tabStyle('building')} onClick={() => navigate('/building')}>
          Building
        </button>
      </div>

      {tab === 'shapes' && <ShapesTab />}
      {tab === 'building' && <BuildingTab />}
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/shapes" replace />} />
      <Route path="/:tab" element={<HomePage />} />
      <Route path="/beam/:type" element={<BeamDetailPage />} />
    </Routes>
  );
}

export default App;
