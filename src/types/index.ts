export type CompanyType = "PRODUTOR" | "COMPRADOR" | "TRANSPORTADOR";

export interface Company {
  id: string;
  name: string;
  cnpj: string;
  type: CompanyType;
  status: "ATIVO" | "PENDENTE_HOMOLOGACAO";
  co2_credits: number; // accumulated ton CO2 emissions saved
}

export type UserRole = "ADMIN_ARCELOR" | "OPERATOR_BUYER" | "LOGISTICS_PARTNER";

export interface User {
  id: string;
  companyId: string;
  name: string;
  email: string;
  role: UserRole;
  companyName?: string;
  companyType?: CompanyType;
}

export type ProductCategory = "ESCORIA" | "PO_FINOS" | "LAMA" | "CAREPA" | "OUTROS";

export interface Product {
  id: string;
  companyId: string;
  name: string;
  category: ProductCategory;
  description: string;
  chemicalSpec: Record<string, number>; // e.g. { CaO: 45, SiO2: 15, Fe2O3: 22 }
  pricePerTon: number;
  stockTons: number;
  unitLocation: string; // plant of origin
  safetyDocUrl?: string; // FDSR/FISPQ URL
}

export type TransactionStatus = "CRIADO" | "APROVADO_ARCELOR" | "EM_CARREGAMENTO" | "CONCLUIDO" | "CANCELADO";

export interface Transaction {
  id: string;
  buyerCompanyId: string;
  buyerCompanyName?: string;
  productId: string;
  productName?: string;
  quantityTons: number;
  totalPrice: number;
  status: TransactionStatus;
  createdAt: string;
}

export type LogisticsStatus = "AGUARDANDO_VEICULO" | "EM_TRANSITO" | "ENTREGUE";

export interface Logistics {
  id: string;
  transactionId: string;
  carrierName: string;
  licensePlate: string;
  status: LogisticsStatus;
  mtrDocNumber: string;
}

export interface ApiAuthResponse {
  user: User;
  company: Company;
}
