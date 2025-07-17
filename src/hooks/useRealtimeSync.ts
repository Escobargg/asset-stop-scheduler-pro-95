import { useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface RealtimeSyncOptions {
  onAssetGroupChange?: (payload: any) => void;
  onMaintenanceStrategyChange?: (payload: any) => void;
  onMaintenanceStopChange?: (payload: any) => void;
  onLocationCenterChange?: (payload: any) => void;
  onAssetChange?: (payload: any) => void;
}

export const useRealtimeSync = (options: RealtimeSyncOptions = {}) => {
  const { toast } = useToast();
  
  const {
    onAssetGroupChange,
    onMaintenanceStrategyChange,
    onMaintenanceStopChange,
    onLocationCenterChange,
    onAssetChange
  } = options;

  const showRealtimeNotification = useCallback((event: string, table: string, payload: any) => {
    const tableNames = {
      'asset_groups': 'Grupo de Ativos',
      'maintenance_strategies': 'Estratégia de Manutenção',
      'maintenance_stops': 'Parada de Manutenção',
      'location_centers': 'Centro de Localização',
      'assets': 'Ativo'
    };

    const eventMessages = {
      'INSERT': 'criado',
      'UPDATE': 'atualizado',
      'DELETE': 'removido'
    };

    const tableName = tableNames[table as keyof typeof tableNames] || table;
    const eventMessage = eventMessages[event as keyof typeof eventMessages] || event;

    toast({
      title: `${tableName} ${eventMessage}`,
      description: `Dados atualizados em tempo real`,
      duration: 3000
    });
  }, [toast]);

  useEffect(() => {
    // Criar canal para sincronização em tempo real
    const channel = supabase
      .channel('schema-db-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'asset_groups'
      }, (payload) => {
        showRealtimeNotification(payload.eventType, 'asset_groups', payload);
        onAssetGroupChange?.(payload);
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'maintenance_strategies'
      }, (payload) => {
        showRealtimeNotification(payload.eventType, 'maintenance_strategies', payload);
        onMaintenanceStrategyChange?.(payload);
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'maintenance_stops'
      }, (payload) => {
        showRealtimeNotification(payload.eventType, 'maintenance_stops', payload);
        onMaintenanceStopChange?.(payload);
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'location_centers'
      }, (payload) => {
        showRealtimeNotification(payload.eventType, 'location_centers', payload);
        onLocationCenterChange?.(payload);
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'assets'
      }, (payload) => {
        showRealtimeNotification(payload.eventType, 'assets', payload);
        onAssetChange?.(payload);
      })
      .subscribe();

    // Cleanup na desmontagem
    return () => {
      supabase.removeChannel(channel);
    };
  }, [
    onAssetGroupChange,
    onMaintenanceStrategyChange,
    onMaintenanceStopChange,
    onLocationCenterChange,
    onAssetChange,
    showRealtimeNotification
  ]);

  return {
    // Hook pronto para sincronização em tempo real
    // Para habilitar realtime, execute no SQL Editor do Supabase:
    // ALTER TABLE public.asset_groups REPLICA IDENTITY FULL;
    // ALTER TABLE public.maintenance_strategies REPLICA IDENTITY FULL;
    // ALTER TABLE public.maintenance_stops REPLICA IDENTITY FULL;
    // ALTER TABLE public.location_centers REPLICA IDENTITY FULL;
    // ALTER TABLE public.assets REPLICA IDENTITY FULL;
    // ALTER PUBLICATION supabase_realtime ADD TABLE public.asset_groups;
    // ALTER PUBLICATION supabase_realtime ADD TABLE public.maintenance_strategies;
    // ALTER PUBLICATION supabase_realtime ADD TABLE public.maintenance_stops;
    // ALTER PUBLICATION supabase_realtime ADD TABLE public.location_centers;
    // ALTER PUBLICATION supabase_realtime ADD TABLE public.assets;
  };
};