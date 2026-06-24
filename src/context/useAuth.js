import { createContext, useContext } from 'react'

export const AuthContext = createContext({
  user: null,
  perfil: null,
  carregando: true,
  logout: async () => {},
  recarregarPerfil: async () => {},
})

export function useAuth() {
  return useContext(AuthContext)
}
