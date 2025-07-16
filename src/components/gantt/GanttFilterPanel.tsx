import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface GanttFilterPanelProps {
  // Filtros básicos
  searchTerm: string;
  onSearchChange: (value: string) => void;
  
  // Centros
  availableCenters: Array<{ code: string; name: string }>;
  selectedLocation: string;
  onLocationChange: (value: string) => void;
  
  // Fases
  availablePhases: string[];
  selectedPhase: string;
  onPhaseChange: (value: string) => void;
  
  // Anos
  availableYears: number[];
  selectedYear: number;
  onYearChange: (value: number) => void;
  
  // Meses
  availableMonths: Array<{ value: string; label: string }>;
  selectedMonth: string;
  onMonthChange: (value: string) => void;
  
  // Semanas
  availableWeeks: Array<{ value: string; label: string }>;
  selectedWeek: string;
  onWeekChange: (value: string) => void;
  
  // Controles
  hasActiveFilters: boolean;
  onClearFilters: () => void;
}

const GanttFilterPanel = ({
  searchTerm,
  onSearchChange,
  availableCenters,
  selectedLocation,
  onLocationChange,
  availablePhases,
  selectedPhase,
  onPhaseChange,
  availableYears,
  selectedYear,
  onYearChange,
  availableMonths,
  selectedMonth,
  onMonthChange,
  availableWeeks,
  selectedWeek,
  onWeekChange,
  hasActiveFilters,
  onClearFilters
}: GanttFilterPanelProps) => {
  return (
    <div className="space-y-4 p-4 bg-muted/30 rounded-lg border">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Filtros do Cronograma</h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="h-8 px-2"
          >
            <X className="h-4 w-4 mr-1" />
            Limpar
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {/* Busca */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground">Buscar Grupos</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Nome do grupo..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9 h-9"
            />
          </div>
        </div>

        {/* Centro */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground">Centro</label>
          <Select value={selectedLocation} onValueChange={onLocationChange}>
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Selecionar centro" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os centros</SelectItem>
              {availableCenters.map((center) => (
                <SelectItem key={center.code} value={center.code}>
                  {center.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Fase */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground">Fase</label>
          <Select value={selectedPhase} onValueChange={onPhaseChange}>
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Selecionar fase" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as fases</SelectItem>
              {availablePhases.map((phase) => (
                <SelectItem key={phase} value={phase}>
                  {phase}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Ano */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground">Ano</label>
          <Select value={selectedYear.toString()} onValueChange={(value) => onYearChange(parseInt(value))}>
            <SelectTrigger className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {availableYears.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Mês */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground">Mês</label>
          <Select value={selectedMonth} onValueChange={onMonthChange}>
            <SelectTrigger className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {availableMonths.map((month) => (
                <SelectItem key={month.value} value={month.value}>
                  {month.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Semana */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground">Semana</label>
          <Select value={selectedWeek} onValueChange={onWeekChange}>
            <SelectTrigger className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {availableWeeks.map((week) => (
                <SelectItem key={week.value} value={week.value}>
                  {week.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Filtros ativos */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {searchTerm && (
            <Badge variant="secondary" className="text-xs">
              Busca: {searchTerm}
            </Badge>
          )}
          {selectedLocation !== 'all' && (
            <Badge variant="secondary" className="text-xs">
              Centro: {availableCenters.find(c => c.code === selectedLocation)?.name || selectedLocation}
            </Badge>
          )}
          {selectedPhase !== 'all' && (
            <Badge variant="secondary" className="text-xs">
              Fase: {selectedPhase}
            </Badge>
          )}
          {selectedMonth !== 'all' && (
            <Badge variant="secondary" className="text-xs">
              Mês: {availableMonths.find(m => m.value === selectedMonth)?.label}
            </Badge>
          )}
          {selectedWeek !== 'all' && (
            <Badge variant="secondary" className="text-xs">
              Semana: {availableWeeks.find(w => w.value === selectedWeek)?.label}
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};

export default GanttFilterPanel;