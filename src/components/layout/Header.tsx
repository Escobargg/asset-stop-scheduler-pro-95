import { Building2, Settings, Calendar, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import SAPBTPStatus from "@/components/sap/SAPBTPStatus";

interface HeaderProps {
  currentView?: string;
  onViewChange?: (view: string) => void;
}

const Header = ({ currentView, onViewChange }: HeaderProps) => {
  return (
    <header className="bg-gradient-primary shadow-card border-b border-border/50 sticky top-0 z-50">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
            <Building2 className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-primary-foreground">
              PCM Manutenção
            </h1>
            <p className="text-sm text-primary-foreground/70">
              Sistema de Gestão de Estratégias de Manutenção
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {onViewChange && (
            <div className="flex items-center space-x-2">
              <Button 
                variant={currentView === "createGroup" ? "secondary" : "ghost"} 
                size="sm" 
                className="text-primary-foreground hover:bg-white/10"
                onClick={() => onViewChange("createGroup")}
              >
                <Building2 className="h-4 w-4 mr-2" />
                Criar Grupo de Ativos
              </Button>
              <Button 
                variant={currentView === "search" ? "secondary" : "ghost"} 
                size="sm" 
                className="text-primary-foreground hover:bg-white/10"
                onClick={() => onViewChange("search")}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Estratégias
              </Button>
              <Button 
                variant={currentView === "stops" ? "secondary" : "ghost"} 
                size="sm" 
                className="text-primary-foreground hover:bg-white/10"
                onClick={() => onViewChange("stops")}
              >
                <Settings className="h-4 w-4 mr-2" />
                Cadastro de Paradas
              </Button>
              <Button 
                variant={currentView === "gantt" ? "secondary" : "ghost"} 
                size="sm" 
                className="text-primary-foreground hover:bg-white/10"
                onClick={() => onViewChange("gantt")}
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Cronograma
              </Button>
            </div>
          )}
          
          <SAPBTPStatus />
          
          <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-white/10">
            <Settings className="h-4 w-4 mr-2" />
            Configurações
          </Button>
          
          <div className="text-right">
            <p className="text-sm font-medium text-primary-foreground">
              Vale S.A.
            </p>
            <p className="text-xs text-primary-foreground/70">
              Sistema Corporativo
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;