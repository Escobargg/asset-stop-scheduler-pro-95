// SAP BTP Compatible Types
export interface SAPEntity {
  /** SAP standard entity identifier */
  sapId?: string;
  /** Client number for multi-tenancy */
  clientId?: string;
  /** Last modified timestamp */
  lastModified?: Date;
  /** Created by user */
  createdBy?: string;
  /** Modified by user */
  modifiedBy?: string;
}

export interface Asset extends SAPEntity {
  id: string;
  tag: string;
  name: string;
  type: string;
  locationCenter: string;
  phase: 'PORTO' | 'MINA' | 'USINA' | 'PELOTIZAÇÃO' | 'FERROVIA';
  system: string;
  category: string;
  executiveDirectorate: string;
  executiveManagement: string;
  groupId?: string;
  /** SAP Plant code */
  plantCode?: string;
  /** SAP Work Center */
  workCenter?: string;
  /** Equipment functional location */
  functionalLocation?: string;
}

export interface AssetGroup extends SAPEntity {
  id: string;
  name: string;
  type: string;
  locationCenter: string;
  locationCenterName: string;
  phase: 'PORTO' | 'MINA' | 'USINA' | 'PELOTIZAÇÃO' | 'FERROVIA';
  system: string;
  category: string;
  executiveDirectorate: string;
  executiveManagement: string;
  assets: Asset[];
  strategies: MaintenanceStrategy[];
  /** SAP Plant code */
  plantCode?: string;
  /** SAP Maintenance Planning Plant */
  maintenancePlant?: string;
  /** SAP Planner Group */
  plannerGroup?: string;
}

export interface MaintenanceStrategy extends SAPEntity {
  id: string;
  name: string;
  groupId: string;
  frequency: {
    value: number;
    unit: 'days' | 'weeks' | 'months' | 'years';
  };
  duration: {
    value: number;
    unit: 'hours' | 'days';
  };
  startDate: Date;
  endDate?: Date;
  isActive: boolean;
  description?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  teams?: string[];
  totalHours?: number;
  completionPercentage?: number;
  createdAt: Date;
  updatedAt: Date;
  /** SAP Maintenance Strategy */
  sapStrategyId?: string;
  /** SAP Maintenance Package */
  maintenancePackage?: string;
  /** SAP Task List */
  taskListId?: string;
}

export interface GanttItem {
  id: string;
  name: string;
  type: 'group' | 'asset';
  parentId?: string;
  strategies: MaintenanceStrategy[];
  level: number;
  expanded?: boolean;
}

export interface CalendarEvent {
  id: string;
  strategyId: string;
  groupId: string;
  startDate: Date;
  endDate: Date;
  title: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export interface MaintenanceStop extends SAPEntity {
  id: string;
  groupId: string;
  strategyId?: string;
  title: string;
  description: string;
  /** @deprecated Use plannedStartDate instead */
  startDate: Date;
  /** @deprecated Use plannedEndDate instead */
  endDate: Date;
  /** Data de início planejada */
  plannedStartDate: Date;
  /** Data de fim planejada */
  plannedEndDate: Date;
  /** Data de início realizada */
  actualStartDate?: Date;
  /** Data de fim realizada */
  actualEndDate?: Date;
  duration: number; // em horas
  status: 'planned' | 'in-progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  affectedAssets: string[]; // IDs dos ativos afetados
  responsibleTeam: string;
  estimatedCost?: number;
  actualCost?: number;
  createdAt: Date;
  updatedAt: Date;
  /** SAP Work Order */
  workOrderId?: string;
  /** SAP Notification */
  notificationId?: string;
  /** SAP Cost Center */
  costCenter?: string;
}

export interface DataStore {
  groups: AssetGroup[];
  strategies: MaintenanceStrategy[];
  stops: MaintenanceStop[];
}