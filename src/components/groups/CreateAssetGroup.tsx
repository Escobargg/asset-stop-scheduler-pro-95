import { useState } from "react";
import { Building2, MapPin, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { 
  locationCenters, 
  getPhasesByCenter, 
  getAssetsByCenterAndPhase, 
  AssetGroupData,
  Asset,
  assetGroups
} from "@/data/mockData";

interface CreateAssetGroupProps {
  onCancel: () => void;
  onSave?: (group: AssetGroupData) => void;
}

const CreateAssetGroup = ({ onCancel, onSave }: CreateAssetGroupProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    locationCenter: "",
    phase: "",
    type: "",
    system: "",
    category: "",
    description: ""
  });

  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);

  const availablePhases = formData.locationCenter ? getPhasesByCenter(formData.locationCenter) : [];
  const availableAssets = formData.locationCenter && formData.phase ? 
    getAssetsByCenterAndPhase(formData.locationCenter, formData.phase) : [];

  const handleAssetToggle = (assetId: string) => {
    setSelectedAssets(prev => 
      prev.includes(assetId) 
        ? prev.filter(id => id !== assetId)
        : [...prev, assetId]
    );
  };

  const handleCenterChange = (centerCode: string) => {
    setFormData({
      ...formData, 
      locationCenter: centerCode,
      phase: "" // Reset phase when center changes
    });
    setSelectedAssets([]); // Reset selected assets
  };

  const handlePhaseChange = (phaseCode: string) => {
    setFormData({...formData, phase: phaseCode});
    setSelectedAssets([]); // Reset selected assets when phase changes
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.locationCenter || !formData.phase || selectedAssets.length === 0) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios e selecione pelo menos um ativo",
        variant: "destructive"
      });
      return;
    }

    const selectedAssetObjects = selectedAssets
      .map(id => availableAssets.find(asset => asset.id === id))
      .filter(Boolean) as Asset[];

    const newGroup: AssetGroupData = {
      id: `group-${Date.now()}`,
      name: formData.name,
      locationCenter: formData.locationCenter,
      phase: formData.phase,
      type: formData.type,
      system: formData.system,
      category: formData.category,
      description: formData.description,
      assets: selectedAssetObjects,
      createdAt: new Date()
    };

    // Add to mock data (in a real app, this would be a database call)
    assetGroups.push(newGroup);

    if (onSave) {
      onSave(newGroup);
    }

    toast({
      title: "Grupo criado com sucesso!",
      description: `O grupo "${formData.name}" foi criado com ${selectedAssets.length} ativo(s).`
    });

    onCancel();
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            Criar Novo Grupo de Ativos
          </CardTitle>
          <CardDescription>
            Agrupe ativos por centro de localização e fase para facilitar o gerenciamento de estratégias
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Informações Básicas */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Informações Básicas</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nome do Grupo *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Ex: Transportadores Porto Tubarão"
                />
              </div>
              
              <div>
                <Label htmlFor="category">Categoria</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar Categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Crítico">Crítico</SelectItem>
                    <SelectItem value="Importante">Importante</SelectItem>
                    <SelectItem value="Normal">Normal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="center">Centro de Localização *</Label>
                <Select value={formData.locationCenter} onValueChange={handleCenterChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar Centro" />
                  </SelectTrigger>
                  <SelectContent>
                    {locationCenters.map((center) => (
                      <SelectItem key={center.code} value={center.code}>
                        {center.code} - {center.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="phase">Fase *</Label>
                <Select 
                  value={formData.phase} 
                  onValueChange={handlePhaseChange}
                  disabled={!formData.locationCenter}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar Fase" />
                  </SelectTrigger>
                  <SelectContent>
                    {availablePhases.map((phase) => (
                      <SelectItem key={phase.code} value={phase.code}>
                        {phase.code} - {phase.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="type">Tipo de Equipamento</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Transportador">Transportador</SelectItem>
                    <SelectItem value="Moega">Moega</SelectItem>
                    <SelectItem value="Britador">Britador</SelectItem>
                    <SelectItem value="Forno">Forno</SelectItem>
                    <SelectItem value="Bomba">Bomba</SelectItem>
                    <SelectItem value="Motor">Motor</SelectItem>
                    <SelectItem value="Escavadeira">Escavadeira</SelectItem>
                    <SelectItem value="Caminhão">Caminhão</SelectItem>
                    <SelectItem value="Guindaste">Guindaste</SelectItem>
                    <SelectItem value="Conversor">Conversor</SelectItem>
                    <SelectItem value="Laminador">Laminador</SelectItem>
                    <SelectItem value="Outros">Outros</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="system">Sistema</Label>
              <Input
                id="system"
                value={formData.system}
                onChange={(e) => setFormData({...formData, system: e.target.value})}
                placeholder="Ex: Movimentação, Beneficiamento, Siderurgia"
              />
            </div>
            
            <div>
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Descreva o grupo de ativos..."
                rows={3}
              />
            </div>
          </div>

          {/* Seleção de Ativos */}
          {formData.locationCenter && formData.phase && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Selecionar Ativos</h3>
              <p className="text-sm text-muted-foreground">
                Selecione os ativos do centro {formData.locationCenter} - {formData.phase} que farão parte deste grupo:
              </p>
              
              {availableAssets.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto p-4 border rounded-lg">
                  {availableAssets.map((asset) => (
                    <div key={asset.id} className="flex items-center space-x-2 p-2 hover:bg-muted/50 rounded">
                      <Checkbox
                        id={asset.id}
                        checked={selectedAssets.includes(asset.id)}
                        onCheckedChange={() => handleAssetToggle(asset.id)}
                      />
                      <div className="flex-1">
                        <label htmlFor={asset.id} className="cursor-pointer">
                          <p className="font-medium">{asset.tag}</p>
                          <p className="text-sm text-muted-foreground">{asset.name}</p>
                          <p className="text-xs text-muted-foreground">{asset.type}</p>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-4 border rounded-lg">
                  <MapPin className="h-8 w-8 mx-auto mb-2 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground">Nenhum ativo encontrado para este centro e fase.</p>
                </div>
              )}
              
              {selectedAssets.length > 0 && (
                <p className="text-sm text-primary">
                  {selectedAssets.length} ativo(s) selecionado(s)
                </p>
              )}
            </div>
          )}

          {/* Botões */}
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button variant="outline" onClick={onCancel}>
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button onClick={handleSubmit}>
              <Plus className="h-4 w-4 mr-2" />
              Criar Grupo
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateAssetGroup;