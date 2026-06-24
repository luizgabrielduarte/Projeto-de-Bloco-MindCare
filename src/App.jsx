import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import EscolherPerfilPage from './pages/EscolherPerfilPage.jsx'
import CadastroPage from './pages/CadastroPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import EditarPerfilPage from './pages/EditarPerfilPage.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"                      element={<LandingPage />} />
        <Route path="/login"                 element={<LoginPage />} />
        <Route path="/cadastro"              element={<EscolherPerfilPage />} />
        <Route path="/cadastro/paciente"     element={<CadastroPage role="paciente" />} />
        <Route path="/cadastro/profissional" element={<CadastroPage role="profissional" />} />
        <Route
          path="/paciente"
          element={
            <ProtectedRoute role="paciente">
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profissional"
          element={
            <ProtectedRoute role="profissional">
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/perfil"
          element={
            <ProtectedRoute>
              <EditarPerfilPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}
