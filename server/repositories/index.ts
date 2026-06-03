import { readDatabase, writeDatabase } from "../database/db";
import { User, Company, Product, Transaction, Logistics } from "../../src/types";

export const UserRepository = {
  findByEmail(email: string): User | undefined {
    const db = readDatabase();
    return db.users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
  },

  findById(id: string): User | undefined {
    const db = readDatabase();
    return db.users.find(u => u.id === id);
  },

  save(user: User): User {
    const db = readDatabase();
    const index = db.users.findIndex(u => u.id === user.id);
    if (index >= 0) {
      db.users[index] = user;
    } else {
      db.users.push(user);
    }
    writeDatabase(db);
    return user;
  }
};

export const CompanyRepository = {
  findById(id: string): Company | undefined {
    const db = readDatabase();
    return db.companies.find(c => c.id === id);
  },

  findByCnpj(cnpj: string): Company | undefined {
    const db = readDatabase();
    return db.companies.find(c => c.cnpj === cnpj.trim());
  },

  save(company: Company): Company {
    const db = readDatabase();
    const index = db.companies.findIndex(c => c.id === company.id);
    if (index >= 0) {
      db.companies[index] = company;
    } else {
      db.companies.push(company);
    }
    writeDatabase(db);
    return company;
  },

  updateCO2Credits(id: string, tonsSaved: number): Company {
    const db = readDatabase();
    const company = db.companies.find(c => c.id === id);
    if (company) {
      company.co2_credits = Number((company.co2_credits + tonsSaved).toFixed(2));
      writeDatabase(db);
      return company;
    }
    throw new Error(`Company ${id} not found`);
  }
};

export const ProductRepository = {
  findAll(): Product[] {
    const db = readDatabase();
    return db.products;
  },

  findById(id: string): Product | undefined {
    const db = readDatabase();
    return db.products.find(p => p.id === id);
  },

  save(product: Product): Product {
    const db = readDatabase();
    const index = db.products.findIndex(p => p.id === product.id);
    if (index >= 0) {
      db.products[index] = product;
    } else {
      db.products.push(product);
    }
    writeDatabase(db);
    return product;
  },

  updateStock(id: string, newStockTons: number): Product {
    const db = readDatabase();
    const product = db.products.find(p => p.id === id);
    if (product) {
      product.stockTons = Number(newStockTons.toFixed(2));
      writeDatabase(db);
      return product;
    }
    throw new Error(`Product ${id} not found`);
  }
};

export const TransactionRepository = {
  findAll(companyId?: string): Transaction[] {
    const db = readDatabase();
    let txs = db.transactions;

    // Filter transactions to user's company or show all if admin
    if (companyId) {
      const company = CompanyRepository.findById(companyId);
      if (company && company.type !== "PRODUTOR") {
        txs = txs.filter(t => t.buyerCompanyId === companyId);
      }
    }

    // Map company names and product names for UI density
    return txs.map(t => {
      const buyer = CompanyRepository.findById(t.buyerCompanyId);
      const prod = ProductRepository.findById(t.productId);
      return {
        ...t,
        buyerCompanyName: buyer ? buyer.name : "Empresa Compradora",
        productName: prod ? prod.name : "Subproduto Siderúrgico",
      };
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  findById(id: string): Transaction | undefined {
    const db = readDatabase();
    return db.transactions.find(t => t.id === id);
  },

  save(transaction: Transaction): Transaction {
    const db = readDatabase();
    const index = db.transactions.findIndex(t => t.id === transaction.id);
    if (index >= 0) {
      db.transactions[index] = transaction;
    } else {
      db.transactions.push(transaction);
    }
    writeDatabase(db);
    return transaction;
  },

  updateStatus(id: string, status: Transaction["status"]): Transaction {
    const db = readDatabase();
    const tx = db.transactions.find(t => t.id === id);
    if (tx) {
      const oldStatus = tx.status;
      tx.status = status;

      // When a transaction moves to "CONCLUIDO", calculate CO2 SAVINGS!
      // Formula: Average of 80kg (0.08 tons) of CO2 saved per ton of byproduct recycled.
      if (status === "CONCLUIDO" && oldStatus !== "CONCLUIDO") {
        const product = db.products.find(p => p.id === tx.productId);
        const savedEmissionTons = Number((tx.quantityTons * 0.08).toFixed(2));
        
        // Reward CO2 credits to buyer
        const buyer = db.companies.find(c => c.id === tx.buyerCompanyId);
        if (buyer) {
          buyer.co2_credits = Number((buyer.co2_credits + savedEmissionTons).toFixed(2));
        }

        // Also add credits to ArcelorMittal as producer
        const producer = db.companies.find(c => c.type === "PRODUTOR");
        if (producer) {
          producer.co2_credits = Number((producer.co2_credits + savedEmissionTons).toFixed(2));
        }
      }

      writeDatabase(db);
      return tx;
    }
    throw new Error(`Transaction ${id} not found`);
  }
};

export const LogisticsRepository = {
  findByTransactionId(transactionId: string): Logistics | undefined {
    const db = readDatabase();
    return db.logistics.find(l => l.transactionId === transactionId);
  },

  save(logistics: Logistics): Logistics {
    const db = readDatabase();
    const index = db.logistics.findIndex(l => l.id === logistics.id);
    if (index >= 0) {
      db.logistics[index] = logistics;
    } else {
      db.logistics.push(logistics);
    }
    writeDatabase(db);
    return logistics;
  }
};
