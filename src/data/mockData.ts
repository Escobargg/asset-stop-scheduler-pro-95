export interface LocationCenter {
  id: string;
  code: string;
  name: string;
  phases: Phase[];
}

export interface Phase {
  id: string;
  code: string;
  name: string;
  centerCode: string;
}

export interface Asset {
  id: string;
  tag: string;
  name: string;
  type: string;
  locationCenter: string;
  phase: string;
}

export interface AssetGroupData {
  id: string;
  name: string;
  locationCenter: string;
  phase: string;
  type: string;
  system: string;
  category: string;
  description: string;
  assets: Asset[];
  createdAt: Date;
}

export interface MaintenanceStop {
  id: string;
  name: string;
  locationCenter: string;
  phase: string;
  assetGroupId: string;
  startDate: Date;
  endDate: Date;
  plannedStartDate: Date;
  plannedEndDate: Date;
  actualStartDate?: Date;
  actualEndDate?: Date;
  duration: number; // em horas
  teams: number;
  totalHours: number;
  completion: number; // percentual
  description: string;
  createdAt: Date;
}

// Centros de Localização com suas fases
export const locationCenters: LocationCenter[] = [
  {
    id: "1089",
    code: "1089",
    name: "Tubarão",
    phases: [
      { id: "1089-PORTO", code: "PORTO", name: "Porto", centerCode: "1089" },
      { id: "1089-PELOTIZAÇÃO", code: "PELOTIZAÇÃO", name: "Pelotização", centerCode: "1089" }
    ]
  },
  {
    id: "2001",
    code: "2001", 
    name: "Mina Carajás",
    phases: [
      { id: "2001-MINA", code: "MINA", name: "Mina", centerCode: "2001" },
      { id: "2001-BENEFICIAMENTO", code: "BENEFICIAMENTO", name: "Beneficiamento", centerCode: "2001" }
    ]
  },
  {
    id: "3050",
    code: "3050",
    name: "Usina Vitória", 
    phases: [
      { id: "3050-USINA", code: "USINA", name: "Usina", centerCode: "3050" },
      { id: "3050-LAMINAÇÃO", code: "LAMINAÇÃO", name: "Laminação", centerCode: "3050" }
    ]
  },
  {
    id: "4100",
    code: "4100",
    name: "Pelotização Tubarão",
    phases: [
      { id: "4100-PELOTIZAÇÃO", code: "PELOTIZAÇÃO", name: "Pelotização", centerCode: "4100" },
      { id: "4100-EXPEDIÇÃO", code: "EXPEDIÇÃO", name: "Expedição", centerCode: "4100" }
    ]
  },
  {
    id: "5200", 
    code: "5200",
    name: "Ferrovia Norte",
    phases: [
      { id: "5200-FERROVIA", code: "FERROVIA", name: "Ferrovia", centerCode: "5200" },
      { id: "5200-MANUTENÇÃO", code: "MANUTENÇÃO", name: "Manutenção", centerCode: "5200" }
    ]
  },
  {
    id: "6001",
    code: "6001",
    name: "Itabira",
    phases: [
      { id: "6001-MINA", code: "MINA", name: "Mina", centerCode: "6001" },
      { id: "6001-BENEFICIAMENTO", code: "BENEFICIAMENTO", name: "Beneficiamento", centerCode: "6001" }
    ]
  },
  {
    id: "6002",
    code: "6002",
    name: "Mariana",
    phases: [
      { id: "6002-MINA", code: "MINA", name: "Mina", centerCode: "6002" },
      { id: "6002-USINA", code: "USINA", name: "Usina", centerCode: "6002" }
    ]
  },
  {
    id: "6003",
    code: "6003",
    name: "Nova Lima",
    phases: [
      { id: "6003-MINA", code: "MINA", name: "Mina", centerCode: "6003" },
      { id: "6003-BENEFICIAMENTO", code: "BENEFICIAMENTO", name: "Beneficiamento", centerCode: "6003" }
    ]
  },
  {
    id: "6004",
    code: "6004",
    name: "Ouro Preto",
    phases: [
      { id: "6004-MINA", code: "MINA", name: "Mina", centerCode: "6004" },
      { id: "6004-PELOTIZAÇÃO", code: "PELOTIZAÇÃO", name: "Pelotização", centerCode: "6004" }
    ]
  },
  {
    id: "6005",
    code: "6005",
    name: "São Luís",
    phases: [
      { id: "6005-PORTO", code: "PORTO", name: "Porto", centerCode: "6005" },
      { id: "6005-FERROVIA", code: "FERROVIA", name: "Ferrovia", centerCode: "6005" }
    ]
  },
  {
    id: "6006",
    code: "6006",
    name: "Parauapebas",
    phases: [
      { id: "6006-MINA", code: "MINA", name: "Mina", centerCode: "6006" },
      { id: "6006-BENEFICIAMENTO", code: "BENEFICIAMENTO", name: "Beneficiamento", centerCode: "6006" }
    ]
  },
  {
    id: "6007",
    code: "6007",
    name: "Canaã dos Carajás",
    phases: [
      { id: "6007-MINA", code: "MINA", name: "Mina", centerCode: "6007" },
      { id: "6007-USINA", code: "USINA", name: "Usina", centerCode: "6007" }
    ]
  },
  {
    id: "6008",
    code: "6008",
    name: "Ipatinga",
    phases: [
      { id: "6008-USINA", code: "USINA", name: "Usina", centerCode: "6008" },
      { id: "6008-LAMINAÇÃO", code: "LAMINAÇÃO", name: "Laminação", centerCode: "6008" }
    ]
  },
  {
    id: "6009",
    code: "6009",
    name: "Varginha",
    phases: [
      { id: "6009-PELOTIZAÇÃO", code: "PELOTIZAÇÃO", name: "Pelotização", centerCode: "6009" },
      { id: "6009-EXPEDIÇÃO", code: "EXPEDIÇÃO", name: "Expedição", centerCode: "6009" }
    ]
  },
  {
    id: "6010",
    code: "6010",
    name: "Brumadinho",
    phases: [
      { id: "6010-MINA", code: "MINA", name: "Mina", centerCode: "6010" },
      { id: "6010-BENEFICIAMENTO", code: "BENEFICIAMENTO", name: "Beneficiamento", centerCode: "6010" }
    ]
  },
  {
    id: "6011",
    code: "6011",
    name: "Congonhas",
    phases: [
      { id: "6011-MINA", code: "MINA", name: "Mina", centerCode: "6011" },
      { id: "6011-FERROVIA", code: "FERROVIA", name: "Ferrovia", centerCode: "6011" }
    ]
  },
  {
    id: "6012",
    code: "6012",
    name: "João Monlevade",
    phases: [
      { id: "6012-USINA", code: "USINA", name: "Usina", centerCode: "6012" },
      { id: "6012-LAMINAÇÃO", code: "LAMINAÇÃO", name: "Laminação", centerCode: "6012" }
    ]
  },
  {
    id: "6013",
    code: "6013",
    name: "Santa Bárbara",
    phases: [
      { id: "6013-MINA", code: "MINA", name: "Mina", centerCode: "6013" },
      { id: "6013-BENEFICIAMENTO", code: "BENEFICIAMENTO", name: "Beneficiamento", centerCode: "6013" }
    ]
  },
  {
    id: "6014",
    code: "6014",
    name: "Sabará",
    phases: [
      { id: "6014-MINA", code: "MINA", name: "Mina", centerCode: "6014" },
      { id: "6014-PELOTIZAÇÃO", code: "PELOTIZAÇÃO", name: "Pelotização", centerCode: "6014" }
    ]
  },
  {
    id: "6015",
    code: "6015",
    name: "Itabirito",
    phases: [
      { id: "6015-MINA", code: "MINA", name: "Mina", centerCode: "6015" },
      { id: "6015-BENEFICIAMENTO", code: "BENEFICIAMENTO", name: "Beneficiamento", centerCode: "6015" }
    ]
  }
];

