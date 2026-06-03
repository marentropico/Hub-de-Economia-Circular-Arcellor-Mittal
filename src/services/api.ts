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

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
  }

  return response.json() as Promise<T>;
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
