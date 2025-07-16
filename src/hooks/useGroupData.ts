import { AssetGroup, MaintenanceStrategy } from "@/types";
import { useMaintenanceData } from "./useMaintenanceData";

// DEPRECATED: Este hook será substituído pelo useMaintenanceData
// Mantido apenas para compatibilidade durante a migração

// Hook otimizado que usa o hook principal de dados
export const useGroupData = () => {
  // Usar o hook principal de dados para evitar duplicação
  const { getAllGroups, getAllStrategies, getGroupById, getStrategiesByGroupId, filterGroups } = 
    useMaintenanceData();
  
  return {
    getAllGroups,
    getAllStrategies,
    getGroupById,
    getStrategiesByGroupId,
    filterGroups
  };
};