import { HashRouter, Routes, Route } from 'react-router-dom'
import { StoreProvider } from './store'
import { EffectsProvider } from './components/Effects'
import { Layout } from './components/Layout'
import Dashboard from './pages/Dashboard'
import DailyLearning from './pages/DailyLearning'
import Flashcards from './pages/Flashcards'
import Curriculum from './pages/Curriculum'
import Challenges from './pages/Challenges'
import MCQPage from './pages/MCQ'
import Progress from './pages/Progress'
import Achievements from './pages/Achievements'
import Settings from './pages/Settings'
import RedTeamAcademy from './pages/RedTeamAcademy'
import BlueTeamAcademy from './pages/BlueTeamAcademy'
import ToolsPage from './pages/Tools'
import TracksPage from './pages/Tracks'
import CapstonesPage from './pages/Capstones'
import VisualLab from './pages/VisualLab'
import Visualizer from './pages/Visualizer'
import { ErrorBoundary } from './components/ErrorBoundary'

export default function App() {
  return (
    <EffectsProvider>
      <StoreProvider>
        <HashRouter>
        <Routes>
          <Route path="visualizer" element={<Visualizer />} />
          <Route element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="daily" element={<DailyLearning />} />
            <Route path="flashcards" element={<Flashcards />} />
            <Route path="curriculum" element={<Curriculum />} />
            <Route path="visual-lab" element={<ErrorBoundary><VisualLab /></ErrorBoundary>} />
            <Route path="visualizations" element={<ErrorBoundary><VisualLab /></ErrorBoundary>} />
            <Route path="red-team" element={<RedTeamAcademy />} />
            <Route path="blue-team" element={<BlueTeamAcademy />} />
            <Route path="tools" element={<ToolsPage />} />
            <Route path="tracks" element={<TracksPage />} />
            <Route path="capstones" element={<CapstonesPage />} />
            <Route path="challenges" element={<Challenges />} />
            <Route path="mcq" element={<MCQPage />} />
            <Route path="progress" element={<Progress />} />
            <Route path="achievements" element={<Achievements />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </HashRouter>
      </StoreProvider>
    </EffectsProvider>
  )
}
