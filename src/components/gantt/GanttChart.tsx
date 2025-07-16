import { useState, useMemo, useEffect, useCallback, memo } from "react";
import { AssetGroup } from "@/types";
import { startOfYear, endOfYear } from "date-fns";
import { useMaintenanceData } from "@/hooks/useMaintenanceData";
import { useCascadingFilters } from "@/hooks/useCascadingFilters";
import GanttContainer from "./GanttContainer";
import GanttHeader from "./GanttHeader";
import GanttFilterPanel from "./GanttFilterPanel";
import GanttContent from "./GanttContent";
import GanttLegend from "./GanttLegend";

interface GanttProps {
  groups?: AssetGroup[];
}

const GanttChart = memo(({ groups: propGroups }: GanttProps) => {
  const { getAllGroups } = useMaintenanceData();
  
  // Estados de controle
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [rulerMode, setRulerMode] = useState<'weeks' | 'months'>('weeks');
  const [orderedGroups, setOrderedGroups] = useState<AssetGroup[]>([]);

  // Dados dos grupos
  const allGroups = useMemo(() => {
    try {
      return propGroups || getAllGroups() || [];
    } catch (error) {
      console.error('Error fetching groups:', error);
      return [];
    }
  }, [propGroups, getAllGroups]);

  // Usar filtros em cascata
  const {
    filterState,
    filteredGroups,
    availableCenters,
    availablePhases,
    availableYears,
    availableMonths,
    availableWeeks,
    updateSearchTerm,
    updateSelectedCenter,
    updateSelectedPhase,
    updateSelectedYear,
    updateSelectedMonth,
    updateSelectedWeek,
    clearAllFilters,
    hasActiveFilters
  } = useCascadingFilters(allGroups);

  // Atualizar grupos ordenados quando filtros mudam
  useEffect(() => {
    setOrderedGroups(filteredGroups);
  }, [filteredGroups]);

  // Datas do ano
  const yearStart = useMemo(() => startOfYear(new Date(filterState.selectedYear, 0, 1)), [filterState.selectedYear]);
  const yearEnd = useMemo(() => endOfYear(new Date(filterState.selectedYear, 0, 1)), [filterState.selectedYear]);

  // Handlers
  const toggleGroup = useCallback((groupId: string) => {
    setExpandedGroups(prev => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(groupId)) {
        newExpanded.delete(groupId);
      } else {
        newExpanded.add(groupId);
      }
      return newExpanded;
    });
  }, []);

  const handleGroupsReorder = useCallback((reorderedGroups: AssetGroup[]) => {
    setOrderedGroups(reorderedGroups);
  }, []);


  return (
    <div className="space-y-6">
      {/* Painel de filtros */}
      <GanttFilterPanel
        searchTerm={filterState.searchTerm}
        onSearchChange={updateSearchTerm}
        availableCenters={availableCenters}
        selectedLocation={filterState.selectedCenter}
        onLocationChange={updateSelectedCenter}
        availablePhases={availablePhases}
        selectedPhase={filterState.selectedPhase}
        onPhaseChange={updateSelectedPhase}
        availableYears={availableYears}
        selectedYear={filterState.selectedYear}
        onYearChange={updateSelectedYear}
        availableMonths={availableMonths}
        selectedMonth={filterState.selectedMonth}
        onMonthChange={updateSelectedMonth}
        availableWeeks={availableWeeks}
        selectedWeek={filterState.selectedWeek}
        onWeekChange={updateSelectedWeek}
        hasActiveFilters={hasActiveFilters}
        onClearFilters={clearAllFilters}
      />

      {/* Container principal */}
      <GanttContainer>
        <GanttHeader 
          currentYear={filterState.selectedYear}
          rulerMode={rulerMode}
          onRulerModeChange={setRulerMode}
        />
        
        <GanttContent
          groups={orderedGroups}
          expandedGroups={expandedGroups}
          onToggleGroup={toggleGroup}
          yearStart={yearStart}
          yearEnd={yearEnd}
          currentYear={filterState.selectedYear}
          rulerMode={rulerMode}
          selectedWeek={filterState.selectedWeek}
          selectedMonth={filterState.selectedMonth}
          onGroupsReorder={handleGroupsReorder}
        />

        <GanttLegend />
      </GanttContainer>
    </div>
  );
});

GanttChart.displayName = 'GanttChart';

export default GanttChart;