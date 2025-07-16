import { MaintenanceStop } from './mockData';
import { useGroupData } from '@/hooks/useGroupData';

// Função para gerar paradas de manutenção para grupos específicos
export const generateMaintenanceStopsForGroups = (groups: any[]): MaintenanceStop[] => {
  const stops: MaintenanceStop[] = [];
  let stopIdCounter = 1;

  // Usar os primeiros 50 grupos para não sobrecarregar
  const groupsToUse = groups.slice(0, 50);
  
  groupsToUse.forEach(group => {
    // Criar exatamente 1 parada por mês para cada grupo
    for (let month = 0; month < 12; month++) {
      const stopsThisMonth = 1; // Exatamente 1 parada por mês
      
      for (let stopIndex = 0; stopIndex < stopsThisMonth; stopIndex++) {
        const stopTypes = [
          { name: "Parada Mensal Preventiva", duration: 3, teams: 8, completion: 85 },
          { name: "Manutenção Mensal", duration: 5, teams: 10, completion: 88 },
          { name: "Inspeção Mensal", duration: 2, teams: 6, completion: 92 },
          { name: "Revisão Mensal", duration: 4, teams: 7, completion: 90 }
        ];

        const stopType = stopTypes[Math.floor(Math.random() * stopTypes.length)];
        
        // Distribuir as paradas ao longo do mês
        const startDay = Math.floor(Math.random() * 28) + 1;
        const startHour = Math.floor(Math.random() * 24);
        const startDate = new Date(2025, month, startDay, startHour);
        const endDate = new Date(startDate.getTime() + (stopType.duration * 24 * 60 * 60 * 1000));
        
        const completion = Math.random() > 0.6 ? 100 : 0;
        
        stops.push({
          id: `stop-${stopIdCounter++}`,
          name: `${stopType.name} - ${group.name.substring(0, 30)}`,
          locationCenter: group.locationCenter,
          phase: group.phase,
          assetGroupId: group.id,
          startDate: startDate,
          endDate: endDate,
          plannedStartDate: startDate,
          plannedEndDate: endDate,
          actualStartDate: completion === 100 ? startDate : undefined,
          actualEndDate: completion === 100 ? endDate : undefined,
          duration: stopType.duration,
          teams: stopType.teams,
          totalHours: stopType.duration * 24 * stopType.teams,
          completion: completion, // Use o completion calculado
          description: `${stopType.name} programada para ${group.name}`,
          createdAt: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1)
        });
      }
    }
  });

  return stops;
};