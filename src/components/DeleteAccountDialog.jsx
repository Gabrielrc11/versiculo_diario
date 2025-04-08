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
import { useDeleteAccount } from '../hooks/useDeleteAccount';

export const DeleteAccountDialog = ({ open, onClose, token, onSuccess }) => {
  const {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    error,
    resetForm,
    handleDeleteAccount
  } = useDeleteAccount(token, onSuccess);
  
  const handleClose = () => {
    if (!loading) {
      resetForm();
      onClose();
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
          onClick={handleDeleteAccount} 
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