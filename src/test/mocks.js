import { vi } from 'vitest'

vi.mock('../firebase', () => ({
  auth: {},
  db: {},
}))

vi.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: vi.fn(),
  createUserWithEmailAndPassword: vi.fn(),
  fetchSignInMethodsForEmail: vi.fn(),
  getAuth: vi.fn(),
}))

vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  getDocs: vi.fn(),
  setDoc: vi.fn(),
  doc: vi.fn(),
  getFirestore: vi.fn(),
}))
