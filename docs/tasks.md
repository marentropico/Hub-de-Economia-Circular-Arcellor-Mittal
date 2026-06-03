# Backlog Técnico de Micro-Tarefas (Fase 1: MVP)

Este arquivo serve como o **roteiro de execução sequencial** para a criação do MVP do Hub de Economia Circular ArcelorMittal. Cada tarefa é formulada como um **prompt robusto** que pode ser consumido diretamente por assistentes de IA para geração livre de bugs.

---

## checklist Geral de Tarefas de Infraestrutura e Código-Fonte

Siga a ordem estrita recomendada abaixo para manter a consistência e integridade do projeto:

### 1. Preparação de Estrutura de Pastas e Scripts
* [ ] **Tarefa 1.1: Inicializar Estrutura Física de Pastas do Servidor e Cliente**
  * *Prompt corporativo:* "Crie o esqueleto de diretórios no projeto seguindo o padrão de Clean Architecture e de modularidade para Express e React descritos na documentação do projeto. No backend, certifique-se de criar `/server/database`, `/server/repositories` e `/server/routes`. Na pasta do cliente `/src`, estruture as subpastas `/src/components`, `/src/views`, `/src/services` e `/src/types` para isolar responsabilidades."

* [ ] **Tarefa 1.2: Configurar Instalação Integrada de Dependências e Modificações de Script de Inicialização**
  * *Prompt corporativo:* "Altere os scripts em `package.json` para suportar o desenvolvimento full-stack unificado. Configure o script `"dev": "tsx server.ts"` e os comandos de build adequadamente: `"build": "vite build && esbuild server.ts --bundle --platform=node --format=cjs --packages=external --sourcemap --outfile=dist/server.cjs"` e `"start": "node dist/server.cjs"`. Instale os pacotes `@mui/material`, `@emotion/react`, `@emotion/styled` usando a ferramenta de pacotes apropriada antes do início de qualquer escrita visual."

---

### 2. Infraestrutura de Banco de Dados e Camada de Acesso a Dados
* [ ] **Tarefa 2.1: Implementar o Inicializador do Banco de Dados SQLite (`/server/database/db.ts`)**
  * *Prompt corporativo:* "Crie o arquivo `/server/database/db.ts` utilizando o driver SQLite. Ele deve estruturar as queries DDL criadoras das tabelas relacionais (`companies`, `users`, `products`, `transactions`, `logistics`) com todas as integridades de chave estrangeira, chaves únicas de CNPJ e índices necessários. Adicione também uma função de população de dados sementes (seed) contendo as principais empresas operadoras fictícias, credenciais iniciais criptografadas de login e cinco coprodutos para testes."

* [ ] **Tarefa 2.2: Implementar Camadas de Repositórios de Acesso a Dados no Servidor**
  * *Prompt corporativo:* "Construa os arquivos estruturados em `/server/repositories/` para mapear o acesso aos modelos de dados. Crie `ProductRepository.ts`, `CompanyRepository.ts` e `UserRepository.ts`. Cada repositório deve expor métodos de leitura filtrada, escrita segura e remoção/atualização por conexões atômicas SQL limpas e tipadas para evitar falhas."

---

### 3. Rotas, Servidor e Controladores da API REST
* [ ] **Tarefa 3.1: Configurar Roteadores Principais e Handlers Express (`/server/routes/index.ts` e `/server/server.ts`)**
  * *Prompt corporativo:* "Escreva as rotas REST do servidor Express em `/server/routes/index.ts` fornecendo os endpoints descritos na documentação corporativa para login, registro, catalogação de produtos, transações iniciais de cotação e consulta de créditos ESG. Em seguida, edite `/server/server.ts` unificando o Express, integrando as chamadas REST criadas e ligando as conexões do SQLite, servindo também os arquivos compilados finais do Vite em modo de produção."

---

### 4. Estruturação Base do Cliente React (Front-end)
* [ ] **Tarefa 4.1: Definir os Contratos de Tipos Estritos do TypeScript (`/src/types/index.ts`)**
  * *Prompt corporativo:* "Crie o arquivo `/src/types/index.ts` declarando as interfaces do TypeScript que espelham as tabelas corporativas (`Company`, `User`, `Product`, `Transaction`, `Logistics`). Garanta forte tipagem de perfis do usuário (`CompanyType` e `UserRole` expressos em enums) para amarrar os componentes visuais com segurança."

