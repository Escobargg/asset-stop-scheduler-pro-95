import { MaintenanceStrategy } from "@/types";
import { addDays, startOfYear, endOfYear } from "date-fns";
import { useMaintenanceData } from "@/hooks/useMaintenanceData";

export const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "critical": return "bg-red-600 border border-red-800";
    case "high": return "bg-orange-500";
    case "medium": return "bg-yellow-500";
    case "low": return "bg-green-500";
    default: return "bg-gray-500";
  }
};

export const calculateOccurrences = (strategy: MaintenanceStrategy, currentYear: number) => {
  const yearStart = startOfYear(new Date(currentYear, 0, 1));
  const yearEnd = endOfYear(new Date(currentYear, 0, 1));
  const occurrences = [];
  let currentDate = new Date(strategy.startDate);
  
  while (currentDate <= yearEnd) {
    if (currentDate >= yearStart) {
      const endDate = new Date(currentDate);
      if (strategy.duration.unit === "hours") {
        endDate.setHours(endDate.getHours() + strategy.duration.value);
      } else {
        endDate.setDate(endDate.getDate() + strategy.duration.value);
      }
      
      occurrences.push({
        startDate: new Date(currentDate),
        endDate,
        strategy
      });
    }
    
    // Calcular próxima ocorrência
    switch (strategy.frequency.unit) {
      case "days":
        currentDate = addDays(currentDate, strategy.frequency.value);
        break;
      case "weeks":
        currentDate = addDays(currentDate, strategy.frequency.value * 7);
        break;
      case "months":
        currentDate = new Date(currentDate.setMonth(currentDate.getMonth() + strategy.frequency.value));
        break;
      case "years":
        currentDate = new Date(currentDate.setFullYear(currentDate.getFullYear() + strategy.frequency.value));
        break;
    }
  }
  
  return occurrences;
};

export const getGroupStrategies = (strategies: MaintenanceStrategy[], groupId: string) => {
  return strategies.filter(strategy => strategy.groupId === groupId);
};

export const getAllOccurrences = (strategies: MaintenanceStrategy[], groupId: string, currentYear: number) => {
  const groupStrategies = getGroupStrategies(strategies, groupId);
  return groupStrategies.flatMap(strategy => calculateOccurrences(strategy, currentYear));
};