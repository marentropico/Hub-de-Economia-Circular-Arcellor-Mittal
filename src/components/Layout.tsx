import React from "react";
import { User, Company } from "../types";
import {
  LayoutDashboard,
  Boxes,
  ClipboardList,
  ShieldCheck,
  LogOut,
  Leaf,
  Factory,
  Menu,
  X,
  User as UserIcon,
  Building2
} from "lucide-react";

interface LayoutProps {
  user: User;
  company: Company;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  children: React.ReactNode;
}

export default function Layout({
  user,
  company,
  activeTab,
  setActiveTab,
  onLogout,
  children
}: LayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const menuItems = [
    { id: "dashboard", label: "Dashboard ESG", icon: LayoutDashboard },
    { id: "catalog", label: "Vitrine Técnica", icon: Boxes },
    { id: "orders", label: "Mesa de Pedidos", icon: ClipboardList },
  ];

  if (user.role === "ADMIN_ARCELOR") {
    menuItems.push({ id: "admin", label: "Painel Siderúrgico", icon: ShieldCheck });
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* HEADER BAR */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs px-4 sm:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-slate-600 p-1 hover:bg-slate-100 rounded"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#FF5F00] text-white flex items-center justify-center rounded-lg font-bold text-xl font-display">
              AM
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-[#111827] tracking-tight flex items-center gap-1.5 leading-none font-display">
                ArcelorMittal
                <span className="text-[#FF5F00] font-medium text-sm border-l border-slate-300 pl-2 leading-none uppercase tracking-wider">
                  Circular
                </span>
              </h1>
              <p className="text-[10px] font-semibold text-slate-400 font-mono tracking-widest uppercase">
                B2B BYPRODUCTS HUB
              </p>
            </div>
          </div>
        </div>

        {/* TOP STATUS AND PERFILS */}
        <div className="flex items-center gap-4 sm:gap-6">
          {/* ESG SCORE ACCUMULATOR */}
          <div className="hidden sm:flex items-center gap-2.5 bg-emerald-50 border border-emerald-200 py-1.5 px-3.5 rounded-full shadow-xs">
            <Leaf size={16} className="text-emerald-600 animate-pulse" />
            <div className="leading-none text-left">
              <div className="text-[9px] font-mono font-bold text-emerald-800 uppercase tracking-widest leading-none">
                CO2 Evitado
              </div>
              <div className="text-sm font-mono font-bold text-emerald-900 leading-none">
                {company.co2_credits.toFixed(1)} t
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-slate-100/80 px-4 py-1.5 rounded-lg border border-slate-200/50">
            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-700 font-bold border border-slate-300">
              {user.name.charAt(0)}
            </div>
            <div className="hidden md:block leading-tight text-left">
              <div className="text-xs font-bold text-slate-800 flex items-center gap-1">
                {user.name}
                <span className={`text-[9px] px-1.5 py-0.2 rounded-sm font-mono border ${
                  user.role === 'ADMIN_ARCELOR' 
                    ? 'bg-[#FF5F00]/10 text-[#FF5F00] border-[#FF5F00]/30' 
                    : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                }`}>
                  {user.role === 'ADMIN_ARCELOR' ? 'Arcor Admin' : 'Comprador'}
                </span>
              </div>
              <div className="text-[10px] text-slate-500 font-medium flex items-center gap-1.5">
                <Building2 size={10} />
                {company.name} (CNPJ: {company.cnpj})
              </div>
            </div>
          </div>

          <button
            onClick={onLogout}
            title="Sair do Sistema"
            className="p-2 border border-slate-200 text-slate-500 hover:text-rose-600 hover:border-rose-100 hover:bg-rose-50 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
          >
            <LogOut size={18} />
            <span className="hidden sm:inline text-xs font-medium">Sair</span>
          </button>
        </div>
      </header>

      <div className="flex flex-1 relative">
        {/* DESKTOP SIDEBAR */}
        <aside className="w-64 bg-slate-900 border-r border-slate-800 hidden md:flex flex-col justify-between py-6 shrink-0 text-slate-300">
          <div className="px-4 space-y-6">
            <div className="text-slate-400 text-xs font-bold tracking-widest font-mono uppercase px-2 mb-4">
              Navegação
            </div>
            <nav className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isSelected = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-150 cursor-pointer text-left ${
                      isSelected
                        ? "bg-[#FF5F00] text-white shadow-md font-bold"
                        : "text-slate-400 hover:text-white hover:bg-slate-800"
                    }`}
                  >
                    <Icon size={18} />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="px-6 py-4 bg-slate-950/50 m-4 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2 mb-2 text-slate-400">
              <Factory size={16} />
              <div className="text-xs font-mono font-bold uppercase tracking-widest">ECOSISTEMA</div>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
              Gerencie subprodutos siderúrgicos com rastreabilidade mecânica e ambiental garantida ArcelorMittal.
            </p>
          </div>
        </aside>

        {/* MOBILE OVERLAY MENU */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 bg-slate-900/60 z-30 md:hidden" onClick={() => setMobileMenuOpen(false)}>
            <div
              className="w-64 h-full bg-slate-900 flex flex-col py-6 px-4 text-slate-300"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-slate-400 text-xs font-bold tracking-widest font-mono uppercase px-2 mb-6">
                Navegação
              </div>
              <nav className="space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isSelected = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-150 text-left ${
                        isSelected
                          ? "bg-[#FF5F00] text-white shadow-md"
                          : "text-slate-400 hover:text-white hover:bg-slate-800"
                      }`}
                    >
                      <Icon size={18} />
                      {item.label}
                    </button>
                  );
                })}
              </nav>

              <div className="mt-auto px-4 py-3 bg-slate-950 m-2 rounded-lg border border-slate-800 text-xs">
                <div className="font-bold text-[#FF5F00]">CNPJ VÍNCULO:</div>
                <div className="font-mono text-[10px] text-slate-400">{company.cnpj}</div>
              </div>
            </div>
          </div>
        )}

        {/* MAIN BODY WINDOW */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-200 py-4 px-6 text-center text-xs text-slate-400 font-medium">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2">
          <div>
            &copy; 2026 ArcelorMittal Brasil. Todos os direitos reservados. Economia Circular & Logística.
          </div>
          <div className="flex gap-4 font-mono text-[10px]">
            <span>DB STATE: PERSISTENT SQLITE</span>
            <span>LICENÇA: CONAMA COMPLIANT</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
