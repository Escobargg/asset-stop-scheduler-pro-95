import { BarChart3 } from "lucide-react";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, CalendarRange } from "lucide-react";

interface GanttHeaderProps {
  currentYear: number;
  rulerMode: 'weeks' | 'months';
  onRulerModeChange: (mode: 'weeks' | 'months') => void;
}

const GanttHeader = ({ currentYear, rulerMode, onRulerModeChange }: GanttHeaderProps) => {
  return (
    <CardHeader>
      <div className="flex items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          Cronograma de Estratégias - {currentYear}
        </CardTitle>
        
        <div className="flex gap-2">
          <Button
            variant={rulerMode === 'weeks' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onRulerModeChange('weeks')}
            className="h-8"
          >
            <CalendarRange className="h-4 w-4 mr-1" />
            Semanas
          </Button>
          <Button
            variant={rulerMode === 'months' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onRulerModeChange('months')}
            className="h-8"
          >
            <Calendar className="h-4 w-4 mr-1" />
            Meses
          </Button>
        </div>
      </div>
    </CardHeader>
  );
};

export default GanttHeader;