import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import logo from '../assets/logo.svg';
import { apiService } from '../services/api';

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      // Chamar a API de registro
      await apiService.register(formData);
      
      // Redirecionar para login após registro bem-sucedido
      navigate('/login', { 
        state: { message: 'Conta criada com sucesso! Faça login para continuar.' }
      });
    } catch (error: any) {
      setError(error.message || 'Erro ao criar conta. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container d-flex align-items-center justify-content-center">
      <div className="login-card card shadow-lg border-0" style={{ maxWidth: '500px', width: '100%' }}>
        <div className="card-body p-4">
          {/* Logo e Título */}
          <div className="text-center mb-4">
            <img src={logo} alt="ToyMetrics Logo" className="mb-3" style={{ width: '64px', height: '64px' }} />
            <h2 className="fw-bold text-dark mb-1">ToyMetrics</h2>
            <p className="text-muted mb-0">Criar Nova Conta</p>
          </div>

          {/* Botão Voltar */}
          <div className="mb-3">
            <button
              type="button"
              className="btn btn-link text-decoration-none p-0"
              onClick={() => navigate('/login')}
            >
              <ArrowLeft size={16} className="me-1" />
              Voltar para Login
            </button>
          </div>

          {/* Mensagem de Erro */}
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          {/* Formulário */}
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="firstName" className="form-label fw-medium">
                  Nome
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Seu nome"
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label htmlFor="lastName" className="form-label fw-medium">
                  Sobrenome
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Seu sobrenome"
                  required
                />
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="username" className="form-label fw-medium">
                Nome de Usuário
              </label>
              <input
                type="text"
                className="form-control"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="nomeusuario"
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="form-label fw-medium">
                Email
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="seu@email.com"
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="dateOfBirth" className="form-label fw-medium">
                Data de Nascimento
              </label>
              <input
                type="date"
                className="form-control"
                id="dateOfBirth"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="form-label fw-medium">
                Senha
              </label>
              <div className="input-group">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-control"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  minLength={6}
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
              <div className="form-text">
                A senha deve ter pelo menos 6 caracteres
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
                  Criando conta...
                </>
              ) : (
                'Criar Conta'
              )}
            </button>
          </form>

          {/* Link para Login */}
          <div className="text-center mt-4">
            <p className="text-muted mb-0">
              Já tem uma conta?{' '}
              <a href="/login" className="text-decoration-none fw-medium">
                Fazer login
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup; 