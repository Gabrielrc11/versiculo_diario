import { Box, Container, Paper, IconButton, Typography } from '@mui/material';
import BookIcon from '@mui/icons-material/Book';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { UserProfile } from '../components/UserProfile';

export const MainLayout = ({ children, modoEscuro, onToggleTheme, userInfo, onLogout, loadingUserInfo, token }) => {
  return (
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
          <UserProfile 
            userInfo={userInfo} 
            onLogout={onLogout} 
            loading={loadingUserInfo} 
            token={token}
          />
          
          <Box position="absolute" right={8} top={8}>
            <IconButton onClick={onToggleTheme} size="small">
              {modoEscuro ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Box>

          <Box display="flex" alignItems="center" justifyContent="center" mb={3}>
            <BookIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
            <Typography variant="h4" component="h1" gutterBottom>
              Versículo Diário
            </Typography>
          </Box>

          <Box display="flex" alignItems="center" justifyContent="center" mb={3}>
            <Typography variant="h6" component="h1" gutterBottom>
              Seu versículo na palma da mão
            </Typography>
          </Box>
          
          {children}
        </Paper>
      </Container>
    </Box>
  );
}; 