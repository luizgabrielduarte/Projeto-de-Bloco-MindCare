import { useEffect, useState } from 'react'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '../firebase'
import { AuthContext } from './useAuth.js'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [perfil, setPerfil] = useState(null)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser(u)
        setPerfil(undefined)
        try {
          const snap = await getDoc(doc(db, 'usuarios', u.uid))
          setPerfil(snap.exists() ? { id: snap.id, ...snap.data() } : null)
        } catch {
          setPerfil(null)
        }
      } else {
        setUser(null)
        setPerfil(null)
      }
      setCarregando(false)
    })
    return unsub
  }, [])

  async function logout() {
    await signOut(auth)
    setPerfil(null)
  }

  async function recarregarPerfil() {
    if (!auth.currentUser) return
    const snap = await getDoc(doc(db, 'usuarios', auth.currentUser.uid))
    setPerfil(snap.exists() ? { id: snap.id, ...snap.data() } : null)
  }

  return (
    <AuthContext.Provider value={{ user, perfil, carregando, logout, recarregarPerfil }}>
      {children}
    </AuthContext.Provider>
  )
}
