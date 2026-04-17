import React from 'react';
import ReactDOM from 'react-dom/client';
import { ApolloProvider } from '@apollo/client/react';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'sonner';
import { apolloClient } from '@/lib/apollo';
import { AuthProvider } from '@/context/AuthContext';
import { TooltipProvider } from '@/components/ui/tooltip';
import App from './App';
import '@fontsource-variable/geist';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ApolloProvider client={apolloClient}>
      <BrowserRouter>
        <AuthProvider>
          <TooltipProvider>
            <App />
            <Toaster
              richColors
              position="top-right"
              toastOptions={{
                style: {
                  borderRadius: '14px',
                  fontSize: '13px',
                  fontFamily: 'Geist Variable, system-ui, sans-serif',
                },
              }}
            />
          </TooltipProvider>
        </AuthProvider>
      </BrowserRouter>
    </ApolloProvider>
  </React.StrictMode>,
);
