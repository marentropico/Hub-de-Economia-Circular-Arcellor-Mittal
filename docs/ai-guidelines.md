# Diretrizes de Comportamento e Desenvolvimento para Inteligência Artificial

Este documento reúne o conjunto de **regras estritas, padrões arbitrários de engenharia e restrições técnicas** que a inteligência artificial deve adotar rigorosamente ao gerar ou atualizar qualquer arquivo de código-fonte neste projeto.

---

## 1. Princípios de Clean Code e Tipagem Estrita

* **TypeScript Sem Concessões:**
  * O uso do tipo `any` é **terminantemente proibido**. Todas as entradas de funções, retornos, interfaces de estado, propriedades de componentes React e retornos de rotas REST devem ser tipadas explicitamente.
  * Se houver objetos de formato dinâmico, utilize mapeamentos seguros do tipo `Record<string, unknown>` ou uniões estritas.
* **Componentização Modular:**
  * Componentes não devem acumular lógica massiva excedendo 250 linhas. Divida sub-layout em arquivos menores isolados em `/src/components/` ou extraia métodos utilitários independentes em arquivos helper.
  * Todas as chamadas de serviços e APIs externas devem passar restritivamente pela camada de `/src/services/` (nunca injete requisições brutas em `useEffect` locais).

---

## 2. Padrões de Nomenclatura e Organização

* **Frontend (React/TypeScript):**
  * Nomes de componentes, views e layouts devem usar obrigatoriamente **PascalCase** (Ex: `ProductCatalog.tsx`, `Layout.tsx`, `MetricCard.tsx`).
  * Hooks customizados ou variáveis internas devem usar **camelCase** (Ex: `useAuth`, `productStock`, `handleOpen`).
  * Estilos locais ou classes de suporte no Tailwind devem herdar convenções de visual responsivo estruturado nas diretrizes de design.
* **Backend (Node.js/Express/SQL):**
  * Nomes de arquivos de rotas, repositórios e controladores devem usar **PascalCase** para classes e **camelCase** para as instâncias instanciadas.
  * Instruções SQL brutas no SQLite devem usar comandos SQL em caixa alta (**SELECT**, **INSERT**, **UPDATE**, **DELETE**, **FOREIGN KEY**) para destaque e perfeitabilidade de leitura analítica.

---

## 3. Tratamento de Erros e Resiliência de Fluxo

* **Frontend Resiliente:**
  * Todas as operações assíncronas com tratamento local devem conter blocos robustos `try-catch`.
  * Na ocorrência de erros de rede de backend ou falha de credenciais, o front deve traduzir a mensagem e alimentar canais suaves na UI (como `Alert`s do MUI ou avisos contextuais), nunca quebrando a renderização do componente inteiro ou travando spinners indefinidos.
* **Backend Seguro:**
  * As APIs devem validar dados de entrada exaustivamente antes de persistir no banco SQLite. Verifique estruturas de CNPJ, quantidades não-negativas em toneladas e emails válidos.
  * Em caso de falha controlada, retorne códigos de status HTTP correspondentes (`400 Bad Request`, `401 Unauthorized`, `404 Not Found`, etc.), acompanhados de um payload JSON legível de erro:
    ```json
    { "error": "Descrição detalhada e limpa da falha industrial." }
    ```

---

## 4. Filosofia Visiva e Acessibilidade (Padrão Industrial B2B)

* **UI/UX Focada na Legibilidade e Sem "AI-Slop" ou Clutter Técnico:**
  * Não invente dados aleatórios ou telemetria para lotar telas (regras anti-larp e anti-slop). Foque estritamente em interfaces corporativas reais que usuários industriais necessitam para operar com seriedade.
  * Use **MUI** para elementos estruturais complexos que exigem alta interatividade e acessibilidade nativa (tab-index, labels de campos legíveis, botões que suportam leitores de tela).
* **Consistência de Contraste e Fontes:**
  * Escolha contrastes nítidos para leitura sob luz natural intensa ou ambientes fabris (fundo branco elegante de alto padrão ou cinza cimento suave para painéis secundários, combinados com cor principal cinza grafite quase negro).
  * Use a paleta definida no arquivo `design.md` baseada nas especificidades de cores corporativas oficiais da marca.
