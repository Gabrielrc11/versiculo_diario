import { useState, useCallback } from 'react';
import { getTheme } from '../theme';

export const useTheme = () => {
  const [modoEscuro, setModoEscuro] = useState(localStorage.getItem('modoEscuro') === 'true');

  const toggleModoEscuro = useCallback(() => {
    const novoModo = !modoEscuro;
    setModoEscuro(novoModo);
    localStorage.setItem('modoEscuro', novoModo);
  }, [modoEscuro]);

  const theme = getTheme(modoEscuro ? 'dark' : 'light');

  return { theme, modoEscuro, toggleModoEscuro };
}; 