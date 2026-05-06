import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { createUserWithEmailAndPassword, fetchSignInMethodsForEmail } from 'firebase/auth'
import { collection, query, where, getDocs, setDoc, doc } from 'firebase/firestore'
import { auth, db } from '../firebase'
import Input from '../components/Input.jsx'
import Button from '../components/Button.jsx'
import Alert from '../components/Alert.jsx'
import styles from './CadastroPage.module.css'

function validarCPF(cpf) {
  cpf = cpf.replace(/\D/g, '')
  if (cpf === '11111111111') return true
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false

  let soma = 0
  for (let i = 0; i < 9; i++) soma += parseInt(cpf[i]) * (10 - i)
  let resto = (soma * 10) % 11
  if (resto === 10 || resto === 11) resto = 0
  if (resto !== parseInt(cpf[9])) return false

  soma = 0
  for (let i = 0; i < 10; i++) soma += parseInt(cpf[i]) * (11 - i)
  resto = (soma * 10) % 11
  if (resto === 10 || resto === 11) resto = 0
  return resto === parseInt(cpf[10])
}

function formatarCPF(valor) {
  return valor
    .replace(/\D/g, '')
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
}

function formatarCEP(valor) {
  return valor
    .replace(/\D/g, '')
    .slice(0, 8)
    .replace(/(\d{5})(\d)/, '$1-$2')
}

async function buscarCEP(cep) {
  const numeros = cep.replace(/\D/g, '')
  if (numeros.length !== 8) return null
  const res = await fetch(`https://viacep.com.br/ws/${numeros}/json/`)
  const data = await res.json()
  if (data.erro) return null
  return data
}

const campoInicial = { valor: '', erro: '' }

