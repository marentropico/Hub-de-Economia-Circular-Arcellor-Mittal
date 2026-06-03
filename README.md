# Hub de Economia Circular ArcelorMittal

Este projeto é um portal digital B2B desenvolvido para conectar a cadeia produtiva da ArcelorMittal com indústrias secundárias (cimenteiras, pavimentadoras, construtoras). Ele viabiliza a negociação, o faturamento, o monitoramento logístico e a destinação ecologicamente licenciada de coprodutos siderúrgicos (escória, carepa, lama, etc.), promovendo a descarbonização industrial por meio da economia circular guiada por dados.

---

## 🚀 Workflow de Criação do Projeto (Desenvolvimento por IA)

O projeto inteiro foi concebido, projetado e desenvolvido de ponta a ponta utilizando **apenas 4 prompts**, em um fluxo colaborativo integrado de engenharia de software compartilhando contexto entre duas interfaces oficiais da Google:

1. **Google Gemini (Interface Web - gemini-3.1-pro)**: [https://gemini.google.com/](https://gemini.google.com/)
   * Utilizado para a concepção de ideias inovadoras B2B de economia circular, estruturação do projeto, planejamento técnico, definição da arquitetura de software e consolidação da base de guias e tarefas em Markdown.
2. **Google AI Studio (Interface de Desenvolvimento - gemini-3.5-flash)**: [https://aistudio.google.com/](https://aistudio.google.com/)
   * Utilizado como o ambiente de execução e agente de codificação, interpretando ativamente as tarefas em Markdown, gerando o código-fonte de alta fidelidade da aplicação funcional (full-stack Express/Vite + React) e refinando e polindo a interface seguindo o design Bento Grid.

Abaixo estão registrados detalhadamente os **4 prompts** que guiaram este desenvolvimento ímpar:

---

### 📝 Registro dos Prompts de Desenvolvimento

#### 💡 Prompt 1: Geração de Ideias Inovadoras (Google Gemini - gemini-3.1-pro)
> "Olá chat por favor me de ideias de sites ou apps úteis e inovadores para a empresa Arcellor Mittal"

---

#### 🏗️ Prompt 2: Engenharia de Prompts e Fluxos de IA-Driven (Google Gemini - gemini-3.1-pro)
> "perfeito chat, adorei a idéia 4. Por favor atue como um especialista em projetos e desenvolvedor sênior e crie um prompt detalhado para a criação da pasta de arquivos markdown responsáveis por guiar a construção do site ou app. Esse prompt deve conter as instruções detalhadas para a criação de todos os arquivos guia para a construção do projeto, detalhadamente, então o próprio prompt deve descrever como essa estrutura será responsável por coordenar a construção do site/app. Todo o projeto será feito com código via IA, então a pasta de documentação também deve conter un arquivo de roadmap e outro de tasks, de maneira que ao começar a produção, o desenvolvedor possa percorrer por cada task e cada markdown em ordem cronológica pra construir o projeto todo da melhor maneira possível."

---

#### 🧠 Prompt 3: Arquitetura Técnica e Geração da Documentação Guia (Google Gemini - gemini-3.1-pro)
> "Atue como um Arquiteto de Software Sênior e Gerente de Projetos Técnicos especialista em desenvolvimento guiado por IA. Seu objetivo é estruturar a base de documentação em Markdown para a criação do "Hub de Economia Circular ArcelorMittal" — um marketplace B2B web focado na venda de subprodutos siderúrgicos (como escória) para outras indústrias.
> Todo o código deste projeto será gerado por IA em etapas futuras. Portanto, esta documentação servirá como o "cérebro" do projeto. Ela deve ser detalhada, estruturada de forma lógica e desenhada para que eu (o desenvolvedor) possa passar cada arquivo como contexto para a IA nas próximas sessões.
> Por favor, gere o conteúdo completo e detalhado para os seguintes arquivos Markdown, organizados em uma pasta /docs:
> **README.md (Visão Geral e Orquestração)**
> Descreva o projeto, o problema que ele resolve e o público-alvo (B2B).
> Defina a Stack Tecnológica ideal para uma aplicação web moderna, escalável e rápida (sugira frameworks de front-end, back-end e banco de dados).
> Explique a metodologia de "AI-Driven Development": como o desenvolvedor deve usar esta pasta /docs a cada nova interação com a IA para manter o contexto.
> **architecture.md (Regras de Negócio e Estrutura Técnica)**
> Defina o esquema do banco de dados (tabelas principais como Usuários/Empresas, Produtos/Resíduos, Transações, Logística).
> Defina a arquitetura de pastas do código-fonte (ex: src/components, src/api, etc.).
> Mapeie as principais rotas da API e as telas do Front-end.
> **roadmap.md (Visão Macro do Projeto)**
> Divida o projeto em 3 fases cronológicas:
> * Fase 1: MVP (Mínimo Produto Viável - Cadastro e vitrine).
> * Fase 2: Transações e Dashboard (Sistema de pedidos e métricas).
> * Fase 3: Logística e Integração (Rastreamento e geração de notas).
> Explique o objetivo de cada fase.
> **tasks.md (Micro-Gerenciamento e Execução Cronológica)**
> Este é o arquivo mais importante para a execução. Crie uma checklist cronológica e granular ([ ] Tarefa 1, [ ] Tarefa 2) para a Fase 1 (MVP).
> Cada tarefa deve ser um comando claro, estruturado quase como um prompt que o desenvolvedor poderá copiar e pedir para a IA executar.
> Exemplo: "[ ] Criar o componente de Navbar responsivo usando o framework X, lendo as cores da documentação".
> A ordem deve fazer sentido técnico: primeiro configuração de ambiente, depois banco de dados, rotas de back-end, e por último componentes de front-end.
> **ai-guidelines.md (Diretrizes de Comportamento para a IA)**
> Um arquivo de regras estritas que será enviado à IA antes de gerar qualquer código.
> Deve conter regras de clean code, padrões de nomenclatura, tratamento de erros, componentização modular e regras de design focado em acessibilidade e UI limpa (estilo corporativo/industrial).
> Gere o conteúdo de cada um desses arquivos além de outros necessários como um arquivo de design.md e etc separando. Seja denso, técnico e extremamente focado na viabilidade do projeto.
> Depois que a pasta de documentação estiver completa, por favor prossiga para a criação da aplicação de fato., estruturando o backend com arquitetura limpa em Node.js e NestJS, o banco de dados pode ser em SQLite pra rodar no proprio site/app.
> Analise os melhores bibliotecas e frameworks antes de iniciar a codificação.
> Podemos usar MUI para resolver a UI e Tailwind CSS para agilizar a estilização responsiva, além de padronizar os ícones usando Lucide React para manter a leveza e consistência visual do projeto.
> Por favor me entregue o prompt mais detalhadamente possível pra que o desenvolvimento que será feito usando IA do Gemini ocorra de maneira ímpar."

---

#### 🎨 Prompt 4: Polimento Visual Estético e Aplicação do Tema (Google AI Studio - gemini-3.5-flash)
> "Apply the "Bento Grid" design theme to the app."

---

## 🗂️ Estrutura Física de Documentação do Projeto

O ecossistema conta com os seguintes guias detalhados criados sob a fase de concepção técnica na pasta `/docs`:
* **[`/docs/README.md`](/docs/README.md)**: Manual operacional geral e diretrizes metodológicas do AI-driven com os registros de criação.
* **[`/docs/ai-guidelines.md`](/docs/ai-guidelines.md)**: Cláusulas e restrições de formatação e arquitetura para a IA.
* **[`/docs/architecture.md`](/docs/architecture.md)**: Modelagem de persistência de banco de dados e mapeamento de rotas.
* **[`/docs/design.md`](/docs/design.md)**: Configuração de identidade visual e especificações de tipografia.
* **[`/docs/roadmap.md`](/docs/roadmap.md)**: Definição estratégica das etapas macro de maturidade do Hub.
* **[`/docs/tasks.md`](/docs/tasks.md)**: Lista cronológica de micro-atividades executáveis pelo agente codificador.

---

## ⚙️ Stack do Projeto Executado

* **Front-End:** React 19 + TypeScript + Tailwind CSS v4 (Estilização de grids harmônicos e painéis translúcidos) + Lucide Icons + Motion
* **Back-End:** Express.js + TSX Hot Reloading + Esbuild Production Bundler
* **Banco de Dados:** In-Memory SQLite (Sincronização persistente baseada no ciclo de vida de sessões de usuário)
