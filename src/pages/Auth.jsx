import { Typography } from '@mui/material';
import { AuthForm } from '../components/AuthForm';
import { MainLayout } from '../layouts/MainLayout';
import { useAuth } from '../hooks/useAuth';

export const Auth = ({ onLogin, modoEscuro, onToggleTheme }) => {
  const {
    loading,
    modoRegistro,
    modoRecuperacao,
    email,
    senha,
    nome,
    erro,
    mensagemSucesso,
    setEmail,
    setSenha,
    setNome,
    handleSubmit,
    toggleMode,
    ativarModoRecuperacao,
    voltarParaLogin
  } = useAuth(onLogin);

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