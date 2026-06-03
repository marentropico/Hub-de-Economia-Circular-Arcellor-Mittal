import React, { useState } from "react";
import {
  Card,
  Button,
  Tabs,
  Tab,
  Select,
  MenuItem,
  FormControl,
  Alert,
  CircularProgress
} from "@mui/material";
import { apiService } from "../services/api";
import { User, Company } from "../types";
import { Mail, Landmark, FileText, UserCheck, Shield, ChevronRight, Leaf, ShieldAlert } from "lucide-react";

interface AuthPageProps {
  onAuthSuccess: (user: User, company: Company) => void;
}

export default function AuthPage({ onAuthSuccess }: AuthPageProps) {
  const [tabIndex, setTabIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Login form states
  const [loginEmail, setLoginEmail] = useState("");

  // Register form states
  const [rgCompanyName, setRgCompanyName] = useState("");
  const [rgCnpj, setRgCnpj] = useState("");
  const [rgType, setRgType] = useState("COMPRADOR");
  const [rgUserName, setRgUserName] = useState("");
  const [rgUserEmail, setRgUserEmail] = useState("");

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
    setErrorMessage("");
    setSuccessMessage("");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim()) {
      setErrorMessage("Por favor, digite o e-mail cadastrado.");
      return;
    }
    setLoading(true);
    setErrorMessage("");
    try {
      const res = await apiService.login(loginEmail.trim());
      setSuccessMessage("Autenticação realizada com sucesso!");
      setTimeout(() => {
        onAuthSuccess(res.user, res.company);
      }, 800);
    } catch (err: any) {
      setErrorMessage(err.message || "E-mail corporativo não encontrado ou inválido.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rgCompanyName || !rgCnpj || !rgUserName || !rgUserEmail) {
      setErrorMessage("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    if (rgCnpj.length < 14) {
      setErrorMessage("CNPJ deve conter formato válido (mínimo 14 caracteres).");
      return;
    }

    setLoading(true);
    setErrorMessage("");
    try {
      const res = await apiService.register({
        companyName: rgCompanyName,
        cnpj: rgCnpj,
        companyType: rgType as any,
        userName: rgUserName,
        userEmail: rgUserEmail.trim(),
        userRole: rgType === "TRANSPORTADOR" ? "LOGISTICS_PARTNER" : "OPERATOR_BUYER",
      });
      setSuccessMessage("Empresa e Operador homologados com sucesso!");
      setTimeout(() => {
        onAuthSuccess(res.user, res.company);
      }, 1000);
    } catch (err: any) {
      setErrorMessage(err.message || "Erro ao realizar cadastramento.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 font-sans bg-slate-50">
      {/* LEFT COMPONENT - BRAND STORY */}
      <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-[#111827] via-slate-900 to-[#111827] text-white p-12 flex-col justify-between relative overflow-hidden border-r border-slate-800">
        <div className="absolute w-[600px] h-[600px] bg-white/[0.02] border border-white/[0.04] rounded-full -top-[10%] -left-[10%] pointer-events-none" />
        <div className="absolute w-[400px] h-[400px] bg-orange-600/[0.05] border border-orange-500/[0.05] rounded-full bottom-[10%] -right-[10%] pointer-events-none" />

        <div className="z-10">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-[#FF5F00] text-white flex items-center justify-center rounded-lg font-bold text-xl">
              AM
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight leading-none font-display text-white">
                ArcelorMittal
              </h2>
              <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-slate-400">
                Hub de Economia Circular
              </span>
            </div>
          </div>

          <div className="space-y-6">
            <h1 className="text-4xl font-extrabold text-white leading-tight font-display tracking-tight">
              Transformando coprodutos siderúrgicos em <span className="text-[#FF5F00]">valores circulares</span> para o amanhã.
            </h1>
            <p className="text-slate-400 text-sm leading-relaxed max-w-md">
              Bem-vindo ao canal B2B de destinação ecológica da ArcelorMittal. Encontre escórias granuladas de alto-forno, escórias LD estabilizadas, lamas, carepas e combustível calorífero para integrar à sua cadeia de transformação, agregando economias brutas de CO₂ calculadas na ponta do lápis.
            </p>
          </div>
        </div>

        <div className="z-10 mt-12">
          <div className="bg-slate-950/60 p-6 rounded-xl border border-slate-800 backdrop-blur-xs max-w-sm text-left">
            <div className="flex items-center gap-2 text-emerald-400 mb-2 font-mono text-xs font-bold leading-none">
              <Leaf size={14} /> ESG CERTIFIED PROJECT
            </div>
            <p className="text-slate-300 italic text-xs leading-relaxed">
              "A substituição de pedras e clínquer por escórias da ArcelorMittal permitiu descarbonizar nossa linha de cimento Portland CP III em mais de 18% este ano."
            </p>
            <div className="mt-3 flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-slate-700 font-bold text-[10px] text-zinc-300 flex items-center justify-center">
                M
              </div>
              <div className="text-[10px] text-slate-400 text-left font-sans">
                <span className="font-bold text-slate-300 block">Marcos Figueroa</span>
                Arquiteto de Soluções Sustentáveis
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 font-mono mt-8">
            ARCELORMITTAL DIGITAL SPACE &bull; TECNOLOGIA &bull; ZERO RESÍDUOS
          </div>
        </div>
      </div>

      {/* RIGHT COMPONENT - FORM ONBOARDING */}
      <div className="col-span-1 lg:col-span-7 flex items-center justify-center p-4 sm:p-8 md:p-16">
        <div className="w-full max-w-lg select-none">
          <div className="flex items-center gap-2 lg:hidden mb-10 justify-center">
            <div className="w-9 h-9 bg-[#FF5F00] text-white flex items-center justify-center rounded-lg font-bold text-lg">
              AM
            </div>
            <div className="text-left">
              <h2 className="text-lg font-bold text-[#111827] leading-none font-display">
                ArcelorMittal
              </h2>
              <span className="text-[9px] uppercase font-mono tracking-wider text-slate-500 font-bold">
                Economia Circular
              </span>
            </div>
          </div>

          <div className="mb-8 text-center lg:text-left">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight font-display mb-2">
              Onboarding de Clientes B2B
            </h1>
            <p className="text-slate-500 text-sm">
              Faça login corporativo imediato ou cadastre sua empresa compradora ou transportadora para homologar acesso a lotes.
            </p>
          </div>

          <Card className="rounded-2xl border border-slate-200/80 shadow-md bg-white overflow-hidden p-1 sm:p-2">
            <div className="border-b border-slate-100 bg-slate-50/50">
              <Tabs
                value={tabIndex}
                onChange={handleTabChange}
                textColor="inherit"
                indicatorColor="primary"
                variant="fullWidth"
                sx={{
                  "& .MuiTabs-indicator": {
                    backgroundColor: "#FF5F00",
                  },
                  "& .MuiTab-root": {
                    fontFamily: "var(--font-sans)",
                    fontWeight: 700,
                    fontSize: "0.875rem",
                    color: "#64748b",
                    py: 2,
                    "&.Mui-selected": {
                      color: "#111827",
                    }
                  }
                }}
              >
                <Tab label="Entrar no Portal" />
                <Tab label="Cadastrar Empresa" />
              </Tabs>
            </div>

            <div className="p-6">
              {errorMessage && (
                <Alert severity="error" icon={<ShieldAlert size={18} />} className="mb-5 font-sans border border-rose-100 bg-rose-50/50 text-slate-800">
                  {errorMessage}
                </Alert>
              )}
              {successMessage && (
                <Alert severity="success" icon={<UserCheck size={18} />} className="mb-5 font-sans border border-emerald-100 bg-emerald-50/50 text-slate-800">
                  {successMessage}
                </Alert>
              )}

              {/* TAB 0: LOGIN */}
              {tabIndex === 0 && (
                <form onSubmit={handleLogin} className="space-y-5 text-left">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 font-mono uppercase tracking-widest mb-1.5">
                      E-mail Corporativo Homologado
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Mail size={18} />
                      </div>
                      <input
                        type="email"
                        required
                        placeholder="seu.nome@empresa.com.br"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        disabled={loading}
                        className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF5F00] focus:bg-white text-slate-800 disabled:bg-slate-50 bg-white"
                      />
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 text-slate-500 space-y-2 text-xs text-left">
                    <div className="font-bold flex items-center gap-1.5 text-slate-700">
                      <Shield size={14} className="text-slate-500" /> Contas de demonstração com logins rápidos:
                    </div>
                    <ul className="list-disc list-inside space-y-1 font-mono text-[11px]">
                      <li>
                        <span className="font-bold text-slate-700 text-xs">marcosfigueroa.br@gmail.com</span> (Arcelor Admin)
                      </li>
                      <li>
                        <span className="font-bold text-slate-700 text-xs">compras@valedosol.com.br</span> (Cimenteira CP III Buyer)
                      </li>
                      <li>
                        <span className="font-bold text-slate-700 text-xs">f.costa@reveste.com.br</span> (Argamassas Buyer)
                      </li>
                      <li>
                        <span className="font-bold text-slate-700 text-xs">logistica@sidertrans.com.br</span> (Transportadora)
                      </li>
                    </ul>
                  </div>

                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={loading}
                    className="cursor-pointer font-bold rounded-lg py-3 flex items-center justify-center gap-2 transition-transform h-12"
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
                    {loading ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      <>
                        Entrar no Portal <ChevronRight size={18} />
                      </>
                    )}
                  </Button>
                </form>
              )}

              {/* TAB 1: REGISTER */}
              {tabIndex === 1 && (
                <form onSubmit={handleRegister} className="space-y-4 text-left">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 font-mono uppercase tracking-widest mb-1.5">
                        Razão Social da Empresa
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                          <Landmark size={16} />
                        </div>
                        <input
                          type="text"
                          required
                          placeholder="Ex: Cimento Forte S.A."
                          value={rgCompanyName}
                          onChange={(e) => setRgCompanyName(e.target.value)}
                          disabled={loading}
                          className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#FF5F00] text-slate-800 disabled:bg-slate-50 bg-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 font-mono uppercase tracking-widest mb-1.5">
                        CNPJ Corporativo
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                          <FileText size={16} />
                        </div>
                        <input
                          type="text"
                          required
                          placeholder="00.000.000/0001-00"
                          value={rgCnpj}
                          onChange={(e) => setRgCnpj(e.target.value)}
                          disabled={loading}
                          className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#FF5F00] text-slate-800 disabled:bg-slate-50 bg-white"
                        />
                      </div>
                    </div>
                  </div>

                  <FormControl fullWidth size="small">
                    <label className="block text-xs font-bold text-slate-500 font-mono uppercase tracking-widest mb-1.5">
                      Ramo de Atuação / Atividade B2B
                    </label>
                    <Select
                      value={rgType}
                      onChange={(e) => setRgType(e.target.value as string)}
                      disabled={loading}
                      sx={{ borderRadius: "8px", fontFamily: "var(--font-sans)", py: 0.5, fontSize: "0.8rem", color: "#334155" }}
                    >
                      <MenuItem value="COMPRADOR">Cimenteira / Pavimentadora / Construtora (Comprador)</MenuItem>
                      <MenuItem value="TRANSPORTADOR">Transportadora / Contratos de Cargas (Logística)</MenuItem>
                    </Select>
                  </FormControl>

                  <div className="border-t border-slate-100 my-4 pt-4">
                    <p className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                      Informações Técnicas do Operador de Conta
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 font-mono uppercase tracking-widest mb-1.5">
                          Nome do Representante
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Nome Completo"
                          value={rgUserName}
                          onChange={(e) => setRgUserName(e.target.value)}
                          disabled={loading}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#FF5F00] text-slate-800 disabled:bg-slate-50 bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-500 font-mono uppercase tracking-widest mb-1.5">
                          E-mail de Login Corporativo
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="nome@empresa.com"
                          value={rgUserEmail}
                          onChange={(e) => setRgUserEmail(e.target.value)}
                          disabled={loading}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#FF5F00] text-slate-800 disabled:bg-slate-50 bg-white"
                        />
                      </div>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={loading}
                    className="cursor-pointer font-bold rounded-lg py-2 transition-transform h-11"
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
                    {loading ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      "Homologar Cadastro B2B"
                    )}
                  </Button>
                </form>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
