import { useState } from "react";
import { CalendarIcon, Clock, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { MaintenanceStrategy, AssetGroup } from "@/types";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface StrategyFormProps {
  group: AssetGroup;
  strategy?: MaintenanceStrategy;
  onSave: (strategy: Omit<MaintenanceStrategy, "id" | "createdAt" | "updatedAt">) => void;
  onCancel: () => void;
}

const StrategyForm = ({ group, strategy, onSave, onCancel }: StrategyFormProps) => {
  const [formData, setFormData] = useState({
    name: strategy?.name || "",
    description: strategy?.description || "",
    frequencyValue: strategy?.frequency.value || 1,
    frequencyUnit: strategy?.frequency.unit || "weeks",
    durationValue: strategy?.duration.value || 3,
    durationUnit: strategy?.duration.unit || "days",
    startDate: strategy?.startDate || new Date(),
    endDate: strategy?.endDate || undefined,
    priority: strategy?.priority || "medium",
    isActive: strategy?.isActive ?? true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const strategyData: Omit<MaintenanceStrategy, "id" | "createdAt" | "updatedAt"> = {
      name: formData.name,
      groupId: group.id,
      frequency: {
        value: formData.frequencyValue,
        unit: formData.frequencyUnit as any
      },
      duration: {
        value: formData.durationValue,
        unit: formData.durationUnit as any
      },
      startDate: formData.startDate,
      endDate: formData.endDate,
      isActive: formData.isActive,
      description: formData.description,
      priority: formData.priority as any
    };

    onSave(strategyData);
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-xl">
            {strategy ? "Editar Estratégia" : "Nova Estratégia"}
          </CardTitle>
          <CardDescription>
            Grupo: {group.name} | {group.locationCenterName} | {group.phase}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Informações Básicas */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Informações Básicas</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome da Estratégia *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Ex: Manutenção Preventiva Quinzenal"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="priority">Prioridade</Label>
                  <Select 
                    value={formData.priority} 
                    onValueChange={(value: "low" | "medium" | "high" | "critical") => setFormData(prev => ({ ...prev, priority: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Baixa</SelectItem>
                      <SelectItem value="medium">Média</SelectItem>
                      <SelectItem value="high">Alta</SelectItem>
                      <SelectItem value="critical">Crítica</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Descreva os detalhes da estratégia de manutenção..."
                  rows={3}
                />
              </div>
            </div>

            {/* Configuração de Frequência */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-primary" />
                Frequência da Parada
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>A cada quantos</Label>
                  <Input
                    type="number"
                    min="1"
                    value={formData.frequencyValue}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      frequencyValue: parseInt(e.target.value) || 1 
                    }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Unidade de tempo</Label>
                  <Select 
                    value={formData.frequencyUnit} 
                    onValueChange={(value: "days" | "weeks" | "months" | "years") => setFormData(prev => ({ ...prev, frequencyUnit: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="days">Dias</SelectItem>
                      <SelectItem value="weeks">Semanas</SelectItem>
                      <SelectItem value="months">Meses</SelectItem>
                      <SelectItem value="years">Anos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Duração da Parada */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Duração da Parada
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Duração</Label>
                  <Input
                    type="number"
                    min="1"
                    max="7"
                    value={formData.durationValue}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      durationValue: Math.min(7, Math.max(1, parseInt(e.target.value) || 1))
                    }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Unidade</Label>
                  <Select 
                    value={formData.durationUnit} 
                    onValueChange={(value: "hours" | "days") => setFormData(prev => ({ ...prev, durationUnit: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="days">Dias</SelectItem>
                      <SelectItem value="hours">Horas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Datas */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Período de Vigência</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Data de Início *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.startDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.startDate ? (
                          format(formData.startDate, "dd/MM/yyyy", { locale: ptBR })
                        ) : (
                          <span>Selecione uma data</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.startDate}
                        onSelect={(date) => date && setFormData(prev => ({ ...prev, startDate: date }))}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="space-y-2">
                  <Label>Data de Fim (Opcional)</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.endDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.endDate ? (
                          format(formData.endDate, "dd/MM/yyyy", { locale: ptBR })
                        ) : (
                          <span>Indefinida</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.endDate}
                        onSelect={(date) => setFormData(prev => ({ ...prev, endDate: date }))}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="flex items-center space-x-2">
              <Switch
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
              />
              <Label>Estratégia ativa</Label>
            </div>

            {/* Botões */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onCancel}
              >
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
              <Button type="submit">
                <Save className="h-4 w-4 mr-2" />
                {strategy ? "Atualizar" : "Criar"} Estratégia
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default StrategyForm;