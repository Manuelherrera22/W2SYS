'use client'

import { supabase } from '@/lib/supabase'
import { RolexProduct, ServiceRecord } from '@/lib/types-rolex'

export class BackupManager {
  private static instance: BackupManager
  private backupInterval: NodeJS.Timeout | null = null

  static getInstance(): BackupManager {
    if (!BackupManager.instance) {
      BackupManager.instance = new BackupManager()
    }
    return BackupManager.instance
  }

  // Backup automático cada hora
  startAutoBackup() {
    if (this.backupInterval) return

    this.backupInterval = setInterval(async () => {
      try {
        await this.createBackup()
        console.log('✅ Backup automático completado')
      } catch (error) {
        console.error('❌ Error en backup automático:', error)
      }
    }, 3600000) // 1 hora

    console.log('🔄 Backup automático iniciado (cada hora)')
  }

  stopAutoBackup() {
    if (this.backupInterval) {
      clearInterval(this.backupInterval)
      this.backupInterval = null
      console.log('⏹️ Backup automático detenido')
    }
  }

  // Crear backup completo
  async createBackup(): Promise<BackupData> {
    try {
      // Obtener todos los productos
      const { data: products, error: productsError } = await supabase
        .from('rolex_products')
        .select('*')

      if (productsError) throw productsError

      // Obtener todos los servicios
      const { data: services, error: servicesError } = await supabase
        .from('service_records')
        .select('*')

      if (servicesError) throw servicesError

      const backupData: BackupData = {
        timestamp: new Date().toISOString(),
        version: '1.0',
        products: products || [],
        services: services || [],
        metadata: {
          totalProducts: products?.length || 0,
          totalServices: services?.length || 0,
          totalValue: this.calculateTotalValue(products || []),
          backupType: 'automatic'
        }
      }

      // Guardar backup en Supabase
      await this.saveBackupToDatabase(backupData)

      // Descargar backup localmente
      this.downloadBackup(backupData)

      return backupData
    } catch (error) {
      console.error('Error creating backup:', error)
      throw error
    }
  }

  // Guardar backup en base de datos
  private async saveBackupToDatabase(backupData: BackupData) {
    try {
      const { error } = await supabase
        .from('system_backups')
        .insert([{
          timestamp: backupData.timestamp,
          data: backupData,
          size: JSON.stringify(backupData).length,
          type: 'full'
        }])

      if (error) throw error
    } catch (error) {
      console.error('Error saving backup to database:', error)
      // No lanzar error, solo log
    }
  }

  // Descargar backup como archivo
  private downloadBackup(backupData: BackupData) {
    try {
      const dataStr = JSON.stringify(backupData, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = `w2sys-backup-${new Date().toISOString().split('T')[0]}.json`
      
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error downloading backup:', error)
    }
  }

  // Restaurar desde backup
  async restoreFromBackup(backupData: BackupData): Promise<void> {
    try {
      // Verificar formato del backup
      if (!backupData.products || !backupData.services) {
        throw new Error('Formato de backup inválido')
      }

      // Limpiar datos existentes (CUIDADO: Esto borra todo)
      const { error: deleteProductsError } = await supabase
        .from('rolex_products')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000') // Delete all

      if (deleteProductsError) throw deleteProductsError

      const { error: deleteServicesError } = await supabase
        .from('service_records')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000') // Delete all

      if (deleteServicesError) throw deleteServicesError

      // Restaurar productos
      if (backupData.products.length > 0) {
        const { error: productsError } = await supabase
          .from('rolex_products')
          .insert(backupData.products)

        if (productsError) throw productsError
      }

      // Restaurar servicios
      if (backupData.services.length > 0) {
        const { error: servicesError } = await supabase
          .from('service_records')
          .insert(backupData.services)

        if (servicesError) throw servicesError
      }

      console.log('✅ Backup restaurado exitosamente')
    } catch (error) {
      console.error('❌ Error restaurando backup:', error)
      throw error
    }
  }

  // Calcular valor total del inventario
  private calculateTotalValue(products: RolexProduct[]): number {
    return products.reduce((total, product) => {
      return total + (product.price || product.cost || 0)
    }, 0)
  }

  // Obtener backups disponibles
  async getAvailableBackups(): Promise<BackupInfo[]> {
    try {
      const { data, error } = await supabase
        .from('system_backups')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(10)

      if (error) throw error

      return data?.map(backup => ({
        id: backup.id,
        timestamp: backup.timestamp,
        size: backup.size,
        type: backup.type
      })) || []
    } catch (error) {
      console.error('Error getting backups:', error)
      return []
    }
  }
}

export interface BackupData {
  timestamp: string
  version: string
  products: RolexProduct[]
  services: ServiceRecord[]
  metadata: {
    totalProducts: number
    totalServices: number
    totalValue: number
    backupType: 'automatic' | 'manual'
  }
}

export interface BackupInfo {
  id: string
  timestamp: string
  size: number
  type: string
}

// Hook para usar el backup manager
export function useBackup() {
  const backupManager = BackupManager.getInstance()

  return {
    createBackup: () => backupManager.createBackup(),
    restoreFromBackup: (data: BackupData) => backupManager.restoreFromBackup(data),
    getAvailableBackups: () => backupManager.getAvailableBackups(),
    startAutoBackup: () => backupManager.startAutoBackup(),
    stopAutoBackup: () => backupManager.stopAutoBackup()
  }
}
