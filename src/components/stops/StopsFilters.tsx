import { useState, useMemo, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { locationCenters, getPhasesByCenter } from "@/data/mockData";
import { useMaintenanceData } from "@/hooks/useMaintenanceData";

interface StopsFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCenter: string;
  onCenterChange: (value: string) => void;
  selectedPhase: string;
  onPhaseChange: (value: string) => void;
  selectedYear: number;
  onYearChange: (value: number) => void;
  selectedMonth: string;
  onMonthChange: (value: string) => void;
  selectedWeek: string;
  onWeekChange: (value: string) => void;
}

const StopsFilters = ({
  searchTerm,
  onSearchChange,
  selectedCenter,
  onCenterChange,
  selectedPhase,
  onPhaseChange,
  selectedYear,
  onYearChange,
  selectedMonth,
  onMonthChange,
  selectedWeek,
  onWeekChange
}: StopsFiltersProps) => {
  const { getAllGroups } = useMaintenanceData();
  const maintenanceGroups = getAllGroups();

  // Fases disponíveis baseadas no centro selecionado (filtro em cascata)
  const availablePhases = useMemo(() => {
    if (selectedCenter === "all") {
      // Se nenhum centro específico, mostrar todas as fases disponíveis
      const allPhases = new Set<string>();
      locationCenters.forEach(center => {
        getPhasesByCenter(center.code).forEach(phase => {
          allPhases.add(phase.code);
        });
      });
      // Também incluir fases dos grupos de manutenção
      maintenanceGroups.forEach(group => {
        if (group.phase) {
          allPhases.add(group.phase);
        }
      });
      return Array.from(allPhases).sort();
    } else {
      // Filtrar fases do centro selecionado
      const centerPhases = getPhasesByCenter(selectedCenter).map(p => p.code);
      // Também incluir fases dos grupos de manutenção do centro
      const maintenancePhasesForCenter = maintenanceGroups
        .filter(group => group.locationCenter === selectedCenter)
        .map(group => group.phase)
        .filter(Boolean);
      
      const combinedPhases = new Set([...centerPhases, ...maintenancePhasesForCenter]);
      return Array.from(combinedPhases).sort();
    }
  }, [selectedCenter, maintenanceGroups]);

  // Reset fase quando centro muda se a fase não estiver mais disponível
  useEffect(() => {
    if (selectedPhase !== "all" && !availablePhases.includes(selectedPhase)) {
      onPhaseChange("all");
    }
  }, [availablePhases, selectedPhase, onPhaseChange]);

  const handleCenterChange = (value: string) => {
    onCenterChange(value);
    // Reset fase se não estiver mais disponível no novo centro
    if (selectedPhase !== "all") {
      const newAvailablePhases = value === "all" 
        ? Array.from(new Set(locationCenters.flatMap(c => getPhasesByCenter(c.code).map(p => p.code))))
        : getPhasesByCenter(value).map(p => p.code);
      
      if (!newAvailablePhases.includes(selectedPhase)) {
        onPhaseChange("all");
      }
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
      <div>
        <Label htmlFor="searchStops">Pesquisar</Label>
        <Input
          id="searchStops"
          placeholder="Nome da parada..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full"
        />
      </div>
      
      <div>
        <Label htmlFor="filterCenter">Centro</Label>
        <Select value={selectedCenter} onValueChange={handleCenterChange}>
          <SelectTrigger>
            <SelectValue placeholder="Todos os centros" />
          </SelectTrigger>
          <SelectContent className="z-50 bg-background">
            <SelectItem value="all">Todos os centros</SelectItem>
            {locationCenters.map((center) => (
              <SelectItem key={center.code} value={center.code}>
                {center.code} - {center.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="filterPhase">Fase</Label>
        <Select value={selectedPhase} onValueChange={onPhaseChange}>
          <SelectTrigger>
            <SelectValue placeholder="Todas as fases" />
          </SelectTrigger>
          <SelectContent className="z-50 bg-background">
            <SelectItem value="all">Todas as fases</SelectItem>
            {availablePhases.map((phase) => (
              <SelectItem key={phase} value={phase}>
                {phase}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="filterYear">Ano</Label>
        <Select value={selectedYear.toString()} onValueChange={(value) => onYearChange(parseInt(value))}>
          <SelectTrigger>
            <SelectValue placeholder="2025" />
          </SelectTrigger>
          <SelectContent className="z-50 bg-background">
            <SelectItem value="2024">2024</SelectItem>
            <SelectItem value="2025">2025</SelectItem>
            <SelectItem value="2026">2026</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="filterMonth">Mês</Label>
        <Select value={selectedMonth} onValueChange={onMonthChange}>
          <SelectTrigger>
            <SelectValue placeholder="Todos os meses" />
          </SelectTrigger>
          <SelectContent className="z-50 bg-background">
            <SelectItem value="all">Todos os meses</SelectItem>
            <SelectItem value="1">Janeiro</SelectItem>
            <SelectItem value="2">Fevereiro</SelectItem>
            <SelectItem value="3">Março</SelectItem>
            <SelectItem value="4">Abril</SelectItem>
            <SelectItem value="5">Maio</SelectItem>
            <SelectItem value="6">Junho</SelectItem>
            <SelectItem value="7">Julho</SelectItem>
            <SelectItem value="8">Agosto</SelectItem>
            <SelectItem value="9">Setembro</SelectItem>
            <SelectItem value="10">Outubro</SelectItem>
            <SelectItem value="11">Novembro</SelectItem>
            <SelectItem value="12">Dezembro</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="filterWeek">Semana</Label>
        <Select value={selectedWeek} onValueChange={onWeekChange}>
          <SelectTrigger>
            <SelectValue placeholder="Todas as semanas" />
          </SelectTrigger>
          <SelectContent className="z-50 bg-background">
            <SelectItem value="all">Todas as semanas</SelectItem>
            {Array.from({ length: 53 }, (_, i) => i + 1).map((week) => (
              <SelectItem key={week} value={week.toString()}>
                Semana {week}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default StopsFilters;