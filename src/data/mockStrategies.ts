import { MaintenanceStrategy } from "@/types";

// Estratégias criadas no sistema - inicializado com estratégias dos grupos
let strategiesCounter = 1000;

// Função para gerar estratégias baseadas nos grupos
const generateMockStrategies = (): MaintenanceStrategy[] => {
  const strategies: MaintenanceStrategy[] = [];
  
  const strategyTemplates = [
    { name: "Manutenção Preventiva Mensal", frequency: { value: 1, unit: "months" as const }, duration: { value: 3, unit: "days" as const }, priority: "high" as const },
    { name: "Calibração Trimestral", frequency: { value: 3, unit: "months" as const }, duration: { value: 2, unit: "days" as const }, priority: "high" as const },
    { name: "Inspeção Termográfica", frequency: { value: 6, unit: "months" as const }, duration: { value: 2, unit: "days" as const }, priority: "critical" as const },
    { name: "Análise Vibração", frequency: { value: 2, unit: "months" as const }, duration: { value: 1, unit: "days" as const }, priority: "high" as const }
  ];

  // Para demonstration purposes, criar algumas estratégias iniciais
  strategyTemplates.forEach((template, index) => {
    const startDate = new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
    
    strategies.push({
      id: `strategy-initial-${index + 1}`,
      name: template.name,
      groupId: `mock-group-${index + 1}`, // Será atualizado quando grupos reais forem associados
      frequency: template.frequency,
      duration: template.duration,
      startDate: startDate,
      endDate: new Date(2025, 11, 31),
      isActive: true,
      description: `${template.name} - Estratégia padrão do sistema`,
      priority: template.priority,
      teams: ["Equipe Manutenção", "Equipe Técnica"],
      totalHours: template.duration.value * 24,
      completionPercentage: Math.floor(Math.random() * 100),
      createdAt: new Date(),
      updatedAt: new Date()
    });
  });

  return strategies;
};

export const mockStrategies: MaintenanceStrategy[] = generateMockStrategies();

// Função para adicionar nova estratégia
export const addStrategy = (strategy: Omit<MaintenanceStrategy, 'id' | 'createdAt' | 'updatedAt'>): MaintenanceStrategy => {
  const newStrategy: MaintenanceStrategy = {
    ...strategy,
    id: `strategy-${++strategiesCounter}`,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  mockStrategies.push(newStrategy);
  return newStrategy;
};