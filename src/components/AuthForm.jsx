import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Link, 
  Fade, 
  CircularProgress,
  Divider 
} from '@mui/material';

export const AuthForm = ({
  modoRegistro,
  nome,
  email,
  senha,
  erro,
  loading,
  onNomeChange,
  onEmailChange,
  onSenhaChange,
  onSubmit,
  onToggleMode
}) => {
  return (
    <Box 
      component="form" 
      onSubmit={onSubmit} 
      sx={{ mt: 3 }}
    >
      <Fade in={modoRegistro}>
        <Box>
          {modoRegistro && (
            <TextField
              fullWidth
              label="Nome"
              value={nome}
              onChange={(e) => onNomeChange(e.target.value)}
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
        onChange={(e) => onEmailChange(e.target.value)}
        margin="normal"
        required
      />

      <TextField
        fullWidth
        label="Senha"
        type="password"
        value={senha}
        onChange={(e) => onSenhaChange(e.target.value)}
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
          onClick={onToggleMode}
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
  );
}; 