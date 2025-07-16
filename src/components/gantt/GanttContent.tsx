import { AssetGroup } from "@/types";
import GanttRow from "./GanttRow";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useMemo } from "react";
import { differenceInDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns";

interface GanttContentProps {
  groups: AssetGroup[];
  expandedGroups: Set<string>;
  onToggleGroup: (groupId: string) => void;
  yearStart: Date;
  yearEnd: Date;
  currentYear: number;
  rulerMode: 'weeks' | 'months';
  selectedWeek: string;
  selectedMonth: string;
  onGroupsReorder: (groups: AssetGroup[]) => void;
}

const GanttContent = ({
  groups,
  expandedGroups,
  onToggleGroup,
  yearStart,
  yearEnd,
  currentYear,
  rulerMode,
  selectedWeek,
  selectedMonth,
  onGroupsReorder
}: GanttContentProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Calcular período de exibição baseado nos filtros
  const { displayStart, displayEnd, totalDays } = useMemo(() => {
    let start = yearStart;
    let end = yearEnd;
    let days = differenceInDays(end, start) + 1;
    
    if (selectedWeek && selectedWeek !== "all") {
      const weekNumber = parseInt(selectedWeek);
      const weekStart = startOfWeek(new Date(currentYear, 0, 1 + (weekNumber - 1) * 7), { weekStartsOn: 1 });
      const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
      start = weekStart;
      end = weekEnd;
      days = 7;
    } else if (selectedMonth && selectedMonth !== "all") {
      const monthNumber = parseInt(selectedMonth) - 1;
      start = startOfMonth(new Date(currentYear, monthNumber, 1));
      end = endOfMonth(new Date(currentYear, monthNumber, 1));
      days = differenceInDays(end, start) + 1;
    }
    
    return { displayStart: start, displayEnd: end, totalDays: days };
  }, [yearStart, yearEnd, currentYear, selectedWeek, selectedMonth]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = groups.findIndex(item => item.id === active.id);
      const newIndex = groups.findIndex(item => item.id === over.id);
      const reorderedGroups = arrayMove(groups, oldIndex, newIndex);
      onGroupsReorder(reorderedGroups);
    }
  };

  const pixelPerDay = selectedWeek !== "all" || selectedMonth !== "all" ? 20 : 4;
  const minWidth = Math.max((totalDays * pixelPerDay) + 430, 1200);
  const displayedGroups = groups.slice(0, 50); // Limitar a 50 grupos para performance

  return (
    <div className="relative">
      {/* Container das linhas do Gantt */}
      <div 
        className="gantt-timeline-container" 
        style={{ minWidth: `${minWidth}px` }}
      >

      {/* Lista de grupos com drag and drop */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={displayedGroups.map(g => g.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {displayedGroups.map((group, index) => (
              <GanttRow
                key={group.id}
                group={group}
                isExpanded={expandedGroups.has(group.id)}
                onToggle={onToggleGroup}
                yearStart={displayStart}
                yearEnd={displayEnd}
                currentYear={currentYear}
                selectedWeek={selectedWeek}
                selectedMonth={selectedMonth}
                isDraggable={true}
                showRuler={index === 0}
                rulerMode={rulerMode}
                totalDays={totalDays}
                pixelPerDay={pixelPerDay}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

        {/* Indicador de grupos limitados */}
        {groups.length > 50 && (
          <div className="text-center py-4 text-muted-foreground">
            Mostrando os primeiros 50 grupos de {groups.length}. Use os filtros para refinar os resultados.
          </div>
        )}
      </div>
    </div>
  );
};

export default GanttContent;