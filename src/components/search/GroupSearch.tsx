import { Search, Filter, Building2, MapPin, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AssetGroup } from "@/types";
import { useMaintenanceData } from "@/hooks/useMaintenanceData";
import { useCascadingFilters } from "@/hooks/useCascadingFilters";

interface GroupSearchProps {
  onSelectGroup: (group: AssetGroup) => void;
  onViewGantt?: (groups: AssetGroup[]) => void;
}

const GroupSearch = ({ onSelectGroup, onViewGantt }: GroupSearchProps) => {
  const { getAllGroups } = useMaintenanceData();
  const allGroups = getAllGroups();
  
  const {
    filterState,
    filteredGroups,
    availableCenters,
    availablePhases,
    updateSearchTerm,
    updateSelectedCenter,
    updateSelectedPhase,
    clearAllFilters,
    hasActiveFilters
  } = useCascadingFilters(allGroups);

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-primary" />
            Localizar Grupos de Ativos
          </CardTitle>
          <CardDescription>
            Busque grupos por centro de localização, fase e nome do grupo
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 1. Busca por nome - sempre primeiro */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome..."
                value={filterState.searchTerm}
                onChange={(e) => updateSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {/* 2. Centro de localização - segundo */}
            <div className="relative">
              <Select value={filterState.selectedCenter} onValueChange={updateSelectedCenter}>
                <SelectTrigger>
                  <SelectValue placeholder="Centro de Localização" />
                </SelectTrigger>
                <SelectContent className="z-50 bg-background">
                  <SelectItem value="all">Todos os centros</SelectItem>
                  {availableCenters.map((center) => (
                    <SelectItem key={center.code} value={center.code}>
                      {center.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {filterState.selectedCenter !== 'all' && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-8 top-1 h-8 w-8 p-0"
                  onClick={() => updateSelectedCenter('all')}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
            
            {/* 3. Fase - terceiro */}
            <div className="relative">
              <Select value={filterState.selectedPhase} onValueChange={updateSelectedPhase}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar Fase" />
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
              {filterState.selectedPhase !== 'all' && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-8 top-1 h-8 w-8 p-0"
                  onClick={() => updateSelectedPhase('all')}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
          
          {/* Botão para limpar todos os filtros */}
          {hasActiveFilters && (
            <div className="flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllFilters}
              >
                <X className="h-4 w-4 mr-2" />
                Limpar Filtros
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Resultados */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            Grupos Encontrados ({filteredGroups.length})
          </h3>
          {onViewGantt && filteredGroups.length > 0 && (
            <Button 
              onClick={() => onViewGantt(filteredGroups)}
              variant="secondary"
              className="ml-4"
            >
              <Building2 className="h-4 w-4 mr-2" />
              Ver Cronograma Gantt
            </Button>
          )}
        </div>
        
        {filteredGroups.map((group) => (
          <Card key={group.id} className="shadow-card hover:shadow-elevated transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-3">
                    <Building2 className="h-5 w-5 text-primary" />
                    <h4 className="text-xl font-semibold">{group.name}</h4>
                    <Badge variant="secondary">{group.type}</Badge>
                    <Badge 
                      variant={group.phase === 'PORTO' ? 'default' : 'outline'}
                      className="bg-primary/10 text-primary"
                    >
                      {group.phase}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Centro:</span>
                      <span>{group.locationCenterName}</span>
                    </div>
                    <div>
                      <span className="font-medium">Sistema:</span>
                      <span className="ml-2">{group.system}</span>
                    </div>
                    <div>
                      <span className="font-medium">Categoria:</span>
                      <span className="ml-2">{group.category}</span>
                    </div>
                    <div>
                      <span className="font-medium">Ativos:</span>
                      <span className="ml-2">{group.assets.length} ativos</span>
                    </div>
                    <div>
                      <span className="font-medium">Estratégias Ativas:</span>
                      <span className="ml-2">{group.strategies.filter(s => s.isActive).length} estratégias</span>
                    </div>
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    <p><strong>Diretoria:</strong> {group.executiveDirectorate}</p>
                    <p><strong>Gerência:</strong> {group.executiveManagement}</p>
                  </div>
                </div>
                
                <Button 
                  onClick={() => onSelectGroup(group)}
                  variant="industrial"
                  className="ml-4"
                >
                  Ver Estratégias
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {filteredGroups.length === 0 && (
          <Card className="shadow-card">
            <CardContent className="p-8 text-center">
              <div className="text-muted-foreground">
                <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum grupo encontrado com os filtros aplicados.</p>
                <p className="text-sm mt-2">Tente ajustar os critérios de busca.</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default GroupSearch;