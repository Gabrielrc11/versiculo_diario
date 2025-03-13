import { useState } from 'react';
import { Typography } from '@mui/material';
import { AuthForm } from '../components/AuthForm';
import { MainLayout } from '../layouts/MainLayout';
import { login, register } from '../services/api';

export const Auth = ({ onLogin, modoEscuro, onToggleTheme }) => {
  const [loading, setLoading] = useState(false);
  const [modoRegistro, setModoRegistro] = useState(false);
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [nome, setNome] = useState('');
  const [erro, setErro] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErro('');

    try {
      let data;
      
      if (modoRegistro) {
        if (senha.length < 6) {
          setErro('A senha deve ter pelo menos 6 caracteres.');
          return;
        }

        if (nome.length < 3) {
          setErro('O nome deve ter pelo menos 3 caracteres.');
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
      
      if (error.response?.status === 404) {
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
    setErro('');
    setEmail('');
    setSenha('');
    setNome('');
  };

  return (
    <MainLayout modoEscuro={modoEscuro} onToggleTheme={onToggleTheme}>
      <Typography variant="body1" gutterBottom align="center" color="text.secondary">
        {modoRegistro ? 'Crie sua conta para começar' : 'Bem-vindo de volta!'}
      </Typography>

      <AuthForm
        modoRegistro={modoRegistro}
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
      />
    </MainLayout>
  );
}; 