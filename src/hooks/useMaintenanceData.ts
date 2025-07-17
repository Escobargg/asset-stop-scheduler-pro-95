import { useState, useCallback, useMemo, useEffect } from 'react';
import { AssetGroup, MaintenanceStrategy, MaintenanceStop, DataStore } from '@/types';
import { fixOrphanedStops, createStopsForGroupsWithoutStops } from '@/utils/stopsFixUtils';
import { sapBTPService, SAPBTPError } from '@/services/sapBtpConfig';
import { 
  convertAssetGroupToSAP, 
  convertStrategyToSAP, 
  convertStopToSAP,
  validateForSAP,
  handleSAPError,
  withSAPPerformanceMonitoring,
  sapBTPCache,
  SAP_BTP_CONSTANTS
} from '@/utils/sapBtpUtils';
import { useMaintenanceSupabase } from './useMaintenanceSupabase';

// Função otimizada para gerar grupos de ativos (reduzido para melhor performance)
const generateAssetGroups = (): AssetGroup[] => {
  const centers = [
    { code: "1089", name: "Tubarão", phases: ["PORTO", "PELOTIZAÇÃO"] },
    { code: "2001", name: "Mina Carajás", phases: ["MINA", "BENEFICIAMENTO"] },
    { code: "3050", name: "Usina Vitória", phases: ["USINA", "LAMINAÇÃO"] },
    { code: "4100", name: "Pelotização Tubarão", phases: ["PELOTIZAÇÃO", "EXPEDIÇÃO"] },
    { code: "5200", name: "Ferrovia Norte", phases: ["FERROVIA", "MANUTENÇÃO"] }
  ];

  const equipmentTypes = [
    "TRANSPORTADOR", "BRITADOR", "PENEIRA", "EMPILHADEIRA", "GUINDASTE"
  ];

  const systems = [
    "Movimentação", "Britagem", "Peneiramento", "Carregamento", "Elevação"
  ];

  const groups: AssetGroup[] = [];
  let assetIdCounter = 1;

  centers.forEach(center => {
    center.phases.forEach(phase => {
      // Criar apenas 3 grupos por centro-fase (otimizado para performance)
      for (let groupIndex = 1; groupIndex <= 3; groupIndex++) {
        const groupId = `${center.code}.${phase}.${groupIndex}`;
        const equipmentType = equipmentTypes[groupIndex - 1] || "EQUIPAMENTO";
        const system = systems[groupIndex - 1] || "Sistema Geral";
        
        // Criar 2-3 ativos por grupo (reduzido)
        const assetsCount = Math.floor(Math.random() * 2) + 2;
        const assets = [];
        
        for (let assetIndex = 1; assetIndex <= assetsCount; assetIndex++) {
          assets.push({
            id: `${assetIdCounter++}`,
            tag: `${center.code}-${phase}-${equipmentType}-${assetIndex.toString().padStart(2, '0')}`,
            name: `${equipmentType} ${center.name} ${assetIndex.toString().padStart(2, '0')}`,
            type: equipmentType,
            locationCenter: center.code,
            phase: phase as any,
            system: system,
            category: groupIndex <= 1 ? "Crítico" : groupIndex <= 2 ? "Importante" : "Normal",
            executiveDirectorate: phase === "USINA" || phase === "LAMINAÇÃO" ? "DIR.EXECUT.AÇOS" : "DIR.EXECUT.FERROSOS",
            executiveManagement: `GER.EXECUT.${center.name.toUpperCase()}`,
            groupId: groupId
          });
        }

        groups.push({
          id: groupId,
          name: `${equipmentType}S ${center.name.toUpperCase()} - ${phase}`,
          type: equipmentType,
          locationCenter: center.code,
          locationCenterName: `${center.code} - ${center.name}`,
          phase: phase as any,
          system: system,
          category: groupIndex <= 1 ? "Crítico" : groupIndex <= 2 ? "Importante" : "Normal",
          executiveDirectorate: phase === "USINA" || phase === "LAMINAÇÃO" ? "DIR.EXECUT.AÇOS" : "DIR.EXECUT.FERROSOS",
          executiveManagement: `GER.EXECUT.${center.name.toUpperCase()}`,
          assets: assets,
          strategies: []
        });
      }
    });
  });

  return groups;
};

