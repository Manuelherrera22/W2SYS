import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://wverkbbgofndagwekaap.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind2ZXJrYmJnb2ZuZGFnd2VrYWFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzMjU4NzcsImV4cCI6MjA3NDkwMTg3N30.rwcM7tcbSEFtIlQ6TDFkiEIguW2VUT8ba01fQzTehKQ'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database Types
export interface Database {
  public: {
    Tables: {
      rolex_products: {
        Row: {
          id: string
          case: string
          model: string
          material: string
          bezel: string
          brazalete: string
          provider: string
          serial: string
          year: string
          end_piece_code: string
          movement_number: string
          cost: number
          price: number
          description: string
          in_card: boolean
          in_papers: boolean
          in_services_papers: boolean
          in_has_box: boolean
          in_third_party_inventory: boolean
          images: string[]
          status: string
          service_needs: any
          created_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          id?: string
          case: string
          model: string
          material: string
          bezel: string
          brazalete: string
          provider: string
          serial: string
          year: string
          end_piece_code: string
          movement_number: string
          cost: number
          price: number
          description: string
          in_card: boolean
          in_papers: boolean
          in_services_papers: boolean
          in_has_box: boolean
          in_third_party_inventory: boolean
          images?: string[]
          status?: string
          service_needs?: any
          created_at?: string
          updated_at?: string
          user_id?: string
        }
        Update: {
          id?: string
          case?: string
          model?: string
          material?: string
          bezel?: string
          brazalete?: string
          provider?: string
          serial?: string
          year?: string
          end_piece_code?: string
          movement_number?: string
          cost?: number
          price?: number
          description?: string
          in_card?: boolean
          in_papers?: boolean
          in_services_papers?: boolean
          in_has_box?: boolean
          in_third_party_inventory?: boolean
          images?: string[]
          status?: string
          service_needs?: any
          created_at?: string
          updated_at?: string
          user_id?: string
        }
      }
      service_records: {
        Row: {
          id: string
          product_id: string
          supplier: string
          invoice: string
          cost: number
          status: string
          date: string
          days_in_labor: number
          created_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          id?: string
          product_id: string
          supplier: string
          invoice: string
          cost: number
          status: string
          date: string
          days_in_labor: number
          created_at?: string
          updated_at?: string
          user_id?: string
        }
        Update: {
          id?: string
          product_id?: string
          supplier?: string
          invoice?: string
          cost?: number
          status?: string
          date?: string
          days_in_labor?: number
          created_at?: string
          updated_at?: string
          user_id?: string
        }
      }
    }
  }
}

