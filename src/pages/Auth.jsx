import { useState } from 'react';
import { Typography } from '@mui/material';
import { AuthForm } from '../components/AuthForm';
import { MainLayout } from '../layouts/MainLayout';
import { login, register, recoverPassword } from '../services/api';

export const Auth = ({ onLogin, modoEscuro, onToggleTheme }) => {
  const [loading, setLoading] = useState(false);
  const [modoRegistro, setModoRegistro] = useState(false);
  const [modoRecuperacao, setModoRecuperacao] = useState(false);
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [nome, setNome] = useState('');
  const [erro, setErro] = useState('');
  const [mensagemSucesso, setMensagemSucesso] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErro('');
    setMensagemSucesso('');

    try {
      let data;
      
      if (modoRecuperacao) {
        if (!email || !email.includes('@')) {
          setErro('Por favor, forneça um email válido.');
          setLoading(false);
          return;
        }

        data = await recoverPassword(email);
        setMensagemSucesso('Email de recuperação enviado com sucesso! Verifique sua caixa de entrada.');
        setLoading(false);
        return;
      }
      
      if (modoRegistro) {
        if (senha.length < 6) {
          setErro('A senha deve ter pelo menos 6 caracteres.');
          setLoading(false);
          return;
        }

        if (nome.length < 3) {
          setErro('O nome deve ter pelo menos 3 caracteres.');
          setLoading(false);
          return;
        }

        data = await register(nome, email, senha);
      } else {
        data = await login(email, senha);
      }

      if (data.token) {
        onLogin(data.token);
      } else {
        throw new Error('Token não recebido');
      }
    } catch (error) {
      console.error('Erro:', error);
      
      if (modoRecuperacao) {
        if (error.response?.status === 404) {
          setErro('Email não encontrado em nossa base de dados.');
        } else {
          setErro('Erro ao processar o pedido de recuperação. Tente novamente mais tarde.');
        }
      } else if (error.response?.status === 404) {
        setErro('Email ou senha incorretos.');
      } else if (error.response?.status === 400) {
        if (error.response?.data?.msg?.includes('already exists')) {
          setErro('Este email já está em uso.');
        } else {
          setErro('Dados inválidos. Verifique suas informações.');
        }
      } else {
        setErro('Erro ao processar sua solicitação. Tente novamente mais tarde.');
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setModoRegistro(!modoRegistro);
    setModoRecuperacao(false);
    setErro('');
    setMensagemSucesso('');
    setEmail('');
    setSenha('');
    setNome('');
  };

  const ativarModoRecuperacao = () => {
    setModoRecuperacao(true);
    setModoRegistro(false);
    setErro('');
    setMensagemSucesso('');
    setSenha('');
    setNome('');
  };

  const voltarParaLogin = () => {
    setModoRecuperacao(false);
    setModoRegistro(false);
    setErro('');
    setMensagemSucesso('');
    setEmail('');
    setSenha('');
  };

  return (
    <MainLayout 
      modoEscuro={modoEscuro} 
      onToggleTheme={onToggleTheme}
      userInfo={null}
      onLogout={null}
      loadingUserInfo={false}
      token={null}
    >
      <Typography variant="body1" gutterBottom align="center" color="text.secondary">
        {modoRecuperacao 
          ? ''
          : modoRegistro 
            ? 'Crie sua conta para começar' 
            : 'Bem-vindo de volta!'}
      </Typography>

      {mensagemSucesso && (
        <Typography 
          sx={{ 
            mt: 2, 
            p: 1, 
            bgcolor: 'success.main', 
            color: 'white',
            borderRadius: 1,
            fontSize: '0.875rem',
            mb: 2
          }}
        >
          {mensagemSucesso}
        </Typography>
      )}

      <AuthForm
        modoRegistro={modoRegistro}
        modoRecuperacao={modoRecuperacao}
        nome={nome}
        email={email}
        senha={senha}
        erro={erro}
        loading={loading}
        onNomeChange={setNome}
        onEmailChange={setEmail}
        onSenhaChange={setSenha}
        onSubmit={handleSubmit}
        onToggleMode={toggleMode}
        onRecuperarSenha={ativarModoRecuperacao}
        onVoltarLogin={voltarParaLogin}
      />
    </MainLayout>
  );
}; 