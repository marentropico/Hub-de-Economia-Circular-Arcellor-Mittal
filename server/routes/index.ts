import { Router, Request, Response } from "express";
import {
  UserRepository,
  CompanyRepository,
  ProductRepository,
  TransactionRepository,
  LogisticsRepository,
} from "../repositories/index";
import { Product, Transaction, Logistics, User, Company } from "../../src/types";

const router = Router();

// Help helper for unique ID generations
const generateId = (prefix: string) => `${prefix}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

// ----------------------------------------------------
// 🔐 AUTHENTICATION ENDPOINTS
// ----------------------------------------------------

router.post("/auth/login", (req: Request, res: Response): void => {
  const { email } = req.body;
  if (!email) {
    res.status(400).json({ error: "O e-mail é obrigatório." });
    return;
  }

  const user = UserRepository.findByEmail(email);
  if (!user) {
    res.status(401).json({ error: "E-mail corporativo não registrado ou não homologado no Hub." });
    return;
  }

  const company = CompanyRepository.findById(user.companyId);
  if (!company) {
    res.status(404).json({ error: "Empresa associada a este usuário não encontrada." });
    return;
  }

  res.json({ user, company });
});

router.post("/auth/register", (req: Request, res: Response): void => {
  const { companyName, cnpj, companyType, userName, userEmail, userRole } = req.body;

  if (!companyName || !cnpj || !companyType || !userName || !userEmail || !userRole) {
    res.status(400).json({ error: "Muitos campos obrigatórios estão ausentes." });
    return;
  }

  // Check if email already registered
  if (UserRepository.findByEmail(userEmail)) {
    res.status(400).json({ error: "Este e-mail corporativo já está cadastrado no sistema." });
    return;
  }

  // Check if company already registered, or create a new one
  let company = CompanyRepository.findByCnpj(cnpj);
  if (!company) {
    company = CompanyRepository.save({
      id: generateId("comp"),
      name: companyName,
      cnpj,
      type: companyType,
      status: "ATIVO", // In a real system starts as candidate status, here auto-approved for frictionless demo
      co2_credits: 0,
    });
  }

  // Save the user linked to this company
  const user = UserRepository.save({
    id: generateId("user"),
    companyId: company.id,
    name: userName,
    email: userEmail,
    role: userRole as any,
  });

  res.status(201).json({ user, company });
});

// ----------------------------------------------------
// 🧱 PRODUCT PLAZA ENDPOINTS
// ----------------------------------------------------

router.get("/products", (req: Request, res: Response): void => {
  const products = ProductRepository.findAll();
  res.json(products);
});

router.post("/products", (req: Request, res: Response): void => {
  const productData: Omit<Product, "id" | "companyId"> = req.body;

  if (!productData.name || !productData.category || !productData.pricePerTon || !productData.stockTons || !productData.unitLocation) {
    res.status(400).json({ error: "Preencha todos os dados industriais obrigatórios." });
    return;
  }

  const arcelorCompany = CompanyRepository.findById("comp-arcelor");
  if (!arcelorCompany) {
    res.status(500).json({ error: "Não foi possível carregar a produtora controladora ArcelorMittal." });
    return;
  }

  const newProduct = ProductRepository.save({
    ...productData,
    id: generateId("prod"),
    companyId: arcelorCompany.id,
    stockTons: Number(productData.stockTons),
    pricePerTon: Number(productData.pricePerTon),
  });

  res.status(201).json(newProduct);
});

router.patch("/products/:id/stock", (req: Request, res: Response): void => {
  const { id } = req.params;
  const { stockTons } = req.body;

  if (stockTons === undefined || stockTons < 0) {
    res.status(400).json({ error: "Estoque em toneladas deve ser de valor positivo." });
    return;
  }

  try {
    const updated = ProductRepository.updateStock(id, Number(stockTons));
    res.json(updated);
  } catch (err: any) {
    res.status(404).json({ error: err.message });
  }
});

// ----------------------------------------------------
// 🤝 TRANSACTION OPERATIONS ENDPOINTS
// ----------------------------------------------------

router.get("/transactions", (req: Request, res: Response): void => {
  const { companyId } = req.query;
  const list = TransactionRepository.findAll(companyId as string || undefined);
  res.json(list);
});

router.post("/transactions", (req: Request, res: Response): void => {
  const { buyerCompanyId, productId, quantityTons, totalPrice } = req.body;

  if (!buyerCompanyId || !productId || !quantityTons || !totalPrice) {
    res.status(400).json({ error: "Dados da ordem comercial incompletos." });
    return;
  }

  const product = ProductRepository.findById(productId);
  if (!product) {
    res.status(404).json({ error: "Lote de subproduto não encontrado na usina." });
    return;
  }

  const requestedTons = Number(quantityTons);
  if (requestedTons <= 0) {
    res.status(400).json({ error: "Quantidade em toneladas inválida." });
    return;
  }

  if (product.stockTons < requestedTons) {
    res.status(400).json({ error: `Estoque insuficiente de ${product.name} na usina. Disponível: ${product.stockTons} t` });
    return;
  }

  // Deduct from immediate stock! Relational coherence.
  ProductRepository.updateStock(product.id, product.stockTons - requestedTons);

  // Save transaction
  const tx = TransactionRepository.save({
    id: generateId("ORD"),
    buyerCompanyId,
    productId,
    quantityTons: requestedTons,
    totalPrice: Number(totalPrice),
    status: "CRIADO",
    createdAt: new Date().toISOString(),
  });

  res.status(201).json(tx);
});

router.patch("/transactions/:id/status", (req: Request, res: Response): void => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    res.status(400).json({ error: "Novo estado do pedido não informado." });
    return;
  }

  try {
    const updatedTx = TransactionRepository.updateStatus(id, status);
    res.json(updatedTx);
  } catch (err: any) {
    res.status(404).json({ error: err.message });
  }
});

// ----------------------------------------------------
// 🚚 LOGISTICS DISPATCH ENDPOINTS
// ----------------------------------------------------

router.get("/logistics/:transactionId", (req: Request, res: Response): void => {
  const { transactionId } = req.params;
  const logistics = LogisticsRepository.findByTransactionId(transactionId);
  if (!logistics) {
    res.status(404).json({ error: "Roteiro logístico de despacho não gerado para esta ordem." });
    return;
  }
  res.json(logistics);
});

router.post("/logistics/:transactionId", (req: Request, res: Response): void => {
  const { transactionId } = req.params;
  const { carrierName, licensePlate, mtrDocNumber } = req.body;

  if (!carrierName || !licensePlate) {
    res.status(400).json({ error: "Transportadora e Placa do caminhão de carga são obrigatórios." });
    return;
  }

  // Generate automated environmental license MTR identifier if not supplied
  const finalMtr = mtrDocNumber || `MTR-${Math.floor(100000 + Math.random() * 900000)}-${transactionId.split("-")[1] || "AM"}`;

  const currentLog = LogisticsRepository.findByTransactionId(transactionId);

  const logistics = LogisticsRepository.save({
    id: currentLog ? currentLog.id : generateId("LOG"),
    transactionId,
    carrierName,
    licensePlate,
    status: currentLog ? currentLog.status : "AGUARDANDO_VEICULO",
    mtrDocNumber: finalMtr,
  });

  // Promote state of the transaction to loaded/loaded-in-transit
  const tx = TransactionRepository.findById(transactionId);
  if (tx && tx.status === "CRIADO") {
    TransactionRepository.updateStatus(transactionId, "EM_CARREGAMENTO");
  }

  res.json(logistics);
});

// ----------------------------------------------------
// 📊 METRICS AND GREEN GRADES ENDPOINTS
// ----------------------------------------------------

router.get("/companies/stats", (req: Request, res: Response): void => {
  const { companyId } = req.query;

  if (!companyId) {
    res.status(400).json({ error: "Identificador de empresa ausente." });
    return;
  }

  const company = CompanyRepository.findById(companyId as string);
  if (!company) {
    res.status(404).json({ error: "Empresa parceira não encontrada." });
    return;
  }

  const companyTxs = TransactionRepository.findAll(companyId as string);
  const completedCount = companyTxs.filter(t => t.status === "CONCLUIDO").length;

  res.json({
    totalCO2Saved: company.co2_credits,
    carbonCreditBalance: Math.floor(company.co2_credits * 1.5), // Formula: credit balance multiplier
    ordersCount: companyTxs.length,
  });
});

export default router;
