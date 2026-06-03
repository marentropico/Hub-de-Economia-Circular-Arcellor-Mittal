import { useState, useEffect } from "react";
import { Product, Company, User } from "../types";
import { apiService } from "../services/api";
import {
  Search,
  Filter,
  MapPin,
  Coins,
  FileDown,
  ChevronRight,
  Sparkles,
  Calculator,
  Leaf,
  Layers,
  X,
  AlertTriangle
} from "lucide-react";
import {
  Drawer,
  IconButton,
  Button,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@mui/material";

interface ProductCatalogProps {
  user: User;
  company: Company;
  setActiveTab: (tab: string) => void;
  onRefreshCompanyCredits: (co2Credits: number) => void;
}

export default function ProductCatalog({
  user,
  company,
  setActiveTab,
  onRefreshCompanyCredits
}: ProductCatalogProps) {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("TODOS");
  const [selectedLocation, setSelectedLocation] = useState<string>("TODAS");

  // Drawer status
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [orderQuantity, setOrderQuantity] = useState<number>(100); // Decimals/Tons default
  const [txSubmitting, setTxSubmitting] = useState(false);
  const [txError, setTxError] = useState("");
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState("");

  const loadCatalog = async () => {
    setLoading(true);
    try {
      const list = await apiService.getProducts();
      setProducts(list);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCatalog();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <CircularProgress sx={{ color: "#FF5F00" }} />
        <p className="text-sm font-semibold text-slate-500 font-mono uppercase tracking-wider">
          Carregando Portfólio de Coprodutos...
        </p>
      </div>
    );
  }

  // Get unique locations for filtering
  const locations = ["TODAS", ...Array.from(new Set(products.map((p) => p.unitLocation)))];

  // Filter logic
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "TODOS" || p.category === selectedCategory;
    const matchesLocation = selectedLocation === "TODAS" || p.unitLocation === selectedLocation;
    return matchesSearch && matchesCategory && matchesLocation;
  });

  const categories = [
    { id: "TODOS", label: "Todos os Materiais" },
    { id: "ESCORIA", label: "Escória" },
    { id: "CAREPA", label: "Carepa" },
    { id: "LAMA", label: "Lama" },
    { id: "PO_FINOS", label: "Pó / Finos" },
  ];

  const handleOpenSpecs = (prod: Product) => {
    setSelectedProduct(prod);
    setOrderQuantity(100);
    setTxError("");
  };

  const handleCloseSpecs = () => {
    setSelectedProduct(null);
  };

  const handleSubmitQuote = async () => {
    if (!selectedProduct) return;
    if (orderQuantity <= 0) {
      setTxError("Por favor, selecione uma quantidade válida (maior que zero).");
      return;
    }
    if (orderQuantity > selectedProduct.stockTons) {
      setTxError(`Erro de pátio: A quantidade ultrapassa o estoque disponível de ${selectedProduct.stockTons} toneladas.`);
      return;
    }

    setTxSubmitting(true);
    setTxError("");
    try {
      const totalPrice = Number((orderQuantity * selectedProduct.pricePerTon).toFixed(2));
      const res = await apiService.createTransaction({
        buyerCompanyId: company.id,
        productId: selectedProduct.id,
        quantityTons: orderQuantity,
        totalPrice,
      });

      // Show satisfaction dialog
      setCreatedOrderId(res.id);
      setShowSuccessDialog(true);
      handleCloseSpecs();

      // Refresh catalog stock
      loadCatalog();
    } catch (err: any) {
      setTxError(err.message || "Erro de validação ao criar contrato de cotação.");
    } finally {
      setTxSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 font-sans text-left">
      {/* HEADER SECTION */}
      <div className="border-b border-slate-200 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#111827] tracking-tight font-display mb-1 flex items-center gap-2">
            Vitrine Siderúrgica de Coprodutos
          </h1>
          <p className="text-slate-500 text-sm">
            Portfólio técnico de subprodutos homologados para reintegração industrial imediata com laudos químicos tabulados.
          </p>
        </div>
      </div>

      {/* FILTER CONTROLS */}
      <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Search bar */}
          <div className="md:col-span-6 relative">
            <Search className="absolute left-3.5 top-3.5 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Pesquisar por granulometria, aplicação ou material..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF5F00] focus:bg-white text-slate-800"
            />
          </div>

          {/* Location filter */}
          <div className="md:col-span-6 flex gap-2 items-center">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
              <MapPin size={14} /> Usina Origem:
            </span>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF5F00] text-slate-800 font-medium"
            >
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
          <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest mr-2 flex items-center gap-1.5">
            <Filter size={12} /> Categoria:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? "bg-[#FF5F00] text-white shadow-xs"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* PRODUCTS GRID */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white border border-slate-100 p-16 rounded-2xl text-center shadow-xs">
          <Typography className="text-slate-400 font-mono text-sm leading-relaxed">
            Nenhum subproduto siderúrgico corresponde aos filtros e termos aplicados neste momento.
          </Typography>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((prod) => (
            <div
              key={prod.id}
              className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden hover:border-[#FF5F00]/50 hover:shadow-md transition-all duration-300 flex flex-col justify-between"
            >
              <div className="p-6 space-y-4">
                {/* Product Name Header */}
                <div className="flex justify-between items-start gap-4">
                  <span className="text-xs font-bold bg-[#FF5F00]/10 text-[#FF5F00] px-2.5 py-1 rounded-sm font-sans uppercase tracking-wider">
                    {prod.category}
                  </span>
                  <div className="flex items-center gap-1 text-slate-400 text-xs font-mono font-bold leading-none bg-slate-100 px-2 py-1 rounded-sm">
                    LOTE CODI
                  </div>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-lg font-bold text-slate-900 leading-tight font-display hover:text-[#FF5F00] transition-colors">
                    {prod.name}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono flex items-center gap-1">
                    <MapPin size={12} className="text-slate-400" />
                    {prod.unitLocation}
                  </p>
                </div>

                {/* Micro illustration wrapper */}
                <div className="bg-[#111827] h-28 rounded-xl flex items-center justify-center p-4 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-[#FF5F00]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="text-center z-10">
                    <Layers className="text-[#FF5F00]/30 mx-auto mb-1 animate-pulse" size={24} />
                    <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                      Composição Química Homologada
                    </p>
                    <p className="text-[9px] text-zinc-400 font-sans">
                      {Object.keys(prod.chemicalSpec).slice(0, 3).join(" • ")}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                  {prod.description}
                </p>
              </div>

              {/* Product Pricing Footer */}
              <div className="bg-slate-50 border-t border-slate-100 p-6 flex items-center justify-between">
                <div>
                  <div className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest leading-none">
                    PREÇO POR TON
                  </div>
                  <div className="text-lg font-mono font-bold text-slate-800 leading-none mt-1 flex items-center gap-1">
                    <Coins size={14} className="text-slate-500" />
                    R$ {prod.pricePerTon.toFixed(2)}
                  </div>
                </div>

                <button
                  onClick={() => handleOpenSpecs(prod)}
                  className="bg-[#FF5F00] hover:bg-[#e05400] text-white font-bold text-xs px-4 py-2.5 rounded-lg transition-colors flex items-center gap-1 shrink-0 cursor-pointer shadow-xs"
                >
                  Ficha Técnica <ChevronRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 🧾 SLIDING SPECIFICATIONS DRAWER */}
      <Drawer
        anchor="right"
        open={selectedProduct !== null}
        onClose={handleCloseSpecs}
        slotProps={{
          paper: {
            sx: {
              width: { xs: "100%", md: "520px" },
              borderLeft: "1px solid #e2e8f0",
              backgroundColor: "#f8fafc",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }
          }
        }}
      >
        {selectedProduct && (
          <div className="flex flex-col h-full font-sans justify-between text-left">
            {/* Header drawer */}
            <div className="bg-slate-900 text-white p-6 sticky top-0 z-10 flex items-center justify-between border-b border-slate-800">
              <div className="space-y-1">
                <span className="text-[9px] font-bold font-mono text-[#FF5F00] uppercase tracking-widest border border-[#FF5F00]/50 px-2 py-0.5 rounded-sm">
                  {selectedProduct.category}
                </span>
                <h2 className="text-xl font-bold font-display text-white mt-1 pr-4 leading-tight">
                  {selectedProduct.name}
                </h2>
                <p className="text-[10px] font-mono text-slate-400 flex items-center gap-1 leading-none">
                  <MapPin size={11} /> {selectedProduct.unitLocation}
                </p>
              </div>
              <IconButton onClick={handleCloseSpecs} className="text-slate-400 hover:text-white cursor-pointer bg-slate-800 p-1.5 rounded-md">
                <X size={20} />
              </IconButton>
            </div>

            {/* Scrollable contents */}
            <div className="p-6 space-y-6 overflow-y-auto flex-1">
              {/* Descriptions */}
              <div className="space-y-2">
                <Typography className="text-xs font-bold font-mono text-slate-400 uppercase tracking-widest">
                  Descrição do Material
                </Typography>
                <p className="text-slate-600 text-xs leading-relaxed bg-white border border-slate-200/60 p-4 rounded-xl">
                  {selectedProduct.description}
                </p>
              </div>

              {/* Chemical specs */}
              <div className="space-y-3">
                <Typography className="text-xs font-bold font-mono text-slate-400 uppercase tracking-widest">
                  Análise Química Homologada
                </Typography>
                <div className="bg-white border border-slate-200/60 rounded-xl overflow-hidden shadow-xs">
                  <table className="w-full text-xs font-sans">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200/60 text-slate-400 font-mono font-semibold uppercase tracking-wider text-left">
                        <th className="px-4 py-2">Composto / Elemento</th>
                        <th className="px-4 py-2 text-right">Porcentagem (%)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {Object.entries(selectedProduct.chemicalSpec).map(([key, val]) => (
                        <tr key={key} className="hover:bg-slate-50">
                          <td className="px-4 py-2.5 font-sans font-medium">{key}</td>
                          <td className="px-4 py-2.5 text-right font-mono font-bold text-slate-900">{val}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="bg-slate-50/50 p-2.5 text-[9px] text-slate-400 text-center font-mono border-t border-slate-100">
                    ANÁLISE REALIZADA CONFORME NORMAS ABNT NBR 10004
                  </div>
                </div>
              </div>

              {/* INTEGRATED CALCULATOR */}
              <div className="bg-[#111827] text-white p-5 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                  <Calculator size={18} className="text-[#FF5F00]" />
                  <span className="text-xs font-bold font-mono uppercase tracking-widest text-[#FF5F00]">
                    Simulador Comercial B2B
                  </span>
                </div>

                <div className="space-y-4 font-sans">
                  {/* Weight input box */}
                  <div className="grid grid-cols-2 gap-4 items-end">
                    <div>
                      <label className="block text-[10px] font-bold font-mono text-slate-400 uppercase tracking-widest mb-1">
                        Volume (Toneladas)
                      </label>
                      <input
                        type="number"
                        min="5"
                        max={selectedProduct.stockTons}
                        value={orderQuantity}
                        onChange={(e) => setOrderQuantity(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-sm font-mono font-bold text-white focus:outline-none focus:ring-1 focus:ring-[#FF5F00]"
                      />
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-mono text-slate-500 block">Estoque Pátio</span>
                      <span className="text-sm font-mono font-bold text-[#FF5F00]">
                        {selectedProduct.stockTons} t
                      </span>
                    </div>
                  </div>

                  {/* Calculations breakdown */}
                  <div className="bg-slate-950 p-4 rounded-xl space-y-2 border border-slate-900 text-xs font-mono">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Valor Unitário</span>
                      <span>R$ {selectedProduct.pricePerTon.toFixed(2)} / t</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-800 pb-2">
                      <span className="text-slate-500">Logística de Embarque</span>
                      <span className="text-emerald-500 font-bold uppercase">EX-WORKS (FOB)</span>
                    </div>
                    <div className="flex justify-between items-center pt-1 font-sans">
                      <span className="text-slate-400 text-xs">Total Parcial (Cotação)</span>
                      <span className="text-lg font-mono font-extrabold text-white">
                        R$ {(orderQuantity * selectedProduct.pricePerTon).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>

                  {/* Projected Carbon Credit saving */}
                  <div className="flex items-center gap-3 bg-emerald-900/20 border border-emerald-800/40 p-3 rounded-lg text-emerald-400">
                    <Leaf size={20} className="animate-pulse" />
                    <div className="text-left font-sans leading-none">
                      <div className="text-[10px] font-bold font-mono text-emerald-400 uppercase tracking-widest leading-none mb-1">
                        Abatimento CO₂ Projetado:
                      </div>
                      <div className="text-sm font-mono font-bold text-white leading-none">
                        +{(orderQuantity * 0.08).toFixed(1)} t CO₂ evitado!
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {txError && (
                <Alert severity="error" className="text-xs font-medium">
                  {txError}
                </Alert>
              )}
            </div>

            {/* Quote Action Drawer Footer */}
            <div className="bg-white border-t border-slate-200 p-6 space-y-3">
              <Button
                fullWidth
                variant="contained"
                disabled={txSubmitting || orderQuantity <= 0}
                onClick={handleSubmitQuote}
                className="cursor-pointer font-bold rounded-lg py-3 flex items-center justify-center gap-1.5 h-12"
                sx={{
                  backgroundColor: "#FF5F00",
                  color: "white",
                  fontFamily: "var(--font-sans)",
                  fontWeight: 700,
                  "&:hover": {
                    backgroundColor: "#e05400",
                  }
                }}
              >
                {txSubmitting ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <>
                    Solicitar Cotação B2B <ChevronRight size={18} />
                  </>
                )}
              </Button>

              <div className="flex justify-center items-center gap-1.5 text-[10px] text-slate-400 font-mono">
                <FileDown size={12} /> FISPQ/FDSR DISPONÍVEL • LICENCIADO
              </div>
            </div>
          </div>
        )}
      </Drawer>

      {/* 🤝 SATISFACTION CONFIRMING DIALOG */}
      <Dialog
        open={showSuccessDialog}
        onClose={() => setShowSuccessDialog(false)}
        slotProps={{
          paper: {
            sx: {
              borderRadius: "16px",
              p: 2,
              fontFamily: "var(--font-sans)",
            }
          }
        }}
      >
        <DialogTitle className="font-display font-extrabold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
          <Sparkles className="text-emerald-500" size={24} /> Proposta Comercial Aberta!
        </DialogTitle>
        <DialogContent className="py-4">
          <p className="text-sm text-slate-600 leading-relaxed font-sans text-left">
            Sua proposta B2B número <strong className="font-mono text-slate-900 bg-slate-50 p-1.5 rounded">{createdOrderId}</strong> foi enviada e integrada com sucesso ao ecossistema da ArcelorMittal.
          </p>
          <div className="bg-slate-50 border border-slate-200/60 p-4 rounded-xl mt-4 font-sans text-left space-y-1.5 text-xs text-slate-500">
            <span className="font-bold text-slate-800 block">Próximas etapas:</span>
            <p>1. A gerência da ArcelorMittal irá revisar e validar as especificidades CNPJ do lote.</p>
            <p>2. Assim que aprovado, acesse a <strong>Mesa de Pedidos</strong> para emitir o seu respectivo manifesto MTR de transporte para despachar de imediato.</p>
          </div>
        </DialogContent>
        <DialogActions className="border-t border-slate-100 pt-2">
          <Button
            onClick={() => {
              setShowSuccessDialog(false);
              setActiveTab("orders");
            }}
            sx={{
              color: "#FF5F00",
              fontWeight: 700,
              fontFamily: "var(--font-sans)"
            }}
          >
            Acessar Mesa de Pedidos
          </Button>
          <Button
            onClick={() => setShowSuccessDialog(false)}
            sx={{
              color: "#64748b",
              fontWeight: 500,
              fontFamily: "var(--font-sans)"
            }}
          >
            Fechar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
