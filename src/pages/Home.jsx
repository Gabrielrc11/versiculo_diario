import { useState, useEffect } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { MainLayout } from '../layouts/MainLayout';
import { Verse } from '../components/Verse';
import { Donation } from '../components/Donation';
import { getRandomVerse } from '../services/api';

export const Home = ({ token, onLogout, modoEscuro, onToggleTheme }) => {
  const [versiculo, setVersiculo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [animarVersiculo, setAnimarVersiculo] = useState(true);

  const buscarVersiculo = async () => {
    setLoading(true);
    setAnimarVersiculo(false);
    
    try {
      const data = await getRandomVerse(token);
      setTimeout(() => {
        setVersiculo(data);
        setAnimarVersiculo(true);
      }, 300);
    } catch (error) {
      console.error('Erro ao buscar versículo:', error);
      if (error.response?.status === 401) {
        onLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    buscarVersiculo();
  }, [token]);

  return (
    <MainLayout modoEscuro={modoEscuro} onToggleTheme={onToggleTheme}>
      {loading ? (
        <Box display="flex" justifyContent="center" my={8}>
          <CircularProgress />
        </Box>
      ) : versiculo ? (
        <>
          <Verse
            versiculo={versiculo}
            onRefresh={buscarVersiculo}
            onLogout={onLogout}
            animarVersiculo={animarVersiculo}
            modoEscuro={modoEscuro}
          />
          <Donation modoEscuro={modoEscuro} />
        </>
      ) : (
        <Typography color="error">
          Erro ao carregar o versículo. Por favor, tente novamente mais tarde.
        </Typography>
      )}
    </MainLayout>
  );
}; 