import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { doc, updateDoc } from 'firebase/firestore'
import { auth, db } from '../firebase'
import { useAuth } from '../context/useAuth.js'
import Input from '../components/Input.jsx'
import Button from '../components/Button.jsx'
import Alert from '../components/Alert.jsx'
import Toast from '../components/Toast.jsx'
import styles from './EditarPerfil.module.css'

function comprimirImagem(file, maxLado = 400, qualidade = 0.8) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const img = new Image()
      img.onload = () => {
        let { width, height } = img
        if (width >= height && width > maxLado) {
          height = Math.round((height * maxLado) / width)
          width = maxLado
        } else if (height > width && height > maxLado) {
          width = Math.round((width * maxLado) / height)
          height = maxLado
        }
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)
        resolve(canvas.toDataURL('image/jpeg', qualidade))
      }
      img.onerror = reject
      img.src = reader.result
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export default function EditarPerfilPage() {
  const { perfil, recarregarPerfil } = useAuth()
  const navigate = useNavigate()
  const inputFileRef = useRef(null)

  const [nome, setNome] = useState(perfil?.nome ?? '')
  const [sobrenome, setSobrenome] = useState(perfil?.sobrenome ?? '')
  const [especialidade, setEspecialidade] = useState(perfil?.especialidade ?? '')
  const [foto, setFoto] = useState(perfil?.foto ?? '')
  const [erro, setErro] = useState('')
  const [toast, setToast] = useState('')
  const [salvando, setSalvando] = useState(false)
  const [processandoFoto, setProcessandoFoto] = useState(false)

  const ehProfissional = perfil?.role === 'profissional'

  async function handleFoto(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setErro('')
    setProcessandoFoto(true)
    try {
      const base64 = await comprimirImagem(file)
      setFoto(base64)
    } catch {
      setErro('Não foi possível processar a imagem.')
    } finally {
      setProcessandoFoto(false)
    }
  }

  function removerFoto() {
    setFoto('')
    if (inputFileRef.current) inputFileRef.current.value = ''
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setErro('')

    if (!nome.trim() || !sobrenome.trim()) {
      setErro('Nome e sobrenome são obrigatórios.')
      return
    }
    if (ehProfissional && !especialidade.trim()) {
      setErro('Informe sua especialidade.')
      return
    }

    setSalvando(true)
    try {
      const dados = {
        nome: nome.trim(),
        sobrenome: sobrenome.trim(),
        foto,
      }
      if (ehProfissional) dados.especialidade = especialidade.trim()

      await updateDoc(doc(db, 'usuarios', auth.currentUser.uid), dados)
      await recarregarPerfil()
      setToast('Perfil atualizado com sucesso!')
    } catch {
      setErro('Erro ao salvar. Tente novamente.')
    } finally {
      setSalvando(false)
    }
  }

  const nomeCompleto = `${nome} ${sobrenome}`.trim()
  const iniciais = nomeCompleto
    ? nomeCompleto.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase()
    : '?'

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1>Editar perfil</h1>
          <p>Atualize seus dados e sua foto</p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <Alert type="error" message={erro} />

          <div className={styles.fotoArea}>
            <div className={styles.avatarWrap}>
              {foto ? (
                <img src={foto} alt="Pré-visualização" className={styles.avatar} />
              ) : (
                <div className={styles.avatarFallback}>{iniciais}</div>
              )}
            </div>

            <input
              ref={inputFileRef}
              id="foto"
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFoto}
              className={styles.inputFile}
            />

            <div className={styles.fotoBotoes}>
              <label htmlFor="foto" className={styles.fotoBtn}>
                {processandoFoto ? 'Processando...' : (foto ? 'Trocar foto' : 'Tirar / escolher foto')}
              </label>
              {foto && (
                <button type="button" className={styles.removerBtn} onClick={removerFoto}>
                  Remover
                </button>
              )}
            </div>
          </div>

          <div className={styles.duo}>
            <Input
              id="nome"
              label="Nome"
              value={nome}
              onChange={e => setNome(e.target.value)}
              placeholder="João"
            />
            <Input
              id="sobrenome"
              label="Sobrenome"
              value={sobrenome}
              onChange={e => setSobrenome(e.target.value)}
              placeholder="Silva"
            />
          </div>

          {ehProfissional && (
            <Input
              id="especialidade"
              label="Especialidade"
              value={especialidade}
              onChange={e => setEspecialidade(e.target.value)}
              placeholder="Ex: Terapia Cognitivo-Comportamental"
            />
          )}

          <Button type="submit" loading={salvando} disabled={salvando || processandoFoto}>
            {salvando ? 'Salvando...' : 'Salvar alterações'}
          </Button>

          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate(ehProfissional ? '/profissional' : '/paciente')}
          >
            Voltar
          </Button>
        </form>
      </div>

      <Toast message={toast} type="success" onClose={() => setToast('')} />
    </main>
  )
}
