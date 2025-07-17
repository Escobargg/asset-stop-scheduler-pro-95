import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';
import { useToast } from '@/hooks/use-toast';

// Tipos para as tabelas do Supabase
type LocationCenter = Tables<'location_centers'>;
type Asset = Tables<'assets'>;
type AssetGroup = Tables<'asset_groups'>;
type MaintenanceStrategy = Tables<'maintenance_strategies'>;
type MaintenanceStop = Tables<'maintenance_stops'>;

// Tipos para inserção
type AssetGroupInsert = TablesInsert<'asset_groups'>;
type MaintenanceStrategyInsert = TablesInsert<'maintenance_strategies'>;
type MaintenanceStopInsert = TablesInsert<'maintenance_stops'>;

export const useSupabaseData = () => {
  const [locationCenters, setLocationCenters] = useState<LocationCenter[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [assetGroups, setAssetGroups] = useState<AssetGroup[]>([]);
  const [strategies, setStrategies] = useState<MaintenanceStrategy[]>([]);
  const [stops, setStops] = useState<MaintenanceStop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { toast } = useToast();

  // Função para buscar todos os dados
  const fetchAllData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Buscar dados em paralelo
      const [
        locationCentersRes,
        assetsRes,
        assetGroupsRes,
        strategiesRes,
        stopsRes
      ] = await Promise.all([
        supabase.from('location_centers').select('*').order('name'),
        supabase.from('assets').select('*').order('name'),
        supabase.from('asset_groups').select('*').order('name'),
        supabase.from('maintenance_strategies').select('*').order('name'),
        supabase.from('maintenance_stops').select('*').order('planned_start_date')
      ]);

      // Verificar erros
      if (locationCentersRes.error) throw locationCentersRes.error;
      if (assetsRes.error) throw assetsRes.error;
      if (assetGroupsRes.error) throw assetGroupsRes.error;
      if (strategiesRes.error) throw strategiesRes.error;
      if (stopsRes.error) throw stopsRes.error;

      // Atualizar estados
      setLocationCenters(locationCentersRes.data || []);
      setAssets(assetsRes.data || []);
      setAssetGroups(assetGroupsRes.data || []);
      setStrategies(strategiesRes.data || []);
      setStops(stopsRes.data || []);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      toast({
        title: "Erro ao carregar dados",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Carregar dados iniciais
  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // CRUD para Asset Groups
  const createAssetGroup = useCallback(async (groupData: AssetGroupInsert) => {
    try {
      const { data, error } = await supabase
        .from('asset_groups')
        .insert(groupData)
        .select()
        .single();

      if (error) throw error;

      setAssetGroups(prev => [...prev, data]);
      toast({
        title: "Grupo criado com sucesso",
        description: `Grupo ${data.name} foi criado.`
      });
      
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar grupo';
      toast({
        title: "Erro ao criar grupo",
        description: errorMessage,
        variant: "destructive"
      });
      throw err;
    }
  }, [toast]);

  const updateAssetGroup = useCallback(async (id: string, updates: TablesUpdate<'asset_groups'>) => {
    try {
      const { data, error } = await supabase
        .from('asset_groups')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setAssetGroups(prev => prev.map(group => 
        group.id === id ? data : group
      ));
      
      toast({
        title: "Grupo atualizado",
        description: `Grupo foi atualizado com sucesso.`
      });
      
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar grupo';
      toast({
        title: "Erro ao atualizar grupo",
        description: errorMessage,
        variant: "destructive"
      });
      throw err;
    }
  }, [toast]);

  // CRUD para Maintenance Strategies
  const createMaintenanceStrategy = useCallback(async (strategyData: MaintenanceStrategyInsert) => {
    try {
      const { data, error } = await supabase
        .from('maintenance_strategies')
        .insert(strategyData)
        .select()
        .single();

      if (error) throw error;

      setStrategies(prev => [...prev, data]);
      toast({
        title: "Estratégia criada com sucesso",
        description: `Estratégia ${data.name} foi criada.`
      });
      
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar estratégia';
      toast({
        title: "Erro ao criar estratégia",
        description: errorMessage,
        variant: "destructive"
      });
      throw err;
    }
  }, [toast]);

  const updateMaintenanceStrategy = useCallback(async (id: string, updates: TablesUpdate<'maintenance_strategies'>) => {
    try {
      const { data, error } = await supabase
        .from('maintenance_strategies')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setStrategies(prev => prev.map(strategy => 
        strategy.id === id ? data : strategy
      ));
      
      toast({
        title: "Estratégia atualizada",
        description: `Estratégia foi atualizada com sucesso.`
      });
      
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar estratégia';
      toast({
        title: "Erro ao atualizar estratégia",
        description: errorMessage,
        variant: "destructive"
      });
      throw err;
    }
  }, [toast]);

  // CRUD para Maintenance Stops
  const createMaintenanceStop = useCallback(async (stopData: MaintenanceStopInsert) => {
    try {
      const { data, error } = await supabase
        .from('maintenance_stops')
        .insert(stopData)
        .select()
        .single();

      if (error) throw error;

      setStops(prev => [...prev, data]);
      toast({
        title: "Parada criada com sucesso",
        description: `Parada ${data.title} foi criada.`
      });
      
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar parada';
      toast({
        title: "Erro ao criar parada",
        description: errorMessage,
        variant: "destructive"
      });
      throw err;
    }
  }, [toast]);

  const updateMaintenanceStop = useCallback(async (id: string, updates: TablesUpdate<'maintenance_stops'>) => {
    try {
      const { data, error } = await supabase
        .from('maintenance_stops')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setStops(prev => prev.map(stop => 
        stop.id === id ? data : stop
      ));
      
      toast({
        title: "Parada atualizada",
        description: `Parada foi atualizada com sucesso.`
      });
      
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar parada';
      toast({
        title: "Erro ao atualizar parada",
        description: errorMessage,
        variant: "destructive"
      });
      throw err;
    }
  }, [toast]);

  // Funções de consulta
  const getAssetsByLocationCenter = useCallback((locationCenterId: string) => {
    return assets.filter(asset => asset.location_center_id === locationCenterId);
  }, [assets]);

  const getAssetsByGroup = useCallback((groupId: string) => {
    return assets.filter(asset => asset.group_id === groupId);
  }, [assets]);

  const getStrategiesByGroup = useCallback((groupId: string) => {
    return strategies.filter(strategy => strategy.group_id === groupId);
  }, [strategies]);

  const getStopsByGroup = useCallback((groupId: string) => {
    return stops.filter(stop => stop.group_id === groupId);
  }, [stops]);

  const getStopsByStrategy = useCallback((strategyId: string) => {
    return stops.filter(stop => stop.strategy_id === strategyId);
  }, [stops]);

  return {
    // Estado dos dados
    locationCenters,
    assets,
    assetGroups,
    strategies,
    stops,
    loading,
    error,

    // Funções de atualização
    fetchAllData,

    // CRUD Asset Groups
    createAssetGroup,
    updateAssetGroup,

    // CRUD Maintenance Strategies
    createMaintenanceStrategy,
    updateMaintenanceStrategy,

    // CRUD Maintenance Stops
    createMaintenanceStop,
    updateMaintenanceStop,

    // Funções de consulta
    getAssetsByLocationCenter,
    getAssetsByGroup,
    getStrategiesByGroup,
    getStopsByGroup,
    getStopsByStrategy
  };
};