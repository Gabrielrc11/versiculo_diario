import { 
  IconButton, 
  Avatar, 
  Menu, 
  MenuItem, 
  Typography, 
  Divider, 
  Box,
  ListItemIcon,
  Tooltip,
  CircularProgress
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EmailIcon from '@mui/icons-material/Email';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import { DeleteAccountDialog } from './DeleteAccountDialog';
import { useUserProfile } from '../hooks/useUserProfile';

export const UserProfile = ({ userInfo, onLogout, loading, token }) => {
  const {
    anchorEl,
    open,
    deleteDialogOpen,
    setDeleteDialogOpen,
    handleClick,
    handleClose,
    handleLogout: handleLogoutHook,
    handleDeleteAccountClick,
    handleDeleteSuccess,
    formatarUltimoLogin
  } = useUserProfile();

  const handleLogoutClick = () => handleLogoutHook(onLogout);
  const handleDeleteSuccessClick = () => handleDeleteSuccess(onLogout);

  return (
    <>
      <Tooltip title="Perfil de Usuário">
        <IconButton
          onClick={handleClick}
          size="small"
          sx={{ 
            position: 'absolute', 
            left: 8, 
            top: 8,
            bgcolor: 'action.hover',
            '&:hover': { bgcolor: 'action.selected' }
          }}
        >
          <PersonIcon />
        </IconButton>
      </Tooltip>
      
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          elevation: 2,
          sx: { width: 260, maxWidth: '100%' }
        }}
        transformOrigin={{ horizontal: 'left', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
      >
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
            <CircularProgress size={24} />
          </Box>
        ) : userInfo ? (
          <>
            <Box sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Avatar sx={{ mr: 1, bgcolor: 'primary.main' }}>
                  <PersonIcon />
                </Avatar>
                <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                  Seu Perfil
                </Typography>
              </Box>
              
              <Divider sx={{ my: 1 }} />
              
              {userInfo.lastLogin && (
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <CalendarTodayIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    Último acesso: {formatarUltimoLogin(userInfo.lastLogin)}
                  </Typography>
                </Box>
              )}
              
              {userInfo.requestsPerMonth && userInfo.requestsPerMonth.length > 0 && (
                <Box sx={{ mt: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <QueryStatsIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      Requisições no mês:
                    </Typography>
                  </Box>
                  {userInfo.requestsPerMonth.map((item, index) => (
                    <Typography key={index} variant="body2" color="text.secondary" sx={{ ml: 4 }}>
                      {item.range}: {item.total} requisições
                    </Typography>
                  ))}
                </Box>
              )}
            </Box>
            
            <Divider />
            
            <MenuItem onClick={handleLogoutClick} dense>
              <ListItemIcon>
                <LogoutIcon fontSize="small" color="error" />
              </ListItemIcon>
              <Typography variant="body2" color="error">Sair</Typography>
            </MenuItem>
            
            <MenuItem onClick={handleDeleteAccountClick} dense>
              <ListItemIcon>
                <DeleteForeverIcon fontSize="small" color="error" />
              </ListItemIcon>
              <Typography variant="body2" color="error">Excluir Conta</Typography>
            </MenuItem>
          </>
        ) : onLogout ? (
          <Box sx={{ p: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Carregando informações do usuário...
            </Typography>
            <Divider sx={{ my: 1 }} />
            <MenuItem onClick={handleLogoutClick} dense>
              <ListItemIcon>
                <LogoutIcon fontSize="small" color="error" />
              </ListItemIcon>
              <Typography variant="body2" color="error">Sair</Typography>
            </MenuItem>
          </Box>
        ) : (
          <Box sx={{ p: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Faça login para ver suas informações
            </Typography>
          </Box>
        )}
      </Menu>
      
      <DeleteAccountDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        token={token}
        onSuccess={handleDeleteSuccessClick}
      />
    </>
  );
}; 