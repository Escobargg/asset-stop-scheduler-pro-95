import { useState, useCallback, useMemo } from 'react';
import { maintenanceStops } from '@/data/mockData';
import { useMaintenanceData } from './useMaintenanceData';
import { generateMaintenanceStopsForGroups } from '@/data/maintenanceStopsGenerator';
import { MaintenanceStop } from '@/types';

let stopIdCounter = 10000;

export const useStopsManagement = () => {
  const { getAllGroups, getAllStops, addStop, updateStop: updateMaintenanceStop } = useMaintenanceData();
  
  const stops = getAllStops();

  const createStop = useCallback((stopData: Omit<MaintenanceStop, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newStop: MaintenanceStop = {
      ...stopData,
      id: `stop-${++stopIdCounter}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    addStop(newStop);
    return newStop;
  }, [addStop]);

  const updateStop = useCallback((id: string, updates: Partial<MaintenanceStop>) => {
    updateMaintenanceStop(id, { ...updates, updatedAt: new Date() });
  }, [updateMaintenanceStop]);

  const getStopsByGroup = useCallback((groupId: string) => {
    return stops.filter(stop => stop.groupId === groupId);
  }, [stops]);

  return {
    stops,
    createStop,
    updateStop,
    getStopsByGroup
  };
};