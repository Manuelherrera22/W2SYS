'use client';

import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

export interface AuditLogEntry {
  id: string;
  user_id: string;
  action: string;
  table_name: string;
  record_id: string;
  old_data?: Record<string, any>;
  new_data?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

export interface AuditLogFilters {
  user_id?: string;
  action?: string;
  table_name?: string;
  record_id?: string;
  date_from?: string;
  date_to?: string;
  limit?: number;
  offset?: number;
}

export function useAuditLog() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const logAction = useCallback(async (
    action: string,
    tableName: string,
    recordId: string,
    oldValues?: Record<string, any>,
    newValues?: Record<string, any>
  ) => {
    try {
      setLoading(true);
      setError(null);

      // Obtener información del usuario actual
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('Usuario no autenticado, saltando audit log');
        return;
      }

      // Obtener IP y User Agent
      const ipAddress = await fetch('https://api.ipify.org?format=json')
        .then(res => res.json())
        .then(data => data.ip)
        .catch(() => 'unknown');

      const userAgent = navigator.userAgent;

      // Crear entrada de audit log
      const auditEntry = {
        user_id: user.id,
        action,
        table_name: tableName,
        record_id: recordId,
        old_data: oldValues || null,
        new_data: newValues || null,
        ip_address: ipAddress,
        user_agent: userAgent,
      };

      const { error: insertError } = await supabase
        .from('audit_logs')
        .insert(auditEntry);

      if (insertError) {
        throw insertError;
      }

      return true;
    } catch (err) {
      console.error('Error logging audit action:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const getAuditLogs = useCallback(async (filters: AuditLogFilters = {}) => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false });

      // Aplicar filtros
      if (filters.user_id) {
        query = query.eq('user_id', filters.user_id);
      }
      if (filters.action) {
        query = query.eq('action', filters.action);
      }
      if (filters.table_name) {
        query = query.eq('table_name', filters.table_name);
      }
      if (filters.record_id) {
        query = query.eq('record_id', filters.record_id);
      }
      if (filters.date_from) {
        query = query.gte('created_at', filters.date_from);
      }
      if (filters.date_to) {
        query = query.lte('created_at', filters.date_to);
      }
      if (filters.limit) {
        query = query.limit(filters.limit);
      }
      if (filters.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 50) - 1);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      return data as AuditLogEntry[];
    } catch (err) {
      console.error('Error fetching audit logs:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getAuditLogsForRecord = useCallback(async (tableName: string, recordId: string) => {
    return getAuditLogs({ table_name: tableName, record_id: recordId });
  }, [getAuditLogs]);

  const getAuditLogsForUser = useCallback(async (userId: string) => {
    return getAuditLogs({ user_id: userId });
  }, [getAuditLogs]);

  const getRecentActivity = useCallback(async (limit: number = 10) => {
    return getAuditLogs({ limit });
  }, [getAuditLogs]);

  return {
    loading,
    error,
    logAction,
    getAuditLogs,
    getAuditLogsForRecord,
    getAuditLogsForUser,
    getRecentActivity,
  };
}

// Hook para logging automático de cambios en productos
export function useProductAuditLog() {
  const { logAction } = useAuditLog();

  const logProductAction = useCallback(async (
    action: 'CREATE' | 'UPDATE' | 'DELETE',
    productId: string,
    oldValues?: Record<string, any>,
    newValues?: Record<string, any>
  ) => {
    return logAction(action, 'rolex_products', productId, oldValues, newValues);
  }, [logAction]);

  return { logProductAction };
}

// Hook para logging automático de cambios en servicios
export function useServiceAuditLog() {
  const { logAction } = useAuditLog();

  const logServiceAction = useCallback(async (
    action: 'CREATE' | 'UPDATE' | 'DELETE',
    serviceId: string,
    oldValues?: Record<string, any>,
    newValues?: Record<string, any>
  ) => {
    return logAction(action, 'service_records', serviceId, oldValues, newValues);
  }, [logAction]);

  return { logServiceAction };
}
