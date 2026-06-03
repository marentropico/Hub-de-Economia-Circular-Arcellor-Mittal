# Arquitetura Técnica e Regras de Negócio

Este documento descreve as estruturas técnicas fundamentais do **Hub de Economia Circular ArcelorMittal**, detalhando o modelo de persistência, a estrutura do código-fonte, as rotas de comunicação (API REST) e o mapeamento de telas.

---

## 1. Esquema do Banco de Dados (SQLite)

O banco de dados do Hub utiliza uma arquitetura relacional clássica para assegurar dados íntegros e rastreabilidade nos negócios B2B. As tabelas chaves estão organizadas no diagrama relacional conceitual abaixo:

```
+--------------------+        +--------------------+        +-------------------------+
|     COMPANIES      |        |      PRODUCTS      |        |        TRANSACTIONS     |
+--------------------+        +--------------------+        +-------------------------+
| pk_id (TEXT, PK)   |        | pk_id (TEXT, PK)   |        | pk_id (TEXT, PK)        |
| name (TEXT)        | <----+ | fk_company (TEXT)  | <----+ | fk_buyer_company (TEXT) |
| cnpj (TEXT, UNIQUE)|        | name (TEXT)        |        | fk_product (TEXT)       |
| type (TEXT)        |        | category (TEXT)    |        | quantity_tons (REAL)    |
| status (TEXT)      |        | chemical_spec (TEXT|        | total_price (REAL)      |
| co2_credits (REAL) |        | price_per_ton (REAL|        | status (TEXT)           |
+--------------------+        | stock_tons (REAL)  |        | created_at (TEXT)       |
          ^                   | unit_location (TEXT|        +-------------------------+
          |                   | safety_doc_url(TEXT|                     |
+--------------------+        +--------------------+                     v
|       USERS        |                                      +-------------------------+
+--------------------+                                      |        LOGISTICS        |
| pk_id (TEXT, PK)   |                                      +-------------------------+
| fk_company (TEXT)  |                                      | pk_id (TEXT, PK)        |
| name (TEXT)        |                                      | fk_transaction (TEXT)   |
| email (TEXT, UNI)  |                                      | carrier_name (TEXT)     |
| password (TEXT)    |                                      | license_plate (TEXT)    |
| role (TEXT)        |                                      | status (TEXT)           |
+--------------------+                                      | mtr_doc_number (TEXT)   |
                                                            +-------------------------+
```

### Especificação de Tabelas
1. **`companies` (Empresas parceiras):**
   * `id` (VARCHAR PRIMARY KEY) - UUID de identificação único.
   * `name` (VARCHAR) - Razão social.
   * `cnpj` (VARCHAR UNIQUE) - CNPJ formatado.
   * `type` (VARCHAR) - Categoria de mercado (`PRODUTOR` | `COMPRADOR` | `TRANSPORTADOR`).
   * `status` (VARCHAR) - Status cadastral (`ATIVO` | `PENDENTE_HOMOLOGACAO`).
   * `co2_credits` (REAL DEFAULT 0) - Créditos ESG ou tonelagem de CO₂ evitado acumulado.

2. **`users` (Acessos dos representantes corporativos):**
   * `id` (VARCHAR PRIMARY KEY) - UUID de identificação.
   * `company_id` (VARCHAR FOREIGN KEY references `companies(id)`) - Vínculo empregatício.
   * `name` (VARCHAR) - Nome completo do operador.
   * `email` (VARCHAR UNIQUE) - Email institucional (login).
   * `password` (VARCHAR) - Hash de senha seguro para autenticação.
   * `role` (VARCHAR) - Nível de permissão (`ADMIN_ARCELOR` | `OPERATOR_BUYER` | `LOGISTICS_PARTNER`).

