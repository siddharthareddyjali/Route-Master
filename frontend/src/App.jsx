import { Navigate, Route, Routes } from 'react-router-dom';

import HistoryPage from './pages/HistoryPage';
import LandingPage from './pages/LandingPage';
import PlannerPage from './pages/PlannerPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/planner" element={<PlannerPage />} />
      <Route path="/history" element={<HistoryPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
