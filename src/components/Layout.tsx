import React from 'react';
import { BarChart3, Users, LogOut, Menu } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/logo.svg';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { logout, user } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/', icon: BarChart3 },
    { name: 'Clientes', href: '/clientes', icon: Users },
  ];

  const isActive = (href: string) => {
    return location.pathname === href;
  };

  return (
    <div className="d-flex w-100">
      {/* Sidebar para desktop */}
      <div className="sidebar d-none d-md-flex flex-column" style={{ width: '280px' }}>
        <div className="d-flex flex-column h-100">
          {/* Logo */}
          <div className="p-3 border-bottom border-white border-opacity-10">
            <div className="d-flex align-items-center">
              <img src={logo} alt="ToyMetrics Logo" className="me-3" style={{ width: '40px', height: '40px' }} />
              <h5 className="mb-0 fw-bold text-white">ToyMetrics</h5>
            </div>
          </div>

          {/* Navegação */}
          <nav className="flex-grow-1 p-3">
            <ul className="nav flex-column">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.name} className="nav-item">
                    <Link
                      to={item.href}
                      className={`nav-link ${isActive(item.href) ? 'active' : ''}`}
                    >
                      <Icon size={18} className="me-2" />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Usuário */}
          <div className="p-3 border-top border-white border-opacity-10">
            <div className="d-flex align-items-center">
              <img src={logo} alt="ToyMetrics Logo" className="me-3" style={{ width: '24px', height: '24px' }} />
              <div className="flex-grow-1">
                <div className="small fw-medium text-white text-truncate" title={user?.email}>
                  {user?.email || 'Usuário'}
                </div>
                <div className="small text-white text-opacity-75">
                  {user?.role === 'admin' ? 'Administrador' : user?.role || 'Usuário'}
                </div>
              </div>
              <button
                onClick={logout}
                className="btn btn-link btn-sm text-white text-opacity-75 p-1 ms-2"
                title="Sair"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar mobile */}
      <div className={`offcanvas offcanvas-start ${sidebarOpen ? 'show' : ''}`} 
           id="sidebarMobile" 
           tabIndex={-1}
           style={{ width: '280px' }}>
        <div className="offcanvas-header border-bottom border-white border-opacity-10">
          <div className="d-flex align-items-center">
            <img src={logo} alt="ToyMetrics Logo" className="me-3" style={{ width: '40px', height: '40px' }} />
            <h5 className="mb-0 fw-bold text-white">ToyMetrics</h5>
          </div>
          <button
            type="button"
            className="btn-close btn-close-white"
            onClick={() => setSidebarOpen(false)}
          ></button>
        </div>
        <div className="offcanvas-body p-0">
          <nav className="p-3">
            <ul className="nav flex-column">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.name} className="nav-item">
                    <Link
                      to={item.href}
                      className={`nav-link ${isActive(item.href) ? 'active' : ''}`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <Icon size={18} className="me-2" />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          <div className="p-3 border-top border-white border-opacity-10 mt-auto">
            <div className="d-flex align-items-center">
              <img src={logo} alt="ToyMetrics Logo" className="me-3" style={{ width: '24px', height: '24px' }} />
              <div className="flex-grow-1">
                <div className="small fw-medium text-white text-truncate" title={user?.email}>
                  {user?.email || 'Usuário'}
                </div>
                <div className="small text-white text-opacity-75">
                  {user?.role === 'admin' ? 'Administrador' : user?.role || 'Usuário'}
                </div>
              </div>
              <button
                onClick={logout}
                className="btn btn-link btn-sm text-white text-opacity-75 p-1 ms-2"
                title="Sair"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="main-content flex-grow-1">
        {/* Header mobile */}
        <div className="d-md-none navbar navbar-light shadow-sm">
          <div className="container-fluid">
            <button
              className="navbar-toggler border-0"
              type="button"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={20} />
            </button>
            <div className="d-flex align-items-center">
               <img src={logo} alt="ToyMetrics Logo" className="me-3" style={{ width: '40px', height: '40px' }} />
              <span className="navbar-brand mb-0 h6 fw-bold">ToyMetrics</span>
            </div>
            <div className="d-flex align-items-center">
              <div className="d-none d-sm-block me-3">
                <div className="small text-muted text-truncate" style={{ maxWidth: '120px' }} title={user?.email}>
                  {user?.email}
                </div>
              </div>
              <button
                onClick={logout}
                className="btn btn-link btn-sm text-muted p-1"
                title="Sair"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Conteúdo da página */}
        <main className="p-4">
          <div className="container-fluid">
            {children}
          </div>
        </main>
      </div>

      {/* Backdrop para mobile */}
      {sidebarOpen && (
        <div 
          className="offcanvas-backdrop fade show d-md-none" 
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default Layout; 