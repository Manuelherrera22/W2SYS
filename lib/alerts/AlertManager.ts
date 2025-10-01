'use client'

import { supabase } from '@/lib/supabase'
import { RolexProduct, ServiceRecord } from '@/lib/types-rolex'

export type AlertType = 'info' | 'warning' | 'error' | 'success'
export type AlertPriority = 'low' | 'medium' | 'high' | 'critical'

export interface Alert {
  id: string
  type: AlertType
  priority: AlertPriority
  title: string
  message: string
  action?: string
  data?: any
  created_at: string
  read: boolean
  user_id: string
}

export interface NotificationRule {
  id: string
  name: string
  condition: string
  message: string
  type: AlertType
  priority: AlertPriority
  enabled: boolean
  created_at: string
}

export class AlertManager {
  private static instance: AlertManager
  private listeners: ((alerts: Alert[]) => void)[] = []

  static getInstance(): AlertManager {
    if (!AlertManager.instance) {
      AlertManager.instance = new AlertManager()
    }
    return AlertManager.instance
  }

  // Crear alerta
  async createAlert(alert: Omit<Alert, 'id' | 'created_at' | 'read'>): Promise<Alert> {
    try {
      const { data, error } = await supabase
        .from('system_alerts')
        .insert([{
          ...alert,
          created_at: new Date().toISOString(),
          read: false
        }])
        .select()
        .single()

      if (error) throw error

      // Notificar a los listeners
      this.notifyListeners()

      return data
    } catch (error) {
      console.error('Error creating alert:', error)
      throw error
    }
  }

  // Obtener alertas del usuario
  async getUserAlerts(userId: string): Promise<Alert[]> {
    try {
      const { data, error } = await supabase
        .from('system_alerts')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error getting user alerts:', error)
      return []
    }
  }

  // Marcar alerta como leída
  async markAsRead(alertId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('system_alerts')
        .update({ read: true })
        .eq('id', alertId)

      if (error) throw error
      this.notifyListeners()
    } catch (error) {
      console.error('Error marking alert as read:', error)
    }
  }

  // Verificar reglas de alertas automáticas
  async checkAlertRules(products: RolexProduct[], services: ServiceRecord[]): Promise<void> {
    try {
      const { data: rules, error } = await supabase
        .from('notification_rules')
        .select('*')
        .eq('enabled', true)

      if (error) throw error

      for (const rule of rules || []) {
        await this.evaluateRule(rule, products, services)
      }
    } catch (error) {
      console.error('Error checking alert rules:', error)
    }
  }

  // Evaluar regla específica
  private async evaluateRule(rule: NotificationRule, products: RolexProduct[], services: ServiceRecord[]): Promise<void> {
    try {
      let shouldTrigger = false
      let alertData: any = {}

      switch (rule.condition) {
        case 'product_long_service':
          const longServiceProducts = products.filter(p => {
            if (p.status !== 'On Service') return false
            const serviceRecord = services.find(s => s.product_id === p.id)
            if (!serviceRecord) return false
            const daysInService = Math.floor((Date.now() - new Date(serviceRecord.date).getTime()) / (1000 * 60 * 60 * 24))
            return daysInService > 30
          })
          
          if (longServiceProducts.length > 0) {
            shouldTrigger = true
            alertData = { products: longServiceProducts }
          }
          break

        case 'high_value_unsold':
          const highValueUnsold = products.filter(p => 
            p.status === 'Ready' && (p.price || p.cost) > 10000
          )
          
          if (highValueUnsold.length > 0) {
            shouldTrigger = true
            alertData = { products: highValueUnsold }
          }
          break

        case 'duplicate_serial':
          const serialCounts: { [key: string]: number } = {}
          products.forEach(p => {
            serialCounts[p.serial] = (serialCounts[p.serial] || 0) + 1
          })
          
          const duplicates = Object.entries(serialCounts).filter(([_, count]) => count > 1)
          if (duplicates.length > 0) {
            shouldTrigger = true
            alertData = { duplicates }
          }
          break

        case 'service_cost_exceeded':
          const expensiveServices = services.filter(s => s.cost > 1000)
          if (expensiveServices.length > 0) {
            shouldTrigger = true
            alertData = { services: expensiveServices }
          }
          break
      }

      if (shouldTrigger) {
        await this.createAlert({
          type: rule.type,
          priority: rule.priority,
          title: rule.name,
          message: rule.message,
          data: alertData,
          user_id: 'system' // Alertas del sistema
        })
      }
    } catch (error) {
      console.error('Error evaluating rule:', error)
    }
  }

  // Alertas específicas del sistema
  async createSystemAlert(
    type: AlertType,
    priority: AlertPriority,
    title: string,
    message: string,
    data?: any
  ): Promise<void> {
    await this.createAlert({
      type,
      priority,
      title,
      message,
      data,
      user_id: 'system'
    })
  }

  // Suscribirse a cambios de alertas
  subscribe(listener: (alerts: Alert[]) => void): () => void {
    this.listeners.push(listener)
    
    return () => {
      const index = this.listeners.indexOf(listener)
      if (index > -1) {
        this.listeners.splice(index, 1)
      }
    }
  }

  // Notificar a los listeners
  private notifyListeners(): void {
    // En una implementación real, aquí obtendrías las alertas actualizadas
    // y las pasarías a todos los listeners
    this.listeners.forEach(listener => {
      // listener(alerts)
    })
  }

  // Crear reglas de alerta por defecto
  async createDefaultRules(): Promise<void> {
    const defaultRules: Omit<NotificationRule, 'id' | 'created_at'>[] = [
      {
        name: 'Producto en servicio por más de 30 días',
        condition: 'product_long_service',
        message: 'Hay productos que llevan más de 30 días en servicio',
        type: 'warning',
        priority: 'medium',
        enabled: true
      },
      {
        name: 'Productos de alto valor sin vender',
        condition: 'high_value_unsold',
        message: 'Hay productos de alto valor listos para vender',
        type: 'info',
        priority: 'medium',
        enabled: true
      },
      {
        name: 'Seriales duplicados detectados',
        condition: 'duplicate_serial',
        message: 'Se detectaron seriales duplicados en el sistema',
        type: 'error',
        priority: 'high',
        enabled: true
      },
      {
        name: 'Servicios con costo elevado',
        condition: 'service_cost_exceeded',
        message: 'Hay servicios con costos superiores a $1,000',
        type: 'warning',
        priority: 'medium',
        enabled: true
      }
    ]

    try {
      const { error } = await supabase
        .from('notification_rules')
        .insert(defaultRules.map(rule => ({
          ...rule,
          created_at: new Date().toISOString()
        })))

      if (error) throw error
    } catch (error) {
      console.error('Error creating default rules:', error)
    }
  }
}

// Hook para usar el alert manager
export function useAlerts() {
  const alertManager = AlertManager.getInstance()

  return {
    createAlert: (alert: Omit<Alert, 'id' | 'created_at' | 'read'>) => alertManager.createAlert(alert),
    getUserAlerts: (userId: string) => alertManager.getUserAlerts(userId),
    markAsRead: (alertId: string) => alertManager.markAsRead(alertId),
    checkAlertRules: (products: RolexProduct[], services: ServiceRecord[]) => 
      alertManager.checkAlertRules(products, services),
    createSystemAlert: (type: AlertType, priority: AlertPriority, title: string, message: string, data?: any) =>
      alertManager.createSystemAlert(type, priority, title, message, data),
    subscribe: (listener: (alerts: Alert[]) => void) => alertManager.subscribe(listener)
  }
}
