import { useState, useEffect } from "react";
import { Company, User, Transaction } from "../types";
import { apiService } from "../services/api";
import {
  Leaf,
  Scale,
  ShoppingBag,
  TrendingUp,
  Award,
  Globe,
  FileCheck2,
  Truck,
  ArrowRight,
  TrendingDown
} from "lucide-react";
import { Alert, CircularProgress } from "@mui/material";

interface DashboardProps {
  user: User;
  company: Company;
  setActiveTab: (tab: string) => void;
}

export default function Dashboard({ user, company, setActiveTab }: DashboardProps) {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalCO2Saved: 0, carbonCreditBalance: 0, ordersCount: 0 });
  const [recentOrders, setRecentOrders] = useState<Transaction[]>([]);
  const [errorHeader, setErrorHeader] = useState("");

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const serverStats = await apiService.getStats(company.id);
      setStats(serverStats);

      const allTxs = await apiService.getTransactions(company.id);
      setRecentOrders(allTxs.slice(0, 4)); // Get up to 4 recent orders
    } catch (err: any) {
      console.error(err);
      setErrorHeader("Erro ao sincronizar painel ESG remoto.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [company.id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <CircularProgress sx={{ color: "#FF5F00" }} />
        <p className="text-sm font-semibold text-slate-500 font-mono uppercase tracking-wider">
          Compilando Métricas de Descarbonização...
        </p>
      </div>
    );
  }

  // Calculate percentage of yearly goal (e.g. goal is 15,000 tons of CO2 saved)
  const yearlyGoal = 15000;
  const goalPercentage = Math.min(Math.round((stats.totalCO2Saved / yearlyGoal) * 100), 100);

  // Carbon compensations items mapping
  const co2Equivalents = [
    { title: "Carros Fora de Circulação", value: Math.round(stats.totalCO2Saved * 0.22), label: "veículos/ano", desc: "Equivale a retirar de rodovias urbanas automóveis movidos a gasolina." },
    { title: "Árvores Plantadas", value: Math.round(stats.totalCO2Saved * 6.2), label: "mudas nativas", desc: "Equivale ao sequestro florestal de mudas cultivadas em reflorestamentos de Mata Atlântica por 20 anos." },
    { title: "Casas Descarbonizadas", value: Math.round(stats.totalCO2Saved / 2.8), label: "lares sustentáveis", desc: "Poder de equivalência na redução energética de residências de alto consumo energético." },
  ];

  return (
    <div className="space-y-8 font-sans text-left">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight font-display mb-1">
            Centro Operational ESG e Descarbonização
          </h1>
          <p className="text-slate-500 text-sm">
            Rastreamento de materiais alternativos reciclados e impactos na pegada de carbono calculados com dados diretos de usina.
          </p>
        </div>
        <button
          onClick={loadDashboardData}
          className="text-xs bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold px-4 py-2 rounded-lg cursor-pointer transition-colors"
        >
          Sincronizar Dados ESG
        </button>
      </div>

      {errorHeader && <Alert severity="warning" className="mb-4">{errorHeader}</Alert>}

      {/* METRICS COUNT - BENTO BARS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* CO2 CREDITS ACCUMULATOR - BENTO CARD ( sustainability dark style from theme html ) */}
        <div className="bg-[#1D2B35] text-white border border-[#2a3c49]/60 p-6 rounded-2xl shadow-sm relative overflow-hidden flex flex-col justify-between h-44 group transition-all duration-300 hover:-translate-y-0.5">
          <div className="absolute right-3 top-3 w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-emerald-400">
            <Leaf size={20} className="group-hover:rotate-12 transition-transform" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-[10px] font-bold font-mono text-slate-300 uppercase tracking-widest block">
                Impacto Ambiental Poupado
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
            <span className="text-4xl font-light font-display text-white tracking-tight block">
              {stats.totalCO2Saved.toFixed(1)} <span className="text-sm font-sans font-medium text-emerald-400 uppercase tracking-widest">tons CO₂</span>
            </span>
          </div>
          <div className="space-y-2">
            <div className="h-1 bg-slate-700/50 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${goalPercentage}%` }}></div>
            </div>
            <div className="text-[10px] text-slate-400 font-mono flex justify-between">
              <span>EFICIÊNCIA ATIVA</span>
              <span className="text-emerald-400 font-bold">{goalPercentage}% DA META</span>
            </div>
          </div>
        </div>

        {/* CARBON CREDIT EQUIVALENT - BENTO CARD ( light clean style with orange accents ) */}
        <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-xs relative overflow-hidden flex flex-col justify-between h-44 group hover:border-[#FF5F00]/30 transition-all duration-300 hover:-translate-y-0.5">
          <div className="absolute right-3 top-3 w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center text-[#FF5F00]">
            <Scale size={20} className="group-hover:-translate-y-0.5 transition-transform" />
          </div>
          <div className="border-l-2 border-[#FF5F00] pl-3">
            <span className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-widest block mb-0.5">
              Créditos Verdes Ativos
            </span>
            <span className="text-3xl font-bold font-mono text-slate-900 tracking-tight block">
              {stats.carbonCreditBalance} <span className="text-xs font-sans font-semibold text-[#FF5F00] bg-orange-50/80 px-2 py-0.5 rounded-md">Ativos AM</span>
            </span>
          </div>
          <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1.5 bg-slate-50/80 p-2 rounded-xl border border-slate-100">
            <Award size={14} className="text-[#FF5F00]" />
            <span>Certificados verdes auditados</span>
          </div>
        </div>

        {/* ORDERS COUNT - BENTO CARD ( light style ) */}
        <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-xs relative overflow-hidden flex flex-col justify-between h-44 group hover:border-[#FF5F00]/30 transition-all duration-300 hover:-translate-y-0.5">
          <div className="absolute right-3 top-3 w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
            <ShoppingBag size={20} className="group-hover:scale-105 transition-transform" />
          </div>
          <div>
            <span className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-widest block mb-1">
              Negociações B2B
            </span>
            <span className="text-3xl font-bold font-mono text-slate-900 tracking-tight block">
              {stats.ordersCount} <span className="text-lg font-sans font-medium text-slate-400">ativos</span>
            </span>
          </div>
          <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1.5 border-t border-slate-100 pt-3">
            <FileCheck2 size={14} className="text-indigo-500" />
            <span>Remessa e cotação homologada</span>
          </div>
        </div>

        {/* TOTAL RECYCLED WEIGHT - BENTO CARD ( Developer dark console style ) */}
        <div className="bg-slate-900 text-white border border-slate-800 p-6 rounded-2xl shadow-sm relative overflow-hidden flex flex-col justify-between h-44 group transition-all duration-300 hover:-translate-y-0.5">
          <div className="absolute right-3 top-3 w-10 h-10 bg-[#FF5F00]/10 rounded-lg flex items-center justify-center text-[#FF5F00]">
            <Globe size={20} className="group-hover:animate-spin transition-all duration-1000" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-widest block">
                Substituição Circular
              </span>
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            </div>
            <span className="text-4xl font-extrabold font-mono text-white block leading-none">
              80.0%
            </span>
          </div>
          <div className="text-[10px] text-slate-400 font-mono bg-slate-950 p-2 rounded-lg border border-slate-800">
            <span className="text-[#FF5F00] font-bold">STATE:</span> ACTIVE_DECARBON
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* CARBON GOAL & EQUIVALENTS COMPARISON */}
        <div className="lg:col-span-7 bg-white border border-slate-200 p-6 rounded-2xl shadow-xs space-y-6 hover:border-slate-300 transition-all">
          <div className="flex justify-between items-start border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-xl font-extrabold text-slate-800 font-display">Meta de Neutralidade de Carbono 2026</h2>
              <p className="text-slate-500 text-xs">Progresso ponderado de redução das emissões sob substituição cíclica de agregados minerais primários.</p>
            </div>
            <span className="text-[10px] bg-emerald-50 text-emerald-700 font-mono font-bold px-2.5 py-1 rounded-md uppercase tracking-wider border border-emerald-100">
              Ativo
            </span>
          </div>

          {/* Progress bar */}
          <div className="space-y-3">
            <div className="flex justify-between items-end text-xs font-mono">
              <span className="text-emerald-700 font-bold uppercase tracking-wider">Atingido: {goalPercentage}%</span>
              <span className="text-slate-500 font-bold">{stats.totalCO2Saved.toFixed(1)} t / {yearlyGoal} t CO₂</span>
            </div>
            <div className="w-full h-4 bg-slate-50 rounded-full overflow-hidden border border-slate-200/60 p-0.5">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-1000 ease-out shadow-xs"
                style={{ width: `${goalPercentage}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
              Meta anual calculada para empresas associadas ao ecossistema da ArcelorMittal. Cada tonelada de coproduto reaproveitado em pavimentação ou cimento abate de forma regulada a pegada industrial integrada.
            </p>
          </div>

          {/* Equivalents blocks */}
          <div className="border-t border-slate-100 pt-5">
            <h3 className="text-xs font-bold text-slate-400 font-mono uppercase tracking-widest mb-4">
              Equivalência Prática do Carbono Economizado
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {co2Equivalents.map((item, index) => (
                <div key={index} className="bg-slate-50/50 border border-slate-200/60 p-4 rounded-xl flex flex-col justify-between hover:bg-slate-50 transition-colors">
                  <div>
                    <span className="text-3xl font-extrabold font-mono text-slate-800 block leading-none">
                      {item.value}
                    </span>
                    <span className="text-[9px] uppercase font-mono font-bold text-emerald-700 tracking-wider">
                      {item.label}
                    </span>
                    <h4 className="text-xs font-bold text-slate-800 mt-3 border-l-2 border-[#FF5F00] pl-2">
                      {item.title}
                    </h4>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-2 leading-snug">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RECENT ORDERS/STATUS WINDOW */}
        <div className="lg:col-span-5 bg-white border border-slate-200/80 p-6 rounded-2xl shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 font-display">Acompanhamento Comercial Recente</h2>
                <p className="text-slate-500 text-xs">Situação das cotações de coprodutos para retirada direta.</p>
              </div>
              <button
                onClick={() => setActiveTab("orders")}
                className="text-xs text-[#FF5F00] font-bold hover:underline cursor-pointer flex items-center gap-0.5"
              >
                Mesa Completa <ArrowRight size={14} />
              </button>
            </div>

            <div className="space-y-3">
              {recentOrders.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs font-mono">
                  Sem pedidos formalizados neste período.
                </div>
              ) : (
                recentOrders.map((ord) => (
                  <div
                    key={ord.id}
                    onClick={() => setActiveTab("orders")}
                    className="flex justify-between items-center p-3 border border-slate-100 hover:border-slate-300 rounded-xl bg-slate-50/50 cursor-pointer transition-colors"
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-800">{ord.productName}</div>
                      <div className="text-[10px] font-mono text-slate-500">
                        {ord.id} &bull; {ord.quantityTons} t &bull; R$ {ord.totalPrice.toLocaleString("pt-BR")}
                      </div>
                    </div>
                    <span className={`text-[10px] px-2.5 py-1 rounded-full font-mono font-bold border ${
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
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-orange-50/30 border border-orange-200/50 rounded-xl p-4 mt-6">
            <h3 className="text-xs font-bold text-[#FF5F00] flex items-center gap-1.5 leading-none mb-1">
              <Truck size={14} /> Canal de Coleta e Cargas Integradas
            </h3>
            <p className="text-[10px] text-slate-500 leading-normal">
              Seu painel também permite sincronização com placas de logística. Lembre-se que cada pedido requer a emissão do manifesto MTR no SINIR para assegurar o frete ambiental homologado.
            </p>
          </div>
        </div>
      </div>

      {/* EDUCATIVE INFORMATION ROW ON CO-BYPRODUCTS */}
      <div className="bg-zinc-900 text-white rounded-2xl p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute right-0 bottom-0 w-96 h-96 bg-[#FF5F00]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="z-10 relative max-w-2xl space-y-3">
          <span className="text-[10px] font-bold font-mono text-[#FF5F00] uppercase tracking-widest">
            Fator de Impacto de Descarbonização
          </span>
          <h2 className="text-2xl font-bold font-display tracking-tight text-white leading-none">
            Por que adotar coprodutos da ArcelorMittal?
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Cada tonelada de <strong className="text-white font-semibold">escória granulada usada no cimento</strong> CP III reduz as emissões de carbono do clínquer mineral em até <strong>0.8 toneladas de CO₂</strong> equivalent. Já o reaproveitamento de <strong className="text-white font-semibold">escória de aciaria LD britada</strong> evita as degradações ambientais e dragagens de lavra de brita nativa, fomentando o passivo industrial em ativo de engenharia focado em pavimentação rodoviária segura e durável.
          </p>
          <div className="pt-2 flex gap-4">
            <button
              onClick={() => setActiveTab("catalog")}
              className="bg-[#FF5F00] hover:bg-[#e05400] text-white font-semibold text-xs px-4 py-2.5 rounded-lg transition-colors cursor-pointer"
            >
              Consultar Coprodutos do Catálogo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
