import { lazy, useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { FloatingAgentChat } from '@/components/blocks';
import { GenesisAuth } from '@/lib/genesis-auth';
import { GenesisSection } from '@/lib/genesis';
import { PORTAL_NAME, PATIENT_ASSISTANT } from '@/config/portal';

if (typeof document !== 'undefined' && document.getElementById('root') == null) {
  const appMount = document.createElement('div');
  appMount.id = 'root';
  (document.body ?? document.documentElement).appendChild(appMount);
}

const HomePage = lazy(() => import('@/pages/HomePage'));
const AdminPage = lazy(() => import('@/pages/AdminPage'));
const ClinicalWorkspacePage = lazy(() => import('@/pages/ClinicalWorkspacePage'));

function PortalGuideChat() {
  const { pathname } = useLocation();
  return <div hidden={pathname.startsWith('/admin')}><FloatingAgentChat agentId={PATIENT_ASSISTANT.agentId} publicAgentId={PATIENT_ASSISTANT.publicAgentId} title="Phoenix Portal Guide" accent={1} placeholder="Ask how to use the portal…" /></div>;
}

export default function App() {
  useEffect(() => {
    document.title = `${PORTAL_NAME} · Telehealth care portal`;
  }, []);

  return (
    <GenesisAuth>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<GenesisSection name="Patient portal"><HomePage /></GenesisSection>} />
          <Route path="/admin" element={<GenesisSection name="Therapist workspace"><AdminPage /></GenesisSection>} />
          <Route path="/admin/clinical" element={<GenesisSection name="Clinical workspace"><ClinicalWorkspacePage /></GenesisSection>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <PortalGuideChat />
      </BrowserRouter>
    </GenesisAuth>
  );
}
