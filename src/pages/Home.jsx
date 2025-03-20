import { useState, useEffect } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { MainLayout } from '../layouts/MainLayout';
import { Verse } from '../components/Verse';
import { Donation } from '../components/Donation';
import { getRandomVerse, getUserInfo } from '../services/api';

export const Home = ({ token, onLogout, modoEscuro, onToggleTheme }) => {
  const [versiculo, setVersiculo] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingUserInfo, setLoadingUserInfo] = useState(true);
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

  const buscarInfoUsuario = async () => {
    setLoadingUserInfo(true);
    try {
      console.log('Buscando informações do usuário...');
      const data = await getUserInfo(token);
      console.log('Informações do usuário recebidas:', data);
      setUserInfo(data);
    } catch (error) {
      console.error('Erro ao buscar informações do usuário:', error);
      console.error('Detalhes do erro:', error.response?.data || 'Sem detalhes disponíveis');
      if (error.response?.status === 401) {
        onLogout();
      }
    } finally {
      setLoadingUserInfo(false);
    }
  };

  useEffect(() => {
    buscarVersiculo();
    buscarInfoUsuario();
  }, [token]);

  return (
    <MainLayout 
      modoEscuro={modoEscuro} 
      onToggleTheme={onToggleTheme}
      userInfo={userInfo}
      onLogout={onLogout}
      loadingUserInfo={loadingUserInfo}
      token={token}
    >
      {loading ? (
        <Box display="flex" justifyContent="center" my={8}>
          <CircularProgress />
        </Box>
      ) : versiculo ? (
        <>
          <Verse
            versiculo={versiculo}
            onRefresh={buscarVersiculo}
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