* [ ] **Tarefa 4.2: Implementar Cliente HTTP de Chamadas à API (`/src/services/api.ts`)**
  * *Prompt corporativo:* "Desenvolva o arquivo `/src/services/api.ts` contendo funções limpas assíncronas encapsuladas para chamar todos os endpoints do backend utilizando o fecth nativo em rotas relativas (Ex: `/api/products`). Trate possíveis erros estruturais de status de rede retornando mensagens amigáveis aos fluxos de tela."

---

### 5. Criação de Interfaces de Autenticação e Layout Geral
* [ ] **Tarefa 5.1: Desenvolver a Tela de Onboarding B2B e Autenticação Corporativa (`/src/views/AuthPage.tsx`)**
  * *Prompt corporativo:* "Crie a tela de autenticação unificada `/src/views/AuthPage.tsx` utilizando componentes premium do Material UI (MUI). Desenvolva um painel com abas dividindo 'Login Corporativo' e 'Cadastro de Empresa (CNPJ)'. Use ícones apropriados do Lucide React nos campos e inclua validações para formato de CNPJ de compradores e indústrias transformadoras."

* [ ] **Tarefa 5.2: Construir a Estratégia de Navegação Geral e Layout Corporativo (`/src/components/Layout.tsx`)**
  * *Prompt corporativo:* "Crie o esqueleto comum `/src/components/Layout.tsx`. Ele deve encapsular um cabeçalho cinza cimento com detalhes na paleta laranja corporativa da ArcelorMittal, de visual minimalista e denso. Conte com menu hambúrguer para dispositivos móveis, botões explícitos para catálogo, pedidos, painel ESG e área de administração, além de exibir a empresa e permissões do usuário que fez o login."

---

### 6. Componentes de Visualização Técnica e Catálogo Interativo
* [ ] **Tarefa 6.1: Criar o Catálogo e Vitrine Tecnológica de Subprodutos (`/src/views/ProductCatalog.tsx`)**
  * *Prompt corporativo:* "Desenvolva a vitrine principal `/src/views/ProductCatalog.tsx`. Ela deve exibir todos os resíduos à venda sob visual rico no estilo bento-grid. Ofereça campo de texto de busca dinâmica combinado a filtros por planta de origem, preço e categorias de materiais. Cada card de produto deve ter indicadores de estoque claro em toneladas."

* [ ] **Tarefa 6.2: Desenvolver o Painel de Cotação e Gráficos de Composição Química (`/src/components/ProductDetailDrawer.tsx`)**
  * *Prompt corporativo:* "Crie um componente lateral ou gaveta suspensa `/src/components/ProductDetailDrawer.tsx` para exibição de especificações de química profunda ao clicar em um material do catálogo. Use componentes interativos para traçar a composição percentual mineral (como teor de CaO, Fe2O3, SiO2). Adicione calculadora dinâmica que converte peso desejado em preço real e botão de cotação oficial."

---

### 7. Dashboards, Painéis ESG e Contratos Administrativos
* [ ] **Tarefa 7.1: Construir Painel ESG de Créditos e Métricas Reativas (`/src/views/Dashboard.tsx`)**
  * *Prompt corporativo:* "Estruture a tela principal `/src/views/Dashboard.tsx`. Use cards densos de métricas com ícones elegantes da Lucide React demonstrando total de resíduos reciclados, emissões de CO₂ poupadas de forma agregada ao mercado e cotações ativas. Crie painéis visuais ricos para que compradores e administradores comparem marcas sustentáveis e acompanhem as metas ESG anuais."

* [ ] **Tarefa 7.2: Desenvolver Painel Administrativo de Pátio e Gestão de Lotes (`/src/views/AdminPanel.tsx`)**
  * *Prompt corporativo:* "Escreva `/src/views/AdminPanel.tsx` para dar controle operacional completo para o administrador siderúrgico. Forneça formulários estritos para atualizar estoque, criar lotes de resíduos industriais adicionando seus laudos físico-químicos em formato tabular rígido e aprovar as requisições financeiras originadas de compradores comerciais."
