import { Activity, Settings, Wrench, Eye, Zap } from "lucide-react";

const GanttLegend = () => {
  return (
    <div className="mt-6 pt-4 border-t space-y-4">
      {/* Legenda Estratégias */}
      <div>
        <div className="text-sm font-medium mb-2 flex items-center gap-2">
          <Settings className="h-4 w-4" />
          Estratégias de Manutenção (Prioridade):
        </div>
        <div className="flex flex-wrap gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-red-600 border border-red-800" />
            <span>Crítica</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-orange-500" />
            <span>Alta</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-yellow-500" />
            <span>Média</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-green-500" />
            <span>Baixa</span>
          </div>
        </div>
      </div>

      {/* Tipos de Estratégias Comuns */}
      <div>
        <div className="text-sm font-medium mb-2 flex items-center gap-2">
          <Activity className="h-4 w-4" />
          Tipos de Estratégias Disponíveis:
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 text-xs">
          <div className="flex items-center gap-2">
            <Eye className="h-3 w-3 text-blue-500" />
            <span>Inspeção Visual/Termográfica</span>
          </div>
          <div className="flex items-center gap-2">
            <Wrench className="h-3 w-3 text-orange-500" />
            <span>Manutenção Preventiva</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="h-3 w-3 text-yellow-500" />
            <span>Calibração/Ajustes</span>
          </div>
          <div className="flex items-center gap-2">
            <Settings className="h-3 w-3 text-purple-500" />
            <span>Lubrificação/Limpeza</span>
          </div>
          <div className="flex items-center gap-2">
            <Activity className="h-3 w-3 text-green-500" />
            <span>Análise Preditiva</span>
          </div>
          <div className="flex items-center gap-2">
            <Wrench className="h-3 w-3 text-red-500" />
            <span>Troca de Componentes</span>
          </div>
        </div>
      </div>

      {/* Legenda Paradas Criadas */}
      <div>
        <div className="text-sm font-medium mb-2 flex items-center gap-2">
          <Activity className="h-4 w-4" />
          Paradas Criadas no Sistema (Status de Conclusão):
        </div>
        <div className="flex flex-wrap gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-green-600 border border-white" />
            <span>≥80% Concluída</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-yellow-600 border border-white" />
            <span>50-79% Em Andamento</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-blue-600 border border-white" />
            <span>1-49% Iniciada</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-gray-600 border border-white" />
            <span>0% Planejada</span>
          </div>
        </div>
      </div>

      {/* Indicador Semana Atual */}
      <div>
        <div className="text-sm font-medium mb-2">Indicadores de Tempo:</div>
        <div className="flex gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-yellow-400 border border-black" />
            <span>Semana/Mês Atual</span>
          </div>
        </div>
      </div>
      
      {/* Estatísticas */}
      <div>
        <div className="text-sm font-medium mb-2">Resumo do Sistema:</div>
        <div className="text-xs text-muted-foreground">
          • Cada grupo de ativos possui 5-7 estratégias de manutenção diferentes<br/>
          • Estratégias são executadas com frequências variadas (semanal, mensal, semestral)<br/>
          • Paradas são criadas baseadas nas necessidades reais de manutenção<br/>
          • Sistema gera automaticamente 1-2 paradas por mês para cada grupo ativo
        </div>
      </div>
    </div>
  );
};

export default GanttLegend;