import { Paper, Typography, Box, IconButton, Tooltip, Fade } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import LogoutIcon from '@mui/icons-material/Logout';

export const Verse = ({ versiculo, onRefresh, onLogout, animarVersiculo, modoEscuro }) => {
  return (
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
              onClick={onRefresh}
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
              onClick={onLogout}
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
  );
}; 