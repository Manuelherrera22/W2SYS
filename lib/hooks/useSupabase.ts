'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { RolexProduct, ServiceRecord } from '@/lib/types-rolex'

export function useSupabaseProducts() {
  const [products, setProducts] = useState<RolexProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch products from Supabase
  const fetchProducts = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('rolex_products')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setProducts(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching products')
      console.error('Error fetching products:', err)
    } finally {
      setLoading(false)
    }
  }

  // Add new product
  const addProduct = async (product: Omit<RolexProduct, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const { data, error } = await supabase
        .from('rolex_products')
        .insert([{
          ...product,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }])
        .select()

      if (error) throw error
      
      if (data && data[0]) {
        const newProduct: RolexProduct = {
          ...data[0],
          id: data[0].id,
          createdAt: data[0].created_at,
          updatedAt: data[0].updated_at,
        }
        setProducts(prev => [newProduct, ...prev])
        return newProduct
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error adding product')
      console.error('Error adding product:', err)
      throw err
    }
  }

  // Update product
  const updateProduct = async (id: string, updates: Partial<RolexProduct>) => {
    try {
      const { data, error } = await supabase
        .from('rolex_products')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()

      if (error) throw error
      
      if (data && data[0]) {
        const updatedProduct: RolexProduct = {
          ...data[0],
          id: data[0].id,
          createdAt: data[0].created_at,
          updatedAt: data[0].updated_at,
        }
        setProducts(prev => prev.map(p => p.id === id ? updatedProduct : p))
        return updatedProduct
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error updating product')
      console.error('Error updating product:', err)
      throw err
    }
  }

  // Delete product
  const deleteProduct = async (id: string) => {
    try {
      const { error } = await supabase
        .from('rolex_products')
        .delete()
        .eq('id', id)

      if (error) throw error
      
      setProducts(prev => prev.filter(p => p.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error deleting product')
      console.error('Error deleting product:', err)
      throw err
    }
  }

  // Real-time subscription
  useEffect(() => {
    fetchProducts()

    const subscription = supabase
      .channel('rolex_products_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'rolex_products' },
        () => {
          fetchProducts() // Refetch on any change
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return {
    products,
    loading,
    error,
    addProduct,
    updateProduct,
    deleteProduct,
    refetch: fetchProducts,
  }
}

export function useSupabaseServices() {
  const [services, setServices] = useState<ServiceRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch services from Supabase
  const fetchServices = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('service_records')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setServices(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching services')
      console.error('Error fetching services:', err)
    } finally {
      setLoading(false)
    }
  }

  // Add new service
  const addService = async (service: Omit<ServiceRecord, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('service_records')
        .insert([{
          ...service,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }])
        .select()

      if (error) throw error
      
      if (data && data[0]) {
        const newService: ServiceRecord = {
          ...data[0],
          id: data[0].id,
        }
        setServices(prev => [newService, ...prev])
        return newService
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error adding service')
      console.error('Error adding service:', err)
      throw err
    }
  }

  // Update service
  const updateService = async (id: string, updates: Partial<ServiceRecord>) => {
    try {
      const { data, error } = await supabase
        .from('service_records')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()

      if (error) throw error
      
      if (data && data[0]) {
        const updatedService: ServiceRecord = {
          ...data[0],
          id: data[0].id,
        }
        setServices(prev => prev.map(s => s.id === id ? updatedService : s))
        return updatedService
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error updating service')
      console.error('Error updating service:', err)
      throw err
    }
  }

  // Real-time subscription
  useEffect(() => {
    fetchServices()

    const subscription = supabase
      .channel('service_records_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'service_records' },
        () => {
          fetchServices() // Refetch on any change
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return {
    services,
    loading,
    error,
    addService,
    updateService,
    refetch: fetchServices,
  }
}

