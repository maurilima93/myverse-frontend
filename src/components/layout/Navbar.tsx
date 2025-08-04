import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { User, Search, Heart, MessageSquare, Users, UserPlus, LogOut, Menu, X } from 'lucide-react';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [friendRequestsCount, setFriendRequestsCount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUsername = localStorage.getItem('username');
    
    if (token && storedUsername) {
      setIsLoggedIn(true);
      setUsername(storedUsername);
      // Simular contagem de solicitações de amizade
      setFriendRequestsCount(3);
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setIsLoggedIn(false);
    setUsername('');
    navigate('/');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  if (!isLoggedIn) {
    return (
      <nav className="bg-gray-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">M</span>
                </div>
                <span className="text-white text-xl font-bold">MyVerse</span>
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Entrar
              </Link>
              <Link
                to="/register"
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Cadastrar
              </Link>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <span className="text-white text-xl font-bold">MyVerse</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/dashboard"
              className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Dashboard
            </Link>
            
            <Link
              to="/search"
              className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-1"
            >
              <Search className="w-4 h-4" />
              <span>Buscar</span>
            </Link>
            
            <Link
              to="/favorites"
              className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-1"
            >
              <Heart className="w-4 h-4" />
              <span>Favoritos</span>
            </Link>
            
            <Link
              to="/forum"
              className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-1"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Fórum</span>
            </Link>

            {/* Menu de Amigos */}
            <div className="relative group">
              <button className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-1">
                <Users className="w-4 h-4" />
                <span>Amigos</span>
                {friendRequestsCount > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 ml-1">
                    {friendRequestsCount}
                  </span>
                )}
              </button>
              
              {/* Dropdown */}
              <div className="absolute right-0 mt-2 w-48 bg-gray-700 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-1">
                  <Link
                    to="/friends"
                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-600 hover:text-white transition-colors"
                  >
                    Meus Amigos
                  </Link>
                  <Link
                    to="/add-friends"
                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-600 hover:text-white transition-colors flex items-center space-x-2"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Adicionar Amigos</span>
                  </Link>
                  {friendRequestsCount > 0 && (
                    <Link
                      to="/friends"
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-600 hover:text-white transition-colors"
                    >
                      Solicitações ({friendRequestsCount})
                    </Link>
                  )}
                </div>
              </div>
            </div>

            {/* Menu do Usuário */}
            <div className="relative group">
              <button className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-1">
                <User className="w-4 h-4" />
                <span>{username}</span>
              </button>
              
              {/* Dropdown */}
              <div className="absolute right-0 mt-2 w-48 bg-gray-700 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-1">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-600 hover:text-white transition-colors"
                  >
                    Meu Perfil
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-600 hover:text-white transition-colors flex items-center space-x-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sair</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMobileMenu}
              className="text-gray-300 hover:text-white p-2"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-700">
              <Link
                to="/dashboard"
                className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              
              <Link
                to="/search"
                className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Buscar
              </Link>
              
              <Link
                to="/favorites"
                className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Favoritos
              </Link>
              
              <Link
                to="/forum"
                className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Fórum
              </Link>
              
              <Link
                to="/friends"
                className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Amigos {friendRequestsCount > 0 && `(${friendRequestsCount})`}
              </Link>
              
              <Link
                to="/add-friends"
                className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Adicionar Amigos
              </Link>
              
              <Link
                to="/profile"
                className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Perfil
              </Link>
              
              <button
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="text-gray-300 hover:text-white block w-full text-left px-3 py-2 rounded-md text-base font-medium"
              >
                Sair
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

