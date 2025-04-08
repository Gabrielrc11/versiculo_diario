import { useState } from 'react';
import { deleteAccount } from '../services/api';

export const useDeleteAccount = (token, onSuccess) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setError('');
  };

  const handleDeleteAccount = async () => {
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

  return {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    error,
    resetForm,
    handleDeleteAccount
  };
}; 