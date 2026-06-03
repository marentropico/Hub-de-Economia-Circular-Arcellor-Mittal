import fs from "fs";
import path from "path";
import { Company, User, Product, Transaction, Logistics } from "../../src/types";

const DB_FILE_PATH = path.join(process.cwd(), "server", "database", "db.json");

interface DataStore {
  companies: Company[];
  users: User[];
  products: Product[];
  transactions: Transaction[];
  logistics: Logistics[];
}

const defaultData: DataStore = {
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

function ensureDirExists(filePath: string) {
  const dirname = path.dirname(filePath);
  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname, { recursive: true });
  }
}

export function initDatabase() {
  ensureDirExists(DB_FILE_PATH);
  if (!fs.existsSync(DB_FILE_PATH)) {
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(defaultData, null, 2), "utf-8");
    console.log("Database file initialized successfully at:", DB_FILE_PATH);
  } else {
    // Validate if the loaded JSON has essential contents, if not parse or write
    try {
      const content = fs.readFileSync(DB_FILE_PATH, "utf-8");
      JSON.parse(content);
    } catch {
      fs.writeFileSync(DB_FILE_PATH, JSON.stringify(defaultData, null, 2), "utf-8");
      console.log("Corrupted database file wiped and re-repopulated at:", DB_FILE_PATH);
    }
  }
}

export function readDatabase(): DataStore {
  initDatabase();
  const raw = fs.readFileSync(DB_FILE_PATH, "utf-8");
  return JSON.parse(raw);
}

export function writeDatabase(data: DataStore) {
  ensureDirExists(DB_FILE_PATH);
  fs.writeFileSync(DB_FILE_PATH, JSON.stringify(data, null, 2), "utf-8");
}
