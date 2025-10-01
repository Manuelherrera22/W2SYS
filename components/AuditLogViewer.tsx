'use client';

import * as React from 'react';
import { useAuditLog, AuditLogEntry } from '@/lib/audit/AuditLogManager';

interface AuditLogViewerProps {
  filters?: {
    user_id?: string;
    action?: string;
    table_name?: string;
    date_from?: string;
    date_to?: string;
  };
  showFilters?: boolean;
}

export function AuditLogViewer({ filters = {}, showFilters = true }: AuditLogViewerProps) {
  const { getAuditLogs, loading, error } = useAuditLog();
  const [auditLogs, setAuditLogs] = React.useState<AuditLogEntry[]>([]);
  const [currentFilters, setCurrentFilters] = React.useState(filters);
  const [page, setPage] = React.useState(0);
  const [totalCount, setTotalCount] = React.useState(0);
  const itemsPerPage = 20;

  const loadAuditLogs = React.useCallback(async () => {
    const data = await getAuditLogs({
      ...currentFilters,
      limit: itemsPerPage,
      offset: page * itemsPerPage,
    });
    setAuditLogs(data);
  }, [getAuditLogs, currentFilters, page]);

  React.useEffect(() => {
    loadAuditLogs();
  }, [loadAuditLogs]);

  const handleFilterChange = (key: string, value: string) => {
    setCurrentFilters(prev => ({
      ...prev,
      [key]: value || undefined,
    }));
    setPage(0);
  };

  const clearFilters = () => {
    setCurrentFilters({});
    setPage(0);
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'CREATE': return '➕';
      case 'UPDATE': return '✏️';
      case 'DELETE': return '🗑️';
      case 'LOGIN': return '🔑';
      case 'LOGOUT': return '🚪';
      case 'BACKUP': return '💾';
      default: return '📝';
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'CREATE': return 'text-green-600 bg-green-100';
      case 'UPDATE': return 'text-blue-600 bg-blue-100';
      case 'DELETE': return 'text-red-600 bg-red-100';
      case 'LOGIN': return 'text-purple-600 bg-purple-100';
      case 'LOGOUT': return 'text-gray-600 bg-gray-100';
      case 'BACKUP': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatChanges = (oldData: any, newData: any) => {
    if (!oldData && !newData) return null;
    
    const changes: string[] = [];
    
    if (oldData && newData) {
      // Comparar cambios
      Object.keys(newData).forEach(key => {
        if (oldData[key] !== newData[key]) {
          changes.push(`${key}: "${oldData[key]}" → "${newData[key]}"`);
        }
      });
    } else if (newData) {
      // Creación
      Object.keys(newData).forEach(key => {
        changes.push(`${key}: "${newData[key]}"`);
      });
    }
    
    return changes;
  };

  if (loading && auditLogs.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        Error cargando audit log: {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          🔍 Audit Log
        </h2>
        <button
          onClick={loadAuditLogs}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          🔄 Actualizar
        </button>
      </div>

      {/* Filtros */}
      {showFilters && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            🔍 Filtros
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Acción
              </label>
              <select
                value={currentFilters.action || ''}
                onChange={(e) => handleFilterChange('action', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Todas las acciones</option>
                <option value="CREATE">Crear</option>
                <option value="UPDATE">Actualizar</option>
                <option value="DELETE">Eliminar</option>
                <option value="LOGIN">Iniciar sesión</option>
                <option value="LOGOUT">Cerrar sesión</option>
                <option value="BACKUP">Backup</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tabla
              </label>
              <select
                value={currentFilters.table_name || ''}
                onChange={(e) => handleFilterChange('table_name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Todas las tablas</option>
                <option value="rolex_products">Productos</option>
                <option value="service_records">Servicios</option>
                <option value="user_profiles">Usuarios</option>
                <option value="system_backups">Backups</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Desde
              </label>
              <input
                type="date"
                value={currentFilters.date_from || ''}
                onChange={(e) => handleFilterChange('date_from', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Hasta
              </label>
              <input
                type="date"
                value={currentFilters.date_to || ''}
                onChange={(e) => handleFilterChange('date_to', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              🗑️ Limpiar Filtros
            </button>
          </div>
        </div>
      )}

      {/* Lista de Audit Logs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            📋 Registro de Actividad
          </h3>
          
          {auditLogs.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No hay registros de auditoría para mostrar
            </div>
          ) : (
            <div className="space-y-4">
              {auditLogs.map((log) => {
                const changes = formatChanges(log.old_data, log.new_data);
                
                return (
                  <div key={log.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${getActionColor(log.action)}`}>
                          {getActionIcon(log.action)} {log.action}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            Usuario: {log.user_id}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {log.table_name} • {log.record_id}
                          </div>
                          {changes && changes.length > 0 && (
                            <div className="mt-2 text-sm">
                              <div className="font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Cambios:
                              </div>
                              <ul className="list-disc list-inside space-y-1">
                                {changes.slice(0, 3).map((change, index) => (
                                  <li key={index} className="text-gray-600 dark:text-gray-400">
                                    {change}
                                  </li>
                                ))}
                                {changes.length > 3 && (
                                  <li className="text-gray-500 dark:text-gray-500">
                                    ... y {changes.length - 3} cambios más
                                  </li>
                                )}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-right text-sm text-gray-500 dark:text-gray-400">
                        <div>{new Date(log.created_at).toLocaleDateString('es-ES')}</div>
                        <div>{new Date(log.created_at).toLocaleTimeString('es-ES')}</div>
                        {log.ip_address && (
                          <div className="text-xs">IP: {log.ip_address}</div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Paginación */}
          {auditLogs.length > 0 && (
            <div className="mt-6 flex justify-between items-center">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Mostrando {page * itemsPerPage + 1} - {Math.min((page + 1) * itemsPerPage, totalCount)} de {totalCount} registros
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setPage(Math.max(0, page - 1))}
                  disabled={page === 0}
                  className="px-3 py-1 bg-gray-500 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors"
                >
                  ← Anterior
                </button>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={auditLogs.length < itemsPerPage}
                  className="px-3 py-1 bg-gray-500 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors"
                >
                  Siguiente →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
