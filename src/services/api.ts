import { User, Company, Product, Transaction, Logistics } from "../types";

const LOCAL_STORAGE_KEY_USER = "arcelor_hub_user";
const LOCAL_STORAGE_KEY_COMPANY = "arcelor_hub_company";

export function getStoredSession(): { user: User; company: Company } | null {
  try {
    const userJson = localStorage.getItem(LOCAL_STORAGE_KEY_USER);
    const companyJson = localStorage.getItem(LOCAL_STORAGE_KEY_COMPANY);
    if (userJson && companyJson) {
      return {
        user: JSON.parse(userJson),
        company: JSON.parse(companyJson),
      };
    }
  } catch (e) {
    console.error("Error loading session:", e);
  }
  return null;
}

export function saveSession(user: User, company: Company) {
  localStorage.setItem(LOCAL_STORAGE_KEY_USER, JSON.stringify(user));
  localStorage.setItem(LOCAL_STORAGE_KEY_COMPANY, JSON.stringify(company));
}

export function clearSession() {
  localStorage.removeItem(LOCAL_STORAGE_KEY_USER);
  localStorage.removeItem(LOCAL_STORAGE_KEY_COMPANY);
}

// ========================================================
// 🗄️ CLIENT-SIDE BROWSER DATABASE ENGINE FOR VERTICAL/VERCEL RUNS
// ========================================================

