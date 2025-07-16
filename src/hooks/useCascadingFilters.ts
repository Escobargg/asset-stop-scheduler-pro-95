import { useState, useMemo, useEffect, useCallback } from 'react';
import { AssetGroup } from '@/types';

type PhaseType = 'PORTO' | 'MINA' | 'USINA' | 'PELOTIZAÇÃO' | 'FERROVIA';

export interface FilterState {
  searchTerm: string;
  selectedCenter: string;
  selectedPhase: string;
  selectedYear: number;
  selectedMonth: string;
  selectedWeek: string;
}

export interface FilterOptions {
  centers: Array<{ code: string; name: string }>;
  phases: PhaseType[];
  years: number[];
  months: Array<{ value: string; label: string }>;
  weeks: Array<{ value: string; label: string }>;
}

export const useCascadingFilters = (allGroups: AssetGroup[] = []) => {
  // Estado dos filtros na ordem correta: busca -> centro -> fase -> ano -> mês -> semana
  const [filterState, setFilterState] = useState<FilterState>({
    searchTerm: '',
    selectedCenter: 'all',
    selectedPhase: 'all',
    selectedYear: 2025,
    selectedMonth: 'all',
    selectedWeek: 'all'
  });

  // Grupos filtrados pela busca por nome
  const groupsFilteredBySearch = useMemo(() => {
    if (!filterState.searchTerm.trim()) return allGroups;
    return allGroups.filter(group => 
      group.name.toLowerCase().includes(filterState.searchTerm.toLowerCase()) ||
      group.locationCenterName.toLowerCase().includes(filterState.searchTerm.toLowerCase())
    );
  }, [allGroups, filterState.searchTerm]);

  // Centros disponíveis após filtro de busca
  const availableCenters = useMemo(() => {
    const centers = Array.from(
      new Set(groupsFilteredBySearch.map(group => group.locationCenterName).filter(Boolean))
    ).map(name => {
      // Extrair código do centro (assumindo formato "1089 - Tubarão")
      const parts = name.split(' - ');
      return {
        code: parts[0] || name,
        name: name
      };
    }).sort((a, b) => a.code.localeCompare(b.code));
    
    return centers;
  }, [groupsFilteredBySearch]);

  // Grupos filtrados por busca e centro
  const groupsFilteredByCenter = useMemo(() => {
    if (filterState.selectedCenter === 'all') return groupsFilteredBySearch;
    return groupsFilteredBySearch.filter(group => 
      group.locationCenterName.includes(filterState.selectedCenter)
    );
  }, [groupsFilteredBySearch, filterState.selectedCenter]);

  // Fases disponíveis após filtro de centro
  const availablePhases = useMemo(() => {
    const phases = Array.from(
      new Set(groupsFilteredByCenter.map(group => group.phase).filter(Boolean))
    ).sort() as PhaseType[];
    
    return phases;
  }, [groupsFilteredByCenter]);

  // Grupos filtrados por busca, centro e fase
  const groupsFilteredByPhase = useMemo(() => {
    if (filterState.selectedPhase === 'all') return groupsFilteredByCenter;
    return groupsFilteredByCenter.filter(group => group.phase === filterState.selectedPhase);
  }, [groupsFilteredByCenter, filterState.selectedPhase]);

  // Anos disponíveis (fixo por enquanto, mas pode ser dinâmico)
  const availableYears = useMemo(() => [2024, 2025, 2026], []);

  // Meses disponíveis (sempre todos por enquanto)
  const availableMonths = useMemo(() => [
    { value: 'all', label: 'Todos os meses' },
    { value: '1', label: 'Janeiro' },
    { value: '2', label: 'Fevereiro' },
    { value: '3', label: 'Março' },
    { value: '4', label: 'Abril' },
    { value: '5', label: 'Maio' },
    { value: '6', label: 'Junho' },
    { value: '7', label: 'Julho' },
    { value: '8', label: 'Agosto' },
    { value: '9', label: 'Setembro' },
    { value: '10', label: 'Outubro' },
    { value: '11', label: 'Novembro' },
    { value: '12', label: 'Dezembro' }
  ], []);

  // Semanas disponíveis (sempre todas por enquanto)
  const availableWeeks = useMemo(() => {
    const weeks = [{ value: 'all', label: 'Todas as semanas' }];
    for (let i = 1; i <= 52; i++) {
      weeks.push({ value: i.toString(), label: `Semana ${i}` });
    }
    return weeks;
  }, []);

  // Resultado final filtrado
  const filteredGroups = useMemo(() => {
    return groupsFilteredByPhase; // Por enquanto só até fase, pode ser expandido para incluir filtros temporais
  }, [groupsFilteredByPhase]);

  // Funções para atualizar filtros - sem dependências circulares
  const updateSearchTerm = useCallback((searchTerm: string) => {
    setFilterState(prev => ({
      ...prev,
      searchTerm
    }));
  }, []);

  const updateSelectedCenter = useCallback((selectedCenter: string) => {
    setFilterState(prev => ({
      ...prev,
      selectedCenter,
      // Reset fase apenas se ela não existir no novo centro
      selectedPhase: selectedCenter === 'all' ? prev.selectedPhase : 'all'
    }));
  }, []);

  const updateSelectedPhase = useCallback((selectedPhase: string) => {
    setFilterState(prev => ({ ...prev, selectedPhase }));
  }, []);

  const updateSelectedYear = useCallback((selectedYear: number) => {
    setFilterState(prev => ({ ...prev, selectedYear }));
  }, []);

  const updateSelectedMonth = useCallback((selectedMonth: string) => {
    setFilterState(prev => ({ ...prev, selectedMonth }));
  }, []);

  const updateSelectedWeek = useCallback((selectedWeek: string) => {
    setFilterState(prev => ({ ...prev, selectedWeek }));
  }, []);

  const clearAllFilters = useCallback(() => {
    setFilterState({
      searchTerm: '',
      selectedCenter: 'all',
      selectedPhase: 'all',
      selectedYear: 2025,
      selectedMonth: 'all',
      selectedWeek: 'all'
    });
  }, []);

  // Removendo useEffect que podem causar loops infinitos
  // A validação de filtros agora será feita apenas nas funções de atualização

  return {
    // Estado atual
    filterState,
    
    // Dados filtrados
    filteredGroups,
    
    // Opções disponíveis para cada filtro (em cascata)
    availableCenters,
    availablePhases,
    availableYears,
    availableMonths,
    availableWeeks,
    
    // Funções para atualizar filtros
    updateSearchTerm,
    updateSelectedCenter,
    updateSelectedPhase,
    updateSelectedYear,
    updateSelectedMonth,
    updateSelectedWeek,
    clearAllFilters,
    
    // Estado de filtros ativos
    hasActiveFilters: Boolean(filterState.searchTerm) || 
                     filterState.selectedCenter !== 'all' || 
                     filterState.selectedPhase !== 'all' ||
                     filterState.selectedMonth !== 'all' ||
                     filterState.selectedWeek !== 'all'
  };
};