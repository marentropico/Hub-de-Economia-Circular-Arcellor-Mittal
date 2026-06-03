import React, { useState, useEffect } from "react";
import { Company, User, Transaction, Logistics } from "../types";
import { apiService } from "../services/api";
import {
  FileText,
  Truck,
  Leaf,
  Clock,
  Sparkles,
  MapPin,
  ClipboardList,
  Compass,
  ArrowRight,
  RefreshCw,
  Search,
  CheckCircle2
} from "lucide-react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Alert,
  CircularProgress
} from "@mui/material";

interface OrderHistoryProps {
  user: User;
  company: Company;
  onRefreshCompanyCredits: (co2Credits: number) => void;
}

export default function OrderHistory({ user, company, onRefreshCompanyCredits }: OrderHistoryProps) {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Transaction[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Logistics tracking drawer/modals
  const [selectedTxForLog, setSelectedTxForLog] = useState<Transaction | null>(null);
  const [carrierName, setCarrierName] = useState("");
  const [licensePlate, setLicensePlate] = useState("");
  const [mtrDoc, setMtrDoc] = useState("");
  const [logSubmitting, setLogSubmitting] = useState(false);
  const [logError, setLogError] = useState("");

  // Tracking visualizer modal
  const [activeLogisticsTx, setActiveLogisticsTx] = useState<Transaction | null>(null);
  const [currentLogistics, setCurrentLogistics] = useState<Logistics | null>(null);
  const [loadingLogistics, setLoadingLogistics] = useState(false);

  // Success delivery rewards
  const [rewardCO2Credits, setRewardCO2Credits] = useState<number | null>(null);
  const [showRewardDialog, setShowRewardDialog] = useState(false);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const list = await apiService.getTransactions(company.id);
      setOrders(list);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [company.id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <CircularProgress sx={{ color: "#FF5F00" }} />
        <p className="text-sm font-semibold text-slate-500 font-mono uppercase tracking-wider">
          Carregando Mesa de Negociações...
        </p>
      </div>
    );
  }

  const handleOpenAssignLogistics = (tx: Transaction) => {
    setSelectedTxForLog(tx);
    setCarrierName(company.type === "TRANSPORTADOR" ? company.name : "");
    setLicensePlate("");
    setMtrDoc("");
    setLogError("");
  };

  const handleCloseAssignLogistics = () => {
    setSelectedTxForLog(null);
  };

  const handleSubmitLogistics = async () => {
    if (!selectedTxForLog) return;
    if (!carrierName || !licensePlate) {
      setLogError("Transportadora e Placa do caminhão de carga são obrigatórios.");
      return;
    }

    setLogSubmitting(true);
    setLogError("");
    try {
      await apiService.createLogistics(selectedTxForLog.id, {
        carrierName,
        licensePlate,
        mtrDocNumber: mtrDoc
      });
      handleCloseAssignLogistics();
      loadOrders(); // reload list
    } catch (err: any) {
      setLogError(err.message || "Erro ao vincular dados do frete.");
    } finally {
      setLogSubmitting(false);
    }
  };

  const handleInspectLogistics = async (tx: Transaction) => {
    setActiveLogisticsTx(tx);
    setLoadingLogistics(true);
    try {
      const log = await apiService.getLogistics(tx.id);
      setCurrentLogistics(log);
    } catch (e) {
      setCurrentLogistics(null);
      console.error(e);
    } finally {
      setLoadingLogistics(false);
    }
  };

  const handleCloseInspectLogistics = () => {
    setActiveLogisticsTx(null);
    setCurrentLogistics(null);
  };

  // Deliver/Finish order Flow - triggers CO2 credit reward
  const handleMarkAsDelivered = async (tx: Transaction) => {
    try {
      setLoading(true);
      await apiService.updateTransactionStatus(tx.id, "CONCLUIDO");

      // Calculate matching CO2 savings (0.08 tons per product ton)
      const co2CreditsSaved = Number((tx.quantityTons * 0.08).toFixed(2));
      setRewardCO2Credits(co2CreditsSaved);
      setShowRewardDialog(true);

      // Sincronizar credits locally with navbar display!
      const currentCreditsAccumulated = company.co2_credits + co2CreditsSaved;
      onRefreshCompanyCredits(currentCreditsAccumulated);

      loadOrders();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(
    (ord) =>
      ord.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (ord.productName && ord.productName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (ord.buyerCompanyName && ord.buyerCompanyName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-8 font-sans text-left">
      {/* HEADER BAR */}
      <div className="border-b border-slate-200 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#111827] tracking-tight font-display mb-1">
            Mesa de Pedidos e Negociações
          </h1>
          <p className="text-slate-500 text-sm">
            Central operacional de cotações, faturamentos, monitoramento logístico e entrega de coprodutos siderúrgicos.
          </p>
        </div>
        <button
          onClick={loadOrders}
          className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs py-2.5 px-4 rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors"
        >
          <RefreshCw size={14} /> Atualizar Pedidos
        </button>
      </div>

      {/* SEARCH AND FILTER */}
      <div className="relative max-w-md bg-white border border-slate-200/50 rounded-xl overflow-hidden shadow-xs">
        <Search className="absolute left-3 top-3.5 text-slate-400" size={18} />
        <input
          type="text"
          placeholder="Pesquisar por Código, Produto ou CNPJ..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white text-sm focus:outline-none focus:ring-1 focus:ring-[#FF5F00] text-slate-800 font-medium"
        />
      </div>

      {/* ORDERS LIST COVERS */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white border border-slate-150 p-12 rounded-2xl text-center">
          <ClipboardList size={32} className="text-slate-300 mx-auto mb-3" />
          <p className="text-slate-400 font-mono text-sm">
            Nenhuma ordem ativa ou proposta comercial registrada.
          </p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          {/* Table display desktop */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-900 text-slate-400 font-mono font-bold uppercase tracking-wider border-b border-slate-800">
                  <th className="px-6 py-4">Código e Data</th>
                  <th className="px-6 py-4">Empresa / CNPJ</th>
                  <th className="px-6 py-4">Subproduto Siderúrgico</th>
                  <th className="px-6 py-4">Volume (Tons)</th>
                  <th className="px-6 py-4">Financeiro (R$)</th>
                  <th className="px-6 py-4">Situação</th>
                  <th className="px-6 py-4 text-center">Ações Logísticas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans text-slate-700">
                {filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50/50">
                    {/* ID & Date */}
                    <td className="px-6 py-4">
                      <div className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded w-max">
                        {ord.id}
                      </div>
                      <div className="text-[10px] text-slate-400 font-medium mt-1">
                        {new Date(ord.createdAt).toLocaleDateString("pt-BR")}{" "}
                        {new Date(ord.createdAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </td>

                    {/* Company */}
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-800 leading-tight">
                        {ord.buyerCompanyName}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        CNPJ COMPRADOR ASSOCIADO
                      </div>
                    </td>

                    {/* Product */}
                    <td className="px-6 py-4 font-semibold text-slate-900">
                      {ord.productName}
                    </td>

                    {/* Volume */}
                    <td className="px-6 py-4 font-mono font-bold text-slate-900">
                      {ord.quantityTons} t
                    </td>

                    {/* Total price */}
                    <td className="px-6 py-4 font-mono font-bold text-slate-900">
                      R$ {ord.totalPrice.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </td>

                    {/* Status badge */}
                    <td className="px-6 py-4">
                      <span className={`text-[10px] px-2.5 py-1 rounded-full font-mono font-bold border block w-max ${
                        ord.status === "CONCLUIDO"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                          : ord.status === "CRIADO"
                          ? "bg-blue-50 text-blue-700 border-blue-100"
                          : ord.status === "EM_CARREGAMENTO"
                          ? "bg-amber-50 text-amber-700 border-amber-100"
                          : "bg-slate-100 text-slate-600 border-slate-200"
                      }`}>
                        {ord.status}
                      </span>
                    </td>

                    {/* Actions and Logistics integrations */}
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        {/* CASE: CRIADO - Can assign carrier */}
                        {ord.status === "CRIADO" && (
                          <button
                            onClick={() => handleOpenAssignLogistics(ord)}
                            className="bg-[#111827] text-white hover:bg-slate-800 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer shadow-xs whitespace-nowrap flex items-center gap-1"
                          >
                            <Truck size={14} className="text-[#FF5F00]" /> Escalar Caminhão
                          </button>
                        )}

                        {/* CASE: EM_CARREGAMENTO - In transit, can inspect and complete */}
                        {ord.status === "EM_CARREGAMENTO" && (
                          <div className="flex gap-1.5 items-center">
                            <button
                              onClick={() => handleInspectLogistics(ord)}
                              className="bg-slate-100 border border-slate-200 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer"
                            >
                              Ver Frete
                            </button>
                            <button
                              onClick={() => handleMarkAsDelivered(ord)}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer shadow-xs whitespace-nowrap flex items-center gap-1.5"
                            >
                              Confirmar Entrega
                            </button>
                          </div>
                        )}

                        {/* CASE: CONCLUIDO - Static tracking */}
                        {ord.status === "CONCLUIDO" && (
                          <button
                            onClick={() => handleInspectLogistics(ord)}
                            className="border border-slate-200 hover:border-slate-300 bg-white text-slate-500 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer flex items-center gap-1"
                          >
                            <FileText size={12} className="text-emerald-500" /> Ver MTR Digital
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 🚚 MODAL: DESIGNATE TRUCK AND GET ENVIRONMENTAL PLATES */}
      <Dialog
        open={selectedTxForLog !== null}
        onClose={handleCloseAssignLogistics}
        slotProps={{
          paper: {
            sx: {
              borderRadius: "16px",
              width: "440px",
              p: 1.5,
              fontFamily: "var(--font-sans)",
            }
          }
        }}
      >
        {selectedTxForLog && (
          <div className="text-left font-sans">
            <DialogTitle className="font-display font-extrabold text-slate-900 border-b border-slate-100 pb-2.5 flex items-center gap-2">
              <Truck className="text-[#FF5F00]" size={22} /> Escalar Caminhão de Coleta
            </DialogTitle>
            <DialogContent className="py-4 space-y-4">
              <p className="text-xs text-slate-500 leading-relaxed">
                Insira os dados da transportadora credenciada e placa de carga para emitir automaticamente o bilhete MTR e mudar formalmente o status da ordem para carregado em trânsito.
              </p>

              <div className="space-y-3">
                {/* Carrier name */}
                <div>
                  <label className="block text-[10px] font-bold font-mono text-slate-500 uppercase tracking-widest mb-1">
                    Nome da Transportadora B2B
                  </label>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Ex: SiderTrans Logística"
                    value={carrierName}
                    onChange={(e) => setCarrierName(e.target.value)}
                    disabled={logSubmitting}
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px", fontFamily: "var(--font-sans)" } }}
                  />
                </div>

                {/* License Plate number */}
                <div>
                  <label className="block text-[10px] font-bold font-mono text-slate-500 uppercase tracking-widest mb-1">
                    Placa do Veículo (Carga Tracionada)
                  </label>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="AAA-0000 ou Mercosul"
                    value={licensePlate}
                    onChange={(e) => setLicensePlate(e.target.value.toUpperCase())}
                    disabled={logSubmitting}
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px", fontFamily: "var(--font-sans)" } }}
                  />
                </div>

                {/* MTR number (optional, else mock autogenerates) */}
                <div>
                  <label className="block text-[10px] font-bold font-mono text-slate-500 uppercase tracking-widest mb-1">
                    Código do Manifesto SINIR MTR (Opcional)
                  </label>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Emissão automatizada se deixado vazio"
                    value={mtrDoc}
                    onChange={(e) => setMtrDoc(e.target.value)}
                    disabled={logSubmitting}
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px", fontFamily: "var(--font-sans)" } }}
                  />
                </div>
              </div>

              {logError && <Alert severity="error">{logError}</Alert>}
            </DialogContent>
            <DialogActions className="border-t border-slate-100 pt-2.5">
              <Button
                disabled={logSubmitting}
                onClick={handleSubmitLogistics}
                variant="contained"
                sx={{
                  backgroundColor: "#FF5F00",
                  color: "#fff",
                  fontFamily: "var(--font-sans)",
                  fontWeight: 700,
                  "&:hover": { backgroundColor: "#e05400" }
                }}
              >
                Gerar Manifesto & Despachar
              </Button>
              <Button
                onClick={handleCloseAssignLogistics}
                disabled={logSubmitting}
                sx={{ color: "#64748b", fontFamily: "var(--font-sans)" }}
              >
                Cancelar
              </Button>
            </DialogActions>
          </div>
        )}
      </Dialog>

      {/* 🧭 MODAL: INSPECT LOGISTICAL TRACKING & environmental licensing MTR */}
      <Dialog
        open={activeLogisticsTx !== null}
        onClose={handleCloseInspectLogistics}
        slotProps={{
          paper: {
            sx: {
              borderRadius: "16px",
              width: "480px",
              p: 1.5,
              fontFamily: "var(--font-sans)"
            }
          }
        }}
      >
        {activeLogisticsTx && (
          <div className="text-left font-sans">
            <DialogTitle className="font-display font-extrabold text-slate-900 border-b border-slate-100 pb-2.5 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Compass className="text-[#FF5F00]" size={22} /> Monitoramento de Frete Digital
              </span>
              <span className="font-mono text-xs font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                Ref: {activeLogisticsTx.id}
              </span>
            </DialogTitle>

            <DialogContent className="py-4 space-y-5">
              {loadingLogistics ? (
                <div className="flex flex-col items-center justify-center py-6 gap-2">
                  <CircularProgress size={24} sx={{ color: "#FF5F00" }} />
                  <p className="text-[11px] font-mono text-slate-400">Consultando Banco Host...</p>
                </div>
              ) : currentLogistics ? (
                <div className="space-y-5">
                  {/* Carrier and MTR tags */}
                  <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-white font-sans space-y-2">
                    <div className="text-[10px] font-mono uppercase tracking-widest text-[#FF5F00] font-bold">
                      Licenciamento de Transporte Ambiental
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold text-white block">{currentLogistics.carrierName}</span>
                      <span className="text-xs bg-slate-800 border border-slate-700 text-slate-300 font-mono font-bold px-2 py-0.5 rounded uppercase">
                        Placa: {currentLogistics.licensePlate}
                      </span>
                    </div>

                    <div className="border-t border-slate-800 pt-2 flex justify-between items-center text-[11px] font-mono">
                      <span className="text-slate-400">MTR Federal SINIR</span>
                      <span className="text-[#FF5F00] font-bold">{currentLogistics.mtrDocNumber}</span>
                    </div>
                  </div>

                  {/* Operational flow tracking */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-slate-400 font-mono uppercase tracking-widest">
                      Etapas de Trânsito Logístico
                    </h3>

                    <div className="relative pl-6 space-y-4 font-sans text-xs">
                      {/* Vertical line indicator */}
                      <div className="absolute left-1.5 top-2 bottom-1 w-0.5 bg-slate-200" />

                      {/* STEP 1 */}
                      <div className="relative">
                        <div className={`absolute -left-[22px] top-0.5 w-3.5 h-3.5 rounded-full border border-white flex items-center justify-center ${
                          true ? "bg-[#FF5F00] shadow-sm" : "bg-slate-200"
                        }`} />
                        <div>
                          <h4 className="font-bold text-slate-800 uppercase leading-none">Aguardando Veículo (Homologado)</h4>
                          <p className="text-[10px] text-slate-400 mt-1">Lote pesado pesagem estática de pátio.</p>
                        </div>
                      </div>

                      {/* STEP 2 */}
                      <div className="relative">
                        <div className={`absolute -left-[22px] top-0.5 w-3.5 h-3.5 rounded-full border border-white flex items-center justify-center ${
                          currentLogistics.status === "EM_TRANSITO" || currentLogistics.status === "ENTREGUE"
                            ? "bg-amber-400 shadow-sm"
                            : "bg-slate-200"
                        }`} />
                        <div>
                          <h4 className="font-bold text-slate-800 uppercase leading-none">Carregado em Trânsito Siderúrgico</h4>
                          <p className="text-[10px] text-slate-400 mt-1">Caminhão com manifesto MTR rodando via rastreamento.</p>
                        </div>
                      </div>

                      {/* STEP 3 */}
                      <div className="relative">
                        <div className={`absolute -left-[22px] top-0.5 w-3.5 h-3.5 rounded-full border border-white flex items-center justify-center ${
                          currentLogistics.status === "ENTREGUE"
                            ? "bg-emerald-500 shadow-sm"
                            : "bg-slate-200"
                        }`} />
                        <div>
                          <h4 className="font-bold text-slate-800 uppercase leading-none">Destinação Final Homologada</h4>
                          <p className="text-[10px] text-slate-400 mt-1">Entregue e pesado no pátio moagem do transformador.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-amber-50 text-amber-800 rounded-lg border border-amber-100 text-xs">
                  Sem ordens logísticas vinculadas. Por favor use os botões principais de escalamento.
                </div>
              )}
            </DialogContent>

            <DialogActions className="border-t border-slate-100 pt-2.5">
              <Button onClick={handleCloseInspectLogistics} sx={{ color: "#FF5F00", fontWeight: 700, fontFamily: "var(--font-sans)" }}>
                Fechar Monitoramento
              </Button>
            </DialogActions>
          </div>
        )}
      </Dialog>

      {/* 🏅 DIALOG: CARBON CREDIT AWARD CERTIFICATE DYNAMIC RECOVERY */}
      <Dialog
        open={showRewardDialog}
        onClose={() => setShowRewardDialog(false)}
        slotProps={{
          paper: {
            sx: {
              borderRadius: "20px",
              width: "420px",
              p: 2,
              backgroundImage: "radial-gradient(ellipse at top, #ecfdf5, #ffffff)",
              fontFamily: "var(--font-sans)",
              border: "1px solid #10b98130",
            }
          }
        }}
      >
        <DialogContent className="text-center space-y-4 py-8">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-500 flex items-center justify-center rounded-full mx-auto border border-emerald-100 animate-bounce">
            <CheckCircle2 size={36} />
          </div>

          <div className="space-y-1">
            <span className="text-[9px] uppercase font-mono font-bold tracking-widest text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
              CERTIFICADO DE IMPACTO AMBIENTAL
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900 font-display tracking-tight">
              Pegada Reduzida!
            </h2>
          </div>

          <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
            Parabéns! Pela conclusão da destinação correta deste lote, sua empresa atingiu novas metas anuais agregadas ao protocolo ArcelorMittal de sustentabilidade.
          </p>

          <div className="bg-emerald-950 text-white rounded-xl py-4 px-6 border border-emerald-900 font-sans space-y-1">
            <span className="text-[10px] font-mono text-emerald-400 block tracking-widest">
              BONIFICAÇÃO OBTIDA:
            </span>
            <span className="text-3xl font-mono font-bold block text-white">
              +{rewardCO2Credits?.toFixed(2)} t CO₂
            </span>
            <span className="text-[10px] text-emerald-300 block">
              salvos da atmosfera de forma atestada
            </span>
          </div>
        </DialogContent>
        <DialogActions className="justify-center border-t border-slate-100 pt-2">
          <Button
            onClick={() => setShowRewardDialog(false)}
            variant="contained"
            sx={{
              backgroundColor: "#10b981",
              color: "#fff",
              fontFamily: "var(--font-sans)",
              fontWeight: 700,
              textTransform: "none",
              borderRadius: "8px",
              px: 4,
              "&:hover": { backgroundColor: "#059669" }
            }}
          >
            Receber Créditos Verdes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
