import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface GanttContainerProps {
  children: ReactNode;
  className?: string;
}

const GanttContainer = ({ children, className }: GanttContainerProps) => {
  return (
    <div className={cn("space-y-6", className)}>
      <Card className="shadow-card">
        <CardContent className="sticky-scroll-container">
          {children}
        </CardContent>
      </Card>
    </div>
  );
};

export default GanttContainer;