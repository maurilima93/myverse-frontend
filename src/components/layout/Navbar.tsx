import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, User, LogOut, Menu, X, Users, UserPlus, Bell } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [user, setUser] = useState<{ username: string } | null>(null);
  const [notifications, setNotifications] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Verificar se o usuário está logado
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
        fetchNotifications();
      } catch (error) {
        console.error('Erro ao parsear dados do usuário:', error);
      }
    }
  }, [location]);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/friends/requests/count`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setNotifications(data.count || 0);
      }
    } catch (error) {
      console.error('Erro ao buscar notificações:', error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm('');
      setIsOpen(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={user ? "/dashboard" : "/"} className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">MV</span>
            </div>
            <span className="text-white font-bold text-xl">MyVerse</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {user ? (
              <>
                {/* Search Bar */}
                <form onSubmit={handleSearch} className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar filmes, séries, jogos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 text-white w-80"
                  />
                </form>

                {/* Navigation Links */}
                <Link
                  to="/dashboard"
                  className={`text-gray-300 hover:text-white transition-colors ${
                    isActive('/dashboard') ? 'text-purple-400' : ''
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/search"
                  className={`text-gray-300 hover:text-white transition-colors ${
                    isActive('/search') ? 'text-purple-400' : ''
                  }`}
                >
                  Explorar
                </Link>
                <Link
                  to="/forum"
                  className={`text-gray-300 hover:text-white transition-colors ${
                    isActive('/forum') ? 'text-purple-400' : ''
                  }`}
                >
                  Fórum
                </Link>
                
                {/* Friends Dropdown */}
                <div className="relative group">
                  <button className={`flex items-center space-x-1 text-gray-300 hover:text-white transition-colors ${
                    isActive('/friends') || isActive('/add-friends') ? 'text-purple-400' : ''
                  }`}>
                    <Users className="h-4 w-4" />
                    <span>Amigos</span>
                    {notifications > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {notifications}
                      </span>
                    )}
                  </button>
                  
                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg border border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="py-2">
                      <Link
                        to="/friends"
                        className="flex items-center space-x-2 px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                      >
                        <Users className="h-4 w-4" />
                        <span>Meus Amigos</span>
                        {notifications > 0 && (
                          <span className="bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center ml-auto">
                            {notifications}
                          </span>
                        )}
                      </Link>
                      <Link
                        to="/add-friends"
                        className="flex items-center space-x-2 px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                      >
                        <UserPlus className="h-4 w-4" />
                        <span>Adicionar Amigos</span>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* User Menu */}
                <div className="relative group">
                  <button className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors">
                    <User className="h-5 w-5" />
                    <span>{user.username}</span>
                  </button>
                  
                  {/* User Dropdown */}
                  <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg border border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="py-2">
                      <Link
                        to="/profile"
                        className="flex items-center space-x-2 px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                      >
                        <User className="h-4 w-4" />
                        <span>Meu Perfil</span>
                      </Link>
                      <Link
                        to="/favorites"
                        className="flex items-center space-x-2 px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                      >
                        <Search className="h-4 w-4" />
                        <span>Meus Favoritos</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-2 w-full px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors text-left"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Sair</span>
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Entrar
                </Link>
                <Link
                  to="/register"
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Cadastrar
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-800 rounded-lg mt-2">
              {user ? (
                <>
                  {/* Mobile Search */}
                  <form onSubmit={handleSearch} className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Buscar..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-purple-500 text-white w-full"
                    />
                  </form>

                  <Link
                    to="/dashboard"
                    className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/search"
                    className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Explorar
                  </Link>
                  <Link
                    to="/forum"
                    className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Fórum
                  </Link>
                  
                  {/* Mobile Friends Section */}
                  <div className="border-t border-gray-700 pt-2 mt-2">
                    <div className="px-3 py-2 text-gray-400 text-sm font-medium">Amigos</div>
                    <Link
                      to="/friends"
                      className="flex items-center space-x-2 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      <Users className="h-4 w-4" />
                      <span>Meus Amigos</span>
                      {notifications > 0 && (
                        <span className="bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center ml-auto">
                          {notifications}
                        </span>
                      )}
                    </Link>
                    <Link
                      to="/add-friends"
                      className="flex items-center space-x-2 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      <UserPlus className="h-4 w-4" />
                      <span>Adicionar Amigos</span>
                    </Link>
                  </div>

                  {/* Mobile User Section */}
                  <div className="border-t border-gray-700 pt-2 mt-2">
                    <div className="px-3 py-2 text-gray-400 text-sm font-medium">{user.username}</div>
                    <Link
                      to="/profile"
                      className="flex items-center space-x-2 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      <User className="h-4 w-4" />
                      <span>Meu Perfil</span>
                    </Link>
                    <Link
                      to="/favorites"
                      className="flex items-center space-x-2 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      <Search className="h-4 w-4" />
                      <span>Meus Favoritos</span>
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsOpen(false);
                      }}
                      className="flex items-center space-x-2 w-full px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition-colors text-left"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sair</span>
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Entrar
                  </Link>
                  <Link
                    to="/register"
                    className="block px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Cadastrar
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

