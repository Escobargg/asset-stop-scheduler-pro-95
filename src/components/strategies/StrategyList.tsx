import { useState } from "react";
import { 
  Plus, 
  Calendar, 
  Clock, 
  Play, 
  Pause, 
  Edit3, 
  Trash2, 
  AlertTriangle,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { AssetGroup, MaintenanceStrategy } from "@/types";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface StrategyListProps {
  group: AssetGroup;
  onCreateStrategy: () => void;
  onEditStrategy: (strategy: MaintenanceStrategy) => void;
  onCreateGroup?: () => void;
}

const StrategyList = ({ group, onCreateStrategy, onEditStrategy, onCreateGroup }: StrategyListProps) => {
  const [strategies, setStrategies] = useState<MaintenanceStrategy[]>([
    {
      id: "1",
      name: "Manutenção Preventiva Quinzenal",
      groupId: group.id,
      frequency: { value: 2, unit: "weeks" },
      duration: { value: 8, unit: "hours" },
      startDate: new Date("2024-01-15"),
      isActive: true,
      description: "Manutenção preventiva dos transportadores de correia",
      priority: "medium",
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01")
    },
    {
      id: "2", 
      name: "Parada Mensal Programada",
      groupId: group.id,
      frequency: { value: 1, unit: "months" },
      duration: { value: 2, unit: "days" },
      startDate: new Date("2024-02-01"),
      isActive: false,
      description: "Parada completa para manutenção corretiva",
      priority: "high",
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-15")
    }
  ]);

  const toggleStrategy = (strategyId: string) => {
    setStrategies(prev => 
      prev.map(strategy => 
        strategy.id === strategyId 
          ? { ...strategy, isActive: !strategy.isActive }
          : strategy
      )
    );
  };

  const deleteStrategy = (strategyId: string) => {
    setStrategies(prev => prev.filter(strategy => strategy.id !== strategyId));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-destructive text-destructive-foreground';
      case 'high': return 'bg-warning text-warning-foreground';
      case 'medium': return 'bg-primary text-primary-foreground';
      case 'low': return 'bg-success text-success-foreground';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  const formatFrequency = (frequency: MaintenanceStrategy['frequency']) => {
    const unitLabels = {
      days: 'dia(s)',
      weeks: 'semana(s)', 
      months: 'mês(es)',
      years: 'ano(s)'
    };
    return `A cada ${frequency.value} ${unitLabels[frequency.unit]}`;
  };

  const formatDuration = (duration: MaintenanceStrategy['duration']) => {
    const unitLabels = {
      hours: 'hora(s)',
      days: 'dia(s)'
    };
    return `${duration.value} ${unitLabels[duration.unit]}`;
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho do Grupo */}
      <Card className="shadow-card">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">Estratégias - {group.name}</CardTitle>
              <CardDescription className="mt-2">
                {group.locationCenterName} | {group.phase} | {group.assets.length} ativos
              </CardDescription>
            </div>
            <div className="space-x-2">
              <Button onClick={onCreateStrategy} className="shadow-primary">
                <Plus className="h-4 w-4 mr-2" />
                Nova Estratégia
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Lista de Estratégias */}
      <div className="space-y-4">
        {strategies.length === 0 ? (
          <Card className="shadow-card">
            <CardContent className="p-8 text-center">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-semibold mb-2">Nenhuma estratégia cadastrada</h3>
              <p className="text-muted-foreground mb-4">
                Crie a primeira estratégia de manutenção para este grupo de ativos.
              </p>
              <Button onClick={onCreateStrategy} variant="industrial">
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeira Estratégia
              </Button>
            </CardContent>
          </Card>
        ) : (
          strategies.map((strategy) => (
            <Card key={strategy.id} className="shadow-card hover:shadow-elevated transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-4 flex-1">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        {strategy.isActive ? (
                          <CheckCircle2 className="h-5 w-5 text-success" />
                        ) : (
                          <Pause className="h-5 w-5 text-muted-foreground" />
                        )}
                        <h4 className="text-lg font-semibold">{strategy.name}</h4>
                      </div>
                      <Badge className={getPriorityColor(strategy.priority)}>
                        {strategy.priority.toUpperCase()}
                      </Badge>
                      <Badge variant={strategy.isActive ? "default" : "secondary"}>
                        {strategy.isActive ? "ATIVA" : "INATIVA"}
                      </Badge>
                    </div>

                    {strategy.description && (
                      <p className="text-muted-foreground">{strategy.description}</p>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-primary" />
                        <div>
                          <span className="font-medium">Frequência:</span>
                          <p className="text-muted-foreground">{formatFrequency(strategy.frequency)}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-primary" />
                        <div>
                          <span className="font-medium">Duração:</span>
                          <p className="text-muted-foreground">{formatDuration(strategy.duration)}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Play className="h-4 w-4 text-primary" />
                        <div>
                          <span className="font-medium">Início:</span>
                          <p className="text-muted-foreground">
                            {format(strategy.startDate, "dd/MM/yyyy", { locale: ptBR })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={strategy.isActive}
                        onCheckedChange={() => toggleStrategy(strategy.id)}
                      />
                      <span className="text-sm font-medium">
                        {strategy.isActive ? "Ativa" : "Inativa"}
                      </span>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => onEditStrategy(strategy)}
                    >
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => deleteStrategy(strategy.id)}
                      className="hover:bg-destructive hover:text-destructive-foreground"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Informações dos Ativos do Grupo */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-lg">Ativos do Grupo</CardTitle>
          <CardDescription>
            Estratégias aplicam-se automaticamente a todos os ativos deste grupo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {group.assets.map((asset) => (
              <div key={asset.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium">{asset.tag}</p>
                  <p className="text-sm text-muted-foreground">{asset.name}</p>
                </div>
                <Badge variant="outline">{asset.type}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StrategyList;