const defaultLocalStorageDb = {
  companies: [
    {
      id: "comp-arcelor",
      name: "ArcelorMittal Tubarão S.A.",
      cnpj: "15.475.643/0001-52",
      type: "PRODUTOR",
      status: "ATIVO",
      co2_credits: 10502.4,
    },
    {
      id: "comp-cimento-vale",
      name: "Cimenteira Vale do Sol S.A.",
      cnpj: "18.349.882/0001-10",
      type: "COMPRADOR",
      status: "ATIVO",
      co2_credits: 482.4,
    },
    {
      id: "comp-reveste",
      name: "Reveste Argamassas e Pavimentos",
      cnpj: "22.109.432/0001-85",
      type: "COMPRADOR",
      status: "ATIVO",
      co2_credits: 120.5,
    },
    {
      id: "comp-carrier",
      name: "SiderTrans Logística Industrial",
      cnpj: "30.122.909/0001-31",
      type: "TRANSPORTADOR",
      status: "ATIVO",
      co2_credits: 0,
    },
  ],
  users: [
    {
      id: "user-admin",
      companyId: "comp-arcelor",
      name: "Marcos Figueroa (ArcelorMittal)",
      email: "marcosfigueroa.br@gmail.com",
      role: "ADMIN_ARCELOR",
    },
    {
      id: "user-buyer1",
      companyId: "comp-cimento-vale",
      name: "Roberto Almeida (Vale do Sol)",
      email: "compras@valedosol.com.br",
      role: "OPERATOR_BUYER",
    },
    {
      id: "user-buyer2",
      companyId: "comp-reveste",
      name: "Fernanda Costa (Reveste)",
      email: "f.costa@reveste.com.br",
      role: "OPERATOR_BUYER",
    },
    {
      id: "user-logistics",
      companyId: "comp-carrier",
      name: "Carlos Santos (SiderTrans)",
      email: "logistica@sidertrans.com.br",
      role: "LOGISTICS_PARTNER",
    },
  ],
  products: [
    {
      id: "prod-escoria-1",
      companyId: "comp-arcelor",
      name: "Escória de Alto-Forno Granulada",
      category: "ESCORIA",
      description: "Subproduto resultante da fusão do minério de ferro em alto-forno. Resíduo de excelente atividade hidráulica latente, idealmente utilizado para a moagem de cimento Portland composto ou de alto-forno (CP III). Granulometria de 0 a 4mm.",
      chemicalSpec: {
        "CaO (Óxido de Cálcio)": 42.5,
        "SiO2 (Dióxido de Silício)": 34.2,
        "Al2O3 (Óxido de Alumínio)": 11.8,
        "MgO (Óxido de Magnésio)": 7.4,
        "S (Enxofre)": 1.1,
      },
      pricePerTon: 85.0,
      stockTons: 15400,
      unitLocation: "Planta de Tubarão, ES",
      safetyDocUrl: "https://www.arcelormittal.com.br/fispq/escoria_alto_forno.pdf",
    },
    {
      id: "prod-escoria-2",
      companyId: "comp-arcelor",
      name: "Escória de Aciaria LD Britada (0 a 19mm)",
      category: "ESCORIA",
      description: "Coproduto alcalino gerado no convertedor de aciaria de oxigênio (LD). Estabilizado quimicamente sob intemperismo para eliminação de cal livre. Indicado para pavimentação rodoviária de base/sub-base, aterros estruturais ou corretivo de acidez de solos agrícolas.",
      chemicalSpec: {
        "CaO (Óxido de Cálcio)": 48.2,
        "Fe2O3 (Óxido de Ferro)": 21.5,
        "SiO2 (Dióxido de Silício)": 14.1,
        "MgO (Óxido de Magnésio)": 6.8,
        "MnO (Óxido de Manganês)": 4.5,
      },
      pricePerTon: 62.5,
      stockTons: 25000,
      unitLocation: "Planta de Tubarão, ES",
      safetyDocUrl: "https://www.arcelormittal.com.br/fispq/escoria_aciaria_ld.pdf",
    },
    {
      id: "prod-carepa",
      companyId: "comp-arcelor",
      name: "Carepa de Laminação de Alto Teor",
      category: "CAREPA",
      description: "Óxido de ferro formado na superfície de placas de aço durante o reaquecimento e deformação a quente nos laminadores. Contém teor de ferro (Fe) superior a 70%. Matéria-prima ideal para indústrias químicas de pigmentos, cimenteiras ou sínter-planta secundária.",
      chemicalSpec: {
        "Fe (Ferro Metálico de Carepa)": 72.8,
        "O (Oxigênio combinado)": 24.1,
        "SiO2 (Sílica residual)": 1.4,
        "C (Carbono livre)": 0.5,
      },
      pricePerTon: 180.0,
      stockTons: 4200,
      unitLocation: "Planta de Monlevade, MG",
      safetyDocUrl: "https://www.arcelormittal.com.br/fispq/carepa_laminacao.pdf",
    },
    {
      id: "prod-lama-aciaria",
      companyId: "comp-arcelor",
      name: "Lama Seca de Aciaria LD",
      category: "LAMA",
      description: "Lodo desidratado proveniente da despoeiramento das chaminés de exaustão dos convertedores LD. Rico em óxidos de ferro e carbono. Indicado para sinterização de minério de ferro ou como aditivo em olarias e indústrias cerâmicas estruturais.",
      chemicalSpec: {
        "Fe2O3 (Óxido de Ferro)": 60.2,
        "CaO (Óxido de Cálcio)": 12.4,
        "C (Carbono total)": 8.5,
        "SiO2 (Sílica)": 3.8,
      },
      pricePerTon: 45.0,
      stockTons: 8900,
      unitLocation: "Planta de Tubarão, ES",
      safetyDocUrl: "https://www.arcelormittal.com.br/fispq/lama_aciaria_ld.pdf",
    },
    {
      id: "prod-po-finos",
      companyId: "comp-arcelor",
      name: "Finos de Coque de Alto-Forno",
      category: "PO_FINOS",
      description: "Fração granulométrica fina do coque metalúrgico obtida após peneiramento no embarque de fornos. Possui alto poder calorífico superior a 7000 kcal/kg e excelente teor de carbono fixo. Muito usado como co-combustível em fornos de cimento ou calcinadores.",
      chemicalSpec: {
        "Carbono Fixo (C)": 86.5,
        "Cinzas de Silício": 9.4,
        "Material Volátil": 2.1,
        "Enxofre (S)": 0.8,
      },
      pricePerTon: 240.0,
      stockTons: 1540,
      unitLocation: "Planta de Tubarão, ES",
      safetyDocUrl: "https://www.arcelormittal.com.br/fispq/finos_coque.pdf",
    }
  ],
  transactions: [
    {
      id: "ORD-9281A",
      buyerCompanyId: "comp-cimento-vale",
      productId: "prod-escoria-1",
      quantityTons: 450,
      totalPrice: 38250,
      status: "CONCLUIDO",
      createdAt: "2026-05-18T14:30:00.000Z",
    },
    {
      id: "ORD-3401X",
      buyerCompanyId: "comp-reveste",
      productId: "prod-escoria-2",
      quantityTons: 120,
      totalPrice: 7500,
      status: "EM_CARREGAMENTO",
      createdAt: "2026-06-02T10:15:00.000Z",
    },
    {
      id: "ORD-8924K",
      buyerCompanyId: "comp-cimento-vale",
      productId: "prod-carepa",
      quantityTons: 50,
      totalPrice: 9000,
      status: "CRIADO",
      createdAt: "2026-06-03T16:45:00.000Z",
    }
  ],
  logistics: [
    {
      id: "LOG-1025B",
      transactionId: "ORD-9281A",
      carrierName: "SiderTrans Logística Industrial",
      licensePlate: "EPX-8B29",
      status: "ENTREGUE",
      mtrDocNumber: "MTR-2605189281-99",
    },
    {
      id: "LOG-3402C",
      transactionId: "ORD-3401X",
      carrierName: "SiderTrans Logística Industrial",
      licensePlate: "MAM-4J10",
      status: "EM_TRANSITO",
      mtrDocNumber: "MTR-2606023401-22",
    }
  ],
};

