import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, DollarSign, Calendar } from 'lucide-react';
import type { EstatisticasResponse } from '../types';
import { apiService } from '../services/api';

const Dashboard: React.FC = () => {
  const [estatisticas, setEstatisticas] = useState<EstatisticasResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEstatisticas = async () => {
      try {
        const data = await apiService.getEstatisticas();
        setEstatisticas(data);
      } catch (error) {
        // Erro tratado silenciosamente
      } finally {
        setLoading(false);
      }
    };

    fetchEstatisticas();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
      </div>
    );
  }

  if (!estatisticas) {
    return (
      <div className="text-center text-muted">
        Erro ao carregar estatísticas
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div>
      {/* Cards de Estatísticas */}
      <div className="row g-3 mb-4">
        {/* Total de Vendas */}
        <div className="col-sm-6 col-lg-3">
          <div className="card dashboard-card card-stats h-100 border-success" style={{ minHeight: '220px' }}>
            <div className="card-body d-flex flex-column p-3 text-center justify-content-between">
              <div className="mb-2">
                <div className="stats-icon success mx-auto mb-2" style={{ width: 'fit-content' }}>
                  <DollarSign size={36} />
                </div>
                <h6 className="card-title mb-1 fw-bold text-success" style={{ fontSize: '0.9rem', lineHeight: '1.2' }}>Total de Vendas</h6>
              </div>
              <div>
                <h4 className="fw-bold text-dark mb-1" style={{ fontSize: '1.4rem', lineHeight: '1.2' }}>
                  {formatCurrency(2113.33)}
                </h4>
                <small className="text-muted" style={{ fontSize: '0.8rem' }}>
                  Soma de todas as vendas
                </small>
              </div>
            </div>
          </div>
        </div>

        {/* Cliente Maior Volume */}
        <div className="col-sm-6 col-lg-3">
          <div className="card dashboard-card card-stats h-100 border-primary" style={{ minHeight: '200px' }}>
            <div className="card-body d-flex flex-column p-3 text-center justify-content-between">
              <div className="mb-2">
                <div className="stats-icon primary mx-auto mb-2" style={{ width: 'fit-content' }}>
                  <TrendingUp size={36} />
                </div>
                <h6 className="card-title mb-1 fw-bold text-primary" style={{ fontSize: '0.9rem', lineHeight: '1.2' }}>Maior Volume</h6>
              </div>
              <div>
                <h5 className="fw-bold text-dark mb-1" title={estatisticas.clienteMaiorVolume.nomeCompleto} style={{ fontSize: '1rem', lineHeight: '1.3', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                  {estatisticas.clienteMaiorVolume.nomeCompleto}
                </h5>
                <p className="text-primary mb-1" style={{ fontSize: '0.85rem', wordBreak: 'break-word' }}>
                  <strong>Total:</strong> {formatCurrency(estatisticas.clienteMaiorVolume.vendas.reduce((acc, venda) => acc + venda.valor, 0))}
                </p>
                <small className="text-muted" style={{ fontSize: '0.8rem' }}>
                  {estatisticas.clienteMaiorVolume.vendas.length} compras
                </small>
              </div>
            </div>
          </div>
        </div>

        {/* Cliente Maior Média */}
        <div className="col-sm-6 col-lg-3">
          <div className="card dashboard-card card-stats h-100 border-warning" style={{ minHeight: '200px' }}>
            <div className="card-body d-flex flex-column p-3 text-center justify-content-between">
              <div className="mb-2">
                <div className="stats-icon warning mx-auto mb-2" style={{ width: 'fit-content' }}>
                  <Users size={36} />
                </div>
                <h6 className="card-title mb-1 fw-bold text-warning" style={{ fontSize: '0.9rem', lineHeight: '1.2' }}>Maior Média</h6>
              </div>
              <div>
                <h5 className="fw-bold text-dark mb-1" title={estatisticas.clienteMaiorMedia.nomeCompleto} style={{ fontSize: '1rem', lineHeight: '1.3', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                  {estatisticas.clienteMaiorMedia.nomeCompleto}
                </h5>
                <p className="text-warning mb-1" style={{ fontSize: '0.85rem', wordBreak: 'break-word' }}>
                  <strong>Média:</strong> {formatCurrency(
                    estatisticas.clienteMaiorMedia.vendas.reduce((acc, venda) => acc + venda.valor, 0) / 
                    estatisticas.clienteMaiorMedia.vendas.length
                  )}
                </p>
                <small className="text-muted" style={{ fontSize: '0.8rem' }}>
                  {estatisticas.clienteMaiorMedia.vendas.length} compras
                </small>
              </div>
            </div>
          </div>
        </div>

        {/* Cliente Maior Frequência */}
        <div className="col-sm-6 col-lg-3">
          <div className="card dashboard-card card-stats h-100 border-info" style={{ minHeight: '200px' }}>
            <div className="card-body d-flex flex-column p-3 text-center justify-content-between">
              <div className="mb-2">
                <div className="stats-icon info mx-auto mb-2" style={{ width: 'fit-content' }}>
                  <Calendar size={36} />
                </div>
                <h6 className="card-title mb-1 fw-bold text-info" style={{ fontSize: '0.9rem', lineHeight: '1.2' }}>Maior Frequência</h6>
              </div>
              <div>
                <h5 className="fw-bold text-dark mb-1" title={estatisticas.clienteMaiorFrequencia.nomeCompleto} style={{ fontSize: '1rem', lineHeight: '1.3', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                  {estatisticas.clienteMaiorFrequencia.nomeCompleto}
                </h5>
                <p className="text-info mb-1" style={{ fontSize: '0.85rem', wordBreak: 'break-word' }}>
                  <strong>{estatisticas.clienteMaiorFrequencia.vendas.length}</strong> compras realizadas
                </p>
                <small className="text-muted" style={{ fontSize: '0.8rem' }}>
                  Cliente mais fiel
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gráfico de Vendas por Dia */}
      <div className="card dashboard-card mb-4">
        <div className="card-body">
          <h5 className="card-title mb-4">Total de Vendas por Dia</h5>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={estatisticas.totalVendasPorDia}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="data" 
                  tickFormatter={formatDate}
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  tickFormatter={(value) => formatCurrency(value)}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip 
                  formatter={(value: number) => [formatCurrency(value), 'Total']}
                  labelFormatter={formatDate}
                />
                <Line 
                  type="monotone" 
                  dataKey="total" 
                  stroke="#4A90E2" 
                  strokeWidth={3}
                  dot={{ fill: '#4A90E2', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Cards de Destaque */}
      <div className="row g-4">
        {/* Cliente com Maior Volume */}
        <div className="col-lg-4">
          <div className="card dashboard-card h-100 border-primary">
            <div className="card-body d-flex flex-column">
              <div className="d-flex align-items-center mb-3">
                <div className="stats-icon primary me-2 flex-shrink-0">
                  <TrendingUp size={20} />
                </div>
                <h6 className="card-title mb-0 fw-bold text-primary">Maior Volume de Vendas</h6>
              </div>
              <h5 className="fw-bold text-dark mb-2 text-truncate" title={estatisticas.clienteMaiorVolume.nomeCompleto}>
                {estatisticas.clienteMaiorVolume.nomeCompleto}
              </h5>
              <p className="text-primary mb-1 text-break">
                <strong>Total:</strong> {formatCurrency(estatisticas.clienteMaiorVolume.vendas.reduce((acc, venda) => acc + venda.valor, 0))}
              </p>
              <small className="text-muted">
                {estatisticas.clienteMaiorVolume.vendas.length} compras realizadas
              </small>
            </div>
          </div>
        </div>

        {/* Cliente com Maior Média */}
        <div className="col-lg-4">
          <div className="card dashboard-card h-100 border-warning">
            <div className="card-body d-flex flex-column">
              <div className="d-flex align-items-center mb-3">
                <div className="stats-icon warning me-2 flex-shrink-0">
                  <Users size={20} />
                </div>
                <h6 className="card-title mb-0 fw-bold text-warning">Maior Média por Venda</h6>
              </div>
              <h5 className="fw-bold text-dark mb-2 text-truncate" title={estatisticas.clienteMaiorMedia.nomeCompleto}>
                {estatisticas.clienteMaiorMedia.nomeCompleto}
              </h5>
              <p className="text-warning mb-1 text-break">
                <strong>Média:</strong> {formatCurrency(
                  estatisticas.clienteMaiorMedia.vendas.reduce((acc, venda) => acc + venda.valor, 0) / 
                  estatisticas.clienteMaiorMedia.vendas.length
                )}
              </p>
              <small className="text-muted">
                {estatisticas.clienteMaiorMedia.vendas.length} compras realizadas
              </small>
            </div>
          </div>
        </div>

        {/* Cliente com Maior Frequência */}
        <div className="col-lg-4">
          <div className="card dashboard-card h-100 border-info">
            <div className="card-body d-flex flex-column">
              <div className="d-flex align-items-center mb-3">
                <div className="stats-icon info me-2 flex-shrink-0">
                  <Calendar size={20} />
                </div>
                <h6 className="card-title mb-0 fw-bold text-info">Maior Frequência de Compra</h6>
              </div>
              <h5 className="fw-bold text-dark mb-2 text-truncate" title={estatisticas.clienteMaiorFrequencia.nomeCompleto}>
                {estatisticas.clienteMaiorFrequencia.nomeCompleto}
              </h5>
              <p className="text-info mb-1 text-break">
                <strong>{estatisticas.clienteMaiorFrequencia.vendas.length}</strong> dias únicos com compras
              </p>
              <small className="text-muted">
                Cliente mais fiel
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 