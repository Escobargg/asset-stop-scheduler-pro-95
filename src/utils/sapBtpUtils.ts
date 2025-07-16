/**
 * SAP BTP Utility Functions
 * Provides utility functions for SAP Business Technology Platform integration
 */

import { AssetGroup, MaintenanceStrategy, MaintenanceStop } from '@/types';
import { sapBTPService, SAPBTPResponse, handleSAPResponse } from '@/services/sapBtpConfig';

/**
 * Constants for SAP BTP integration
 */
export const SAP_BTP_CONSTANTS = {
  ENTITY_TYPES: {
    ASSET_GROUP: 'MaintenanceAssetGroup',
    STRATEGY: 'MaintenanceStrategy', 
    STOP: 'MaintenanceStop'
  },
  STATUS_CODES: {
    PLANNED: '01',
    IN_PROGRESS: '02', 
    COMPLETED: '03',
    CANCELLED: '04'
  },
  PRIORITY_CODES: {
    LOW: '3',
    MEDIUM: '2',
    HIGH: '1',
    CRITICAL: '0'
  }
} as const;

/**
 * Map application status to SAP status codes
 */
export const mapStatusToSAP = (status: string): string => {
  const statusMap: Record<string, string> = {
    'planned': SAP_BTP_CONSTANTS.STATUS_CODES.PLANNED,
    'in-progress': SAP_BTP_CONSTANTS.STATUS_CODES.IN_PROGRESS,
    'completed': SAP_BTP_CONSTANTS.STATUS_CODES.COMPLETED,
    'cancelled': SAP_BTP_CONSTANTS.STATUS_CODES.CANCELLED
  };
  
  return statusMap[status] || SAP_BTP_CONSTANTS.STATUS_CODES.PLANNED;
};

/**
 * Map SAP status codes to application status
 */
export const mapStatusFromSAP = (sapStatus: string): string => {
  const statusMap: Record<string, string> = {
    [SAP_BTP_CONSTANTS.STATUS_CODES.PLANNED]: 'planned',
    [SAP_BTP_CONSTANTS.STATUS_CODES.IN_PROGRESS]: 'in-progress',
    [SAP_BTP_CONSTANTS.STATUS_CODES.COMPLETED]: 'completed',
    [SAP_BTP_CONSTANTS.STATUS_CODES.CANCELLED]: 'cancelled'
  };
  
  return statusMap[sapStatus] || 'planned';
};

/**
 * Map application priority to SAP priority codes
 */
export const mapPriorityToSAP = (priority: string): string => {
  const priorityMap: Record<string, string> = {
    'low': SAP_BTP_CONSTANTS.PRIORITY_CODES.LOW,
    'medium': SAP_BTP_CONSTANTS.PRIORITY_CODES.MEDIUM,
    'high': SAP_BTP_CONSTANTS.PRIORITY_CODES.HIGH,
    'critical': SAP_BTP_CONSTANTS.PRIORITY_CODES.CRITICAL
  };
  
  return priorityMap[priority] || SAP_BTP_CONSTANTS.PRIORITY_CODES.MEDIUM;
};

/**
 * Convert AssetGroup to SAP format
 */
export const convertAssetGroupToSAP = (group: AssetGroup): Record<string, any> => {
  return sapBTPService.formatForSAP({
    id: group.id,
    name: group.name,
    type: group.type,
    locationCenter: group.locationCenter,
    locationCenterName: group.locationCenterName,
    phase: group.phase,
    system: group.system,
    category: group.category,
    executiveDirectorate: group.executiveDirectorate,
    executiveManagement: group.executiveManagement,
    plantCode: group.plantCode || group.locationCenter,
    maintenancePlant: group.maintenancePlant || group.locationCenter,
    plannerGroup: group.plannerGroup || 'MAI',
    sapId: group.sapId,
    clientId: group.clientId || '100',
    createdBy: group.createdBy || 'SYSTEM',
    modifiedBy: group.modifiedBy || 'SYSTEM',
    lastModified: group.lastModified || new Date()
  });
};

/**
 * Convert MaintenanceStrategy to SAP format
 */
export const convertStrategyToSAP = (strategy: MaintenanceStrategy): Record<string, any> => {
  return sapBTPService.formatForSAP({
    id: strategy.id,
    name: strategy.name,
    groupId: strategy.groupId,
    frequency: strategy.frequency,
    duration: strategy.duration,
    startDate: strategy.startDate,
    endDate: strategy.endDate,
    isActive: strategy.isActive,
    description: strategy.description,
    priority: mapPriorityToSAP(strategy.priority),
    teams: strategy.teams,
    totalHours: strategy.totalHours,
    completionPercentage: strategy.completionPercentage,
    sapStrategyId: strategy.sapStrategyId,
    maintenancePackage: strategy.maintenancePackage,
    taskListId: strategy.taskListId,
    sapId: strategy.sapId,
    clientId: strategy.clientId || '100',
    createdBy: strategy.createdBy || 'SYSTEM',
    modifiedBy: strategy.modifiedBy || 'SYSTEM',
    lastModified: strategy.lastModified || new Date()
  });
};

