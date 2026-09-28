import React from 'react';
import { AppStateProvider, useAppState } from './services/AppState';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { SyntheticBanner } from './components/SyntheticBanner';

import { Dashboard } from './pages/Dashboard';
import { AssetRegistry } from './pages/AssetRegistry';
import { GisMap } from './pages/GisMap';
import { Inspection } from './pages/Inspection';
import { History } from './pages/History';
import { Sensors } from './pages/Sensors';
import { Prediction } from './pages/Prediction';
import { RiskScoring } from './pages/RiskScoring';
import { PriorityQueue } from './pages/PriorityQueue';
import { MaintenanceWindows } from './pages/MaintenanceWindows';
import { BlockPlanner } from './pages/BlockPlanner';
import { ExplainableAI } from './pages/ExplainableAI';
import { ExternalRisk } from './pages/ExternalRisk';
import { Notifications } from './pages/Notifications';
import { Reports } from './pages/Reports';
import { AuditTrail } from './pages/AuditTrail';

const PageRouter: React.FC = () => {
  const { activeModule } = useAppState();
  switch (activeModule) {
    case 'dashboard': return <Dashboard />;
    case 'registry': return <AssetRegistry />;
    case 'gis': return <GisMap />;
    case 'inspection': return <Inspection />;
    case 'history': return <History />;
    case 'sensors': return <Sensors />;
    case 'prediction': return <Prediction />;
    case 'risk': return <RiskScoring />;
    case 'priority': return <PriorityQueue />;
    case 'windows': return <MaintenanceWindows />;
    case 'blockplanner': return <BlockPlanner />;
    case 'explain': return <ExplainableAI />;
    case 'external': return <ExternalRisk />;
    case 'notifications': return <Notifications />;
    case 'reports': return <Reports />;
    case 'audit': return <AuditTrail />;
    default: return <Dashboard />;
  }
};

const Shell: React.FC = () => (
  <div className="app-shell">
    <Sidebar />
    <div className="app-main">
      <TopBar />
      <div className="app-content">
        <SyntheticBanner />
        <PageRouter />
      </div>
    </div>
  </div>
);

const App: React.FC = () => (
  <AppStateProvider>
    <Shell />
  </AppStateProvider>
);

export default App;
