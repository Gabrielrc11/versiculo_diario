import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Alert,
  CircularProgress
} from '@mui/material';
import { deleteAccount } from '../services/api';

export const DeleteAccountDialog = ({ open, onClose, token, onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleClose = () => {
    if (!loading) {
      setEmail('');
      setPassword('');
      setError('');
      onClose();
    }
  };
  
  const handleConfirm = async () => {
    // Validações básicas
    if (!email || !email.includes('@')) {
      setError('Por favor, informe um email válido');
      return;
    }
    
    if (!password || password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      await deleteAccount(token, email, password);
      onSuccess();
    } catch (error) {
      console.error('Erro ao excluir conta:', error);
      if (error.response?.status === 401) {
        setError('Email ou senha incorretos');
      } else if (error.response?.status === 404) {
        setError('Conta não encontrada');
      } else {
        setError('Erro ao excluir conta. Por favor, tente novamente mais tarde.');
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Excluir Conta</DialogTitle>
      <DialogContent>
        <Typography variant="body1" gutterBottom sx={{ mb: 2 }}>
          Esta ação não pode ser desfeita. Todos os seus dados serão removidos permanentemente.
        </Typography>
        
        <Typography variant="body2" color="error" gutterBottom>
          Para confirmar a exclusão da sua conta, digite seu email e senha:
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ my: 2 }}>
            {error}
          </Alert>
        )}
        
        <TextField
          label="Email"
          type="email"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          margin="normal"
          disabled={loading}
          required
        />
        
        <TextField
          label="Senha"
          type="password"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          margin="normal"
          disabled={loading}
          required
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancelar
        </Button>
        <Button 
          onClick={handleConfirm} 
          color="error" 
          variant="contained" 
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
        >
          {loading ? 'Excluindo...' : 'Excluir Conta'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}; 