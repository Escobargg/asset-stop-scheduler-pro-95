import { useState, useCallback, useMemo } from 'react';
import { maintenanceStops } from '@/data/mockData';
import { useMaintenanceData } from './useMaintenanceData';
import { generateMaintenanceStopsForGroups } from '@/data/maintenanceStopsGenerator';
import { MaintenanceStop } from '@/types';
import { useMaintenanceSupabase } from './useMaintenanceSupabase';

let stopIdCounter = 10000;

export const useStopsManagement = () => {
  const { getAllGroups, getAllStops, addStop, updateStop: updateMaintenanceStop } = useMaintenanceData();
  const supabaseData = useMaintenanceSupabase();
  
  const stops = getAllStops();

  const createStop = useCallback(async (stopData: Omit<MaintenanceStop, 'id' | 'createdAt' | 'updatedAt'>) => {
    // Usar o Supabase para criar a parada
    const newStop = await supabaseData.addStop(stopData);
    return newStop;
  }, [supabaseData]);

  const updateStop = useCallback(async (id: string, updates: Partial<MaintenanceStop>) => {
    // Usar o Supabase para atualizar a parada
    await updateMaintenanceStop(id, updates);
  }, [updateMaintenanceStop]);

  const getStopsByGroup = useCallback((groupId: string) => {
    return stops.filter(stop => stop.groupId === groupId);
  }, [stops]);

  return {
    stops,
    createStop,
    updateStop,
    getStopsByGroup,
    // Dados do Supabase
    loading: supabaseData.loading,
    error: supabaseData.error
  };
};