// Ativos por centro e fase - expandidos
export const assets: Asset[] = [
  // 1089 - PORTO
  { id: "TB-001", tag: "TB-001", name: "Transportador de Correia 001", type: "Transportador", locationCenter: "1089", phase: "PORTO" },
  { id: "TB-002", tag: "TB-002", name: "Transportador de Correia 002", type: "Transportador", locationCenter: "1089", phase: "PORTO" },
  { id: "TB-003", tag: "TB-003", name: "Transportador de Correia 003", type: "Transportador", locationCenter: "1089", phase: "PORTO" },
  { id: "M-001", tag: "M-001", name: "Moega de Recepção 001", type: "Moega", locationCenter: "1089", phase: "PORTO" },
  { id: "M-002", tag: "M-002", name: "Moega de Recepção 002", type: "Moega", locationCenter: "1089", phase: "PORTO" },
  { id: "GP-001", tag: "GP-001", name: "Guindaste de Pórtico 001", type: "Guindaste", locationCenter: "1089", phase: "PORTO" },
  { id: "GP-002", tag: "GP-002", name: "Guindaste de Pórtico 002", type: "Guindaste", locationCenter: "1089", phase: "PORTO" },
  
  // 1089 - PELOTIZAÇÃO
  { id: "FO-001", tag: "FO-001", name: "Forno de Pelotização 001", type: "Forno", locationCenter: "1089", phase: "PELOTIZAÇÃO" },
  { id: "FO-002", tag: "FO-002", name: "Forno de Pelotização 002", type: "Forno", locationCenter: "1089", phase: "PELOTIZAÇÃO" },
  { id: "MI-001", tag: "MI-001", name: "Misturador 001", type: "Misturador", locationCenter: "1089", phase: "PELOTIZAÇÃO" },
  { id: "MI-002", tag: "MI-002", name: "Misturador 002", type: "Misturador", locationCenter: "1089", phase: "PELOTIZAÇÃO" },
  
  // 2001 - MINA
  { id: "BR-001", tag: "BR-001", name: "Britador Primário 001", type: "Britador", locationCenter: "2001", phase: "MINA" },
  { id: "BR-002", tag: "BR-002", name: "Britador Secundário 001", type: "Britador", locationCenter: "2001", phase: "MINA" },
  { id: "EX-001", tag: "EX-001", name: "Escavadeira 001", type: "Escavadeira", locationCenter: "2001", phase: "MINA" },
  { id: "EX-002", tag: "EX-002", name: "Escavadeira 002", type: "Escavadeira", locationCenter: "2001", phase: "MINA" },
  { id: "CA-001", tag: "CA-001", name: "Caminhão Fora de Estrada 001", type: "Caminhão", locationCenter: "2001", phase: "MINA" },
  { id: "CA-002", tag: "CA-002", name: "Caminhão Fora de Estrada 002", type: "Caminhão", locationCenter: "2001", phase: "MINA" },
  
  // 2001 - BENEFICIAMENTO
  { id: "BR-003", tag: "BR-003", name: "Britador Terciário 001", type: "Britador", locationCenter: "2001", phase: "BENEFICIAMENTO" },
  { id: "PE-001", tag: "PE-001", name: "Peneira Vibratória 001", type: "Peneira", locationCenter: "2001", phase: "BENEFICIAMENTO" },
  { id: "PE-002", tag: "PE-002", name: "Peneira Vibratória 002", type: "Peneira", locationCenter: "2001", phase: "BENEFICIAMENTO" },
  
  // 3050 - USINA
  { id: "AF-001", tag: "AF-001", name: "Alto Forno 001", type: "Forno", locationCenter: "3050", phase: "USINA" },
  { id: "AF-002", tag: "AF-002", name: "Alto Forno 002", type: "Forno", locationCenter: "3050", phase: "USINA" },
  { id: "CV-001", tag: "CV-001", name: "Conversor LD 001", type: "Conversor", locationCenter: "3050", phase: "USINA" },
  { id: "CV-002", tag: "CV-002", name: "Conversor LD 002", type: "Conversor", locationCenter: "3050", phase: "USINA" },
  
  // 3050 - LAMINAÇÃO
  { id: "LQ-001", tag: "LQ-001", name: "Laminador a Quente 001", type: "Laminador", locationCenter: "3050", phase: "LAMINAÇÃO" },
  { id: "LF-001", tag: "LF-001", name: "Laminador a Frio 001", type: "Laminador", locationCenter: "3050", phase: "LAMINAÇÃO" },
  { id: "BO-001", tag: "BO-001", name: "Bobinador 001", type: "Bobinador", locationCenter: "3050", phase: "LAMINAÇÃO" },
  { id: "BO-002", tag: "BO-002", name: "Bobinador 002", type: "Bobinador", locationCenter: "3050", phase: "LAMINAÇÃO" },

  // Adicionar mais ativos para os novos centros
  ...generateMoreAssets()
];

