import React, { useState, useEffect } from 'react';
import { User, Mail, Calendar, Save, X } from 'lucide-react';
import type { Cliente } from '../types';

interface ClienteFormProps {
  cliente?: Cliente | null;
  onSubmit: (cliente: Omit<Cliente, 'id' | 'vendas' | 'primeiraLetraFaltante'>) => void;
  onCancel: () => void;
}

const ClienteForm: React.FC<ClienteFormProps> = ({ cliente, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    nomeCompleto: '',
    email: '',
    nascimento: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (cliente) {
      setFormData({
        nomeCompleto: cliente.nomeCompleto,
        email: cliente.email,
        nascimento: cliente.nascimento
      });
    }
  }, [cliente]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nomeCompleto.trim()) {
      newErrors.nomeCompleto = 'Nome é obrigatório';
    } else if (formData.nomeCompleto.trim().length < 2) {
      newErrors.nomeCompleto = 'Nome deve ter pelo menos 2 caracteres';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.nascimento) {
      newErrors.nascimento = 'Data de nascimento é obrigatória';
    } else {
      const dataNascimento = new Date(formData.nascimento);
      const hoje = new Date();
      if (dataNascimento > hoje) {
        newErrors.nascimento = 'Data de nascimento não pode ser no futuro';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="w-100">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow-lg border-0">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="card-title mb-0 fw-bold">
                  {cliente ? 'Editar Cliente' : 'Novo Cliente'}
                </h4>
                <button
                  onClick={onCancel}
                  className="btn btn-link text-muted p-0"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                {/* Nome Completo */}
                <div className="mb-3">
                  <label htmlFor="nomeCompleto" className="form-label fw-medium">
                    Nome Completo
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-light">
                      <User size={16} className="text-muted" />
                    </span>
                    <input
                      type="text"
                      id="nomeCompleto"
                      className={`form-control ${errors.nomeCompleto ? 'is-invalid' : ''}`}
                      value={formData.nomeCompleto}
                      onChange={(e) => handleChange('nomeCompleto', e.target.value)}
                      placeholder="Digite o nome completo"
                    />
                  </div>
                  {errors.nomeCompleto && (
                    <div className="invalid-feedback d-block">
                      {errors.nomeCompleto}
                    </div>
                  )}
                </div>

                {/* Email */}
                <div className="mb-3">
                  <label htmlFor="email" className="form-label fw-medium">
                    Email
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-light">
                      <Mail size={16} className="text-muted" />
                    </span>
                    <input
                      type="email"
                      id="email"
                      className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      placeholder="Digite o email"
                    />
                  </div>
                  {errors.email && (
                    <div className="invalid-feedback d-block">
                      {errors.email}
                    </div>
                  )}
                </div>

                {/* Data de Nascimento */}
                <div className="mb-4">
                  <label htmlFor="nascimento" className="form-label fw-medium">
                    Data de Nascimento
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-light">
                      <Calendar size={16} className="text-muted" />
                    </span>
                    <input
                      type="date"
                      id="nascimento"
                      className={`form-control ${errors.nascimento ? 'is-invalid' : ''}`}
                      value={formData.nascimento}
                      onChange={(e) => handleChange('nascimento', e.target.value)}
                    />
                  </div>
                  {errors.nascimento && (
                    <div className="invalid-feedback d-block">
                      {errors.nascimento}
                    </div>
                  )}
                </div>

                {/* Botões */}
                <div className="d-flex justify-content-end gap-2">
                  <button
                    type="button"
                    onClick={onCancel}
                    className="btn btn-outline-secondary"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                  >
                    <Save size={16} className="me-2" />
                    {cliente ? 'Atualizar' : 'Salvar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClienteForm; 