import { format, differenceInDays, startOfMonth, endOfMonth, startOfWeek, endOfWeek } from "date-fns";
import { ptBR } from "date-fns/locale";
import { getAllOccurrences, getPriorityColor } from "@/utils/ganttUtils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useStopsManagement } from "@/hooks/useStopsManagement";
import { useMaintenanceData } from "@/hooks/useMaintenanceData";

interface GanttTimelineBarProps {
  groupId: string;
  yearStart: Date;
  yearEnd: Date;
  currentYear: number;
  selectedWeek?: string;
  selectedMonth?: string;
  pixelPerDay?: number;
}

const GanttTimelineBar = ({ 
  groupId, 
  yearStart, 
  yearEnd, 
  currentYear, 
  selectedWeek,
  selectedMonth,
  pixelPerDay = 4
}: GanttTimelineBarProps) => {
  // TODOS OS HOOKS DEVEM VIR PRIMEIRO
  const { getAllStrategies } = useMaintenanceData();
  const { getStopsByGroup } = useStopsManagement();
  
  // Depois vem a lógica
  const allStrategies = getAllStrategies();
  const occurrences = getAllOccurrences(allStrategies, groupId, currentYear);
  const realMaintenanceStops = getStopsByGroup(groupId);
  
  // Usar os períodos calculados no componente pai (GanttContent)
  const totalDays = differenceInDays(yearEnd, yearStart) + 1;
  const displayStart = yearStart;
  const displayEnd = yearEnd;

  

  return (
    <div>
      {/* Estratégias de Manutenção */}
      <div className="space-y-2">
        <div className="text-xs font-medium text-muted-foreground mb-2">Estratégias de Manutenção:</div>
        <div className="relative h-3 bg-muted/20 rounded border">
          <div className="relative h-full" style={{ minWidth: `${totalDays * pixelPerDay}px` }}>
          {occurrences
            .filter(occurrence => 
              occurrence.startDate >= displayStart && occurrence.startDate <= displayEnd
            )
            .map((occurrence, index) => {
            const startOffset = differenceInDays(occurrence.startDate, displayStart);
            const duration = differenceInDays(occurrence.endDate, occurrence.startDate) || 1;
            
            const leftPercent = (startOffset / totalDays) * 100;
            const widthPercent = (duration / totalDays) * 100;
            
            return (
              <TooltipProvider key={index}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      className={`absolute top-0.5 h-2 ${getPriorityColor(occurrence.strategy.priority)} rounded opacity-80 hover:opacity-100 transition-opacity cursor-pointer`}
                      style={{
                        left: `${leftPercent}%`,
                        width: `${Math.max(widthPercent, 0.5)}%`
                      }}
                    />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <div className="space-y-2">
                      <div className="font-semibold">{occurrence.strategy.name}</div>
                      <div className="text-sm">
                        <div>📅 {format(occurrence.startDate, "dd/MM/yyyy", { locale: ptBR })} a {format(occurrence.endDate, "dd/MM/yyyy", { locale: ptBR })}</div>
                        <div>🔄 Frequência: {occurrence.strategy.frequency.value} {occurrence.strategy.frequency.unit}</div>
                        <div>⚡ Prioridade: {occurrence.strategy.priority}</div>
                      </div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          })}
          </div>
        </div>

        {/* Paradas de Manutenção Criadas */}        
        {realMaintenanceStops.length > 0 && (
          <>
            <div className="text-xs font-medium text-muted-foreground mb-2 mt-4">Paradas Criadas no Sistema:</div>
            <div className="relative h-3 bg-muted/30 rounded border border-dashed">
              <div className="relative h-full" style={{ minWidth: `${totalDays * pixelPerDay}px` }}>
              {realMaintenanceStops
                .filter(stop => 
                  stop.startDate >= displayStart && stop.startDate <= displayEnd
                )
                .map((stop, index) => {
                const startOffset = differenceInDays(stop.startDate, displayStart);
                const duration = differenceInDays(stop.endDate, stop.startDate) || 1;
                
                const leftPercent = (startOffset / totalDays) * 100;
                const widthPercent = (duration / totalDays) * 100;
                
                // Calculate completion based on status and date as requested
                const completion = stop.status === 'completed' ? 100 : stop.status === 'in-progress' ? 50 : 0;
                
                // Cor baseada na conclusão
                const getCompletionColor = (completion: number) => {
                  if (completion >= 80) return "bg-green-600";
                  if (completion >= 50) return "bg-yellow-600";
                  if (completion > 0) return "bg-blue-600";
                  return "bg-gray-600";
                };
                
                return (
                  <TooltipProvider key={index}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                         <div
                           className={`absolute top-0.5 h-2 ${getCompletionColor(completion)} rounded opacity-70 hover:opacity-100 transition-opacity cursor-pointer border border-white`}
                           style={{
                             left: `${leftPercent}%`,
                             width: `${Math.max(widthPercent, 0.5)}%`
                           }}
                         />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <div className="space-y-2">
                          <div className="font-semibold">{stop.title}</div>
                          <div className="text-sm">
                            <div>📅 {format(stop.startDate, "dd/MM/yyyy", { locale: ptBR })} a {format(stop.endDate, "dd/MM/yyyy", { locale: ptBR })}</div>
                            <div>👥 Equipe: {stop.responsibleTeam}</div>
                            <div>⏱️ Duração: {stop.duration}h</div>
                            <div>💯 Conclusão: {completion}%</div>
                            <div>🔧 Status: {stop.status}</div>
                            {stop.description && <div>📝 {stop.description}</div>}
                          </div>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                );
              })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default GanttTimelineBar;