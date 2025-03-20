import { Box, Button, Typography, Link, Fade } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';

export const Donation = ({ modoEscuro }) => {
  const handleDonationClick = () => {
    // Substitua pela URL do site oficial de doações
    window.open('https://www.abibliadigital.com.br', '_blank');
  };

  return (
    <Fade in={true}>
      <Box 
        sx={{ 
          mt: 4, 
          p: 2, 
          borderRadius: 2,
          border: '1px dashed',
          borderColor: 'primary.main',
          textAlign: 'center',
          bgcolor: modoEscuro ? 'rgba(25, 118, 210, 0.08)' : 'rgba(25, 118, 210, 0.04)'
        }}
      >
        <Box display="flex" alignItems="center" justifyContent="center" mb={1}>
          <FavoriteIcon color="error" sx={{ mr: 1 }} />
          <Typography variant="h6" component="h2">
            Apoie este projeto
          </Typography>
        </Box>
        
        <Typography variant="body2" paragraph sx={{ mb: 2 }}>
          Ajude ao criador da API a continuar levando a palavra de Deus para mais pessoas.
          Sua contribuição faz a diferença!
        </Typography>
        
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleDonationClick}
          startIcon={<FavoriteIcon />}
          sx={{ 
            px: 3, 
            py: 1, 
            borderRadius: 4,
            fontWeight: 'bold'
          }}
        >
          Fazer uma Doação
        </Button>
      </Box>
    </Fade>
  );
}; 