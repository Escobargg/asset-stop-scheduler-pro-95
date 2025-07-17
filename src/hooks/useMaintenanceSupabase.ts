import { useCallback, useEffect } from 'react';
import { useSupabaseData } from './useSupabaseData';
import { useRealtimeSync } from './useRealtimeSync';
import { AssetGroup, MaintenanceStrategy, MaintenanceStop } from '@/types';
import { Tables } from '@/integrations/supabase/types';

// Hook principal que integra Supabase com o sistema existente
export const useMaintenanceSupabase = () => {
  const {
    locationCenters,
    assets,
    assetGroups,
    strategies,
    stops,
    loading,
    error,
    fetchAllData,
    createAssetGroup,
    updateAssetGroup,
    createMaintenanceStrategy,
    updateMaintenanceStrategy,
    createMaintenanceStop,
    updateMaintenanceStop,
    getAssetsByLocationCenter,
    getAssetsByGroup,
    getStrategiesByGroup,
    getStopsByGroup,
    getStopsByStrategy
  } = useSupabaseData();

  // Configurar sincronização em tempo real
  useRealtimeSync({
    onAssetGroupChange: (payload) => {
      console.log('Asset group changed:', payload);
      // Dados já são atualizados automaticamente pelo useSupabaseData
    },
    onMaintenanceStrategyChange: (payload) => {
      console.log('Maintenance strategy changed:', payload);
      // Dados já são atualizados automaticamente pelo useSupabaseData
    },
    onMaintenanceStopChange: (payload) => {
      console.log('Maintenance stop changed:', payload);
      // Dados já são atualizados automaticamente pelo useSupabaseData
    },
    onLocationCenterChange: (payload) => {
      console.log('Location center changed:', payload);
      // Dados já são atualizados automaticamente pelo useSupabaseData
    },
    onAssetChange: (payload) => {
      console.log('Asset changed:', payload);
      // Dados já são atualizados automaticamente pelo useSupabaseData
    }
  });

  // Conversões dos dados do Supabase para o formato do sistema
  const convertSupabaseGroupToAssetGroup = useCallback((group: Tables<'asset_groups'>): AssetGroup => {
    const groupAssets = getAssetsByGroup(group.id);
    const groupStrategies = getStrategiesByGroup(group.id);
    
    return {
      id: group.id,
      name: group.name,
      type: group.type,
      locationCenter: group.location_center_id || '',
      locationCenterName: locationCenters.find(lc => lc.id === group.location_center_id)?.name || '',
      phase: group.phase,
      system: group.system,
      category: group.category,
      executiveDirectorate: group.executive_directorate,
      executiveManagement: group.executive_management,
      assets: groupAssets.map(asset => ({
        id: asset.id,
        tag: asset.tag,
        name: asset.name,
        type: asset.type,
        locationCenter: asset.location_center_id || '',
        phase: asset.phase,
        system: asset.system,
        category: asset.category,
        executiveDirectorate: asset.executive_directorate,
        executiveManagement: asset.executive_management,
        groupId: asset.group_id || ''
      })),
      strategies: groupStrategies.map(strategy => ({
        id: strategy.id,
        name: strategy.name,
        groupId: strategy.group_id,
        frequency: {
          value: strategy.frequency_value,
          unit: strategy.frequency_unit
        },
        duration: {
          value: strategy.duration_value,
          unit: strategy.duration_unit
        },
        startDate: new Date(strategy.start_date),
        endDate: strategy.end_date ? new Date(strategy.end_date) : undefined,
        isActive: strategy.is_active,
        description: strategy.description || '',
        priority: strategy.priority,
        teams: strategy.teams || [],
        totalHours: strategy.total_hours || 0,
        completionPercentage: strategy.completion_percentage || 0,
        createdAt: new Date(strategy.created_at),
        updatedAt: new Date(strategy.updated_at)
      }))
    };
  }, [locationCenters, getAssetsByGroup, getStrategiesByGroup]);

  const convertSupabaseStrategyToMaintenanceStrategy = useCallback((strategy: Tables<'maintenance_strategies'>): MaintenanceStrategy => {
    return {
      id: strategy.id,
      name: strategy.name,
      groupId: strategy.group_id,
      frequency: {
        value: strategy.frequency_value,
        unit: strategy.frequency_unit
      },
      duration: {
        value: strategy.duration_value,
        unit: strategy.duration_unit
      },
      startDate: new Date(strategy.start_date),
      endDate: strategy.end_date ? new Date(strategy.end_date) : undefined,
      isActive: strategy.is_active,
      description: strategy.description || '',
      priority: strategy.priority,
      teams: strategy.teams || [],
      totalHours: strategy.total_hours || 0,
      completionPercentage: strategy.completion_percentage || 0,
      createdAt: new Date(strategy.created_at),
      updatedAt: new Date(strategy.updated_at)
    };
  }, []);

  const convertSupabaseStopToMaintenanceStop = useCallback((stop: Tables<'maintenance_stops'>): MaintenanceStop => {
    return {
      id: stop.id,
      groupId: stop.group_id,
      strategyId: stop.strategy_id || undefined,
      title: stop.title,
      description: stop.description || '',
      startDate: new Date(stop.start_date),
      endDate: new Date(stop.end_date),
      plannedStartDate: new Date(stop.planned_start_date),
      plannedEndDate: new Date(stop.planned_end_date),
      actualStartDate: stop.actual_start_date ? new Date(stop.actual_start_date) : undefined,
      actualEndDate: stop.actual_end_date ? new Date(stop.actual_end_date) : undefined,
      duration: stop.duration,
      status: stop.status,
      priority: stop.priority,
      affectedAssets: stop.affected_assets,
      responsibleTeam: stop.responsible_team,
      estimatedCost: stop.estimated_cost ? Number(stop.estimated_cost) : undefined,
      actualCost: stop.actual_cost ? Number(stop.actual_cost) : undefined,
      createdAt: new Date(stop.created_at),
      updatedAt: new Date(stop.updated_at)
    };
  }, []);

  // Funções de consulta compatíveis com o sistema existente
  const getAllGroups = useCallback((): AssetGroup[] => {
    return assetGroups.map(convertSupabaseGroupToAssetGroup);
  }, [assetGroups, convertSupabaseGroupToAssetGroup]);

  const getAllStrategies = useCallback((): MaintenanceStrategy[] => {
    return strategies.map(convertSupabaseStrategyToMaintenanceStrategy);
  }, [strategies, convertSupabaseStrategyToMaintenanceStrategy]);

  const getAllStops = useCallback((): MaintenanceStop[] => {
    return stops.map(convertSupabaseStopToMaintenanceStop);
  }, [stops, convertSupabaseStopToMaintenanceStop]);

  const getGroupById = useCallback((id: string): AssetGroup | undefined => {
    const group = assetGroups.find(g => g.id === id);
    return group ? convertSupabaseGroupToAssetGroup(group) : undefined;
  }, [assetGroups, convertSupabaseGroupToAssetGroup]);

  const getStrategiesByGroupId = useCallback((groupId: string): MaintenanceStrategy[] => {
    const groupStrategies = strategies.filter(s => s.group_id === groupId);
    return groupStrategies.map(convertSupabaseStrategyToMaintenanceStrategy);
  }, [strategies, convertSupabaseStrategyToMaintenanceStrategy]);

  const getStopsByGroupId = useCallback((groupId: string): MaintenanceStop[] => {
    const groupStops = stops.filter(s => s.group_id === groupId);
    return groupStops.map(convertSupabaseStopToMaintenanceStop);
  }, [stops, convertSupabaseStopToMaintenanceStop]);

  const getStopsByStrategyId = useCallback((strategyId: string): MaintenanceStop[] => {
    const strategyStops = stops.filter(s => s.strategy_id === strategyId);
    return strategyStops.map(convertSupabaseStopToMaintenanceStop);
  }, [stops, convertSupabaseStopToMaintenanceStop]);

  // Funções de filtro
  const filterGroups = useCallback((searchTerm: string, phase: string, center: string): AssetGroup[] => {
    const filteredGroups = assetGroups.filter(group => {
      const locationCenter = locationCenters.find(lc => lc.id === group.location_center_id);
      const matchesSearch = group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (locationCenter?.name || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPhase = !phase || group.phase === phase;
      const matchesCenter = !center || group.location_center_id === center;
      
      return matchesSearch && matchesPhase && matchesCenter;
    });
    
    return filteredGroups.map(convertSupabaseGroupToAssetGroup);
  }, [assetGroups, locationCenters, convertSupabaseGroupToAssetGroup]);

  // Funções CRUD adaptadas para o sistema existente
  const addGroup = useCallback(async (group: Omit<AssetGroup, 'id' | 'assets' | 'strategies'>) => {
    const groupData = {
      name: group.name,
      type: group.type,
      location_center_id: group.locationCenter || null,
      phase: group.phase,
      system: group.system,
      category: group.category,
      executive_directorate: group.executiveDirectorate,
      executive_management: group.executiveManagement
    };
    
    await createAssetGroup(groupData);
  }, [createAssetGroup]);

  const addStrategy = useCallback(async (strategy: Omit<MaintenanceStrategy, 'id' | 'createdAt' | 'updatedAt'>) => {
    const strategyData = {
      name: strategy.name,
      group_id: strategy.groupId,
      frequency_value: strategy.frequency.value,
      frequency_unit: strategy.frequency.unit,
      duration_value: strategy.duration.value,
      duration_unit: strategy.duration.unit,
      start_date: strategy.startDate.toISOString(),
      end_date: strategy.endDate?.toISOString() || null,
      is_active: strategy.isActive,
      description: strategy.description || null,
      priority: strategy.priority,
      teams: strategy.teams || null,
      total_hours: strategy.totalHours || null,
      completion_percentage: strategy.completionPercentage || 0
    };
    
    await createMaintenanceStrategy(strategyData);
  }, [createMaintenanceStrategy]);

  const addStop = useCallback(async (stop: Omit<MaintenanceStop, 'id' | 'createdAt' | 'updatedAt'>) => {
    const stopData = {
      group_id: stop.groupId,
      strategy_id: stop.strategyId || null,
      title: stop.title,
      description: stop.description || null,
      start_date: stop.startDate.toISOString(),
      end_date: stop.endDate.toISOString(),
      planned_start_date: stop.plannedStartDate.toISOString(),
      planned_end_date: stop.plannedEndDate.toISOString(),
      actual_start_date: stop.actualStartDate?.toISOString() || null,
      actual_end_date: stop.actualEndDate?.toISOString() || null,
      duration: stop.duration,
      status: stop.status,
      priority: stop.priority,
      affected_assets: stop.affectedAssets,
      responsible_team: stop.responsibleTeam,
      estimated_cost: stop.estimatedCost || null,
      actual_cost: stop.actualCost || null
    };
    
    await createMaintenanceStop(stopData);
  }, [createMaintenanceStop]);

  return {
    // Dados brutos do Supabase
    locationCenters,
    assets,
    loading,
    error,
    fetchAllData,

    // Funções compatíveis com o sistema existente
    getAllGroups,
    getAllStrategies,
    getAllStops,
    getGroupById,
    getStrategiesByGroupId,
    getStopsByGroupId,
    getStopsByStrategyId,
    filterGroups,

    // Funções CRUD
    addGroup,
    addStrategy,
    addStop,

    // Funções de atualização
    updateAssetGroup,
    updateMaintenanceStrategy,
    updateMaintenanceStop,

    // Funções de consulta específicas
    getAssetsByLocationCenter,
    getAssetsByGroup,
    getStrategiesByGroup,
    getStopsByGroup,
    getStopsByStrategy
  };
};