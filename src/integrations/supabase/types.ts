export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      asset_groups: {
        Row: {
          category: string
          client_id: string | null
          created_at: string
          created_by: string | null
          executive_directorate: string
          executive_management: string
          id: string
          location_center_id: string | null
          maintenance_plant: string | null
          modified_by: string | null
          name: string
          phase: Database["public"]["Enums"]["phase_type"]
          planner_group: string | null
          plant_code: string | null
          sap_id: string | null
          system: string
          type: string
          updated_at: string
        }
        Insert: {
          category: string
          client_id?: string | null
          created_at?: string
          created_by?: string | null
          executive_directorate: string
          executive_management: string
          id?: string
          location_center_id?: string | null
          maintenance_plant?: string | null
          modified_by?: string | null
          name: string
          phase: Database["public"]["Enums"]["phase_type"]
          planner_group?: string | null
          plant_code?: string | null
          sap_id?: string | null
          system: string
          type: string
          updated_at?: string
        }
        Update: {
          category?: string
          client_id?: string | null
          created_at?: string
          created_by?: string | null
          executive_directorate?: string
          executive_management?: string
          id?: string
          location_center_id?: string | null
          maintenance_plant?: string | null
          modified_by?: string | null
          name?: string
          phase?: Database["public"]["Enums"]["phase_type"]
          planner_group?: string | null
          plant_code?: string | null
          sap_id?: string | null
          system?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "asset_groups_location_center_id_fkey"
            columns: ["location_center_id"]
            isOneToOne: false
            referencedRelation: "location_centers"
            referencedColumns: ["id"]
          },
        ]
      }
      assets: {
        Row: {
          category: string
          client_id: string | null
          created_at: string
          created_by: string | null
          executive_directorate: string
          executive_management: string
          functional_location: string | null
          group_id: string | null
          id: string
          location_center_id: string | null
          modified_by: string | null
          name: string
          phase: Database["public"]["Enums"]["phase_type"]
          plant_code: string | null
          sap_id: string | null
          system: string
          tag: string
          type: string
          updated_at: string
          work_center: string | null
        }
        Insert: {
          category: string
          client_id?: string | null
          created_at?: string
          created_by?: string | null
          executive_directorate: string
          executive_management: string
          functional_location?: string | null
          group_id?: string | null
          id?: string
          location_center_id?: string | null
          modified_by?: string | null
          name: string
          phase: Database["public"]["Enums"]["phase_type"]
          plant_code?: string | null
          sap_id?: string | null
          system: string
          tag: string
          type: string
          updated_at?: string
          work_center?: string | null
        }
        Update: {
          category?: string
          client_id?: string | null
          created_at?: string
          created_by?: string | null
          executive_directorate?: string
          executive_management?: string
          functional_location?: string | null
          group_id?: string | null
          id?: string
          location_center_id?: string | null
          modified_by?: string | null
          name?: string
          phase?: Database["public"]["Enums"]["phase_type"]
          plant_code?: string | null
          sap_id?: string | null
          system?: string
          tag?: string
          type?: string
          updated_at?: string
          work_center?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "assets_location_center_id_fkey"
            columns: ["location_center_id"]
            isOneToOne: false
            referencedRelation: "location_centers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_assets_group_id"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "asset_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      location_centers: {
        Row: {
          corridor: string | null
          created_at: string
          executive_directorate: string
          executive_management: string
          id: string
          maintenance_plant: string | null
          name: string
          phase: Database["public"]["Enums"]["phase_type"]
          planner_group: string | null
          plant_code: string | null
          process: string | null
          updated_at: string
        }
        Insert: {
          corridor?: string | null
          created_at?: string
          executive_directorate: string
          executive_management: string
          id?: string
          maintenance_plant?: string | null
          name: string
          phase: Database["public"]["Enums"]["phase_type"]
          planner_group?: string | null
          plant_code?: string | null
          process?: string | null
          updated_at?: string
        }
        Update: {
          corridor?: string | null
          created_at?: string
          executive_directorate?: string
          executive_management?: string
          id?: string
          maintenance_plant?: string | null
          name?: string
          phase?: Database["public"]["Enums"]["phase_type"]
          planner_group?: string | null
          plant_code?: string | null
          process?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      maintenance_stops: {
        Row: {
          actual_cost: number | null
          actual_end_date: string | null
          actual_start_date: string | null
          affected_assets: string[]
          client_id: string | null
          cost_center: string | null
          created_at: string
          created_by: string | null
          description: string | null
          duration: number
          end_date: string
          estimated_cost: number | null
          group_id: string
          id: string
          modified_by: string | null
          notification_id: string | null
          planned_end_date: string
          planned_start_date: string
          priority: Database["public"]["Enums"]["priority_type"]
          responsible_team: string
          sap_id: string | null
          start_date: string
          status: Database["public"]["Enums"]["stop_status"]
          strategy_id: string | null
          title: string
          updated_at: string
          work_order_id: string | null
        }
        Insert: {
          actual_cost?: number | null
          actual_end_date?: string | null
          actual_start_date?: string | null
          affected_assets: string[]
          client_id?: string | null
          cost_center?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          duration: number
          end_date: string
          estimated_cost?: number | null
          group_id: string
          id?: string
          modified_by?: string | null
          notification_id?: string | null
          planned_end_date: string
          planned_start_date: string
          priority?: Database["public"]["Enums"]["priority_type"]
          responsible_team: string
          sap_id?: string | null
          start_date: string
          status?: Database["public"]["Enums"]["stop_status"]
          strategy_id?: string | null
          title: string
          updated_at?: string
          work_order_id?: string | null
        }
        Update: {
          actual_cost?: number | null
          actual_end_date?: string | null
          actual_start_date?: string | null
          affected_assets?: string[]
          client_id?: string | null
          cost_center?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          duration?: number
          end_date?: string
          estimated_cost?: number | null
          group_id?: string
          id?: string
          modified_by?: string | null
          notification_id?: string | null
          planned_end_date?: string
          planned_start_date?: string
          priority?: Database["public"]["Enums"]["priority_type"]
          responsible_team?: string
          sap_id?: string | null
          start_date?: string
          status?: Database["public"]["Enums"]["stop_status"]
          strategy_id?: string | null
          title?: string
          updated_at?: string
          work_order_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "maintenance_stops_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "asset_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "maintenance_stops_strategy_id_fkey"
            columns: ["strategy_id"]
            isOneToOne: false
            referencedRelation: "maintenance_strategies"
            referencedColumns: ["id"]
          },
        ]
      }
      maintenance_strategies: {
        Row: {
          client_id: string | null
          completion_percentage: number | null
          created_at: string
          created_by: string | null
          description: string | null
          duration_unit: Database["public"]["Enums"]["duration_unit"]
          duration_value: number
          end_date: string | null
          frequency_unit: Database["public"]["Enums"]["frequency_unit"]
          frequency_value: number
          group_id: string
          id: string
          is_active: boolean
          maintenance_package: string | null
          modified_by: string | null
          name: string
          priority: Database["public"]["Enums"]["priority_type"]
          sap_id: string | null
          sap_strategy_id: string | null
          start_date: string
          task_list_id: string | null
          teams: string[] | null
          total_hours: number | null
          updated_at: string
        }
        Insert: {
          client_id?: string | null
          completion_percentage?: number | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          duration_unit: Database["public"]["Enums"]["duration_unit"]
          duration_value: number
          end_date?: string | null
          frequency_unit: Database["public"]["Enums"]["frequency_unit"]
          frequency_value: number
          group_id: string
          id?: string
          is_active?: boolean
          maintenance_package?: string | null
          modified_by?: string | null
          name: string
          priority?: Database["public"]["Enums"]["priority_type"]
          sap_id?: string | null
          sap_strategy_id?: string | null
          start_date: string
          task_list_id?: string | null
          teams?: string[] | null
          total_hours?: number | null
          updated_at?: string
        }
        Update: {
          client_id?: string | null
          completion_percentage?: number | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          duration_unit?: Database["public"]["Enums"]["duration_unit"]
          duration_value?: number
          end_date?: string | null
          frequency_unit?: Database["public"]["Enums"]["frequency_unit"]
          frequency_value?: number
          group_id?: string
          id?: string
          is_active?: boolean
          maintenance_package?: string | null
          modified_by?: string | null
          name?: string
          priority?: Database["public"]["Enums"]["priority_type"]
          sap_id?: string | null
          sap_strategy_id?: string | null
          start_date?: string
          task_list_id?: string | null
          teams?: string[] | null
          total_hours?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "maintenance_strategies_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "asset_groups"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      duration_unit: "hours" | "days"
      frequency_unit: "days" | "weeks" | "months" | "years"
      phase_type: "PORTO" | "MINA" | "USINA" | "PELOTIZAÇÃO" | "FERROVIA"
      priority_type: "low" | "medium" | "high" | "critical"
      stop_status: "planned" | "in-progress" | "completed" | "cancelled"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      duration_unit: ["hours", "days"],
      frequency_unit: ["days", "weeks", "months", "years"],
      phase_type: ["PORTO", "MINA", "USINA", "PELOTIZAÇÃO", "FERROVIA"],
      priority_type: ["low", "medium", "high", "critical"],
      stop_status: ["planned", "in-progress", "completed", "cancelled"],
    },
  },
} as const
