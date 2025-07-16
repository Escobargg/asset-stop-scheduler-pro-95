import { useState } from 'react';
import { Cloud, CloudOff, Settings, Database, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { sapBTPService } from '@/services/sapBtpConfig';
import { useMaintenanceData } from '@/hooks/useMaintenanceData';

const SAPBTPStatus = () => {
  const { sapBTPConfigured, generateSAPReport, syncWithSAP, exportToSAP } = useMaintenanceData();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [syncStatus, setSyncStatus] = useState<{ loading: boolean; message?: string }>({ loading: false });

  const handleSyncWithSAP = async () => {
    setSyncStatus({ loading: true });
    try {
      const result = await syncWithSAP();
      setSyncStatus({ 
        loading: false, 
        message: result.success ? 'Sincronização concluída com sucesso!' : result.message 
      });
    } catch (error) {
      setSyncStatus({ 
        loading: false, 
        message: 'Erro na sincronização com SAP BTP' 
      });
    }
  };

  const handleExportToSAP = async (entityType: 'groups' | 'strategies' | 'stops') => {
    try {
      const result = await exportToSAP(entityType);
      setSyncStatus({ 
        loading: false, 
        message: result.success ? `Export de ${entityType} concluído!` : `Erro no export de ${entityType}` 
      });
    } catch (error) {
      setSyncStatus({ 
        loading: false, 
        message: `Erro no export de ${entityType}` 
      });
    }
  };

  const config = sapBTPService.getConfig();
  const report = generateSAPReport();

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-2"
        >
          {sapBTPConfigured ? (
            <Cloud className="h-4 w-4 text-green-600" />
          ) : (
            <CloudOff className="h-4 w-4 text-gray-400" />
          )}
          SAP BTP
          <Badge variant={sapBTPConfigured ? "default" : "secondary"}>
            {sapBTPConfigured ? "Conectado" : "Offline"}
          </Badge>
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            SAP Business Technology Platform - Status e Configuração
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status de Conexão */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {sapBTPConfigured ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-orange-600" />
                )}
                Status da Conexão
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <strong>Status:</strong>
                  <Badge 
                    variant={sapBTPConfigured ? "default" : "secondary"}
                    className="ml-2"
                  >
                    {sapBTPConfigured ? "Configurado" : "Não Configurado"}
                  </Badge>
                </div>
                <div>
                  <strong>Ambiente:</strong> {config.tenantSubdomain || 'Local Development'}
                </div>
                <div>
                  <strong>CF API:</strong> {config.cfApiEndpoint || 'Não configurado'}
                </div>
                <div>
                  <strong>S/4HANA:</strong> {config.s4HanaEndpoint || 'Não configurado'}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Resumo dos Dados */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Resumo dos Dados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary">{report.summary.totalGroups}</div>
                  <div className="text-sm text-muted-foreground">Grupos de Ativos</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">{report.summary.totalStrategies}</div>
                  <div className="text-sm text-muted-foreground">Estratégias</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">{report.summary.totalStops}</div>
                  <div className="text-sm text-muted-foreground">Paradas</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">{report.summary.criticalAssets}</div>
                  <div className="text-sm text-muted-foreground">Ativos Críticos</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ações SAP BTP */}
          {sapBTPConfigured && (
            <Card>
              <CardHeader>
                <CardTitle>Operações SAP BTP</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-2 flex-wrap">
                    <Button 
                      onClick={handleSyncWithSAP}
                      disabled={syncStatus.loading}
                      size="sm"
                    >
                      {syncStatus.loading ? "Sincronizando..." : "Sincronizar com SAP"}
                    </Button>
                    
                    <Button 
                      onClick={() => handleExportToSAP('groups')}
                      variant="outline"
                      size="sm"
                    >
                      Exportar Grupos
                    </Button>
                    
                    <Button 
                      onClick={() => handleExportToSAP('strategies')}
                      variant="outline"
                      size="sm"
                    >
                      Exportar Estratégias
                    </Button>
                    
                    <Button 
                      onClick={() => handleExportToSAP('stops')}
                      variant="outline"
                      size="sm"
                    >
                      Exportar Paradas
                    </Button>
                  </div>

                  {syncStatus.message && (
                    <div className={`p-3 rounded-md text-sm ${
                      syncStatus.message.includes('sucesso') || syncStatus.message.includes('concluído') 
                        ? 'bg-green-100 text-green-800 border border-green-200' 
                        : 'bg-orange-100 text-orange-800 border border-orange-200'
                    }`}>
                      {syncStatus.message}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Configuração para desenvolvimento */}
          {!sapBTPConfigured && (
            <Card>
              <CardHeader>
                <CardTitle>Configuração SAP BTP</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Para conectar ao SAP BTP, configure as seguintes variáveis de ambiente:
                  </p>
                  <ul className="text-sm space-y-1 list-disc list-inside">
                    <li><code>REACT_APP_SAP_CF_API_ENDPOINT</code> - Endpoint da API Cloud Foundry</li>
                    <li><code>REACT_APP_SAP_S4HANA_ENDPOINT</code> - Endpoint do S/4HANA Cloud</li>
                    <li><code>REACT_APP_SAP_CLIENT_ID</code> - Client ID do XSUAA</li>
                    <li><code>REACT_APP_SAP_TENANT_SUBDOMAIN</code> - Subdomínio do tenant</li>
                  </ul>
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                    <p className="text-sm text-blue-800">
                      💡 <strong>Dica:</strong> O sistema funciona normalmente sem SAP BTP. 
                      A integração é opcional e permite sincronização com sistemas SAP existentes.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Performance por Prioridade */}
          <Card>
            <CardHeader>
              <CardTitle>Distribuição por Prioridade</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-red-600">{report.performance.stopsByPriority.critical}</div>
                  <div className="text-sm">Críticas</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-orange-600">{report.performance.stopsByPriority.high}</div>
                  <div className="text-sm">Altas</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-yellow-600">{report.performance.stopsByPriority.medium}</div>
                  <div className="text-sm">Médias</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-green-600">{report.performance.stopsByPriority.low}</div>
                  <div className="text-sm">Baixas</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SAPBTPStatus;