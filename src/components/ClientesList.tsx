import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, User, Mail, Tag } from 'lucide-react';
import type { Cliente } from '../types';
import { apiService } from '../services/api';
import ClienteForm from './ClienteForm';

const ClientesList: React.FC = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroNome, setFiltroNome] = useState('');
  const [filtroEmail, setFiltroEmail] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [clienteEditando, setClienteEditando] = useState<Cliente | null>(null);

  useEffect(() => {
    fetchClientes();
  }, [filtroNome, filtroEmail]);

  const fetchClientes = async () => {
    try {
      setLoading(true);
      const data = await apiService.getClientes({
        nome: filtroNome || undefined,
        email: filtroEmail || undefined
      });
      setClientes(data);
    } catch (error) {
      // Erro tratado silenciosamente
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este cliente?')) {
      try {
        await apiService.deleteCliente(id);
        await fetchClientes();
      } catch (error) {
        // Erro tratado silenciosamente
      }
    }
  };

  const handleEdit = (cliente: Cliente) => {
    setClienteEditando(cliente);
    setShowForm(true);
  };

  const handleFormSubmit = async (cliente: Omit<Cliente, 'id' | 'vendas' | 'primeiraLetraFaltante'>) => {
    try {
      if (clienteEditando) {
        await apiService.updateCliente(clienteEditando.id!, cliente);
      } else {
        await apiService.createCliente(cliente);
      }
      await fetchClientes();
      setShowForm(false);
    } catch (error) {
      // Erro tratado silenciosamente
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getTotalVendas = (vendas: any[]) => {
    return vendas.reduce((acc, venda) => acc + venda.valor, 0);
  };

  if (showForm) {
    return (
      <ClienteForm
        cliente={clienteEditando}
        onSubmit={handleFormSubmit}
        onCancel={() => {
          setShowForm(false);
          setClienteEditando(null);
        }}
      />
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4">
        <div>
          <h2 className="h3 fw-bold text-dark mb-1">Clientes</h2>
          <p className="text-muted mb-0">Gerencie os clientes da loja de brinquedos</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn btn-primary mt-3 mt-md-0"
        >
          <Plus size={16} className="me-2" />
          Novo Cliente
        </button>
      </div>

      {/* Filtros */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label fw-medium">Filtrar por Nome</label>
              <div className="input-group">
                <span className="input-group-text bg-light">
                  <Search size={16} className="text-muted" />
                </span>
                <input
                  type="text"
                  className="form-control"
                  value={filtroNome}
                  onChange={(e) => setFiltroNome(e.target.value)}
                  placeholder="Digite o nome..."
                />
              </div>
            </div>
            <div className="col-md-6">
              <label className="form-label fw-medium">Filtrar por Email</label>
              <div className="input-group">
                <span className="input-group-text bg-light">
                  <Mail size={16} className="text-muted" />
                </span>
                <input
                  type="email"
                  className="form-control"
                  value={filtroEmail}
                  onChange={(e) => setFiltroEmail(e.target.value)}
                  placeholder="Digite o email..."
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Clientes */}
      {loading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Carregando...</span>
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Cliente</th>
                    <th>Contato</th>
                    <th>Vendas</th>
                    <th>Letra Faltante</th>
                    <th className="text-end">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {clientes.map((cliente) => (
                    <tr key={cliente.id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="stats-icon bg-light me-3">
                            <User size={16} className="text-muted" />
                          </div>
                          <div>
                            <div className="fw-medium text-dark">
                              {cliente.nomeCompleto}
                            </div>
                            <small className="text-muted">
                              Nascimento: {formatDate(cliente.nascimento)}
                            </small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="text-dark">{cliente.email}</div>
                      </td>
                      <td>
                        <div className="text-dark">
                          {cliente.vendas.length} compras
                        </div>
                        <small className="text-muted">
                          Total: {formatCurrency(getTotalVendas(cliente.vendas))}
                        </small>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <Tag size={14} className="text-muted me-1" />
                          <span className="badge bg-secondary badge-custom">
                            {cliente.primeiraLetraFaltante}
                          </span>
                        </div>
                      </td>
                      <td className="text-end">
                        <div className="btn-group" role="group">
                          <button
                            onClick={() => handleEdit(cliente)}
                            className="btn btn-outline-primary btn-sm"
                            title="Editar"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(cliente.id!)}
                            className="btn btn-outline-danger btn-sm"
                            title="Excluir"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {clientes.length === 0 && !loading && (
              <div className="text-center py-5">
                <div className="stats-icon bg-light mx-auto mb-3">
                  <User size={24} className="text-muted" />
                </div>
                <h6 className="text-muted mb-2">Nenhum cliente encontrado</h6>
                <p className="text-muted small mb-0">
                  {filtroNome || filtroEmail ? 'Tente ajustar os filtros.' : 'Comece adicionando um novo cliente.'}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientesList; 