const DB_LOCAL_KEY = "arcelor_circular_local_db";

function getLocalStore() {
  const data = localStorage.getItem(DB_LOCAL_KEY);
  if (!data) {
    localStorage.setItem(DB_LOCAL_KEY, JSON.stringify(defaultLocalStorageDb));
    return defaultLocalStorageDb;
  }
  try {
    return JSON.parse(data);
  } catch {
    localStorage.setItem(DB_LOCAL_KEY, JSON.stringify(defaultLocalStorageDb));
    return defaultLocalStorageDb;
  }
}

function saveLocalStore(store: any) {
  localStorage.setItem(DB_LOCAL_KEY, JSON.stringify(store));
}

function localRequest(url: string, options?: RequestInit): any {
  const store = getLocalStore();
  const cleanUrl = url.split("?")[0];
  const queryParams = new URLSearchParams(url.split("?")[1] || "");

  const method = options?.method?.toUpperCase() || "GET";
  const body = options?.body ? JSON.parse(options.body as string) : null;

  // 1. LOGIN
  if (cleanUrl === "/api/auth/login" && method === "POST") {
    const { email } = body;
    const user = store.users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      throw new Error("E-mail corporativo não registrado ou não homologado no Hub.");
    }
    const company = store.companies.find((c: any) => c.id === user.companyId);
    if (!company) {
      throw new Error("Empresa associada a este usuário não encontrada.");
    }
    return { user, company };
  }

  // 2. REGISTER
  if (cleanUrl === "/api/auth/register" && method === "POST") {
    const { companyName, cnpj, companyType, userName, userEmail, userRole } = body;
    if (store.users.some((u: any) => u.email.toLowerCase() === userEmail.toLowerCase())) {
      throw new Error("Este e-mail corporativo já está cadastrado no sistema.");
    }
    let company = store.companies.find((c: any) => c.cnpj === cnpj);
    if (!company) {
      company = {
        id: `comp-${Math.random().toString(36).substring(2, 11).toUpperCase()}`,
        name: companyName,
        cnpj,
        type: companyType,
        status: "ATIVO",
        co2_credits: 0,
      };
      store.companies.push(company);
    }
    const user = {
      id: `user-${Math.random().toString(36).substring(2, 11).toUpperCase()}`,
      companyId: company.id,
      name: userName,
      email: userEmail,
      role: userRole,
    };
    store.users.push(user);
    saveLocalStore(store);
    return { user, company };
  }

  // 3. PRODUCTS LIST
  if (cleanUrl === "/api/products" && method === "GET") {
    return store.products;
  }

  // 4. CREATE PRODUCT
  if (cleanUrl === "/api/products" && method === "POST") {
    const arcelorCompany = store.companies.find((c: any) => c.id === "comp-arcelor");
    const newProduct = {
      ...body,
      id: `prod-${Math.random().toString(36).substring(2, 11).toUpperCase()}`,
      companyId: arcelorCompany ? arcelorCompany.id : "comp-arcelor",
      stockTons: Number(body.stockTons),
      pricePerTon: Number(body.pricePerTon),
    };
    store.products.push(newProduct);
    saveLocalStore(store);
    return newProduct;
  }

  // 5. UPDATE STOCK
  const stockUpdateMatch = cleanUrl.match(/^\/api\/products\/(.+)\/stock$/);
  if (stockUpdateMatch && method === "PATCH") {
    const id = stockUpdateMatch[1];
    const product = store.products.find((p: any) => p.id === id);
    if (!product) {
      throw new Error("Produto não encontrado.");
    }
    product.stockTons = Number(body.stockTons);
    saveLocalStore(store);
    return product;
  }

  // 6. TRANSACTIONS LIST
  if (cleanUrl === "/api/transactions" && method === "GET") {
    const compId = queryParams.get("companyId");
    if (compId) {
      return store.transactions.filter((t: any) => t.buyerCompanyId === compId || compId === "comp-arcelor");
    }
    return store.transactions;
  }

  // 7. CREATE TRANSACTION
  if (cleanUrl === "/api/transactions" && method === "POST") {
    const { buyerCompanyId, productId, quantityTons, totalPrice } = body;
    const product = store.products.find((p: any) => p.id === productId);
    if (!product) {
      throw new Error("Lote de subproduto não encontrado na usina.");
    }
    const requestedTons = Number(quantityTons);
    if (product.stockTons < requestedTons) {
      throw new Error(`Estoque insuficiente de ${product.name} na usina. Disponível: ${product.stockTons} t`);
    }
    product.stockTons -= requestedTons;

    const tx = {
      id: `ORD-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
      buyerCompanyId,
      productId,
      quantityTons: requestedTons,
      totalPrice: Number(totalPrice),
      status: "CRIADO",
      createdAt: new Date().toISOString(),
    };
    store.transactions.push(tx);
    saveLocalStore(store);
    return tx;
  }

  // 8. UPDATE TRANSACTION STATUS
  const txStatusMatch = cleanUrl.match(/^\/api\/transactions\/(.+)\/status$/);
  if (txStatusMatch && method === "PATCH") {
    const id = txStatusMatch[1];
    const { status } = body;
    const tx = store.transactions.find((t: any) => t.id === id);
    if (!tx) {
      throw new Error("Transação não encontrada.");
    }
    const previousStatus = tx.status;
    tx.status = status;

    // If status is promoted to CONCLUIDO, let's add CO2 credits for buyer!
    if (status === "CONCLUIDO" && previousStatus !== "CONCLUIDO") {
      const company = store.companies.find((c: any) => c.id === tx.buyerCompanyId);
      if (company) {
        // Increment CO2 savings based on ton quantity (1.2 tons CO2 saved per ton of mineral aggregate substitution)
        const savedEmission = Number(tx.quantityTons) * 1.2;
        company.co2_credits = Number((company.co2_credits + savedEmission).toFixed(1));
      }
    }

    saveLocalStore(store);
    return tx;
  }

  // 9. LOGISTICS BY TRANSACTION
  const logMatch = cleanUrl.match(/^\/api\/logistics\/(.+)$/);
  if (logMatch) {
    const transactionId = logMatch[1];
    if (method === "GET") {
      const log = store.logistics.find((l: any) => l.transactionId === transactionId);
      if (!log) {
        throw new Error("Roteiro logístico de despacho não gerado para esta ordem.");
      }
      return log;
    }
    if (method === "POST") {
      const { carrierName, licensePlate, mtrDocNumber } = body;
      const finalMtr = mtrDocNumber || `MTR-${Math.floor(100000 + Math.random() * 900000)}-${transactionId.split("-")[1] || "AM"}`;
      let log = store.logistics.find((l: any) => l.transactionId === transactionId);
      if (log) {
        log.carrierName = carrierName;
        log.licensePlate = licensePlate;
        log.mtrDocNumber = finalMtr;
      } else {
        log = {
          id: `LOG-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
          transactionId,
          carrierName,
          licensePlate,
          status: "AGUARDANDO_VEICULO",
          mtrDocNumber: finalMtr,
        };
        store.logistics.push(log);
      }

      // Automatically transition tx status to EM_CARREGAMENTO if needed
      const tx = store.transactions.find((t: any) => t.id === transactionId);
      if (tx && tx.status === "CRIADO") {
        tx.status = "EM_CARREGAMENTO";
      }

      saveLocalStore(store);
      return log;
    }
  }

  // 10. COMPANY STATS
  if (cleanUrl === "/api/companies/stats" && method === "GET") {
    const compId = queryParams.get("companyId");
    const company = store.companies.find((c: any) => c.id === compId);
    if (!company) {
      throw new Error("Empresa parceira não encontrada.");
    }
    const companyTxs = store.transactions.filter((t: any) => t.buyerCompanyId === compId);
    return {
      totalCO2Saved: company.co2_credits,
      carbonCreditBalance: Math.floor(company.co2_credits * 1.5),
      ordersCount: companyTxs.length,
    };
  }

  throw new Error("404 endpoint not found locally.");
}

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const isVercel = typeof window !== "undefined" && 
    (window.location.hostname.endsWith("vercel.app") || 
     window.location.hostname.endsWith("netlify.app") || 
     window.location.hostname.endsWith("github.io"));

  if (isVercel) {
    try {
      console.log(`[Vercel Hub Eco] Directing request ${url} directly to Client-Side Local DB`);
      return localRequest(url, options) as T;
    } catch (e: any) {
      throw new Error(e.message || "Erro no processamento local");
    }
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    if (!response.ok) {
      if (response.status === 405 || response.status === 404) {
        console.warn(`[Hub Eco] Server returned ${response.status}. Falling back to Client-Side Local DB.`);
        return localRequest(url, options) as T;
      }
      
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
    }

    return response.json() as Promise<T>;
  } catch (err: any) {
    console.warn("[Hub Eco] Network failure or server is unreachable. Falling back to Client-Side Local DB.", err);
    try {
      return localRequest(url, options) as T;
    } catch (localErr: any) {
      throw new Error(localErr.message || err.message);
    }
  }
}

