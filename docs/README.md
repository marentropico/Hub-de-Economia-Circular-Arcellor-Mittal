# Hub de Economia Circular ArcelorMittal

Bem-vindo ao **Hub de Economia Circular ArcelorMittal**, uma plataforma digital B2B disruptiva projetada para otimizar e comercializar coprodutos e resíduos industriais derivados da manufatura do aço (como escória de aciaria, escória de alto-forno, lama de aciaria, carepas de laminação e finos de minério) para cadeias produtivas secundárias (construção civil, cimenteiras, pavimentação e indústrias químicas).

---

## 🚀 Workflow de Criação do Projeto (Desenvolvimento por IA)

O projeto inteiro foi concebido, projetado e desenvolvido de ponta a ponta utilizando **apenas 4 prompts**, em um fluxo colaborativo integrado de engenharia de software compartilhando contexto entre duas interfaces oficiais da Google:

1. **Google Gemini (Interface Web - gemini-3.1-pro)**: [https://gemini.google.com/](https://gemini.google.com/)
   * Utilizado para a concepção de ideias inovadoras B2B de economia circular, estruturação do projeto, planejamento técnico, definição da arquitetura de software e consolidação da base de guias e tarefas em Markdown.
2. **Google AI Studio (Interface de Desenvolvimento - gemini-3.5-flash)**: [https://aistudio.google.com/](https://aistudio.google.com/)
   * Utilizado como o ambiente de execução e agente de codificação, interpretando ativamente as tarefas em Markdown, gerando o código-fonte de alta fidelidade da aplicação funcional (full-stack Express/Vite + React) e refinando refinadamente a interface seguindo o design Bento Grid.

Abaixo estão registrados detalhadamente os **4 prompts** que guiaram este desenvolvimento ímpar:

---

### 📝 Registro dos Prompts de Desenvolvimento

#### 💡 Prompt 1: Geração de Ideias Inovadoras (Google Gemini - gemini-3.1-pro)
> "Olá chat por favor me de ideias de sites ou apps úteis e inovadores para a empresa Arcellor Mittal"

---

#### 🏗️ Prompt 2: Engenharia de Prompts e Fluxos de IA-Driven (Google Gemini - gemini-3.1-pro)
> "perfeito chat, adorei a idéia 4. Por favor atue como um especialista em projetos e desenvolvedor sênior e crie um prompt detalhado para a criação da pasta de arquivos markdown responsáveis por guiar a construção do site ou app. Esse prompt deve conter as instruções detalhadas para a criação de todos os arquivos guia para a construção do projeto, detalhadamente, então o próprio prompt deve descrever como essa estrutura será responsável por coordenar a construção do site/app. Todo o projeto será feito com código via IA, então a pasta de documentação também deve conter um arquivo de roadmap e outro de tasks, de maneira que ao começar a produção, o desenvolvedor possa percorrer por cada task e cada markdown em ordem cronológica pra construir o projeto todo da melhor maneira possível."

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

## 1. Visão Geral do Projeto e Problema Resolvido

### O Problema
A produção siderúrgica gera milhões de toneladas de subprodutos que, historicamente, eram tratados como passivos ambientais ou estocados em pátios com alto custo logístico e regulatório. Paralelamente, indústrias de infraestrutura e cimento buscam matérias-primas alternativas para descarbonizar suas próprias cadeias de suprimentos de forma economicamente viável. No entanto, a transação direta desses materiais carece de:
* um marketplace centralizado e transparente;
* rastreabilidade física e regulatória;
* facilidade na contratação logística de volumes industrias;
* visibilidade técnica (ensaios de laboratório, especificações químicas e físicas).

### A Solução (marketplace B2B)
O **Hub de Economia Circular** preenche essa lacuna conectando as usinas produtoras da ArcelorMittal diretamente com compradores homologados da indústria de transformação. A plataforma atua em quatro frentes principais:
1. **Vitrine Técnica de Subprodutos:** Catálogo detalhado com fichas técnicas, laudos laboratoriais, granulometria e utilidade recomendada.
2. **Negociação e Pedidos B2B:** Fluxo de cotação e compra em grande escala com suporte a múltiplos modais de transporte (Rodoviário, Ferroviário).
3. **Métricas de Impacto Ambiental (ESG):** Dashboards que calculam as emissões de CO₂ evitadas pelo uso de coprodutos reciclados em vez de matéria-prima virgem.
4. **Logística Integrada e Rastreabilidade técnica:** Gestão e monitoramento das etapas de carregamento e destinação regulada (licenças ambientais MTR).

---

## 2. Stack Tecnológica Proposta

Para garantir alto rendimento, facilidade de implantação sob demanda e modularidade rígida, o Hub foi arquitetado com as tecnologias mais modernas e robustas do mercado:

| Camada | Tecnologia | Motivação e Benefício |
| :--- | :--- | :--- |
| **Apresentação (UI/UX)** | **React (v19) + TypeScript** | Componentização modular, renderização de alta fidelidade baseada em estados e tipagem estrita para segurança de dados corporativos. |
| **Estilização** | **Tailwind CSS + Material UI (MUI)** | **MUI** fornece os componentes estruturais B2B altamente complexos (tabelas densas, formulários robustos, abas). **Tailwind CSS** garante estilização rápida, flexível e design responsivo com classes utilitárias. |
| **Servidor (Backend)** | **Express / Node.js (Clean Architecture)** | Emprega a arquitetura limpa (Clean Architecture), desacoplamento de controladores, use cases e repositórios, de fácil manutenção e excelente integração com o Vite no ambiente Cloud Run. |
| **Persistência de Dados** | **SQLite (File-based / In-Memory)** | Banco de dados relacional robusto integrado ao projeto, permitindo integridade referencial por chaves estrangeiras sem requerer um container de banco separado para o protótipo/MVP. |
| **Biblioteca de Ícones** | **Lucide React** | Pacote de ícones minimalistas, leves, consistentes e modernos, otimizando o tempo de carregamento da aplicação web. |
| **Animações de Interface** | **Motion** | Transições de tela elegantes e dinâmicas, micro-interações de botões e carregadores que aprimoram a percepção de qualidade do software. |

---

## 3. Metodologia "AI-Driven Development" (Desenvolvimento Guiado por IA)

Esta pasta `/docs` não é apenas documentação estática; ela foi projetada como a **memória contextual externa** da inteligência artificial para futuras iterações. 

### Fluxo de Trabalho do Desenvolvedor com a IA:
1. **Carregamento de Contexto Prioritário:** Toda nova sessão com a IA (ou novo ciclo de prompt) deve começar apontando para estes arquivos. O desenvolvedor deve instruir a IA a ler a documentação de contexto antes de escrever qualquer código.
2. **Mapeamento Incremental:** Cada tarefa no arquivo `tasks.md` está estruturada de maneira independente e sequencial. Execute uma tarefa por vez.
3. **Garantia de Não-Regressão:** Ao solicitar alterações, use `ai-guidelines.md` como rédea curadora. A IA deve validar o código gerado contra as restrições estritas descritas lá (ausência de "AI Slop", nomenclatura, modularidade).
4. **Alinhamento de Design:** O arquivo `design.md` deve ser lido pela IA sempre que um componente visual for criado ou modificado, garantindo consistência com a paleta de cores corporativa, tipografia industrial de alta legibilidade, e o design refinado exigido no onboarding B2B.
