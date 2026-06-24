import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth.js'

function destinoPorRole(role) {
  return role === 'profissional' ? '/profissional' : '/paciente'
}

export default function ProtectedRoute({ children, role }) {
  const { user, perfil, carregando } = useAuth()

  if (carregando) return null

  if (!user) return <Navigate to="/login" replace />

  if (perfil === undefined) return null

  if (role && perfil?.role && perfil.role !== role) {
    return <Navigate to={destinoPorRole(perfil.role)} replace />
  }

  return children
}