// Função para gerar mais ativos
function generateMoreAssets(): Asset[] {
  const moreAssets: Asset[] = [];
  
  // Adicionar ativos para cada novo centro
  const newCenters = [
    { code: "6001", name: "Itabira", phases: ["MINA", "BENEFICIAMENTO"] },
    { code: "6002", name: "Mariana", phases: ["MINA", "USINA"] },
    { code: "6003", name: "Nova Lima", phases: ["MINA", "BENEFICIAMENTO"] },
    { code: "6004", name: "Ouro Preto", phases: ["MINA", "PELOTIZAÇÃO"] },
    { code: "6005", name: "São Luís", phases: ["PORTO", "FERROVIA"] }
  ];

  newCenters.forEach(center => {
    center.phases.forEach(phase => {
      // Adicionar 10 ativos por fase para cada centro
      for (let i = 1; i <= 10; i++) {
        const id = `${center.code}-${i.toString().padStart(3, '0')}`;
        const tag = `${center.code}-EQ-${i.toString().padStart(3, '0')}`;
        const name = `Equipamento ${center.name} ${i.toString().padStart(3, '0')}`;
        
        moreAssets.push({
          id,
          tag,
          name,
          type: "Equipamento",
          locationCenter: center.code,
          phase: phase as any
        });
      }
    });
  });

  return moreAssets;
}

