import { useState, useCallback, memo, lazy, Suspense } from "react";
import { MaintenanceStrategy, AssetGroup } from "@/types";
import Header from "@/components/layout/Header";
import GroupSearch from "@/components/search/GroupSearch";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

// Lazy loading dos componentes para melhor performance
const StrategyList = lazy(() => import("@/components/strategies/StrategyList"));
const StrategyForm = lazy(() => import("@/components/strategies/StrategyForm"));
const GanttChart = lazy(() => import("@/components/gantt/GanttChart"));
const StopsManagement = lazy(() => import("@/components/stops/StopsManagement"));
const CreateAssetGroup = lazy(() => import("@/components/groups/CreateAssetGroup"));

type AppState = "search" | "strategies" | "form" | "gantt" | "stops" | "createGroup";

const Index = memo(() => {
  const [currentState, setCurrentState] = useState<AppState>("search");
  const [selectedGroup, setSelectedGroup] = useState<AssetGroup | null>(null);
  const [editingStrategy, setEditingStrategy] = useState<MaintenanceStrategy | null>(null);
  const [allGroups, setAllGroups] = useState<AssetGroup[]>([]);

  const handleSelectGroup = useCallback((group: AssetGroup) => {
    setSelectedGroup(group);
    setCurrentState("strategies");
  }, []);

  const handleCreateStrategy = useCallback(() => {
    setEditingStrategy(null);
    setCurrentState("form");
  }, []);

  const handleEditStrategy = useCallback((strategy: MaintenanceStrategy) => {
    setEditingStrategy(strategy);
    setCurrentState("form");
  }, []);

  const handleSaveStrategy = useCallback((strategyData: Omit<MaintenanceStrategy, "id" | "createdAt" | "updatedAt">) => {
    // TODO: Implementar salvamento da estratégia
    console.log("Saving strategy:", strategyData);
    setCurrentState("strategies");
    setEditingStrategy(null);
  }, []);

  const handleCancel = useCallback(() => {
    if (currentState === "form") {
      setCurrentState("strategies");
    } else if (currentState === "createGroup") {
      setCurrentState("search");
    } else {
      setCurrentState("search");
    }
    setEditingStrategy(null);
  }, [currentState]);

  const handleCreateGroup = useCallback(() => {
    setCurrentState("createGroup");
  }, []);

  const handleBackToSearch = useCallback(() => {
    setCurrentState("search");
    setSelectedGroup(null);
    setEditingStrategy(null);
  }, []);

  const handleViewGantt = useCallback((groups: AssetGroup[]) => {
    setAllGroups(groups);
    setCurrentState("gantt");
  }, []);

  const handleViewChange = useCallback((view: string) => {
    if (view === "search") {
      setCurrentState("search");
    } else if (view === "gantt") {
      setCurrentState("gantt");
    } else if (view === "stops") {
      setCurrentState("stops");
    } else if (view === "createGroup") {
      setCurrentState("createGroup");
    }
  }, []);

  const getMainView = () => {
    if (currentState === "strategies" || currentState === "form") {
      return "search";
    }
    return currentState;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        currentView={getMainView()} 
        onViewChange={handleViewChange}
      />
      
      <main className="container mx-auto px-6 py-8">
        {/* Navegação */}
        {currentState !== "search" && (
          <div className="mb-6">
            <button
              onClick={handleBackToSearch}
              className="text-primary hover:text-primary-hover font-medium"
            >
              ← Voltar para busca de grupos
            </button>
          </div>
        )}

        {/* Conteúdo Principal */}
        {currentState === "search" && (
          <GroupSearch 
            onSelectGroup={handleSelectGroup}
            onViewGantt={handleViewGantt}
          />
        )}

      {currentState === "strategies" && selectedGroup && (
        <Suspense fallback={<LoadingSpinner text="Carregando estratégias..." className="h-32" />}>
          <StrategyList
            group={selectedGroup}
            onCreateStrategy={handleCreateStrategy}
            onEditStrategy={handleEditStrategy}
            onCreateGroup={handleCreateGroup}
          />
        </Suspense>
      )}

        {currentState === "form" && selectedGroup && (
          <Suspense fallback={<LoadingSpinner text="Carregando formulário..." className="h-32" />}>
            <StrategyForm
              group={selectedGroup}
              strategy={editingStrategy}
              onSave={handleSaveStrategy}
              onCancel={handleCancel}
            />
          </Suspense>
        )}

        {currentState === "gantt" && (
          <Suspense fallback={<LoadingSpinner text="Carregando Gantt..." className="h-32" />}>
            <GanttChart />
          </Suspense>
        )}

        {currentState === "stops" && (
          <Suspense fallback={<LoadingSpinner text="Carregando paradas..." className="h-32" />}>
            <StopsManagement />
          </Suspense>
        )}

        {currentState === "createGroup" && (
          <Suspense fallback={<LoadingSpinner text="Carregando formulário..." className="h-32" />}>
            <CreateAssetGroup onCancel={handleCancel} />
          </Suspense>
        )}
      </main>
    </div>
  );
});

export default Index;