/**
 * Convert MaintenanceStop to SAP format
 */
export const convertStopToSAP = (stop: MaintenanceStop): Record<string, any> => {
  return sapBTPService.formatForSAP({
    id: stop.id,
    groupId: stop.groupId,
    strategyId: stop.strategyId,
    title: stop.title,
    description: stop.description,
    startDate: stop.startDate,
    endDate: stop.endDate,
    duration: stop.duration,
    status: mapStatusToSAP(stop.status),
    priority: mapPriorityToSAP(stop.priority),
    affectedAssets: stop.affectedAssets,
    responsibleTeam: stop.responsibleTeam,
    estimatedCost: stop.estimatedCost,
    actualCost: stop.actualCost,
    workOrderId: stop.workOrderId,
    notificationId: stop.notificationId,
    costCenter: stop.costCenter,
    sapId: stop.sapId,
    clientId: stop.clientId || '100',
    createdBy: stop.createdBy || 'SYSTEM',
    modifiedBy: stop.modifiedBy || 'SYSTEM',
    lastModified: stop.lastModified || new Date()
  });
};

/**
 * Enhanced error handling for SAP BTP operations
 */
export const handleSAPError = (error: any, operation: string): Error => {
  console.error(`SAP BTP Error in ${operation}:`, error);
  
  if (error.statusCode === 401) {
    return new Error('Não autorizado para executar esta operação SAP');
  }
  
  if (error.statusCode === 403) {
    return new Error('Acesso negado ao sistema SAP');
  }
  
  if (error.statusCode >= 500) {
    return new Error('Erro interno do sistema SAP. Tente novamente mais tarde.');
  }
  
  return new Error(`Erro SAP: ${error.message || 'Erro desconhecido'}`);
};

/**
 * Validate data before sending to SAP
 */
export const validateForSAP = (data: any, entityType: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  // Common validations
  if (!data.id) errors.push('ID é obrigatório');
  if (!data.name && entityType !== SAP_BTP_CONSTANTS.ENTITY_TYPES.STOP) {
    errors.push('Nome é obrigatório');
  }
  
  // Entity-specific validations
  switch (entityType) {
    case SAP_BTP_CONSTANTS.ENTITY_TYPES.ASSET_GROUP:
      if (!data.locationCenter) errors.push('Centro de localização é obrigatório');
      if (!data.phase) errors.push('Fase é obrigatória');
      break;
      
    case SAP_BTP_CONSTANTS.ENTITY_TYPES.STRATEGY:
      if (!data.groupId) errors.push('ID do grupo é obrigatório');
      if (!data.frequency) errors.push('Frequência é obrigatória');
      if (!data.duration) errors.push('Duração é obrigatória');
      break;
      
    case SAP_BTP_CONSTANTS.ENTITY_TYPES.STOP:
      if (!data.groupId) errors.push('ID do grupo é obrigatório');
      if (!data.startDate) errors.push('Data de início é obrigatória');
      if (!data.endDate) errors.push('Data de fim é obrigatória');
      break;
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Create batch request for SAP BTP
 */
export const createSAPBatch = (operations: Array<{
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  url: string;
  data?: any;
}>): Record<string, any> => {
  return {
    requests: operations.map((op, index) => ({
      id: `request_${index}`,
      method: op.method,
      url: op.url,
      headers: sapBTPService.getStandardHeaders(),
      body: op.data ? JSON.stringify(sapBTPService.formatForSAP(op.data)) : undefined
    }))
  };
};

/**
 * Performance monitoring for SAP BTP operations
 */
export const withSAPPerformanceMonitoring = async <T>(
  operation: () => Promise<T>,
  operationName: string
): Promise<T> => {
  const startTime = performance.now();
  
  try {
    const result = await operation();
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    // Log performance metrics (in production, send to monitoring service)
    console.info(`SAP BTP Operation ${operationName} completed in ${duration.toFixed(2)}ms`);
    
    return result;
  } catch (error) {
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    console.error(`SAP BTP Operation ${operationName} failed after ${duration.toFixed(2)}ms:`, error);
    throw error;
  }
};

/**
 * Cache management for SAP BTP data
 */
export class SAPBTPCache {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();
  
  set(key: string, data: any, ttlMs: number = 300000): void { // 5 minutes default TTL
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlMs
    });
  }
  
  get(key: string): any | null {
    const cached = this.cache.get(key);
    
    if (!cached) return null;
    
    if (Date.now() - cached.timestamp > cached.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return cached.data;
  }
  
  clear(): void {
    this.cache.clear();
  }
  
  delete(key: string): boolean {
    return this.cache.delete(key);
  }
}

export const sapBTPCache = new SAPBTPCache();