3. **`products` (Subprodutos siderúrgicos cadastrados):**
   * `id` (VARCHAR PRIMARY KEY)- ID único do produto.
   * `company_id` (VARCHAR FOREIGN KEY references `companies(id)`) - Empresa produtora do lote.
   * `name` (VARCHAR) - Denominação técnica (Ex: *Escória de Aciaria de convertedor LD - tipo britada*).
   * `category` (VARCHAR) - Categoria técnica (`ESCORIA`, `PO_FINOS`, `LAMA`, `CAREPA`, `OUTROS`).
   * `description` (TEXT) - Ficha descritiva com propriedades físicas de granulometria e umidade.
   * `chemical_spec` (TEXT) - Composição química formatada em JSON (Ex: `{"CaO": 45, "SiO2": 15, "Fe2O3": 22}`).
   * `price_per_ton` (REAL) - Preço em reais por tonelada ex-works.
   * `stock_tons` (REAL) - Disponibilidade imediata em toneladas.
   * `unit_location` (VARCHAR) - Planta produtora de origem (Ex: *Planta de Tubarão*, *Planta de Monlevade*).
   * `safety_doc_url` (VARCHAR) - Link para ficha de dados de segurança de resíduos químicos (FDSR/FISPQ).

4. **`transactions` (Pedidos de compra e contratos de fornecimento):**
   * `id` (VARCHAR PRIMARY KEY) - Número do Pedido de Compra.
   * `buyer_company_id` (VARCHAR FOREIGN KEY references `companies(id)`) - Empresa compradora.
   * `product_id` (VARCHAR FOREIGN KEY references `products(id)`) - Subproduto negociado.
   * `quantity_tons` (REAL) - Volume total solicitado em toneladas.
   * `total_price` (REAL) - Valor final da transação financeira.
   * `status` (VARCHAR) - Situação do pedido (`CRIADO` | `APROVADO_ARCELOR` | `EM_CARREGAMENTO` | `CONCLUIDO` | `CANCELADO`).
   * `created_at` (TIMESTAMP) - Data e hora de formalização da operação.

5. **`logistics` (Despacho físico e licenciamento de transporte):**
   * `id` (VARCHAR PRIMARY KEY) - Identificador do lote logístico.
   * `transaction_id` (VARCHAR FOREIGN KEY references `transactions(id)`) - Pedido associado.
   * `carrier_name` (VARCHAR) - Razão social do transportador físico.
   * `license_plate` (VARCHAR) - Placa do veículo transportador de carga.
   * `status` (VARCHAR) - Status da logística (`AGUARDANDO_VEICULO` | `EM_TRANSITO` | `ENTREGUE`).
   * `mtr_doc_number` (VARCHAR) - Código do manifesto de transporte de resíduos (MTR emitido no SINIR).

---

## 2. Arquitetura de Pastas de Código-Fonte (Clean Architecture)

A organização interna do projeto segue uma estrutura baseada em camadas que isola regras de negócios de infraestruturas voláteis.

```
/src
├── components/          # Componentes visuais atômicos/reutilizáveis (MUI + Tailwind)
│   ├── ui/              # Elementos primitivos (botões customizados, inputs, cards)
│   ├── Layout.tsx       # Estrutura padrão de navegação e rodopé responsivos
│   └── MetricCard.tsx   # Card reutilizável de monitoramento ESG
├── views/               # Telas completas da aplicação (Front-end)
│   ├── Dashboard.tsx    # Centro operacional ESG com gráficos dinâmicos de CO₂ e estoque
│   ├── ProductCatalog.tsx# Vitrine de coprodutos, filtros industriais e cotações
│   ├── OrderHistory.tsx # Listagem de ordens B2B para compradores e administradores
│   ├── AdminPanel.tsx   # Área restrita da Arcelor para gerenciar estoque e contratos
│   └── AuthPage.tsx     # Tela de login corporativo e cadastro de empresas (onboarding)
├── services/            # Clientes HTTP, chamadas de API e utilitários de estado local
│   ├── api.ts           # Cliente HTTP pré-configurado com as rotas
│   └── auth.ts          # Gerenciamento de credenciais e sessão local (B2B tokens)
├── types/               # Tipagem estrutural estrita do TypeScript
│   └── index.ts         # Contratos de interfaces corporativas e DTOs
├── index.css            # Folha de estilos tailwindcss unificada
├── App.tsx              # Componente principal unindo roteador inteligente e telas
└── main.tsx             # Ponto de entrada de renderização do React v19
```

