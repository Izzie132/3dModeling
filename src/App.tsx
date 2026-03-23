import { Routes, Route, useNavigate, useParams, Navigate } from 'react-router-dom';
import ShapesTab from './shapes/ShapesTab';
import BuildingTab from './building/BuildingTab';
import BeamDetailPage from './building/BeamDetailPage';
import { featureFlags } from './featureFlags';
import './App.css';

interface TabDef {
  id: string;
  label: string;
  component: React.ComponentType;
}

const TABS: TabDef[] = [
  { id: 'shapes', label: 'Shapes', component: ShapesTab },
  { id: 'building', label: 'Building', component: BuildingTab },
];

function HomePage({ enabledTabs }: { enabledTabs: Record<string, boolean> }) {
  const { tab } = useParams();
  const navigate = useNavigate();

  const tabStyle = (t: string): React.CSSProperties => ({
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

  const visibleTabs = TABS.filter((t) => enabledTabs[t.id]);

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
        {visibleTabs.map((t) => (
          <button key={t.id} style={tabStyle(t.id)} onClick={() => navigate(`/${t.id}`)}>
            {t.label}
          </button>
        ))}
      </div>

      {visibleTabs.map((t) => tab === t.id && <t.component key={t.id} />)}
    </div>
  );
}

const enabledTabs = TABS.filter((t) => featureFlags[t.id]);
const defaultTab = enabledTabs[0]?.id || 'shapes';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to={`/${defaultTab}`} replace />} />
      <Route path="/:tab" element={<HomePage enabledTabs={featureFlags} />} />
      {featureFlags.building && <Route path="/beam/:type" element={<BeamDetailPage />} />}
    </Routes>
  );
}

export default App;
