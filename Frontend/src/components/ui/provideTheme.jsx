import { createContext, useContext, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../../redux/themeSlice'; // Adjust path

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const dispatch = useDispatch();
  // Read the theme mode directly from the Redux store
  const { mode } = useSelector((state) => state.theme);

  const isDarkMode = mode === 'dark';

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(isDarkMode ? 'light' : 'dark');
    root.classList.add(mode);
  }, [mode, isDarkMode]);

  // The toggle function now just dispatches the Redux action
  const toggleDarkMode = () => {
    dispatch(toggleTheme());
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);