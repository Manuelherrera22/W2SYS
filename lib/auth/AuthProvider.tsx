'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'

export type UserRole = 'admin' | 'manager' | 'viewer' | 'service'

export interface UserProfile {
  id: string
  email: string
  full_name: string
  role: UserRole
  created_at: string
  last_login: string
}

interface AuthContextType {
  user: User | null
  profile: UserProfile | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, fullName: string, role: UserRole) => Promise<void>
  signOut: () => Promise<void>
  hasPermission: (permission: string) => boolean
  canEdit: () => boolean
  canDelete: () => boolean
  canViewAnalytics: () => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Permisos por rol
const ROLE_PERMISSIONS = {
  admin: ['*'], // Todos los permisos
  manager: ['view', 'edit', 'create', 'analytics'],
  viewer: ['view'],
  service: ['view', 'edit_service']
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Obtener sesión inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchUserProfile(session.user.id)
      } else {
        setLoading(false)
      }
    })

    // Escuchar cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        if (session?.user) {
          await fetchUserProfile(session.user.id)
        } else {
          setProfile(null)
          setLoading(false)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) throw error
      setProfile(data)
    } catch (error) {
      console.error('Error fetching user profile:', error)
      // Si no existe perfil, crear uno básico
      await createDefaultProfile(userId)
    } finally {
      setLoading(false)
    }
  }

  const createDefaultProfile = async (userId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('user_profiles')
        .insert([{
          id: userId,
          email: user.email || '',
          full_name: user.user_metadata?.full_name || 'Usuario',
          role: 'viewer', // Rol por defecto
          last_login: new Date().toISOString()
        }])
        .select()
        .single()

      if (error) throw error
      setProfile(data)
    } catch (error) {
      console.error('Error creating user profile:', error)
    }
  }

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    if (error) throw error
  }

  const signUp = async (email: string, password: string, fullName: string, role: UserRole) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: role
        }
      }
    })
    if (error) throw error

    // Crear perfil de usuario
    if (data.user) {
      await supabase
        .from('user_profiles')
        .insert([{
          id: data.user.id,
          email: email,
          full_name: fullName,
          role: role,
          last_login: new Date().toISOString()
        }])
    }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  const hasPermission = (permission: string): boolean => {
    if (!profile) return false
    const permissions = ROLE_PERMISSIONS[profile.role] || []
    return permissions.includes('*') || permissions.includes(permission)
  }

  const canEdit = (): boolean => hasPermission('edit')
  const canDelete = (): boolean => hasPermission('delete')
  const canViewAnalytics = (): boolean => hasPermission('analytics')

  const value = {
    user,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    hasPermission,
    canEdit,
    canDelete,
    canViewAnalytics
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
