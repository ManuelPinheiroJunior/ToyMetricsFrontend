import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Eye, EyeOff } from 'lucide-react';
import logo from '../assets/logo.svg';

const Login: React.FC = () => {
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  // Verificar se há mensagem de sucesso do signup
  const successMessage = location.state?.message;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await login({ email, password });
    } catch (error) {
      // Erro tratado pelo contexto de autenticação
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container d-flex align-items-center justify-content-center">
      <div className="login-card card shadow-lg border-0" style={{ maxWidth: '400px', width: '100%' }}>
        <div className="card-body p-4">
          {/* Logo */}
          <div className="text-center mb-4">
            <img src={logo} alt="ToyMetrics Logo" className="mb-3" style={{ width: '64px', height: '64px' }} />
            <h2 className="fw-bold text-dark mb-1">ToyMetrics</h2>
            <p className="text-muted mb-0">Sistema de Gestão de Clientes</p>
          </div>

          {/* Mensagem de Sucesso */}
          {successMessage && (
            <div className="alert alert-success" role="alert">
              {successMessage}
            </div>
          )}

          {/* Formulário */}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label fw-medium">
                Email
              </label>
              <input
                type="email"
                className="form-control form-control-lg"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="form-label fw-medium">
                Senha
              </label>
              <div className="input-group input-group-lg">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-control"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg w-100"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Entrando...
                </>
              ) : (
                'Entrar'
              )}
            </button>
          </form>

          {/* Link para Signup */}
          <div className="text-center mt-4">
            <p className="text-muted mb-0">
              Não tem uma conta?{' '}
              <a href="/signup" className="text-decoration-none fw-medium">
                Criar conta
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 