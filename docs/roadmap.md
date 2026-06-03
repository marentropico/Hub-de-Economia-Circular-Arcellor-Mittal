# Roadmap de Desenvolvimento e Metas Estratégicas

Este documento delineia o cronograma estratégico e evolutivo para o **Hub de Economia Circular ArcelorMittal**, dividindo o ciclo de vida do produto em três fases funcionais lógicas para garantir a rápida entrega de valor e estabilidade operacional.

---

## Cronograma Evolutivo do Projeto

```
   [ Fase 1: MVP ]                 [ Fase 2: Transações & ESG ]       [ Fase 3: Logística & MTR ]
=======================          ==============================      =============================
• Cadastro Corporativo           • Cotações B2B Automatizadas        • Integração MTR / SINIR
• Vitrine Siderúrgica            • Painel Financeiro e Volumes       • Rastreabilidade de Caminhões
• Composição Química Interativa  • Gráficos ESG de CO₂ Evitado       • Emissão de Licenças Digitais
```

---

## Detalhamento das Fases

### 🏁 Fase 1: Mínimo Produto Viável (MVP) — Cadastro e Vitrine Técnica
**Objetivo Principal:** Estabelecer a infraestrutura básica da aplicação e validar o escopo conceitual da vitrine técnica de coprodutos siderúrgicos, provendo um catálogo funcional para investidores e clientes secundários consultarem materiais da ArcelorMittal.

* **Escopo Funcional:**
  * Setup de todo o ecossistema do repositório utilizando Node.js, Express de arquitetura limpa e banco de dados SQLite local.
  * Tela de Autenticação Corporativa (Onboarding B2B) com segmentação de perfis para representantes e administradores.
  * Catálogo dinâmico de resíduos siderúrgicos e coprodutos (Escória de Alto-Forno, Escória de Aciaria LD, Lamas, Carepas, etc.) refinado por filtros avançados de granulometria, plantas originárias e estoques disponíveis.
  * Ficha Técnica Interativa que calcula custos conforme o peso necessário em toneladas e exibe os laudos físicos e composições químicas por gráficos dinâmicos de pizza.
  * Painel administrativo Arcelor para inclusão rápida e atualização de volumes e preços dos lotes cadastrados.
* **Métricas de Sucesso do MVP:**
  * Tempo de resposta de APIs abaixo de 200 milissegundos.
  * Renderização perfeita de fichas químicas e relatórios de segurança.
  * Cadastro bem-sucedido de empresas de transporte, compradores e representantes.

---

### 📈 Fase 2: Transações Comerciais e Dashboard ESG Avançado
**Objetivo Principal:** Fechar o ciclo econômico habilitando o fechamento das negociações na plataforma e quantificar o valor ecológico obtido com a transição, calculando impacto ambiental real conforme padrões ambientais GWP (Global Warming Potential).

* **Escopo Funcional:**
  * Motor de Processamento B2B: Conversão de produtos selecionados no catálogo em propostas comerciais ativas com registro estrito de CNPJ comprador, volumes contratados, valores negociados e impostos aplicáveis.
  * Módulo de Gestão de Contratos de Fornecimento B2B sob modal recorrente.
  * **Dashboard de Sustentabilidade (ESG Metric Center):** Gráficos interativos em barra e painéis de dados agregando economia de CO₂ gerada para compradores parceiros com base na substituição de agregados virgens (Ex: 1 tonelada de escória britada substituindo argila e britagem mineral convencional salva em média 80kg de pegada de carbono equivalente).
  * Painel de Controle de Ordens de Compra e status de faturamento integrado.

* **Métricas de Sucesso da Fase 2:**
  * Contratação e cálculo automatizado de transações volumosas sem perda de integridade referencial de estoque.
  * Atualização reativa de painéis de economia energética (ESG) por empresa operadora.

---

### 🚚 Fase 3: Logística Avançada, Licenciamento e Integração Externa
**Objetivo Principal:** Fornecer suporte e governança logística, garantindo que o transporte físico de resíduos industriais atenda 100% dos quesitos federais brasileiros de licenciamento ambiental (SINIR/MTR/IBAMA) de ponta a ponta.

* **Escopo Funcional:**
  * Módulo de Logística Integrada: Cadastro de contratantes logísticos credenciados, placas dos caminhões coletores, pesagem de entrada e saída.
  * Simulador de Manifesto de Transporte de Resíduos (MTR) em conformidade com as legislações do Conselho Nacional do Meio Ambiente (CONAMA).
  * Tela de Rastreamento de Despacho Logístico em tempo real, informando horários aproximados de embarque na planta portuária/siderúrgica e entrega final para o transformador de material.
  * Exportador de Relatórios Mensais de Auditoria de Resíduos para relatórios de sustentabilidade ou fiscalizações governamentais de segurança de materiais em formato PDF/JSON.

* **Métricas de Sucesso da Fase 3:**
  * Emissão simulada sem falhas de numerações MTR únicas rastreáveis.
  * Vinculação direta de contratos às placas de caminhões de transporte com validação estrita.