// Função para gerar estratégias para os grupos (limitada a 2-3 por grupo)
const generateStrategiesForGroups = (groups: AssetGroup[]): MaintenanceStrategy[] => {
  const strategies: MaintenanceStrategy[] = [];
  let strategyIdCounter = 1;

  const strategyTypes = [
    { name: "Manutenção Preventiva Mensal", frequency: { value: 1, unit: "months" as const }, duration: { value: 3, unit: "days" as const }, priority: "high" as const },
    { name: "Calibração Trimestral", frequency: { value: 3, unit: "months" as const }, duration: { value: 2, unit: "days" as const }, priority: "high" as const },
    { name: "Inspeção Termográfica Semestral", frequency: { value: 6, unit: "months" as const }, duration: { value: 2, unit: "days" as const }, priority: "critical" as const },
    { name: "Análise de Vibração Bimestral", frequency: { value: 2, unit: "months" as const }, duration: { value: 1, unit: "days" as const }, priority: "high" as const }
  ];

  groups.forEach(group => {
    // Limitar estratégias por grupo: mínimo 1, máximo 2 (otimizado)
    const strategiesCount = Math.floor(Math.random() * 2) + 1; // 1-2 estratégias por grupo
    
    for (let i = 0; i < strategiesCount; i++) {
      const strategyType = strategyTypes[i % strategyTypes.length];
      // Distribuir as estratégias ao longo de 2025
      const startMonth = Math.floor(i * 2); // Espalhar as estratégias pelos meses
      const startDay = Math.floor(Math.random() * 28) + 1;
      const startDate = new Date(2025, startMonth % 12, startDay);
      
      strategies.push({
        id: `strategy-${strategyIdCounter++}`,
        name: `${strategyType.name} - ${group.name}`,
        groupId: group.id,
        frequency: strategyType.frequency,
        duration: strategyType.duration,
        startDate: startDate,
        endDate: new Date(2025, 11, 31),
        isActive: true,
        description: `${strategyType.name} para ${group.name}`,
        priority: strategyType.priority,
        teams: [`Equipe ${group.locationCenter}`, "Equipe Manutenção"],
        totalHours: strategyType.duration.value * 24,
        completionPercentage: Math.floor(Math.random() * 100),
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
  });

  return strategies;
};

// Função para gerar paradas de manutenção mensais para todos os grupos
const generateMaintenanceStops = (groups: AssetGroup[], strategies: MaintenanceStrategy[]): MaintenanceStop[] => {
  const stops: MaintenanceStop[] = [];
  let stopIdCounter = 1;

  // Lista de equipes disponíveis para garantir que todas as paradas tenham equipe
  const availableTeams = [
    "Equipe Mecânica A",
    "Equipe Elétrica B", 
    "Equipe Instrumentação C",
    "Equipe Caldeiraria D",
    "Equipe Soldagem E",
    "Equipe Hidráulica F",
    "Equipe Lubrificação G",
    "Equipe Estrutural H",
    "Equipe Manutenção Central",
    "Equipe Operação A",
    "Equipe Operação B",
    "Equipe Suporte Técnico"
  ];

  // Gerar 1 parada a cada 2 meses para cada grupo (otimizado)
  groups.forEach(group => {
    for (let month = 0; month < 12; month += 2) {
      const startDay = Math.floor(Math.random() * 28) + 1;
      const startDate = new Date(2025, month, startDay, 8); // Começar às 8h
      
      // Duração baseada nas estratégias do grupo ou padrão (em dias)
      const groupStrategies = strategies.filter(s => s.groupId === group.id);
      const avgDuration = groupStrategies.length > 0 
        ? Math.round(groupStrategies.reduce((sum, s) => sum + s.duration.value, 0) / groupStrategies.length)
        : 3; // Duração padrão de 3 dias
      
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + avgDuration);

      // Determinar status baseado na data conforme solicitado
      let status: 'planned' | 'in-progress' | 'completed';
      if (startDate < new Date(2025, 6, 1)) { // Antes de julho de 2025
        status = 'completed';
      } else if (month === 6) { // Julho de 2025
        status = 'in-progress';
      } else {
        status = 'planned';
      }

      // Garantir que TODAS as paradas tenham equipe - selecionar equipe aleatória
      const teamIndex = (stopIdCounter + month + parseInt(group.id.split('.')[0] || '0')) % availableTeams.length;
      const selectedTeam = availableTeams[teamIndex];

      stops.push({
        id: `stop-${stopIdCounter++}`,
        groupId: group.id,
        strategyId: undefined,
        title: `Parada Mensal - ${group.name.substring(0, 30)}`,
        description: `Parada mensal programada para manutenção do grupo ${group.name} - Equipe: ${selectedTeam}`,
        startDate: startDate,
        endDate: endDate,
        plannedStartDate: startDate,
        plannedEndDate: endDate,
        actualStartDate: status === 'completed' ? startDate : undefined,
        actualEndDate: status === 'completed' ? endDate : undefined,
        duration: avgDuration * 24, // Converter dias para horas para compatibilidade
        status: status,
        priority: group.category === 'Crítico' ? 'critical' : group.category === 'Importante' ? 'high' : 'medium',
        affectedAssets: group.assets.map(asset => asset.id),
        responsibleTeam: selectedTeam, // GARANTIR que todas as paradas tenham equipe
        estimatedCost: Math.floor(Math.random() * 40000) + 15000,
        actualCost: Math.random() > 0.5 ? Math.floor(Math.random() * 45000) + 18000 : undefined,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
  });

  return stops;
};

// Hook principal para gerenciar todos os dados de manutenção
export const useMaintenanceData = () => {
  // Usar o hook do Supabase como fonte principal de dados
  const supabaseData = useMaintenanceSupabase();

  // Criar um dataStore virtual para compatibilidade com SAP
  const dataStore = useMemo(() => {
    const groups = supabaseData.getAllGroups();
    const strategies = supabaseData.getAllStrategies();
    const stops = supabaseData.getAllStops();
    
    return { groups, strategies, stops };
  }, [supabaseData]);

  // Getters - usar funções do Supabase
  const getAllGroups = supabaseData.getAllGroups;
  const getAllStrategies = supabaseData.getAllStrategies;
  const getAllStops = supabaseData.getAllStops;
  const getGroupById = supabaseData.getGroupById;
  const getStrategiesByGroupId = supabaseData.getStrategiesByGroupId;
  const getStopsByGroupId = supabaseData.getStopsByGroupId;
  const getStopsByStrategyId = supabaseData.getStopsByStrategyId;
  const filterGroups = supabaseData.filterGroups;

  // CRUD Operations - usar funções do Supabase
  const addGroup = supabaseData.addGroup;
  const addStrategy = supabaseData.addStrategy;
  const addStop = supabaseData.addStop;

  // Funções de atualização (manter compatibilidade)
  const updateGroup = useCallback(async (groupId: string, updatedGroup: Partial<AssetGroup>) => {
    const updates = {
      name: updatedGroup.name,
      type: updatedGroup.type,
      location_center_id: updatedGroup.locationCenter || null,
      phase: updatedGroup.phase,
      system: updatedGroup.system,
      category: updatedGroup.category,
      executive_directorate: updatedGroup.executiveDirectorate,
      executive_management: updatedGroup.executiveManagement
    };
    
    await supabaseData.updateAssetGroup(groupId, updates);
  }, [supabaseData]);

  const updateStrategy = useCallback(async (strategyId: string, updatedStrategy: Partial<MaintenanceStrategy>) => {
    const updates = {
      name: updatedStrategy.name,
      frequency_value: updatedStrategy.frequency?.value,
      frequency_unit: updatedStrategy.frequency?.unit,
      duration_value: updatedStrategy.duration?.value,
      duration_unit: updatedStrategy.duration?.unit,
      start_date: updatedStrategy.startDate?.toISOString(),
      end_date: updatedStrategy.endDate?.toISOString() || null,
      is_active: updatedStrategy.isActive,
      description: updatedStrategy.description || null,
      priority: updatedStrategy.priority,
      teams: updatedStrategy.teams || null,
      total_hours: updatedStrategy.totalHours || null,
      completion_percentage: updatedStrategy.completionPercentage || 0
    };
    
    await supabaseData.updateMaintenanceStrategy(strategyId, updates);
  }, [supabaseData]);

  const updateStop = useCallback(async (stopId: string, updatedStop: Partial<MaintenanceStop>) => {
    const updates = {
      title: updatedStop.title,
      description: updatedStop.description || null,
      start_date: updatedStop.startDate?.toISOString(),
      end_date: updatedStop.endDate?.toISOString(),
      planned_start_date: updatedStop.plannedStartDate?.toISOString(),
      planned_end_date: updatedStop.plannedEndDate?.toISOString(),
      actual_start_date: updatedStop.actualStartDate?.toISOString() || null,
      actual_end_date: updatedStop.actualEndDate?.toISOString() || null,
      duration: updatedStop.duration,
      status: updatedStop.status,
      priority: updatedStop.priority,
      affected_assets: updatedStop.affectedAssets,
      responsible_team: updatedStop.responsibleTeam,
      estimated_cost: updatedStop.estimatedCost || null,
      actual_cost: updatedStop.actualCost || null
    };
    
    await supabaseData.updateMaintenanceStop(stopId, updates);
  }, [supabaseData]);

  // SAP BTP Integration Methods
  const syncWithSAP = useCallback(async () => {
    if (!sapBTPService.isConfigured()) {
      console.warn('SAP BTP não está configurado');
      return { success: false, message: 'SAP BTP não configurado' };
    }

    try {
      return await withSAPPerformanceMonitoring(async () => {
        // Sync groups to SAP
        const groupPromises = dataStore.groups.map(async (group) => {
          const validation = validateForSAP(group, SAP_BTP_CONSTANTS.ENTITY_TYPES.ASSET_GROUP);
          if (!validation.isValid) {
            console.warn(`Grupo ${group.id} possui erros de validação:`, validation.errors);
            return { success: false, id: group.id, errors: validation.errors };
          }
          
          const sapData = convertAssetGroupToSAP(group);
          // Here would be actual SAP API call
          sapBTPCache.set(`group_${group.id}`, sapData);
          return { success: true, id: group.id };
        });

        const results = await Promise.all(groupPromises);
        return { 
          success: true, 
          message: `${results.filter(r => r.success).length} grupos sincronizados com SAP BTP`,
          details: results
        };
      }, 'syncWithSAP');
    } catch (error) {
      const sapError = handleSAPError(error, 'syncWithSAP');
      return { success: false, message: sapError.message };
    }
  }, [dataStore.groups]);

  const exportToSAP = useCallback(async (entityType: 'groups' | 'strategies' | 'stops', entityIds?: string[]) => {
    if (!sapBTPService.isConfigured()) {
      throw new Error('SAP BTP não está configurado');
    }

    try {
      return await withSAPPerformanceMonitoring(async () => {
        let entities: any[] = [];
        let converter: (entity: any) => Record<string, any>;
        let sapEntityType: string;

        switch (entityType) {
          case 'groups':
            entities = entityIds ? 
              dataStore.groups.filter(g => entityIds.includes(g.id)) : 
              dataStore.groups;
            converter = convertAssetGroupToSAP;
            sapEntityType = SAP_BTP_CONSTANTS.ENTITY_TYPES.ASSET_GROUP;
            break;
          case 'strategies':
            entities = entityIds ? 
              dataStore.strategies.filter(s => entityIds.includes(s.id)) : 
              dataStore.strategies;
            converter = convertStrategyToSAP;
            sapEntityType = SAP_BTP_CONSTANTS.ENTITY_TYPES.STRATEGY;
            break;
          case 'stops':
            entities = entityIds ? 
              dataStore.stops.filter(s => entityIds.includes(s.id)) : 
              dataStore.stops;
            converter = convertStopToSAP;
            sapEntityType = SAP_BTP_CONSTANTS.ENTITY_TYPES.STOP;
            break;
          default:
            throw new Error(`Tipo de entidade não suportado: ${entityType}`);
        }

        const exportResults = await Promise.all(
          entities.map(async (entity) => {
            const validation = validateForSAP(entity, sapEntityType);
            if (!validation.isValid) {
              return { 
                success: false, 
                id: entity.id, 
                errors: validation.errors 
              };
            }

            const sapData = converter(entity);
            // In production, this would make actual SAP API calls
            sapBTPCache.set(`${entityType}_${entity.id}`, sapData);
            
            return { success: true, id: entity.id, sapData };
          })
        );

        const successful = exportResults.filter(r => r.success);
        const failed = exportResults.filter(r => !r.success);

        return {
          success: failed.length === 0,
          message: `${successful.length} ${entityType} exportados para SAP BTP`,
          successful: successful.length,
          failed: failed.length,
          failures: failed
        };
      }, `exportToSAP_${entityType}`);
    } catch (error) {
      throw handleSAPError(error, `exportToSAP_${entityType}`);
    }
  }, [dataStore]);

  const generateSAPReport = useCallback(() => {
    const report = {
      timestamp: new Date(),
      summary: {
        totalGroups: dataStore.groups.length,
        totalStrategies: dataStore.strategies.length,
        totalStops: dataStore.stops.length,
        activStrategies: dataStore.strategies.filter(s => s.isActive).length,
        criticalAssets: dataStore.groups.filter(g => g.category === 'Crítico').length
      },
      performance: {
        strategiesPerGroup: dataStore.groups.map(g => ({
          groupId: g.id,
          groupName: g.name,
          strategiesCount: g.strategies.length,
          activeStrategies: g.strategies.filter(s => s.isActive).length
        })),
        stopsByPriority: {
          critical: dataStore.stops.filter(s => s.priority === 'critical').length,
          high: dataStore.stops.filter(s => s.priority === 'high').length,
          medium: dataStore.stops.filter(s => s.priority === 'medium').length,
          low: dataStore.stops.filter(s => s.priority === 'low').length
        }
      },
      sapIntegration: {
        configured: sapBTPService.isConfigured(),
        lastSync: sapBTPCache.get('lastSyncTimestamp'),
        cacheStatus: 'active'
      }
    };

    // Cache the report
    sapBTPCache.set('maintenance_report', report, 600000); // 10 minutes TTL

    return report;
  }, [dataStore]);

  return {
    // Getters
    getAllGroups,
    getAllStrategies,
    getAllStops,
    getGroupById,
    getStrategiesByGroupId,
    getStopsByGroupId,
    getStopsByStrategyId,
    filterGroups,
    
    // CRUD Operations
    addGroup,
    updateGroup,
    addStrategy,
    updateStrategy,
    addStop,
    updateStop,
    
    // SAP BTP Integration
    syncWithSAP,
    exportToSAP,
    generateSAPReport,
    
    // Direct access to data store for complex operations
    dataStore,
    
    // SAP BTP Status
    sapBTPConfigured: sapBTPService.isConfigured()
  };
};