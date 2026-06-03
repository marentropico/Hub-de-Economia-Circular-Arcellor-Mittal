import { useState, useEffect } from "react";
import { Company, User, Product, Transaction } from "../types";
import { apiService } from "../services/api";
import {
  ShieldCheck,
  PlusCircle,
  Warehouse,
  Flame,
  Check,
  AlertCircle,
  Coins,
  MapPin,
  ClipboardCheck,
  Scale,
  RefreshCw,
  Boxes
} from "lucide-react";
import {
  TextField,
  Button,
  FormControl,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Card,
  Tab,
  Tabs,
  Box
} from "@mui/material";

interface AdminPanelProps {
  user: User;
  company: Company;
}

export default function AdminPanel({ user, company }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  
  const [products, setProducts] = useState<Product[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Add Product form states
  const [prodName, setProdName] = useState("");
  const [prodCategory, setProdCategory] = useState("ESCORIA");
  const [prodDesc, setProdDesc] = useState("");
  const [prodPrice, setProdPrice] = useState("");
  const [prodStock, setProdStock] = useState("");
  const [prodLocation, setProdLocation] = useState("Planta de Tubarão, ES");
  
  // Custom Chemical compound states (CaO, SiO2, etc)
  const [chemCaO, setChemCaO] = useState("");
  const [chemSiO2, setChemSiO2] = useState("");
  const [chemFe2O3, setChemFe2O3] = useState("");
  const [chemAl2O3, setChemAl2O3] = useState("");

  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  // Replenish stock state
  const [replenishProductId, setReplenishProductId] = useState("");
  const [replenishTons, setReplenishTons] = useState("");
  const [replenishLoading, setReplenishLoading] = useState(false);

  const loadAdminMetrics = async () => {
    setLoading(true);
    try {
      const pList = await apiService.getProducts();
      setProducts(pList);
      
      const tList = await apiService.getTransactions(company.id);
      setTransactions(tList);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminMetrics();
  }, []);

  if (user.role !== "ADMIN_ARCELOR") {
    return (
      <div className="bg-rose-50 border border-rose-200 text-rose-800 p-8 rounded-2xl max-w-xl mx-auto space-y-3 mt-10">
        <AlertCircle size={32} className="text-rose-500 animate-pulse" />
        <h2 className="text-lg font-bold font-display">Acesso Restrito Siderúrgico</h2>
        <p className="text-xs leading-relaxed">
          Sua conta atual ({user.name}) não possui privilégios de controle de pátios ou parametrização química de materiais ArcelorMittal. Por favor entre com credenciais administrativas homologadas.
        </p>
      </div>
    );
  }

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName || !prodDesc || !prodPrice || !prodStock || !prodLocation) {
      setFormError("Por favor preencha todos os campos comerciais e de estoque.");
      return;
    }

    setFormLoading(true);
    setFormError("");
    setFormSuccess("");

    try {
      const chemicalSpec: Record<string, number> = {};
      if (chemCaO) chemicalSpec["CaO (Óxido de Cálcio)"] = Number(chemCaO);
      if (chemSiO2) chemicalSpec["SiO2 (Dióxido de Silício)"] = Number(chemSiO2);
      if (chemFe2O3) chemicalSpec["Fe2O3 (Óxido de Ferro)"] = Number(chemFe2O3);
      if (chemAl2O3) chemicalSpec["Al2O3 (Óxido de Alumínio)"] = Number(chemAl2O3);

      await apiService.createProduct({
        name: prodName,
        category: prodCategory as any,
        description: prodDesc,
        pricePerTon: Number(prodPrice),
        stockTons: Number(prodStock),
        unitLocation: prodLocation,
        chemicalSpec,
      });

      setFormSuccess("Lote e análise química gravados e distribuídos com sucesso!");
      
      // Reset variables
      setProdName("");
      setProdDesc("");
      setProdPrice("");
      setProdStock("");
      setChemCaO("");
      setChemSiO2("");
      setChemFe2O3("");
      setChemAl2O3("");

      // Reload list
      loadAdminMetrics();
    } catch (err: any) {
      setFormError(err.message || "Erro de validação operacional no formulário.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleReplenishStock = async (pId: string) => {
    const tons = Number(replenishTons);
    if (!pId || tons <= 0) return;

    setReplenishLoading(true);
    try {
      const product = products.find((p) => p.id === pId);
      if (product) {
        const targetTons = product.stockTons + tons;
        await apiService.updateStock(pId, targetTons);
        setReplenishTons("");
        setReplenishProductId("");
        loadAdminMetrics();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setReplenishLoading(false);
    }
  };

  const handleApproveTransaction = async (txId: string) => {
    try {
      setLoading(true);
      await apiService.updateTransactionStatus(txId, "EM_CARREGAMENTO");
      loadAdminMetrics();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <CircularProgress sx={{ color: "#FF5F00" }} />
        <p className="text-sm font-semibold text-slate-500 font-mono uppercase tracking-wider">
          Sincronizando Plataforma do Administrador...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans text-left">
      {/* HEADER SECTION */}
      <div className="border-b border-slate-200 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#111827] tracking-tight font-display mb-1 flex items-center gap-2">
            <ShieldCheck size={28} className="text-[#FF5F00]" /> Painel Siderúrgico Administrativo
          </h1>
          <p className="text-slate-500 text-sm">
            Estação corporativa de governança. Cadastre lotes de resíduos siderúrgicos e autorize o despacho de contratos comerciais.
          </p>
        </div>
        <button
          onClick={loadAdminMetrics}
          className="bg-slate-250 text-slate-700 font-bold text-xs py-2 px-3.5 rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors"
        >
          <RefreshCw size={14} /> Atualizar Painel
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: ACTIVE PRODUCTS LIST & REPLENISHMENT */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-xs space-y-4">
            <h2 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2 border-b border-slate-100 pb-2">
              <Warehouse size={18} className="text-slate-500" /> Volumes em Pátio
            </h2>

            <div className="space-y-3.5 max-h-[460px] overflow-y-auto">
              {products.map((p) => {
                const isReplenishing = replenishProductId === p.id;
                return (
                  <div key={p.id} className="p-3 border border-slate-100/80 rounded-xl bg-slate-50/50 space-y-2">
                    <div className="flex justify-between items-start gap-1">
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 leading-tight">{p.name}</h4>
                        <span className="text-[9px] text-slate-400 font-mono block mt-0.5 uppercase tracking-wide">
                          R$ {p.pricePerTon.toFixed(2)}/t &bull; {p.unitLocation.split(",")[0]}
                        </span>
                      </div>
                      <span className="text-xs font-mono font-bold text-[#FF5F00]">{p.stockTons} t</span>
                    </div>

                    {isReplenishing ? (
                      <div className="flex gap-2 items-center pt-1 border-t border-slate-100">
                        <input
                          type="number"
                          placeholder="Tons..."
                          value={replenishTons}
                          onChange={(e) => setReplenishTons(e.target.value)}
                          className="w-1/2 bg-white border border-slate-200 py-1 px-2.5 rounded text-xs font-mono"
                        />
                        <button
                          onClick={() => handleReplenishStock(p.id)}
                          disabled={replenishLoading}
                          className="bg-[#FF5F00] text-white px-2 py-1 rounded text-[10px] font-bold cursor-pointer hover:bg-[#e05400] transition-colors shrink-0"
                        >
                          Confirmar
                        </button>
                        <button
                          onClick={() => setReplenishProductId("")}
                          className="text-slate-400 hover:text-slate-600 text-[10px] uppercase font-bold"
                        >
                          X
                        </button>
                      </div>
                    ) : (
                      <div className="text-right pt-1 border-t border-slate-100/50">
                        <button
                          onClick={() => setReplenishProductId(p.id)}
                          className="text-[10px] font-bold text-slate-500 hover:text-[#FF5F00] transition-colors"
                        >
                          + Repor Estoque Pátio
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: CORE ACTION SPACE - TABBED */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
          <div className="bg-slate-50 border-b border-slate-150">
            <Tabs
              value={activeTab}
              onChange={(_e, v) => setActiveTab(v)}
              indicatorColor="primary"
              textColor="inherit"
              sx={{
                "& .MuiTabs-indicator": { backgroundColor: "#FF5F00" },
                "& .MuiTab-root": {
                  fontFamily: "var(--font-sans)",
                  fontWeight: 700,
                  fontSize: "0.8rem",
                  color: "#64748b",
                  py: 2,
                  "&.Mui-selected": { color: "#111827" }
                }
              }}
            >
              <Tab label="Cadastrar Coproduto" icon={<PlusCircle size={16} />} iconPosition="start" />
              <Tab label="Aprovações e Cotações" icon={<ClipboardCheck size={16} />} iconPosition="start" />
            </Tabs>
          </div>

          <div className="p-6 flex-1">
            {/* TAB 0: CREATE PRODUCTS FORM */}
            {activeTab === 0 && (
              <form onSubmit={handleCreateProduct} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Name field */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 font-mono uppercase tracking-widest mb-1">
                      Denominação do Subproduto Siderúrgico
                    </label>
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="Ex: Escória Granulada LD Alto Forno"
                      value={prodName}
                      onChange={(e) => setProdName(e.target.value)}
                      disabled={formLoading}
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px", fontFamily: "var(--font-sans)" } }}
                    />
                  </div>

                  {/* Category select block */}
                  <FormControl fullWidth size="small">
                    <label className="block text-[10px] font-bold text-slate-500 font-mono uppercase tracking-widest mb-1.5">
                      Categoria do Material
                    </label>
                    <Select
                      value={prodCategory}
                      onChange={(e) => setProdCategory(e.target.value as string)}
                      disabled={formLoading}
                      sx={{ borderRadius: "8px", fontFamily: "var(--font-sans)" }}
                    >
                      <MenuItem value="ESCORIA">Escória (LD / Alto-Forno)</MenuItem>
                      <MenuItem value="CAREPA">Carepa de Laminação</MenuItem>
                      <MenuItem value="LAMA">Lama Seca de Aciaria</MenuItem>
                      <MenuItem value="PO_FINOS">Pó de Balança / Finos de Coque</MenuItem>
                      <MenuItem value="OUTROS">Outros Coprodutos</MenuItem>
                    </Select>
                  </FormControl>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Stock, price and location */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 font-mono uppercase tracking-widest mb-1">
                      Volume Pátio Inicial (Tons)
                    </label>
                    <TextField
                      fullWidth
                      size="small"
                      type="number"
                      placeholder="Ex: 5000"
                      value={prodStock}
                      onChange={(e) => setProdStock(e.target.value)}
                      disabled={formLoading}
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px", fontFamily: "var(--font-sans)" } }}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 font-mono uppercase tracking-widest mb-1">
                      Preço (R$ por tonelada)
                    </label>
                    <TextField
                      fullWidth
                      size="small"
                      type="number"
                      placeholder="Ex: 110.00"
                      value={prodPrice}
                      onChange={(e) => setProdPrice(e.target.value)}
                      disabled={formLoading}
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px", fontFamily: "var(--font-sans)" } }}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 font-mono uppercase tracking-widest mb-1">
                      Localização do Pátio Usina
                    </label>
                    <select
                      value={prodLocation}
                      onChange={(e) => setProdLocation(e.target.value)}
                      disabled={formLoading}
                      className="w-full bg-white border border-slate-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#FF5F00] text-slate-800 h-[40px]"
                    >
                      <option value="Planta de Tubarão, ES">Planta de Tubarão, ES</option>
                      <option value="Planta de Monlevade, MG">Planta de Monlevade, MG</option>
                      <option value="Planta de Sabará, MG">Planta de Sabará, MG</option>
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 font-mono uppercase tracking-widest mb-1">
                    Descrição Detalhada e Granulométrica
                  </label>
                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    placeholder="Descrição física, umidade e aplicações industriais recomendadas..."
                    value={prodDesc}
                    onChange={(e) => setProdDesc(e.target.value)}
                    disabled={formLoading}
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px", fontFamily: "var(--font-sans)" } }}
                  />
                </div>

                {/* Chemical specs input */}
                <div className="border-t border-slate-100 pt-4">
                  <h3 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-widest mb-2">
                    Composição Química Homologada (%)
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div>
                      <TextField
                        fullWidth
                        size="small"
                        label="CaO"
                        placeholder="Ex: 45.2"
                        value={chemCaO}
                        onChange={(e) => setChemCaO(e.target.value)}
                        disabled={formLoading}
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
                      />
                    </div>
                    <div>
                      <TextField
                        fullWidth
                        size="small"
                        label="SiO2"
                        placeholder="Ex: 14.8"
                        value={chemSiO2}
                        onChange={(e) => setChemSiO2(e.target.value)}
                        disabled={formLoading}
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
                      />
                    </div>
                    <div>
                      <TextField
                        fullWidth
                        size="small"
                        label="Fe2O3 / Fe"
                        placeholder="Ex: 22.0"
                        value={chemFe2O3}
                        onChange={(e) => setChemFe2O3(e.target.value)}
                        disabled={formLoading}
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
                      />
                    </div>
                    <div>
                      <TextField
                        fullWidth
                        size="small"
                        label="Al2O3"
                        placeholder="Ex: 11.5"
                        value={chemAl2O3}
                        onChange={(e) => setChemAl2O3(e.target.value)}
                        disabled={formLoading}
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
                      />
                    </div>
                  </div>
                </div>

                {formError && <Alert severity="error">{formError}</Alert>}
                {formSuccess && <Alert severity="success">{formSuccess}</Alert>}

                <Button
                  type="submit"
                  disabled={formLoading}
                  variant="contained"
                  fullWidth
                  className="font-bold py-2.5 h-11 cursor-pointer rounded-lg"
                  sx={{
                    backgroundColor: "#FF5F00",
                    color: "white",
                    fontWeight: 700,
                    fontFamily: "var(--font-sans)",
                    "&:hover": { backgroundColor: "#e05400" }
                  }}
                >
                  {formLoading ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    "Cadastrar Coproduto no Portfólio"
                  )}
                </Button>
              </form>
            )}

            {/* TAB 1: CO-NEGOTIATIONS MANAGER APPROVALS */}
            {activeTab === 1 && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-800 font-display">
                  Análise e Gestão de Propostas Comerciais B2B
                </h3>

                <div className="space-y-3.5 max-h-[380px] overflow-y-auto">
                  {transactions.filter((t) => t.status === "CRIADO").length === 0 ? (
                    <div className="py-8 text-center text-slate-400 font-mono text-xs">
                      Sem propostas ativas aguardando homologação operacional da usina neste bloco.
                    </div>
                  ) : (
                    transactions
                      .filter((t) => t.status === "CRIADO")
                      .map((tx) => (
                        <div
                          key={tx.id}
                          className="p-4 border border-slate-150 rounded-2xl bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                        >
                          <div className="space-y-1 text-left">
                            <div className="flex gap-2 items-center">
                              <span className="font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded text-xs">
                                {tx.id}
                              </span>
                              <span className="text-[10px] text-slate-400 font-medium">
                                {new Date(tx.createdAt).toLocaleDateString("pt-BR")}
                              </span>
                            </div>
                            <h4 className="text-sm font-bold text-slate-900">{tx.productName}</h4>
                            <p className="text-[11px] text-slate-500 font-sans">
                              Solicitado por: <strong className="text-slate-700">{tx.buyerCompanyName}</strong> &bull; Volume: {tx.quantityTons}t &bull; R$ {tx.totalPrice.toLocaleString("pt-BR")}
                            </p>
                          </div>

                          <div className="flex gap-2 shrink-0">
                            <button
                              onClick={() => handleApproveTransaction(tx.id)}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                            >
                              <Check size={14} /> Aprovar Lote
                            </button>
                          </div>
                        </div>
                      ))
                  )}
                </div>

                {/* Histórico Simplificado */}
                <div className="border-t border-slate-100 pt-4 space-y-2">
                  <h4 className="text-xs font-bold text-slate-400 font-mono uppercase tracking-widest">
                    Pedidos Siderúrgicos Consolidados (Aprovados/Em Trânsito)
                  </h4>
                  <div className="text-xs font-mono text-slate-500 space-y-1">
                    {transactions
                      .filter((t) => t.status !== "CRIADO")
                      .slice(0, 3)
                      .map((t) => (
                        <div key={t.id} className="flex justify-between items-center bg-slate-100/50 p-2 rounded">
                          <span>{t.id} &bull; {t.productName}</span>
                          <span className="font-bold uppercase text-slate-700">{t.status}</span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
