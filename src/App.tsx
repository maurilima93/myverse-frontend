import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import './App.css';

// Componentes de Autenticação
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';

// Componentes de Layout
import Navbar from './components/layout/Navbar';
import LoadingScreen from './components/ui/LoadingScreen';

// Páginas
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import OnboardingPage from './pages/OnboardingPage';
import ProfilePage from './pages/ProfilePage';
import ForumPage from './pages/ForumPage';
import ForumTopicPage from './pages/ForumTopicPage';
import CreateTopicPage from './pages/CreateTopicPage';
import SearchPage from './pages/SearchPage';
import FavoritesPage from './pages/FavoritesPage';
import AboutPage from './pages/AboutPage';

// Componente para rotas protegidas
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Componente para rotas públicas (redireciona se já logado)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

// Layout principal com navbar
const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        {children}
      </main>
    </div>
  );
};

// Layout sem navbar (para login/registo)
const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  );
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Rotas Públicas */}
      <Route 
        path="/" 
        element={
          <MainLayout>
            <HomePage />
          </MainLayout>
        } 
      />
      <Route 
        path="about" 
        element={
          <MainLayout>
            <AboutPage/>
          </MainLayout>
        } 
      />
      {/* Rotas de Autenticação */}
      <Route 
        path="/login" 
        element={
          <PublicRoute>
            <AuthLayout>
              <LoginForm />
            </AuthLayout>
          </PublicRoute>
        } 
      />
      
      <Route 
        path="/register" 
        element={
          <PublicRoute>
            <AuthLayout>
              <RegisterForm />
            </AuthLayout>
          </PublicRoute>
        } 
      />

      {/* Rotas Protegidas */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <MainLayout>
              <DashboardPage />
            </MainLayout>
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/onboarding" 
        element={
          <ProtectedRoute>
            <MainLayout>
              <OnboardingPage />
            </MainLayout>
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <MainLayout>
              <ProfilePage />
            </MainLayout>
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/search" 
        element={
          <MainLayout>
            <SearchPage />
          </MainLayout>
        } 
      />

      <Route 
        path="/favorites" 
        element={
          <ProtectedRoute>
            <MainLayout>
              <FavoritesPage />
            </MainLayout>
          </ProtectedRoute>
        } 
      />

      {/* Rotas do Fórum */}
      <Route 
        path="/forum" 
        element={
          <MainLayout>
            <ForumPage />
          </MainLayout>
        } 
      />

      <Route 
        path="/forum/topic/:id" 
        element={
          <MainLayout>
            <ForumTopicPage />
          </MainLayout>
        } 
      />

      <Route 
        path="/forum/create" 
        element={
          <ProtectedRoute>
            <MainLayout>
              <CreateTopicPage />
            </MainLayout>
          </ProtectedRoute>
        } 
      />

      {/* Rota 404 */}
      <Route 
        path="*" 
        element={
          <MainLayout>
            <div className="myverse-container myverse-section text-center">
              <h1 className="myverse-heading-2 mb-4">Página não encontrada</h1>
              <p className="myverse-body-large mb-8">
                A página que procura não existe ou foi movida.
              </p>
              <a 
                href="/" 
                className="myverse-button inline-flex items-center"
              >
                Voltar ao início
              </a>
            </div>
          </MainLayout>
        } 
      />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <AppRoutes />
          
          {/* Toast Notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'hsl(var(--card))',
                color: 'hsl(var(--card-foreground))',
                border: '1px solid hsl(var(--border))',
              },
              success: {
                iconTheme: {
                  primary: 'hsl(var(--primary))',
                  secondary: 'hsl(var(--primary-foreground))',
                },
              },
              error: {
                iconTheme: {
                  primary: 'hsl(var(--destructive))',
                  secondary: 'hsl(var(--destructive-foreground))',
                },
              },
            }}
          />
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;

