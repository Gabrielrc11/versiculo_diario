import { useState, useEffect } from 'react';
import { Container, Paper, Typography, Box, CircularProgress, TextField, Button, Link } from '@mui/material';
import axios from 'axios';

function App() {
  const [versiculo, setVersiculo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('bibliaToken'));
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [nome, setNome] = useState('');
  const [erro, setErro] = useState('');
  const [modoRegistro, setModoRegistro] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErro('');

    try {
      const response = await axios.put('https://www.abibliadigital.com.br/api/users/token', {
        email,
        password: senha
      });

      const novoToken = response.data.token;
      setToken(novoToken);
      localStorage.setItem('bibliaToken', novoToken);
      buscarVersiculo(novoToken);
    } catch (error) {
      console.error('Erro no login:', error);
      if (error.response?.status === 400) {
        setErro('Email ou senha inválidos.');
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
      const response = await axios.post('https://www.abibliadigital.com.br/api/users', {
        name: nome,
        email: email,
        password: senha,
        notifications: true
      });

      // Após registro bem-sucedido, usar o token retornado
      const novoToken = response.data.token;
      setToken(novoToken);
      localStorage.setItem('bibliaToken', novoToken);
      buscarVersiculo(novoToken);
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
    try {
      const response = await axios.get('https://www.abibliadigital.com.br/api/verses/nvi/random', {
        headers: {
          'Authorization': `Bearer ${tokenAtual}`
        }
      });

      setVersiculo(response.data);
    } catch (error) {
      console.error('Erro ao buscar versículo:', error);
      if (error.response?.status === 401) {
        setToken(null);
        localStorage.removeItem('bibliaToken');
      }
    } finally {
      setLoading(false);
    }
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
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Versículo Diário
          </Typography>
          <Typography variant="body1" gutterBottom align="center">
            {modoRegistro ? 'Crie sua conta' : 'Faça login para ver o versículo do dia'}
          </Typography>
          <Box 
            component="form" 
            onSubmit={modoRegistro ? handleRegistro : handleLogin} 
            sx={{ mt: 3 }}
          >
            {modoRegistro && (
              <TextField
                fullWidth
                label="Nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                margin="normal"
                required
              />
            )}
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
            />
            {erro && (
              <Typography color="error" sx={{ mt: 2 }}>
                {erro}
              </Typography>
            )}
            <Button
              fullWidth
              type="submit"
              variant="contained"
              sx={{ mt: 3 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : (modoRegistro ? 'Criar Conta' : 'Entrar')}
            </Button>
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Link
                component="button"
                variant="body2"
                onClick={() => {
                  setModoRegistro(!modoRegistro);
                  limparCampos();
                }}
                sx={{ cursor: 'pointer' }}
              >
                {modoRegistro 
                  ? 'Já tem uma conta? Faça login' 
                  : 'Não tem uma conta? Registre-se'}
              </Link>
            </Box>
          </Box>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Versículo do Dia
        </Typography>
        
        {loading ? (
          <Box display="flex" justifyContent="center" my={4}>
            <CircularProgress />
          </Box>
        ) : versiculo ? (
          <>
            <Typography variant="h6" color="primary" gutterBottom>
              {versiculo.book.name} {versiculo.chapter}:{versiculo.number}
            </Typography>
            <Typography variant="body1" paragraph>
              {versiculo.text}
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Button
                variant="outlined"
                onClick={() => buscarVersiculo(token)}
                sx={{ mr: 1 }}
              >
                Novo Versículo
              </Button>
              <Button
                variant="text"
                color="error"
                onClick={() => {
                  setToken(null);
                  localStorage.removeItem('bibliaToken');
                }}
              >
                Sair
              </Button>
            </Box>
          </>
        ) : (
          <Typography color="error">
            Erro ao carregar o versículo. Por favor, tente novamente mais tarde.
          </Typography>
        )}
      </Paper>
    </Container>
  );
}

export default App;
