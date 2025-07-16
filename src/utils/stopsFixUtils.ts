import { MaintenanceStop, AssetGroup } from '@/types';

/**
 * Função para corrigir paradas que não têm grupos associados
 * Associa paradas órfãs a grupos compatíveis baseado no centro de localização e fase
 */
export const fixOrphanedStops = (
  stops: MaintenanceStop[], 
  groups: AssetGroup[]
): MaintenanceStop[] => {
  return stops.map(stop => {
    // Se a parada já tem um grupo válido, retorna como está
    const hasValidGroup = groups.some(group => group.id === stop.groupId);
    if (hasValidGroup) {
      return stop;
    }

    // Procura um grupo compatível baseado no centro de localização e fase
    const compatibleGroups = groups.filter(group => 
      group.locationCenter === (stop as any).locationCenter && 
      group.phase === (stop as any).phase
    );

    if (compatibleGroups.length > 0) {
      // Seleciona um grupo aleatório compatível
      const randomGroup = compatibleGroups[Math.floor(Math.random() * compatibleGroups.length)];
      
      return {
        ...stop,
        groupId: randomGroup.id,
        // Atualiza outros campos se necessário
        affectedAssets: randomGroup.assets.map(asset => asset.id)
      };
    }

    // Se não encontrar grupo compatível, tenta encontrar qualquer grupo do mesmo centro
    const centerGroups = groups.filter(group => 
      group.locationCenter === (stop as any).locationCenter
    );

    if (centerGroups.length > 0) {
      const randomGroup = centerGroups[Math.floor(Math.random() * centerGroups.length)];
      
      return {
        ...stop,
        groupId: randomGroup.id,
        phase: randomGroup.phase, // Atualiza a fase para corresponder ao grupo
        affectedAssets: randomGroup.assets.map(asset => asset.id)
      };
    }

    // Como último recurso, associa ao primeiro grupo disponível
    if (groups.length > 0) {
      const firstGroup = groups[0];
      
      return {
        ...stop,
        groupId: firstGroup.id,
        locationCenter: firstGroup.locationCenter,
        phase: firstGroup.phase,
        affectedAssets: firstGroup.assets.map(asset => asset.id)
      };
    }

    // Se não há grupos disponíveis, retorna a parada como está
    return stop;
  });
};

/**
 * Função para criar paradas para grupos que não têm paradas
 */
export const createStopsForGroupsWithoutStops = (
  groups: AssetGroup[],
  existingStops: MaintenanceStop[]
): MaintenanceStop[] => {
  const newStops: MaintenanceStop[] = [];
  let stopIdCounter = 10000;

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

  const groupsWithoutStops = groups.filter(group => 
    !existingStops.some(stop => stop.groupId === group.id)
  );

  groupsWithoutStops.forEach(group => {
    // Criar 2-3 paradas para cada grupo sem paradas
    const stopCount = Math.floor(Math.random() * 2) + 2; // 2-3 paradas
    
    for (let i = 0; i < stopCount; i++) {
      const stopTypes = [
        { name: "Parada Preventiva", duration: 3, teams: 8, priority: "high" as const },
        { name: "Manutenção Corretiva", duration: 5, teams: 10, priority: "critical" as const },
        { name: "Inspeção Técnica", duration: 2, teams: 6, priority: "medium" as const },
        { name: "Revisão Geral", duration: 4, teams: 7, priority: "high" as const }
      ];

      const stopType = stopTypes[Math.floor(Math.random() * stopTypes.length)];
      
      // Criar paradas distribuídas ao longo de 2025
      const month = Math.floor(Math.random() * 12);
      const day = Math.floor(Math.random() * 28) + 1;
      const hour = Math.floor(Math.random() * 24);
      const startDate = new Date(2025, month, day, hour);
      const endDate = new Date(startDate.getTime() + (stopType.duration * 24 * 60 * 60 * 1000));
      
      // Garantir que TODAS as paradas tenham equipe - selecionar equipe baseada em índices únicos
      const teamIndex = (stopIdCounter + i + parseInt(group.id.split('.')[0] || '0')) % availableTeams.length;
      const selectedTeam = availableTeams[teamIndex];
      
      const isCompleted = Math.random() > 0.8;
      
      newStops.push({
        id: `stop-fixed-${++stopIdCounter}`,
        groupId: group.id,
        strategyId: undefined,
        title: `${stopType.name} - ${group.name}`,
        description: `${stopType.name} programada para o grupo ${group.name} - Equipe: ${selectedTeam}`,
        startDate: startDate,
        endDate: endDate,
        plannedStartDate: startDate,
        plannedEndDate: endDate,
        actualStartDate: isCompleted ? startDate : undefined,
        actualEndDate: isCompleted ? endDate : undefined,
        duration: stopType.duration * 24, // Converter para horas
        status: isCompleted ? 'completed' : 'planned',
        priority: stopType.priority,
        affectedAssets: group.assets.map(asset => asset.id),
        responsibleTeam: selectedTeam, // GARANTIR que todas as paradas tenham equipe
        estimatedCost: Math.floor(Math.random() * 50000) + 20000,
        actualCost: isCompleted ? Math.floor(Math.random() * 55000) + 22000 : undefined,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
  });

  return newStops;
};