// Grupos de ativos expandidos
export const assetGroups: AssetGroupData[] = [
  {
    id: "group-001",
    name: "Transportadores Porto Tubarão",
    locationCenter: "1089",
    phase: "PORTO", 
    type: "Transportador",
    system: "Movimentação",
    category: "Crítico",
    description: "Grupo de transportadores de correia do porto",
    assets: assets.filter(a => a.locationCenter === "1089" && a.phase === "PORTO" && a.type === "Transportador"),
    createdAt: new Date("2024-01-15")
  },
  {
    id: "group-002",
    name: "Britadores Carajás",
    locationCenter: "2001",
    phase: "MINA",
    type: "Britador", 
    system: "Cominuição",
    category: "Crítico",
    description: "Britadores da operação de mina",
    assets: assets.filter(a => a.locationCenter === "2001" && a.phase === "MINA" && a.type === "Britador"),
    createdAt: new Date("2024-01-20")
  },
  {
    id: "group-003", 
    name: "Fornos Alto Forno Vitória",
    locationCenter: "3050",
    phase: "USINA",
    type: "Forno",
    system: "Siderurgia", 
    category: "Crítico",
    description: "Altos fornos da usina de Vitória",
    assets: assets.filter(a => a.locationCenter === "3050" && a.phase === "USINA" && a.type === "Forno"),
    createdAt: new Date("2024-02-01")
  },
  {
    id: "group-004",
    name: "Equipamentos Itabira Mina",
    locationCenter: "6001",
    phase: "MINA",
    type: "Equipamento",
    system: "Mineração",
    category: "Crítico",
    description: "Equipamentos da mina de Itabira",
    assets: assets.filter(a => a.locationCenter === "6001" && a.phase === "MINA"),
    createdAt: new Date("2024-03-01")
  },
  {
    id: "group-005",
    name: "Equipamentos Mariana Usina", 
    locationCenter: "6002",
    phase: "USINA",
    type: "Equipamento",
    system: "Siderurgia",
    category: "Crítico", 
    description: "Equipamentos da usina de Mariana",
    assets: assets.filter(a => a.locationCenter === "6002" && a.phase === "USINA"),
    createdAt: new Date("2024-03-15")
  }
];