export const apiService = {
  // Authentication
  async login(email: string): Promise<{ user: User; company: Company }> {
    const res = await request<{ user: User; company: Company }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
    saveSession(res.user, res.company);
    return res;
  },

  async register(data: {
    companyName: string;
    cnpj: string;
    companyType: "PRODUTOR" | "COMPRADOR" | "TRANSPORTADOR";
    userName: string;
    userEmail: string;
    userRole: string;
  }): Promise<{ user: User; company: Company }> {
    const res = await request<{ user: User; company: Company }>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
    saveSession(res.user, res.company);
    return res;
  },

  // Products
  async getProducts(): Promise<Product[]> {
    return request<Product[]>("/api/products");
  },

  async createProduct(product: Omit<Product, "id" | "companyId">): Promise<Product> {
    return request<Product>("/api/products", {
      method: "POST",
      body: JSON.stringify(product),
    });
  },

  async updateStock(id: string, stockTons: number): Promise<Product> {
    return request<Product>(`/api/products/${id}/stock`, {
      method: "PATCH",
      body: JSON.stringify({ stockTons }),
    });
  },

  // Transactions
  async getTransactions(companyId: string): Promise<Transaction[]> {
    return request<Transaction[]>(`/api/transactions?companyId=${companyId}`);
  },

  async createTransaction(data: {
    buyerCompanyId: string;
    productId: string;
    quantityTons: number;
    totalPrice: number;
  }): Promise<Transaction> {
    return request<Transaction>("/api/transactions", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async updateTransactionStatus(id: string, status: string): Promise<Transaction> {
    return request<Transaction>(`/api/transactions/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  },

  // Logistics
  async getLogistics(transactionId: string): Promise<Logistics> {
    return request<Logistics>(`/api/logistics/${transactionId}`);
  },

  async createLogistics(
    transactionId: string,
    data: { carrierName: string; licensePlate: string; mtrDocNumber: string }
  ): Promise<Logistics> {
    return request<Logistics>(`/api/logistics/${transactionId}`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // Analytics/Company credits
  async getStats(companyId: string): Promise<{ totalCO2Saved: number; carbonCreditBalance: number; ordersCount: number }> {
    return request<{ totalCO2Saved: number; carbonCreditBalance: number; ordersCount: number }>(
      `/api/companies/stats?companyId=${companyId}`
    );
  },
};

