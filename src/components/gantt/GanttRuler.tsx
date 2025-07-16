import { format, differenceInDays, eachWeekOfInterval, eachMonthOfInterval, startOfMonth, endOfMonth, startOfWeek, endOfWeek, startOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";

interface GanttRulerProps {
  displayStart: Date;
  displayEnd: Date;
  totalDays: number;
  rulerMode: 'weeks' | 'months';
  currentYear: number;
  selectedWeek: string;
  selectedMonth: string;
  pixelPerDay?: number;
}

const GanttRuler = ({
  displayStart,
  displayEnd,
  totalDays,
  rulerMode,
  currentYear,
  selectedWeek,
  selectedMonth,
  pixelPerDay = 4
}: GanttRulerProps) => {
  const currentDate = new Date();
  const currentWeekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const isCurrentYearDisplayed = currentDate.getFullYear() === currentYear;
  
  const totalWidth = totalDays * pixelPerDay;

  // Função para renderizar quando uma semana específica está selecionada
  const renderSelectedWeek = () => {
    const isCurrentWeek = isCurrentYearDisplayed && 
      startOfWeek(currentDate, { weekStartsOn: 1 }).getTime() === displayStart.getTime();
    
    return (
      <div 
        className={`h-full flex items-center justify-center text-sm font-bold border rounded ${
          isCurrentWeek 
            ? 'bg-yellow-400 text-black' 
            : 'bg-muted/20 text-muted-foreground'
        }`}
        style={{ width: `${totalWidth}px` }}
      >
        Semana {selectedWeek} - {format(displayStart, "dd/MM", { locale: ptBR })} a {format(displayEnd, "dd/MM", { locale: ptBR })}
      </div>
    );
  };

  // Função para renderizar quando um mês específico está selecionado
  const renderSelectedMonth = () => {
    const monthNumber = parseInt(selectedMonth) - 1;
    const isCurrentMonth = isCurrentYearDisplayed && currentDate.getMonth() === monthNumber;
    
    return (
      <div 
        className={`h-full flex items-center justify-center text-sm font-bold border rounded ${
          isCurrentMonth 
            ? 'bg-yellow-400 text-black' 
            : 'bg-muted/20 text-muted-foreground'
        }`}
        style={{ width: `${totalWidth}px` }}
      >
        {format(displayStart, "MMMM yyyy", { locale: ptBR })}
      </div>
    );
  };

  // Função para renderizar semanas
  const renderWeeks = () => {
    const weeks = eachWeekOfInterval({ start: displayStart, end: displayEnd }, { weekStartsOn: 1 });
    
    return weeks.map((week, index) => {
      const weekStart = startOfWeek(week, { weekStartsOn: 1 });
      const weekEnd = endOfWeek(week, { weekStartsOn: 1 });
      
      // Calcular quantos dias desta semana estão no período
      const actualStart = weekStart < displayStart ? displayStart : weekStart;
      const actualEnd = weekEnd > displayEnd ? displayEnd : weekEnd;
      const daysInPeriod = differenceInDays(actualEnd, actualStart) + 1;
      const weekWidth = daysInPeriod * pixelPerDay;
      
      const isCurrentWeek = isCurrentYearDisplayed && 
        startOfDay(currentWeekStart).getTime() === startOfDay(weekStart).getTime();
      
      // Calcular número da semana no ano
      const firstDayOfYear = new Date(currentYear, 0, 1);
      const weekStartOfYear = startOfWeek(firstDayOfYear, { weekStartsOn: 1 });
      const weekNumber = Math.floor(differenceInDays(weekStart, weekStartOfYear) / 7) + 1;
      
      return (
        <div 
          key={index}
          className={`h-full flex items-center justify-center text-xs font-medium border-r border-border/30 ${
            isCurrentWeek 
              ? 'bg-yellow-400 text-black font-bold' 
              : 'text-muted-foreground hover:bg-muted/20'
          }`}
          style={{ width: `${weekWidth}px`, minWidth: `${weekWidth}px` }}
        >
          <div className="text-center">
            <div>S{weekNumber}</div>
            <div className="text-[10px] opacity-70">
              {format(actualStart, "dd/MM", { locale: ptBR })}
            </div>
          </div>
        </div>
      );
    });
  };

  // Função para renderizar meses
  const renderMonths = () => {
    const months = eachMonthOfInterval({ start: displayStart, end: displayEnd });
    
    return months.map((month, index) => {
      const monthStart = startOfMonth(month);
      const monthEnd = endOfMonth(month);
      
      // Calcular quantos dias deste mês estão no período
      const actualStart = monthStart < displayStart ? displayStart : monthStart;
      const actualEnd = monthEnd > displayEnd ? displayEnd : monthEnd;
      const daysInPeriod = differenceInDays(actualEnd, actualStart) + 1;
      const monthWidth = daysInPeriod * pixelPerDay;
      
      const isCurrentMonth = isCurrentYearDisplayed && 
        currentDate.getMonth() === month.getMonth();
      
      return (
        <div 
          key={index}
          className={`h-full flex items-center justify-center text-xs font-medium border-r border-border/30 ${
            isCurrentMonth 
              ? 'bg-yellow-400 text-black font-bold' 
              : 'text-muted-foreground hover:bg-muted/20'
          }`}
          style={{ width: `${monthWidth}px`, minWidth: `${monthWidth}px` }}
        >
          <div className="text-center">
            <div>{format(month, "MMM", { locale: ptBR })}</div>
            <div className="text-[10px] opacity-70">{month.getFullYear()}</div>
          </div>
        </div>
      );
    });
  };

  return (
    <div className="relative h-10 mb-3 bg-muted/10 rounded border overflow-hidden">
      <div 
        className="flex h-full"
        style={{ width: `${totalWidth}px`, minWidth: `${totalWidth}px` }}
      >
        {/* Quando semana específica está selecionada - mostrar centralizado */}
        {selectedWeek !== "all" ? renderSelectedWeek() :
         
         /* Quando mês específico está selecionado - mostrar centralizado ou dividir em semanas */
         selectedMonth !== "all" ? (pixelPerDay >= 8 ? renderWeeks() : renderSelectedMonth()) :
         
         /* Visualização padrão */
         rulerMode === 'weeks' ? renderWeeks() : renderMonths()}
      </div>
    </div>
  );
};

export default GanttRuler;