// Função para gerar paradas com equipes e durações calculadas
const generateBasicMaintenanceStops = (): MaintenanceStop[] => {
  const teams = [
    "Equipe Mecânica A",
    "Equipe Elétrica B", 
    "Equipe Instrumentação C",
    "Equipe Caldeiraria D",
    "Equipe Soldagem E",
    "Equipe Hidráulica F",
    "Equipe Lubrificação G",
    "Equipe Estrutural H"
  ];

  const stops: MaintenanceStop[] = [];
  
  assetGroups.forEach((group, index) => {
    // Criar 3-5 paradas por grupo
    const stopsCount = 3 + Math.floor(Math.random() * 3);
    
    for (let i = 0; i < stopsCount; i++) {
      const startDate = new Date(2024, 5 + Math.floor(Math.random() * 8), Math.floor(Math.random() * 28) + 1);
      const durationDays = 2 + Math.floor(Math.random() * 10); // 2-12 dias
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + durationDays);
      
      const durationHours = durationDays * 24;
      const teamsCount = 1 + Math.floor(Math.random() * 3); // 1-4 equipes
      const selectedTeams = teams.slice(0, teamsCount);
      
      // Calcular conclusão baseado na data
      let completion = 0;
      const now = new Date();
      const julyStart = new Date(2025, 6, 1); // julho 2025
      
      if (startDate < julyStart) {
        completion = 100; // Antes de julho 2025 = 100%
      } else if (startDate.getMonth() === 6 && startDate.getFullYear() === 2025) {
        completion = 50; // Julho 2025 = 50%
      }
      
      stops.push({
        id: `stop-${group.id}-${i + 1}`,
        name: `Parada ${group.name} ${i + 1}`,
        locationCenter: group.locationCenter,
        phase: group.phase,
        assetGroupId: group.id,
        startDate,
        endDate,
        plannedStartDate: startDate,
        plannedEndDate: endDate,
        actualStartDate: completion === 100 ? startDate : undefined,
        actualEndDate: completion === 100 ? endDate : undefined,
        duration: durationHours,
        teams: teamsCount,
        totalHours: durationHours * teamsCount,
        completion,
        description: `Manutenção programada do grupo ${group.name} - Equipes: ${selectedTeams.join(', ')}`,
        createdAt: new Date()
      });
    }
  });
  
  return stops;
};

// Paradas de manutenção geradas
export const maintenanceStops: MaintenanceStop[] = generateBasicMaintenanceStops();

// Função para obter fases por centro
export const getPhasesByCenter = (centerCode: string): Phase[] => {
  const center = locationCenters.find(c => c.code === centerCode);
  return center?.phases || [];
};

// Função para obter ativos por centro e fase
export const getAssetsByCenterAndPhase = (centerCode: string, phaseCode: string): Asset[] => {
  return assets.filter(a => a.locationCenter === centerCode && a.phase === phaseCode);
};

// Função para obter grupos por centro e fase
export const getGroupsByCenterAndPhase = (centerCode: string, phaseCode: string): AssetGroupData[] => {
  return assetGroups.filter(g => g.locationCenter === centerCode && g.phase === phaseCode);
};

// Função para obter paradas por centro e fase
export const getStopsByCenterAndPhase = (centerCode: string, phaseCode: string): MaintenanceStop[] => {
  return maintenanceStops.filter(s => s.locationCenter === centerCode && s.phase === phaseCode);
};