import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from "./components/ui/sonner"
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from './components/ui/provideTheme.jsx'
import { Provider } from 'react-redux'
import store from './redux/store.js'
import { PersistGate } from 'redux-persist/integration/react';
import { persistor } from './redux/store.js'
import { SocketContextProvider } from './lib/SocketContext.jsx'
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SocketContextProvider>
          <ThemeProvider>
            <App />
            <Toaster />
          </ThemeProvider>

        </SocketContextProvider>
      </PersistGate>


    </Provider>

  </StrictMode>,
)