No lado servidor, visando solidez no backend, o servidor express adota um modelo estruturado:
```
/server
├── database/            # Configurações do banco SQLite e mocks de sementes (seeds)
│   └── db.ts            # Inicializador e execuções de comandos SQL nativos
├── repositories/        # Acesso a dados (Data Access Objects) por camadas de repositório
│   ├── ProductRepository.ts
│   ├── CompanyRepository.ts
│   └── UserRepository.ts
├── routes/              # Roteamentos unificados de endpoints express
│   └── index.ts
└── server.ts            # Inicialização geral do servidor express e integração com Vite
```

---

## 3. Mapeamento de Rotas da API REST

A comunicação é estruturada via endpoints modulares estruturados no prefixo `/api/*`:

### 🔐 Autenticação e Empresas (B2B Onboarding)
* `POST /api/auth/login` → Autentica representantes e retorna dados corporativos + perfil de acesso.
* `POST /api/auth/register` → Realiza o cadastramento rápido de nova empresa parceira no Hub de Economia Circular.
* `GET /api/companies/stats` → Fornece dados agregados para cálculo ESG de CO₂ evitado por empresa produtora/compradora.

### 🧱 Catálogo de Coprodutos Industriais
* `GET /api/products` → Retorna o catálogo completo de materiais cadastrados, aceitando query-params de filtro (`category`, `unit_location`, `search`).
* `POST /api/products` → Criação de novo lote/material (Acesso restrito: `ADMIN_ARCELOR`).
* `PATCH /api/products/:id/stock` → Ajuste de toneladas remanescentes em tempo real pós negociações.

### 🤝 Negociações, Pedidos e Logística
* `POST /api/transactions` → Instaura uma cotação/pedido formal B2B contra um subproduto selecionado (indica tonelagem, transporte e agendamento).
* `GET /api/transactions` → Histórico de relacionamento comercial (Filtra por empresa ou usuário conectado).
* `PATCH /api/transactions/:id/status` → Altera etapas do pedido (`APROVADO_ARCELOR`, `EM_CARREGAMENTO`, `CONCLUIDO`).
* `POST /api/logistics/:transactionId` → Vincula manifestos de transportadoras associadas (MTR) fornecendo placas, transportadora e data prevista.

---

## 4. Mapeamento de Interfaces do Front-end

O Hub será composto essencialmente por 5 fluxos funcionais amarrados visualmente na aplicação principal:

1. **Onboarding / Login Corporativo (`/auth`):**
   * Formulário elegante projetado para CNPJs e e-mails homologados.
2. **Dashboard de Visão Geral (`/`):**
   * Central ESG: Gráficos estruturados em barramento de descarbonização, emissões salvas, cotações abertas, fluxos volumétricos em trânsito e resumo operacional.
3. **Vitrine Técnica (`/catalogo`):**
   * Cards densos contendo detalhes de granulometria, localização geográfica, seletor de transporte próprio ou ArcelorMittal, composição química expressa interativamente em gráficos de pizza, cálculo instantâneo do valor de compra por massa, e download simulado de FISPQ/FDSR.
4. **Painel de Ordens e Contratos (`/pedidos`):**
   * Grade detalhada estilo planilha corporativa com status colorido para cada lote de subproduto encomendado.
5. **Painel do Administrador Siderúrgico (`/admin`):**
   * Configuração de pátios geradores, parametrização técnica do preço de escória por tonelada e controle do recebimento logístico de caminhões.
