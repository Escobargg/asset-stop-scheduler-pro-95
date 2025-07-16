import { useState, useCallback } from 'react';
import { MaintenanceStrategy } from '@/types';
import { mockStrategies, addStrategy } from '@/data/mockStrategies';

export const useStrategyManagement = () => {
  const [strategies, setStrategies] = useState<MaintenanceStrategy[]>(mockStrategies);

  const createStrategy = useCallback((strategyData: Omit<MaintenanceStrategy, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newStrategy = addStrategy(strategyData);
    setStrategies(prev => [...prev, newStrategy]);
    return newStrategy;
  }, []);

  const updateStrategy = useCallback((id: string, updates: Partial<MaintenanceStrategy>) => {
    setStrategies(prev => 
      prev.map(strategy => 
        strategy.id === id 
          ? { ...strategy, ...updates, updatedAt: new Date() }
          : strategy
      )
    );
  }, []);

  const deleteStrategy = useCallback((id: string) => {
    setStrategies(prev => prev.filter(strategy => strategy.id !== id));
  }, []);

  const getStrategiesByGroup = useCallback((groupId: string) => {
    return strategies.filter(strategy => strategy.groupId === groupId);
  }, [strategies]);

  return {
    strategies,
    createStrategy,
    updateStrategy,
    deleteStrategy,
    getStrategiesByGroup
  };
};