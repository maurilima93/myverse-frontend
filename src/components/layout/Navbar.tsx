import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Menu, X, User, LogOut } from 'lucide-react';
import { Button } from '../ui/button';
import { useAuth } from '../../contexts/AuthContext';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="imdb-navbar sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3">
              <img 
                src="/logo.png" 
                alt="MyVerse Logo" 
                className="w-10 h-10 object-contain"
              />
              <span className="text-xl font-bold text-white">MyVerse</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link 
                to="/" 
                className="text-gray-300 hover:text-purple-400 px-3 py-2 text-sm font-medium transition-colors"
              >
                Início
              </Link>
              <Link 
                to="/about" 
                className="text-gray-300 hover:text-purple-400 px-3 py-2 text-sm font-medium transition-colors"
              >
                Sobre
              </Link>
              <Link 
                to="/forum" 
                className="text-gray-300 hover:text-purple-400 px-3 py-2 text-sm font-medium transition-colors"
              >
                Fórum
              </Link>
              <Link 
                to="/privacy" 
                className="text-gray-300 hover:text-purple-400 px-3 py-2 text-sm font-medium transition-colors"
              >
                Política de Privacidade
              </Link>
              {user && (
                <Link 
                  to="/dashboard" 
                  className="text-gray-300 hover:text-purple-400 px-3 py-2 text-sm font-medium transition-colors"
                >
                  Dashboard
                </Link>
              )}
            </div>
          </div>

          {/* Search Bar */}
          <div className="hidden md:block flex-1 max-w-lg mx-8">
            <form onSubmit={handleSearch} className="relative">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="imdb-input w-full pl-10 pr-4 py-2 text-sm"
                  placeholder="Pesquisar filmes, séries, jogos..."
                />
              </div>
            </form>
          </div>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <Link to="/profile">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-gray-300 hover:text-purple-400 hover:bg-purple-500/10"
                  >
                    <User className="h-4 w-4 mr-2" />
                    {user.username}
                  </Button>
                </Link>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleLogout}
                  className="text-gray-300 hover:text-red-400 hover:bg-red-500/10"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sair
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-gray-300 hover:text-purple-400 hover:bg-purple-500/10"
                  >
                    Entrar
                  </Button>
                </Link>
                <Link to="/register">
                  <Button 
                    size="sm"
                    className="purple-button"
                  >
                    Criar conta
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 hover:text-purple-400"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-700">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-900/95 backdrop-blur">
            {/* Mobile Search */}
            <div className="px-3 py-2">
              <form onSubmit={handleSearch} className="relative">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="imdb-input w-full pl-10 pr-4 py-2 text-sm"
                    placeholder="Pesquisar filmes, séries, jogos..."
                  />
                </div>
              </form>
            </div>

            {/* Mobile Navigation Links */}
            <Link
              to="/"
              className="text-gray-300 hover:text-purple-400 block px-3 py-2 text-base font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Início
            </Link>
            <Link
              to="/forum"
              className="text-gray-300 hover:text-purple-400 block px-3 py-2 text-base font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Fórum
            </Link>
            {user && (
              <Link
                to="/dashboard"
                className="text-gray-300 hover:text-purple-400 block px-3 py-2 text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
            )}

            {/* Mobile User Actions */}
            <div className="border-t border-gray-700 pt-4 pb-3">
              {user ? (
                <div className="space-y-2">
                  <Link
                    to="/profile"
                    className="flex items-center px-3 py-2 text-base font-medium text-gray-300 hover:text-purple-400"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="h-5 w-5 mr-3" />
                    {user.username}
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center w-full px-3 py-2 text-base font-medium text-gray-300 hover:text-red-400"
                  >
                    <LogOut className="h-5 w-5 mr-3" />
                    Sair
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link
                    to="/login"
                    className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-purple-400"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Entrar
                  </Link>
                  <Link
                    to="/register"
                    className="block px-3 py-2 text-base font-medium text-purple-400 hover:text-purple-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Criar conta
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

