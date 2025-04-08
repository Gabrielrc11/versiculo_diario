import { useState } from 'react';

export const useUserProfile = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = (onLogout) => {
    if (onLogout) {
      handleClose();
      onLogout();
    }
  };

  const handleDeleteAccountClick = () => {
    handleClose();
    setDeleteDialogOpen(true);
  };

  const handleDeleteSuccess = (onLogout) => {
    setDeleteDialogOpen(false);
    if (onLogout) {
      onLogout();
    }
  };

  const formatarUltimoLogin = (dataString) => {
    if (!dataString) return 'Indisponível';
    
    try {
      const data = new Date(dataString);
      return data.toLocaleDateString('pt-BR', { 
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Data inválida';
    }
  };

  return {
    anchorEl,
    open,
    deleteDialogOpen,
    setDeleteDialogOpen,
    handleClick,
    handleClose,
    handleLogout,
    handleDeleteAccountClick,
    handleDeleteSuccess,
    formatarUltimoLogin
  };
}; 