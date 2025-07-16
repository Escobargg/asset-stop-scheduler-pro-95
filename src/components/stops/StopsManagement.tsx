import { useState, useMemo, useEffect } from "react";
import { Settings, Plus, Calendar, Clock, Users, CheckCircle, Trash2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { format, getWeek, getMonth, getYear } from "date-fns";
import { ptBR } from "date-fns/locale";
import { 
  locationCenters, 
  getPhasesByCenter, 
  getGroupsByCenterAndPhase,
  MaintenanceStop,
  maintenanceStops,
  AssetGroupData
} from "@/data/mockData";
import { useMaintenanceData } from "@/hooks/useMaintenanceData";
import { fixOrphanedStops, createStopsForGroupsWithoutStops } from "@/utils/stopsFixUtils";
import StopsFilters from "./StopsFilters";

const StopsManagement = () => {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingStop, setEditingStop] = useState<any>(null);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCenter, setSelectedCenter] = useState("all");
  const [selectedPhase, setSelectedPhase] = useState("all");
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [selectedWeek, setSelectedWeek] = useState("all");
  const [selectedYear, setSelectedYear] = useState(2025);
  
  const [formData, setFormData] = useState({
    name: "",
    locationCenter: "",
    phase: "",
    assetGroupId: "",
    plannedStartDate: "",
    plannedEndDate: "",
    actualStartDate: "",
    actualEndDate: "",
    duration: "",
    teams: "",
    totalHours: "",
    completion: "",
    description: ""
  });

  const [editFormData, setEditFormData] = useState({
    name: "",
    locationCenter: "",
    phase: "",
    assetGroupId: "",
    plannedStartDate: "",
    plannedEndDate: "",
    actualStartDate: "",
    actualEndDate: "",
    duration: "",
    teams: "",
    totalHours: "",
    completion: "",
    description: ""
  });

  const availablePhases = formData.locationCenter ? getPhasesByCenter(formData.locationCenter) : [];
  
  // Combinar grupos dos dados mock e do useMaintenanceData
  const { getAllGroups, getAllStops, updateStop } = useMaintenanceData();
  const maintenanceGroups = getAllGroups();
  const mockGroups = formData.locationCenter && formData.phase ? 
    getGroupsByCenterAndPhase(formData.locationCenter, formData.phase) : [];
  
  const availableGroups = [
    ...mockGroups,
    ...maintenanceGroups.filter(g => 
      g.locationCenter === formData.locationCenter && 
      g.phase === formData.phase
    )
  ];

  const editAvailablePhases = editFormData.locationCenter ? getPhasesByCenter(editFormData.locationCenter) : [];
  const editMockGroups = editFormData.locationCenter && editFormData.phase ? 
    getGroupsByCenterAndPhase(editFormData.locationCenter, editFormData.phase) : [];
  
  const editAvailableGroups = [
    ...editMockGroups,
    ...maintenanceGroups.filter(g => 
      g.locationCenter === editFormData.locationCenter && 
      g.phase === editFormData.phase
    )
  ];

  const handleCenterChange = (centerCode: string) => {
    setFormData({
      ...formData,
      locationCenter: centerCode,
      phase: "",
      assetGroupId: ""
    });
  };

  const handlePhaseChange = (phaseCode: string) => {
    setFormData({
      ...formData,
      phase: phaseCode,
      assetGroupId: ""
    });
  };

  const calculateTotalHours = (duration: string, teams: string) => {
    const durationNum = parseFloat(duration);
    const teamsNum = parseFloat(teams);
    if (!isNaN(durationNum) && !isNaN(teamsNum)) {
      return (durationNum * teamsNum).toString();
    }
    return "";
  };

  const handleDurationChange = (value: string) => {
    setFormData({
      ...formData,
      duration: value,
      totalHours: calculateTotalHours(value, formData.teams)
    });
  };

  const handleTeamsChange = (value: string) => {
    setFormData({
      ...formData,
      teams: value,
      totalHours: calculateTotalHours(formData.duration, value)
    });
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.locationCenter || !formData.phase || 
        !formData.assetGroupId || !formData.plannedStartDate || !formData.plannedEndDate) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    const plannedStart = new Date(formData.plannedStartDate);
    const plannedEnd = new Date(formData.plannedEndDate);
    
    // Calcular conclusão baseado na data conforme solicitado
    let completion = 0;
    if (plannedStart < new Date(2025, 6, 1)) { // Antes de julho de 2025
      completion = 100;
    } else if (plannedStart.getMonth() === 6 && plannedStart.getFullYear() === 2025) { // Julho de 2025
      completion = 50;
    } else {
      completion = parseFloat(formData.completion) || 0;
    }

    // Para paradas concluídas, preencher as datas realizadas com as planejadas
    const actualStart = completion === 100 ? plannedStart : (formData.actualStartDate ? new Date(formData.actualStartDate) : undefined);
    const actualEnd = completion === 100 ? plannedEnd : (formData.actualEndDate ? new Date(formData.actualEndDate) : undefined);

    const newStop: MaintenanceStop = {
      id: `stop-${Date.now()}`,
      name: formData.name,
      locationCenter: formData.locationCenter,
      phase: formData.phase,
      assetGroupId: formData.assetGroupId,
      startDate: plannedStart, // Manter compatibilidade
      endDate: plannedEnd, // Manter compatibilidade
      plannedStartDate: plannedStart,
      plannedEndDate: plannedEnd,
      actualStartDate: actualStart,
      actualEndDate: actualEnd,
      duration: parseFloat(formData.duration) || 0,
      teams: parseFloat(formData.teams) || 0,
      totalHours: parseFloat(formData.totalHours) || 0,
      completion: completion,
      description: formData.description,
      createdAt: new Date()
    };

    // Add to mock data
    maintenanceStops.push(newStop);

    toast({
      title: "Parada criada com sucesso!",
      description: `A parada "${formData.name}" foi criada.`
    });

    setFormData({
      name: "",
      locationCenter: "",
      phase: "",
      assetGroupId: "",
      plannedStartDate: "",
      plannedEndDate: "",
      actualStartDate: "",
      actualEndDate: "",
      duration: "",
      teams: "",
      totalHours: "",
      completion: "",
      description: ""
    });

    setIsDialogOpen(false);
  };

  const getGroupName = (groupId: string): string => {
    // Primeiro tenta buscar nos grupos dos dados mock
    const allMockGroups = locationCenters.flatMap(center => 
      center.phases.flatMap(phase => 
        getGroupsByCenterAndPhase(center.code, phase.code)
      )
    );
    const mockGroup = allMockGroups.find(g => g.id === groupId);
    if (mockGroup) return mockGroup.name;
    
    // Se não encontrar, busca nos grupos do useMaintenanceData
    const maintenanceGroup = maintenanceGroups.find(g => g.id === groupId);
    
    return maintenanceGroup?.name || "Grupo não encontrado";
  };

  const getCenterName = (centerCode: string): string => {
    const center = locationCenters.find(c => c.code === centerCode);
    return center ? `${center.code} - ${center.name}` : centerCode;
  };

  const getCompletionColor = (completion: number) => {
    if (completion >= 80) return "bg-green-500";
    if (completion >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  // Calcular conclusão baseado no status (mesma lógica do cronograma)
  const calculateCompletion = (stop: any) => {
    return stop.status === 'completed' ? 100 : stop.status === 'in-progress' ? 50 : 0;
  };

  // Função para abrir o modal de edição
  const handleEditStop = (stop: any) => {
    setEditingStop(stop);
    
    // Preencher o formulário de edição com os dados da parada
    const isFromMockData = !!(stop as any).name; // Mock data tem "name", hook tem "title"
    
    setEditFormData({
      name: (stop as any).name || (stop as any).title || '',
      locationCenter: (stop as any).locationCenter || '',
      phase: (stop as any).phase || '',
      assetGroupId: (stop as any).assetGroupId || (stop as any).groupId || '',
      plannedStartDate: ((stop as any).plannedStartDate || stop.startDate) ? format((stop as any).plannedStartDate || stop.startDate, "yyyy-MM-dd'T'HH:mm") : '',
      plannedEndDate: ((stop as any).plannedEndDate || stop.endDate) ? format((stop as any).plannedEndDate || stop.endDate, "yyyy-MM-dd'T'HH:mm") : '',
      actualStartDate: (stop as any).actualStartDate ? format((stop as any).actualStartDate, "yyyy-MM-dd'T'HH:mm") : '',
      actualEndDate: (stop as any).actualEndDate ? format((stop as any).actualEndDate, "yyyy-MM-dd'T'HH:mm") : '',
      duration: stop.duration?.toString() || '',
      teams: ((stop as any).teams || 1).toString(),
      totalHours: ((stop as any).totalHours || stop.duration).toString(),
      completion: isFromMockData ? ((stop as any).completion || 0).toString() : calculateCompletion(stop).toString(),
      description: stop.description || ''
    });
    
    setIsEditDialogOpen(true);
  };

  // Função para salvar alterações da parada
  const handleSaveEdit = () => {
    if (!editFormData.name || !editFormData.locationCenter || !editFormData.phase || 
        !editFormData.assetGroupId || !editFormData.plannedStartDate || !editFormData.plannedEndDate) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    const isFromMockData = !!(editingStop as any).name; // Mock data tem "name", hook tem "title"
    const completion = parseFloat(editFormData.completion) || 0;

    if (isFromMockData) {
      // Atualizar dados mock
      const stopIndex = maintenanceStops.findIndex(s => s.id === editingStop.id);
      if (stopIndex !== -1) {
        const plannedStart = new Date(editFormData.plannedStartDate);
        const plannedEnd = new Date(editFormData.plannedEndDate);
        
        // Para paradas concluídas, preencher as datas realizadas se não preenchidas
        let actualStart = editFormData.actualStartDate ? new Date(editFormData.actualStartDate) : undefined;
        let actualEnd = editFormData.actualEndDate ? new Date(editFormData.actualEndDate) : undefined;
        
        if (completion === 100 && !actualStart && !actualEnd) {
          actualStart = plannedStart;
          actualEnd = plannedEnd;
        }

        maintenanceStops[stopIndex] = {
          ...maintenanceStops[stopIndex],
          name: editFormData.name,
          locationCenter: editFormData.locationCenter,
          phase: editFormData.phase,
          assetGroupId: editFormData.assetGroupId,
          startDate: plannedStart, // Manter compatibilidade
          endDate: plannedEnd, // Manter compatibilidade
          plannedStartDate: plannedStart,
          plannedEndDate: plannedEnd,
          actualStartDate: actualStart,
          actualEndDate: actualEnd,
          duration: parseFloat(editFormData.duration) || 0,
          teams: parseFloat(editFormData.teams) || 1,
          totalHours: parseFloat(editFormData.totalHours) || 0,
          completion: completion,
          description: editFormData.description
        };
      }
    } else {
      // Usar hook para atualizar dados
      updateStop(editingStop.id, {
        title: editFormData.name,
        description: editFormData.description,
        startDate: new Date(editFormData.plannedStartDate),
        endDate: new Date(editFormData.plannedEndDate),
        duration: parseFloat(editFormData.duration) || 0,
        responsibleTeam: `Equipe ${editFormData.teams}`,
        updatedAt: new Date()
      });
    }

    toast({
      title: "Parada atualizada com sucesso!",
      description: `A parada foi atualizada.`
    });

    setIsEditDialogOpen(false);
    setEditingStop(null);
  };

  // Função para corrigir paradas com equipes N/A
  const fixStopsWithoutTeams = () => {
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

    // Corrigir paradas mock data
    maintenanceStops.forEach((stop, index) => {
      if (!stop.teams || stop.teams === 0) {
        const teamIndex = index % availableTeams.length;
        const teamCount = Math.floor(Math.random() * 3) + 1; // 1-3 equipes
        maintenanceStops[index] = {
          ...stop,
          teams: teamCount,
          totalHours: stop.duration * teamCount,
          description: `${stop.description} - Equipe: ${availableTeams[teamIndex]}`
        };
      }
    });

    // Corrigir paradas do hook
    const allStops = getAllStops();
    allStops.forEach((stop, index) => {
      if (!stop.responsibleTeam || stop.responsibleTeam === 'N/A') {
        const teamIndex = index % availableTeams.length;
        updateStop(stop.id, {
          responsibleTeam: availableTeams[teamIndex],
          updatedAt: new Date()
        });
      }
    });

    toast({
      title: "Paradas corrigidas!",
      description: "Todas as paradas agora têm equipes atribuídas.",
    });
  };

  // Aplicar correção automaticamente quando o componente carrega
  useEffect(() => {
    fixStopsWithoutTeams();
  }, []);

  // Handlers para edição e exclusão
  const handleEditCenterChange = (centerCode: string) => {
    setEditFormData({
      ...editFormData,
      locationCenter: centerCode,
      phase: "",
      assetGroupId: ""
    });
  };

  const handleEditPhaseChange = (phaseCode: string) => {
    setEditFormData({
      ...editFormData,
      phase: phaseCode,
      assetGroupId: ""
    });
  };

  const handleEditDurationChange = (value: string) => {
    setEditFormData({
      ...editFormData,
      duration: value,
      totalHours: calculateTotalHours(value, editFormData.teams)
    });
  };

  const handleEditTeamsChange = (value: string) => {
    setEditFormData({
      ...editFormData,
      teams: value,
      totalHours: calculateTotalHours(editFormData.duration, value)
    });
  };

  // Filter maintenanceStops based on filters - incluir paradas do useMaintenanceData
  const allStops = getAllStops();
  
  const filteredStops = useMemo(() => {
    // Combinar paradas dos dados mock e do hook
    const combinedStops = [...maintenanceStops, ...allStops];
    
    return combinedStops.filter(stop => {
      // Verificar se é parada do mock data ou do hook
      const stopName = (stop as any).name || (stop as any).title || '';
      const stopCenter = (stop as any).locationCenter || '';
      const stopPhase = (stop as any).phase || '';
      const stopGroupId = (stop as any).groupId || (stop as any).assetGroupId || '';
      
      const matchesSearch = stopName.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Filtro de centro corrigido - deve filtrar exatamente pelo centro
      const matchesCenter = selectedCenter === "all" || stopCenter === selectedCenter;
      
      // Filtro de fase corrigido - deve filtrar exatamente pela fase
      const matchesPhase = selectedPhase === "all" || stopPhase === selectedPhase;
      
      // Filter by year
      const stopYear = getYear(stop.startDate);
      const matchesYear = stopYear === selectedYear;
      
      // Filter by month
      let matchesMonth = true;
      if (selectedMonth !== "all") {
        const stopMonth = getMonth(stop.startDate) + 1; // getMonth returns 0-11
        matchesMonth = stopMonth === parseInt(selectedMonth);
      }
      
      // Filter by week
      let matchesWeek = true;
      if (selectedWeek !== "all") {
        const stopWeek = getWeek(stop.startDate);
        matchesWeek = stopWeek === parseInt(selectedWeek);
      }
      
      return matchesSearch && matchesCenter && matchesPhase && matchesYear && matchesMonth && matchesWeek;
    });
  }, [maintenanceStops, allStops, searchTerm, selectedCenter, selectedPhase, selectedMonth, selectedWeek, selectedYear]);

  return (
    <div className="space-y-6">
      <Card className="shadow-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-primary" />
                Cadastro de Paradas de Manutenção
              </CardTitle>
              <CardDescription>
                Gerencie as paradas de manutenção por centro de localização e fase
              </CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Parada
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Criar Nova Parada de Manutenção</DialogTitle>
                  <DialogDescription>
                    Preencha as informações da parada de manutenção
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="stopName">Nome da Parada *</Label>
                      <Input
                        id="stopName"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="Ex: Parada Geral Transportadores"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="completion">Conclusão (%) - Automático para paradas antes de jul/25</Label>
                      <Input
                        id="completion"
                        type="number"
                        min="0"
                        max="100"
                        value={formData.completion}
                        onChange={(e) => setFormData({...formData, completion: e.target.value})}
                        placeholder="Calculado automaticamente baseado na data"
                           disabled={formData.plannedStartDate && new Date(formData.plannedStartDate) < new Date(2025, 7, 1)}
                       />
                       {formData.plannedStartDate && new Date(formData.plannedStartDate) < new Date(2025, 6, 1) && (
                         <p className="text-xs text-muted-foreground mt-1">100% - Parada anterior a julho/2025</p>
                       )}
                       {formData.plannedStartDate && new Date(formData.plannedStartDate).getMonth() === 6 && new Date(formData.plannedStartDate).getFullYear() === 2025 && (
                         <p className="text-xs text-muted-foreground mt-1">50% - Parada de julho/2025</p>
                       )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="stopCenter">Centro de Localização *</Label>
                      <Select value={formData.locationCenter} onValueChange={handleCenterChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecionar Centro" />
                        </SelectTrigger>
                        <SelectContent>
                          {locationCenters.map((center) => (
                            <SelectItem key={center.code} value={center.code}>
                              {center.code} - {center.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="stopPhase">Fase *</Label>
                      <Select 
                        value={formData.phase} 
                        onValueChange={handlePhaseChange}
                        disabled={!formData.locationCenter}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecionar Fase" />
                        </SelectTrigger>
                        <SelectContent>
                          {availablePhases.map((phase) => (
                            <SelectItem key={phase.code} value={phase.code}>
                              {phase.code} - {phase.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="assetGroup">Grupo de Ativos *</Label>
                    <Select 
                      value={formData.assetGroupId} 
                      onValueChange={(value) => setFormData({...formData, assetGroupId: value})}
                      disabled={!formData.phase}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecionar Grupo de Ativos" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableGroups.map((group) => (
                          <SelectItem key={group.id} value={group.id}>
                            {group.name} ({group.assets.length} ativos)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="plannedStartDate">Data início planejada *</Label>
                      <Input
                        id="plannedStartDate"
                        type="datetime-local"
                        value={formData.plannedStartDate}
                        onChange={(e) => setFormData({...formData, plannedStartDate: e.target.value})}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="plannedEndDate">Fim planejada *</Label>
                      <Input
                        id="plannedEndDate"
                        type="datetime-local"
                        value={formData.plannedEndDate}
                        onChange={(e) => setFormData({...formData, plannedEndDate: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="actualStartDate">Data início realizado</Label>
                      <Input
                        id="actualStartDate"
                        type="datetime-local"
                        value={formData.actualStartDate}
                        onChange={(e) => setFormData({...formData, actualStartDate: e.target.value})}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="actualEndDate">Fim realizado</Label>
                      <Input
                        id="actualEndDate"
                        type="datetime-local"
                        value={formData.actualEndDate}
                        onChange={(e) => setFormData({...formData, actualEndDate: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="duration">Duração (horas)</Label>
                      <Input
                        id="duration"
                        type="number"
                        value={formData.duration}
                        onChange={(e) => handleDurationChange(e.target.value)}
                        placeholder="72"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="teams">Equipes</Label>
                      <Input
                        id="teams"
                        type="number"
                        value={formData.teams}
                        onChange={(e) => handleTeamsChange(e.target.value)}
                        placeholder="15"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="totalHours">Total de HH</Label>
                      <Input
                        id="totalHours"
                        type="number"
                        value={formData.totalHours}
                        readOnly
                        className="bg-muted"
                        placeholder="Calculado automaticamente"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="stopDescription">Descrição</Label>
                    <Textarea
                      id="stopDescription"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      placeholder="Descreva a parada de manutenção..."
                      rows={3}
                    />
                  </div>

                  <div className="flex justify-end space-x-2 pt-4">
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleSubmit}>
                      <Plus className="h-4 w-4 mr-2" />
                      Criar Parada
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        
        {/* Modal de Edição */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Editar Parada de Manutenção</DialogTitle>
              <DialogDescription>
                Altere as informações da parada de manutenção
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="editStopName">Nome da Parada *</Label>
                  <Input
                    id="editStopName"
                    value={editFormData.name}
                    onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                    placeholder="Ex: Parada Geral Transportadores"
                  />
                </div>
                
                <div>
                  <Label htmlFor="editCompletion">Conclusão (%)</Label>
                  <Input
                    id="editCompletion"
                    type="number"
                    min="0"
                    max="100"
                    value={editFormData.completion}
                    onChange={(e) => setEditFormData({...editFormData, completion: e.target.value})}
                    placeholder="Porcentagem de conclusão"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="editStopCenter">Centro de Localização *</Label>
                  <Select value={editFormData.locationCenter} onValueChange={handleEditCenterChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecionar Centro" />
                    </SelectTrigger>
                    <SelectContent>
                      {locationCenters.map((center) => (
                        <SelectItem key={center.code} value={center.code}>
                          {center.code} - {center.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="editStopPhase">Fase *</Label>
                  <Select 
                    value={editFormData.phase} 
                    onValueChange={handleEditPhaseChange}
                    disabled={!editFormData.locationCenter}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecionar Fase" />
                    </SelectTrigger>
                    <SelectContent>
                      {editAvailablePhases.map((phase) => (
                        <SelectItem key={phase.code} value={phase.code}>
                          {phase.code} - {phase.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="editAssetGroup">Grupo de Ativos *</Label>
                <Select 
                  value={editFormData.assetGroupId} 
                  onValueChange={(value) => setEditFormData({...editFormData, assetGroupId: value})}
                  disabled={!editFormData.phase}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar Grupo de Ativos" />
                  </SelectTrigger>
                  <SelectContent>
                    {editAvailableGroups.map((group) => (
                      <SelectItem key={group.id} value={group.id}>
                        {group.name} ({group.assets.length} ativos)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                   <Label htmlFor="editPlannedStartDate">Data início planejada *</Label>
                   <Input
                     id="editPlannedStartDate"
                     type="datetime-local"
                     value={editFormData.plannedStartDate}
                     onChange={(e) => setEditFormData({...editFormData, plannedStartDate: e.target.value})}
                   />
                 </div>
                 
                 <div>
                   <Label htmlFor="editPlannedEndDate">Fim planejada *</Label>
                   <Input
                     id="editPlannedEndDate"
                     type="datetime-local"
                     value={editFormData.plannedEndDate}
                     onChange={(e) => setEditFormData({...editFormData, plannedEndDate: e.target.value})}
                   />
                 </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                   <Label htmlFor="editActualStartDate">Data início realizado</Label>
                   <Input
                     id="editActualStartDate"
                     type="datetime-local"
                     value={editFormData.actualStartDate}
                     onChange={(e) => setEditFormData({...editFormData, actualStartDate: e.target.value})}
                   />
                 </div>
                 
                 <div>
                   <Label htmlFor="editActualEndDate">Fim realizado</Label>
                   <Input
                     id="editActualEndDate"
                     type="datetime-local"
                     value={editFormData.actualEndDate}
                     onChange={(e) => setEditFormData({...editFormData, actualEndDate: e.target.value})}
                   />
                 </div>
               </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="editDuration">Duração (horas)</Label>
                  <Input
                    id="editDuration"
                    type="number"
                    value={editFormData.duration}
                    onChange={(e) => handleEditDurationChange(e.target.value)}
                    placeholder="72"
                  />
                </div>
                
                <div>
                  <Label htmlFor="editTeams">Equipes</Label>
                  <Input
                    id="editTeams"
                    type="number"
                    value={editFormData.teams}
                    onChange={(e) => handleEditTeamsChange(e.target.value)}
                    placeholder="15"
                  />
                </div>
                
                <div>
                  <Label htmlFor="editTotalHours">Total de HH</Label>
                  <Input
                    id="editTotalHours"
                    type="number"
                    value={editFormData.totalHours}
                    readOnly
                    className="bg-muted"
                    placeholder="Calculado automaticamente"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="editStopDescription">Descrição</Label>
                <Textarea
                  id="editStopDescription"
                  value={editFormData.description}
                  onChange={(e) => setEditFormData({...editFormData, description: e.target.value})}
                  placeholder="Descreva a parada de manutenção..."
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSaveEdit}>
                  <Edit className="h-4 w-4 mr-2" />
                  Salvar Alterações
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        <CardContent>
          {/* Filtros */}
          <StopsFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedCenter={selectedCenter}
            onCenterChange={setSelectedCenter}
            selectedPhase={selectedPhase}
            onPhaseChange={setSelectedPhase}
            selectedYear={selectedYear}
            onYearChange={setSelectedYear}
            selectedMonth={selectedMonth}
            onMonthChange={setSelectedMonth}
            selectedWeek={selectedWeek}
            onWeekChange={setSelectedWeek}
          />

          <div className="space-y-4">
            {filteredStops.length === 0 ? (
              <div className="text-center py-8">
                <Settings className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">
                  {maintenanceStops.length === 0 
                    ? "Nenhuma parada cadastrada ainda." 
                    : "Nenhuma parada encontrada com os filtros aplicados."
                  }
                </p>
                <p className="text-sm text-muted-foreground">
                  {maintenanceStops.length === 0 
                    ? "Clique em \"Nova Parada\" para começar." 
                    : "Tente ajustar os filtros para ver mais resultados."
                  }
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredStops.map((stop) => (
                  <Card key={stop.id} className="shadow-sm">
                     <CardContent className="p-4">
                       <div className="flex items-start justify-between">
                         <div className="space-y-2">
                           <div className="flex items-center gap-2">
                             <h3 className="font-semibold">{(stop as any).name || (stop as any).title}</h3>
                             <Badge variant="outline">{getCenterName((stop as any).locationCenter || '')}</Badge>
                             <Badge variant="secondary">{(stop as any).phase || ''}</Badge>
                           </div>
                           
                           <p className="text-sm text-muted-foreground">
                             Grupo: {getGroupName((stop as any).assetGroupId || (stop as any).groupId)}
                           </p>
                           
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                <span>
                                  <strong>Planejada:</strong> {format(((stop as any).plannedStartDate || stop.startDate), "dd/MM/yyyy", { locale: ptBR })} - {format(((stop as any).plannedEndDate || stop.endDate), "dd/MM/yyyy", { locale: ptBR })}
                                </span>
                              </div>
                              {((stop as any).actualStartDate && (stop as any).actualEndDate) && (
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  <span>
                                    <strong>Realizada:</strong> {format((stop as any).actualStartDate, "dd/MM/yyyy", { locale: ptBR })} - {format((stop as any).actualEndDate, "dd/MM/yyyy", { locale: ptBR })}
                                  </span>
                                </div>
                              )}
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {stop.duration}h
                              </div>
                               <div className="flex items-center gap-1">
                                 <Users className="h-4 w-4" />
                                 {(stop as any).teams ? 
                                   `${(stop as any).teams} equipes` : 
                                   (stop as any).responsibleTeam || 'Equipe não atribuída'
                                 }
                               </div>
                              <div className="flex items-center gap-1">
                                <CheckCircle className="h-4 w-4" />
                                {(stop as any).totalHours || (stop.duration * ((stop as any).teams || 1))} HH total
                              </div>
                            </div>
                           
                           {stop.description && (
                             <p className="text-sm text-muted-foreground">{stop.description}</p>
                           )}
                         </div>
                         
                          <div className="flex items-center gap-2">
                            <div className="text-right">
                              <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${getCompletionColor(calculateCompletion(stop))}`}></div>
                                <span className="text-sm font-medium">{calculateCompletion(stop)}%</span>
                              </div>
                              <p className="text-xs text-muted-foreground">Conclusão</p>
                            </div>
                           <Button variant="ghost" size="sm" onClick={() => handleEditStop(stop)}>
                             <Edit className="h-4 w-4" />
                           </Button>
                           <Button variant="ghost" size="sm">
                             <Trash2 className="h-4 w-4" />
                           </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StopsManagement;