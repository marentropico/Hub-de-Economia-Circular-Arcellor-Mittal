# Hub de Economia Circular ArcelorMittal

Bem-vindo ao **Hub de Economia Circular ArcelorMittal**, uma plataforma digital B2B disruptiva projetada para otimizar e comercializar coprodutos e resíduos industriais derivados da manufatura do aço (como escória de aciaria, escória de alto-forno, lama de aciaria, carepas de laminação e finos de minério) para cadeias produtivas secundárias (construção civil, cimenteiras, pavimentação e indústrias químicas).

Este documento serve como o **Guia Geral e Manual de Orquestração** para o ecossistema de desenvolvimento guiado por inteligência artificial (AI-Driven Development).

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
| **Servidor (Backend)** | **Express / Node.js (Clean Architecture)** | Implementação de arquitetura limpa (Clean Architecture), desacoplamento de controladores, use cases e repositórios, de fácil manutenção e excelente integração com o Vite no ambiente Cloud Run. |
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

---

Com esta estrutura, o projeto ganha um controle absoluto sobre os fluxos de trabalho e qualidade do código fonte desenvolvido. A próxima fase técnica consiste em detalhar a arquitetura de dados e rotas.
