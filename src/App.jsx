import { useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { Alert, Snackbar } from '@mui/material';
import { useTheme } from './hooks/useTheme';
import { Auth } from './pages/Auth';
import { Home } from './pages/Home';

function App() {
  const [token, setToken] = useState(localStorage.getItem('bibliaToken'));
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const { theme, modoEscuro, toggleModoEscuro } = useTheme();

  const handleLogin = (novoToken) => {
    setToken(novoToken);
    localStorage.setItem('bibliaToken', novoToken);
    setSnackbar({ open: true, message: 'Login realizado com sucesso!', severity: 'success' });
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('bibliaToken');
    setSnackbar({ open: true, message: 'Logout realizado com sucesso!', severity: 'info' });
  };

  return (
    <ThemeProvider theme={theme}>
      {!token ? (
        <Auth 
          onLogin={handleLogin}
          modoEscuro={modoEscuro}
          onToggleTheme={toggleModoEscuro}
        />
      ) : (
        <Home
          token={token}
          onLogout={handleLogout}
          modoEscuro={modoEscuro}
          onToggleTheme={toggleModoEscuro}
        />
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}

export default App;