export default function CadastroPage() {
  const [campos, setCampos] = useState({
    nome:          campoInicial,
    sobrenome:     campoInicial,
    email:         campoInicial,
    senha:         campoInicial,
    confirmaSenha: campoInicial,
    cpf:           campoInicial,
    cep:           campoInicial,
  })
  const [enderecoInfo, setEnderecoInfo] = useState('')
  const [buscandoCep, setBuscandoCep] = useState(false)
  const [erroGeral, setErroGeral] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  function set(campo, valor, erro = '') {
    setCampos(prev => ({ ...prev, [campo]: { valor, erro } }))
  }

  function setErro(campo, erro) {
    setCampos(prev => ({ ...prev, [campo]: { ...prev[campo], erro } }))
  }

  // Validações individuais por campo (chamadas no onBlur)
  function blurNome() {
    if (!campos.nome.valor.trim()) setErro('nome', 'Campo obrigatório.')
    else setErro('nome', '')
  }

  function blurSobrenome() {
    if (!campos.sobrenome.valor.trim()) setErro('sobrenome', 'Campo obrigatório.')
    else setErro('sobrenome', '')
  }

  function blurEmail() {
    const v = campos.email.valor.trim()
    if (!v) setErro('email', 'Campo obrigatório.')
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) setErro('email', 'E-mail inválido.')
    else setErro('email', '')
  }

  function blurSenha() {
    if (!campos.senha.valor) setErro('senha', 'Campo obrigatório.')
    else if (campos.senha.valor.length < 6) setErro('senha', 'Mínimo de 6 caracteres.')
    else setErro('senha', '')
  }

  function blurConfirmaSenha() {
    if (!campos.confirmaSenha.valor) setErro('confirmaSenha', 'Campo obrigatório.')
    else if (campos.confirmaSenha.valor !== campos.senha.valor) setErro('confirmaSenha', 'As senhas não coincidem.')
    else setErro('confirmaSenha', '')
  }

  function blurCPF() {
    const cpfLimpo = campos.cpf.valor.replace(/\D/g, '')
    if (!cpfLimpo) setErro('cpf', 'Campo obrigatório.')
    else if (!validarCPF(cpfLimpo)) setErro('cpf', 'CPF inválido.')
    else setErro('cpf', '')
  }

  async function blurCEP() {
    const cep = campos.cep.valor
    const limpo = cep.replace(/\D/g, '')

    if (!limpo) { setErro('cep', 'Campo obrigatório.'); return }
    if (limpo.length !== 8) { setErro('cep', 'CEP inválido.'); return }

    setBuscandoCep(true)
    setEnderecoInfo('')
    try {
      const dados = await buscarCEP(cep)
      if (!dados) {
        setErro('cep', 'CEP não encontrado.')
      } else {
        setErro('cep', '')
        setEnderecoInfo(`${dados.logradouro}, ${dados.bairro} — ${dados.localidade}/${dados.uf}`)
      }
    } catch {
      setErro('cep', 'Erro ao consultar CEP.')
    } finally {
      setBuscandoCep(false)
    }
  }

  function validarCampos() {
    let valido = true
    const v = campos

    if (!v.nome.valor.trim())      { setErro('nome', 'Campo obrigatório.'); valido = false }
    if (!v.sobrenome.valor.trim()) { setErro('sobrenome', 'Campo obrigatório.'); valido = false }

    if (!v.email.valor.trim()) {
      setErro('email', 'Campo obrigatório.'); valido = false
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.valor)) {
      setErro('email', 'E-mail inválido.'); valido = false
    }

    if (!v.senha.valor) {
      setErro('senha', 'Campo obrigatório.'); valido = false
    } else if (v.senha.valor.length < 6) {
      setErro('senha', 'Mínimo de 6 caracteres.'); valido = false
    }

    if (!v.confirmaSenha.valor) {
      setErro('confirmaSenha', 'Campo obrigatório.'); valido = false
    } else if (v.confirmaSenha.valor !== v.senha.valor) {
      setErro('confirmaSenha', 'As senhas não coincidem.'); valido = false
    }

    const cpfLimpo = v.cpf.valor.replace(/\D/g, '')
    if (!cpfLimpo) {
      setErro('cpf', 'Campo obrigatório.'); valido = false
    } else if (!validarCPF(cpfLimpo)) {
      setErro('cpf', 'CPF inválido.'); valido = false
    }

    const cepLimpo = v.cep.valor.replace(/\D/g, '')
    if (!cepLimpo) {
      setErro('cep', 'Campo obrigatório.'); valido = false
    } else if (cepLimpo.length !== 8) {
      setErro('cep', 'CEP inválido.'); valido = false
    } else if (v.cep.erro) {
      valido = false
    }

    return valido
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setErroGeral('')

    if (!validarCampos()) return

    setLoading(true)

    try {
      const metodos = await fetchSignInMethodsForEmail(auth, campos.email.valor.trim())
      if (metodos.length > 0) {
        setErro('email', 'Este e-mail já está cadastrado.')
        setLoading(false)
        return
      }

      const cpfLimpo = campos.cpf.valor.replace(/\D/g, '')
      if (cpfLimpo !== '11111111111') {
        const q = query(collection(db, 'usuarios'), where('cpf', '==', cpfLimpo))
        const snap = await getDocs(q)
        if (!snap.empty) {
          setErro('cpf', 'Este CPF já está cadastrado.')
          setLoading(false)
          return
        }
      }

      const { user } = await createUserWithEmailAndPassword(
        auth,
        campos.email.valor.trim(),
        campos.senha.valor
      )

      await setDoc(doc(db, 'usuarios', user.uid), {
        nome:      campos.nome.valor.trim(),
        sobrenome: campos.sobrenome.valor.trim(),
        email:     campos.email.valor.trim(),
        cpf:       cpfLimpo,
        cep:       campos.cep.valor.replace(/\D/g, ''),
        criadoEm:  new Date(),
      })

      navigate('/', { state: { cadastroSucesso: true } })
    } catch (err) {
      switch (err.code) {
        case 'auth/email-already-in-use':
          setErro('email', 'Este e-mail já está cadastrado.')
          break
        case 'auth/weak-password':
          setErro('senha', 'Senha muito fraca.')
          break
        default:
          setErroGeral('Erro ao cadastrar. Tente novamente.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className={styles.page}>
      <div className={styles.card}>

        <div className={styles.header}>
          <h1>MindCare</h1>
          <p>Crie sua conta</p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <Alert type="error" message={erroGeral} />

          <div className={styles.duo}>
            <Input
              id="nome"
              label="Nome"
              value={campos.nome.valor}
              onChange={e => set('nome', e.target.value)}
              onBlur={blurNome}
              placeholder="João"
              error={campos.nome.erro}
            />
            <Input
              id="sobrenome"
              label="Sobrenome"
              value={campos.sobrenome.valor}
              onChange={e => set('sobrenome', e.target.value)}
              onBlur={blurSobrenome}
              placeholder="Silva"
              error={campos.sobrenome.erro}
            />
          </div>

          <Input
            id="email"
            label="E-mail"
            type="email"
            value={campos.email.valor}
            onChange={e => set('email', e.target.value)}
            onBlur={blurEmail}
            placeholder="joao@email.com"
            error={campos.email.erro}
          />

          <Input
            id="senha"
            label="Senha"
            type="password"
            value={campos.senha.valor}
            onChange={e => set('senha', e.target.value)}
            onBlur={blurSenha}
            placeholder="Mínimo 6 caracteres"
            error={campos.senha.erro}
          />

          <Input
            id="confirmaSenha"
            label="Confirmar senha"
            type="password"
            value={campos.confirmaSenha.valor}
            onChange={e => set('confirmaSenha', e.target.value)}
            onBlur={blurConfirmaSenha}
            placeholder="Repita a senha"
            error={campos.confirmaSenha.erro}
          />

          <Input
            id="cpf"
            label="CPF"
            value={campos.cpf.valor}
            onChange={e => set('cpf', formatarCPF(e.target.value))}
            onBlur={blurCPF}
            placeholder="000.000.000-00"
            error={campos.cpf.erro}
          />

          <div>
            <Input
              id="cep"
              label="CEP"
              value={campos.cep.valor}
              onChange={e => set('cep', formatarCEP(e.target.value))}
              onBlur={blurCEP}
              placeholder="00000-000"
              error={campos.cep.erro}
            />
            {buscandoCep && <p className={styles.hint}>Buscando CEP...</p>}
            {enderecoInfo && !campos.cep.erro && (
              <p className={styles.enderecoInfo}>{enderecoInfo}</p>
            )}
          </div>

          <Button type="submit" loading={loading} disabled={loading}>
            {loading ? 'Cadastrando...' : 'Criar conta'}
          </Button>

          <p className={styles.hint}>
            Já tem conta?{' '}
            <Link to="/" className={styles.link}>Entrar</Link>
          </p>
        </form>
      </div>
    </main>
  )
}