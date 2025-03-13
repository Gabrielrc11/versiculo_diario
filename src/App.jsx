import { useState, useEffect } from 'react';
import { 
  Container, 
  Paper, 
  Typography, 
  Box, 
  CircularProgress, 
  TextField, 
  Button, 
  Link,
  IconButton,
  Fade,
  Tooltip,
  Divider,
  Alert,
  Snackbar
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import RefreshIcon from '@mui/icons-material/Refresh';
import LogoutIcon from '@mui/icons-material/Logout';
import BookIcon from '@mui/icons-material/Book';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import axios from 'axios';

// Configuração base do axios
axios.defaults.baseURL = 'https://www.abibliadigital.com.br/api';
axios.defaults.headers.common['Accept'] = 'application/json';
axios.defaults.headers.post['Content-Type'] = 'application/json';

// Criando um tema personalizado
const getTheme = (mode) => createTheme({
  palette: {
    mode,
    primary: {
      main: mode === 'light' ? '#1e88e5' : '#90caf9',
    },
    background: {
      default: mode === 'light' ? '#f5f5f5' : '#121212',
      paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontSize: '1rem',
          padding: '8px 24px',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
  },
});

function App() {
  const [versiculo, setVersiculo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('bibliaToken'));
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [nome, setNome] = useState('');
  const [erro, setErro] = useState('');
  const [modoRegistro, setModoRegistro] = useState(false);
  const [modoEscuro, setModoEscuro] = useState(localStorage.getItem('modoEscuro') === 'true');
  const [animarVersiculo, setAnimarVersiculo] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const theme = getTheme(modoEscuro ? 'dark' : 'light');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErro('');

    try {
      // Primeiro, tenta autenticar
      const response = await axios.post('/users/auth', {
        email,
        password: senha
      });

      if (response.data.token) {
        const novoToken = response.data.token;
        setToken(novoToken);
        localStorage.setItem('bibliaToken', novoToken);
        setSnackbar({ open: true, message: 'Login realizado com sucesso!', severity: 'success' });
        buscarVersiculo(novoToken);
      } else {
        throw new Error('Token não recebido');
      }
    } catch (error) {
      console.error('Erro no login:', error);
      
      if (error.response?.status === 404) {
        setErro('Email ou senha incorretos.');
      } else if (error.response?.status === 400) {
        setErro('Dados inválidos. Verifique suas informações.');
      } else {
        setErro('Erro ao fazer login. Tente novamente mais tarde.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegistro = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErro('');

    // Validações
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

    try {
      // Tenta criar o usuário
      const response = await axios.post('/users', {
        name: nome,
        email: email,
        password: senha,
        notifications: true
      });

      if (response.data.token) {
        const novoToken = response.data.token;
        setToken(novoToken);
        localStorage.setItem('bibliaToken', novoToken);
        setSnackbar({ open: true, message: 'Conta criada com sucesso!', severity: 'success' });
        buscarVersiculo(novoToken);
      } else {
        // Se não recebeu o token, tenta fazer login
        await handleLogin(e);
      }
    } catch (error) {
      console.error('Erro no registro:', error);
      
      if (error.response?.status === 400) {
        if (error.response?.data?.msg?.includes('already exists')) {
          setErro('Este email já está em uso.');
        } else {
          setErro(error.response?.data?.msg || 'Dados inválidos. Verifique as informações.');
        }
      } else {
        setErro('Erro ao criar conta. Tente novamente mais tarde.');
      }
    } finally {
      setLoading(false);
    }
  };

  const buscarVersiculo = async (tokenAtual) => {
    setLoading(true);
    setAnimarVersiculo(false);
    
    try {
      const response = await axios.get('/verses/nvi/random', {
        headers: {
          'Authorization': `Bearer ${tokenAtual}`
        }
      });

      if (response.data) {
        setTimeout(() => {
          setVersiculo(response.data);
          setAnimarVersiculo(true);
        }, 300);
      }
    } catch (error) {
      console.error('Erro ao buscar versículo:', error);
      if (error.response?.status === 401) {
        setToken(null);
        localStorage.removeItem('bibliaToken');
        setSnackbar({ open: true, message: 'Sessão expirada. Por favor, faça login novamente.', severity: 'warning' });
      } else {
        setSnackbar({ open: true, message: 'Erro ao carregar versículo. Tente novamente.', severity: 'error' });
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleModoEscuro = () => {
    const novoModo = !modoEscuro;
    setModoEscuro(novoModo);
    localStorage.setItem('modoEscuro', novoModo);
  };

  useEffect(() => {
    if (token) {
      buscarVersiculo(token);
    }
  }, [token]);

  const limparCampos = () => {
    setEmail('');
    setSenha('');
    setNome('');
    setErro('');
  };

  if (!token) {
    return (
      <ThemeProvider theme={theme}>
        <Box sx={{ 
          minHeight: '100vh', 
          bgcolor: 'background.default',
          transition: 'background-color 0.3s ease'
        }}>
          <Container maxWidth="sm" sx={{ pt: 4, pb: 4 }}>
            <Paper 
              elevation={modoEscuro ? 2 : 1} 
              sx={{ 
                p: 4,
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <Box position="absolute" right={8} top={8}>
                <IconButton onClick={toggleModoEscuro} size="small">
                  {modoEscuro ? <LightModeIcon /> : <DarkModeIcon />}
                </IconButton>
              </Box>

              <Box display="flex" alignItems="center" justifyContent="center" mb={3}>
                <BookIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
                <Typography variant="h4" component="h1" gutterBottom>
                  Versículo Diário
                </Typography>
              </Box>

              <Typography variant="body1" gutterBottom align="center" color="text.secondary">
                {modoRegistro ? 'Crie sua conta para começar' : 'Bem-vindo de volta!'}
              </Typography>

              <Box 
                component="form" 
                onSubmit={modoRegistro ? handleRegistro : handleLogin} 
                sx={{ mt: 3 }}
              >
                <Fade in={modoRegistro}>
                  <Box>
                    {modoRegistro && (
                      <TextField
                        fullWidth
                        label="Nome"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        margin="normal"
                        required
                        sx={{ mb: 2 }}
                      />
                    )}
                  </Box>
                </Fade>

                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  margin="normal"
                  required
                />

                <TextField
                  fullWidth
                  label="Senha"
                  type="password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  margin="normal"
                  required
                  helperText={modoRegistro ? "Mínimo de 6 caracteres" : ""}
                />

                {erro && (
                  <Typography 
                    color="error" 
                    sx={{ 
                      mt: 2, 
                      p: 1, 
                      bgcolor: 'error.main', 
                      color: 'white',
                      borderRadius: 1,
                      fontSize: '0.875rem'
                    }}
                  >
                    {erro}
                  </Typography>
                )}

                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  sx={{ mt: 3, height: 48 }}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : (modoRegistro ? 'Criar Conta' : 'Entrar')}
                </Button>

                <Divider sx={{ my: 3 }} />

                <Box sx={{ textAlign: 'center' }}>
                  <Link
                    component="button"
                    variant="body2"
                    onClick={() => {
                      setModoRegistro(!modoRegistro);
                      setErro('');
                      limparCampos();
                    }}
                    sx={{ 
                      cursor: 'pointer',
                      textDecoration: 'none',
                      '&:hover': {
                        textDecoration: 'underline'
                      }
                    }}
                  >
                    {modoRegistro 
                      ? 'Já tem uma conta? Faça login' 
                      : 'Não tem uma conta? Registre-se'}
                  </Link>
                </Box>
              </Box>
            </Paper>
          </Container>
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ 
        minHeight: '100vh', 
        bgcolor: 'background.default',
        transition: 'background-color 0.3s ease'
      }}>
        <Container maxWidth="sm" sx={{ pt: 4, pb: 4 }}>
          <Paper 
            elevation={modoEscuro ? 2 : 1} 
            sx={{ 
              p: 4, 
              textAlign: 'center',
              position: 'relative'
            }}
          >
            <Box position="absolute" right={8} top={8}>
              <IconButton onClick={toggleModoEscuro} size="small">
                {modoEscuro ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>
            </Box>

            <Box display="flex" alignItems="center" justifyContent="center" mb={4}>
              <BookIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
              <Typography variant="h4" component="h1">
                Versículo do Dia
              </Typography>
            </Box>
            
            {loading ? (
              <Box display="flex" justifyContent="center" my={8}>
                <CircularProgress />
              </Box>
            ) : versiculo ? (
              <Fade in={animarVersiculo}>
                <Box>
                  <Paper 
                    elevation={0} 
                    sx={{ 
                      p: 3, 
                      bgcolor: 'action.hover',
                      borderRadius: 2
                    }}
                  >
                    <Typography 
                      variant="h6" 
                      color="primary" 
                      gutterBottom 
                      sx={{ fontWeight: 500 }}
                    >
                      {versiculo.book.name} {versiculo.chapter}:{versiculo.number}
                    </Typography>
                    <Typography 
                      variant="body1" 
                      paragraph 
                      sx={{ 
                        fontSize: '1.1rem',
                        lineHeight: 1.6,
                        fontStyle: 'italic'
                      }}
                    >
                      "{versiculo.text}"
                    </Typography>
                  </Paper>

                  <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 2 }}>
                    <Tooltip title="Novo versículo">
                      <IconButton
                        onClick={() => buscarVersiculo(token)}
                        color="primary"
                        sx={{ 
                          bgcolor: 'action.hover',
                          '&:hover': { bgcolor: 'action.selected' }
                        }}
                      >
                        <RefreshIcon />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Sair">
                      <IconButton
                        onClick={() => {
                          setToken(null);
                          localStorage.removeItem('bibliaToken');
                        }}
                        color="error"
                        sx={{ 
                          bgcolor: 'action.hover',
                          '&:hover': { bgcolor: 'action.selected' }
                        }}
                      >
                        <LogoutIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              </Fade>
            ) : (
              <Typography color="error">
                Erro ao carregar o versículo. Por favor, tente novamente mais tarde.
              </Typography>
            )}
          </Paper>
        </Container>
        
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
      </Box>
    </ThemeProvider>
  );
}

export default App;
