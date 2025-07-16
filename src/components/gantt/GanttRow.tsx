import { ChevronDown, ChevronRight, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AssetGroup } from "@/types";
import GanttTimelineBar from "./GanttTimelineBar";
import GanttRuler from "./GanttRuler";
import { getGroupStrategies, getPriorityColor } from "@/utils/ganttUtils";
import { useMaintenanceData } from "@/hooks/useMaintenanceData";
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface GanttRowProps {
  group: AssetGroup;
  isExpanded: boolean;
  onToggle: (groupId: string) => void;
  yearStart: Date;
  yearEnd: Date;
  currentYear: number;
  selectedWeek?: string;
  selectedMonth?: string;
  isDraggable?: boolean;
  showRuler?: boolean;
  rulerMode?: 'weeks' | 'months';
  totalDays?: number;
  pixelPerDay?: number;
}

const GanttRow = ({ 
  group, 
  isExpanded, 
  onToggle, 
  yearStart, 
  yearEnd, 
  currentYear, 
  selectedWeek, 
  selectedMonth,
  isDraggable = false,
  showRuler = false,
  rulerMode = 'weeks',
  totalDays = 0,
  pixelPerDay = 4
}: GanttRowProps) => {
  const { getAllStrategies } = useMaintenanceData();
  const allStrategies = getAllStrategies();
  
  // Always call hooks first
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: group?.id || 'fallback-id',
    disabled: !isDraggable
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const minWidth = Math.max((totalDays * pixelPerDay) + 430, 1200);
  
  // Check validity after all hooks are called
  const isValidGroup = group && group.id;
  const groupStrategies = isValidGroup ? getGroupStrategies(allStrategies, group.id) : [];

  if (!isValidGroup) {
    return (
      <div className="text-red-500 p-4 border rounded">
        Grupo inválido: {group ? 'ID missing' : 'Group is null'}
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative ${isDragging ? 'z-50 opacity-50' : ''}`}
    >
      <div className="border rounded-lg" style={{ minWidth: `${minWidth}px` }}>
        {/* Linha do grupo */}
        <div className="flex items-center p-2 hover:bg-muted/50 transition-colors">
          {/* Drag handle */}
          {isDraggable && (
            <div className="mr-2">
              <div
                {...attributes}
                {...listeners}
                className="cursor-grab active:cursor-grabbing p-1 rounded hover:bg-muted/50 transition-colors"
              >
                <GripVertical className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          )}
          
          <div className="flex items-center gap-3" style={{ width: '340px', minWidth: '340px' }}>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => onToggle(group.id)}
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
            
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium truncate max-w-48" title={group.name}>
                {group.name}
              </span>
              <Badge variant="outline" className="text-xs px-1 py-0 h-5">
                {group.phase}
              </Badge>
              <Badge variant="secondary" className="text-xs px-1 py-0 h-5">
                {groupStrategies.length}
              </Badge>
            </div>
          </div>
          
          <div className="flex-1" style={{ marginLeft: isDraggable ? '22px' : '52px' }}>
            {/* Régua apenas no primeiro grupo */}
            {showRuler && (
              <div className="mb-2">
                <GanttRuler
                  displayStart={yearStart}
                  displayEnd={yearEnd}
                  totalDays={totalDays}
                  rulerMode={rulerMode}
                  currentYear={currentYear}
                  selectedWeek={selectedWeek || "all"}
                  selectedMonth={selectedMonth || "all"}
                  pixelPerDay={pixelPerDay}
                />
              </div>
            )}
            <GanttTimelineBar 
              groupId={group.id} 
              yearStart={yearStart} 
              yearEnd={yearEnd} 
              currentYear={currentYear}
              selectedWeek={selectedWeek}
              selectedMonth={selectedMonth}
              pixelPerDay={pixelPerDay}
            />
          </div>
        </div>

        {/* Lista de ativos (expandido) */}
        {isExpanded && (
          <div className="pl-8 pb-2">
            {group.assets.map((asset) => (
              <div key={asset.id} className="flex items-center p-1 text-sm">
                <div style={{ width: '340px', minWidth: '340px' }}>
                  <span className="text-muted-foreground text-xs truncate" title={asset.name}>
                    {asset.name}
                  </span>
                </div>
              </div>
            ))}
            
            {/* Lista de estratégias do grupo */}
            {groupStrategies.length > 0 && (
              <div className="mt-2 p-2 bg-muted/30 rounded">
                <div className="text-xs font-medium text-muted-foreground mb-2">Estratégias:</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {groupStrategies.map((strategy) => (
                    <div key={strategy.id} className="flex items-center gap-2 text-xs">
                      <div className={`w-3 h-3 rounded ${getPriorityColor(strategy.priority)}`} />
                      <span>{strategy.name}</span>
                      <span className="text-muted-foreground">
                        ({strategy.frequency.value} {strategy.frequency.unit})
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GanttRow;