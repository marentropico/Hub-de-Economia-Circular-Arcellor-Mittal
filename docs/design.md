# Diretrizes de Design e Identidade Visual B2B

Este documento estabelece as especificações estéticas regulamentadoras e o tom visual do **Hub de Economia Circular ArcelorMittal**. O objetivo é entregar uma interface B2B, limpa, ergonômica, de alto padrão técnico e com excelente legibilidade tanto em escritórios executivos de sustentabilidade quanto em terminais operacionais no chão de fábrica.

---

## 1. Filosofia Estética: "Industrial Moderno"

Inspirado na arquitetura, no concreto bruto e na manufatura pesada do aço, o conceito visual repousa em três bases fundamentais:
* **Espaçamento Generoso:** Uso abundante de espaços vazios (padding/margins) para evitar sobrecarga visual de dados densos e propiciar conforto na tomada de decisão.
* **Geometria Rígida:** Bordas levemente arredondadas (`rounded-md` ou `rounded-lg`), sombras sutis (`shadow-sm`) e grids estruturados sob o conceito de bento-grid.
* **Honestidade Arquitetônica:** Sem ornamentos fúteis, gradientes exagerados ou componentes de telemetria falsos. A beleza do design deve brotar da impecabilidade tipográfica, do fluxo organizacional e do contraste elegante de cores.

---

## 2. Paleta de Cores Oficial

O esquema cromático homenageia os tons clássicos do aço escovado, do carbono, do minério de ferro e do calor da marca:

| Nome da Cor | Código Hex | Utilidade na UI |
| :--- | :--- | :--- |
| **Laranja Arcelor** | `#FF5F00` | Detalhes de destaque primário, botões de ação críticos (Cotações, Compra), indicadores de status ativos. |
| **Cinza Antracite (Carbono)**| `#111827` | Texto principal, cabeçalhos, menus principais de navegação para passar seriedade e nobreza. |
| **Cinza Cimento (Suave)** | `#F3F4F6` | Planos de fundo secundários, divisórias, contornos ou grids que organizam as informações. |
| **Branco Absoluto** | `#FFFFFF` | Fundo principal de cartões (cards), vitrines de produtos e janelas modais. |
| **Verde ESG (Sustentabilidade)**| `#10B981` | Indicadores de impacto ambiental de CO₂ reduzido, status "Concluído" de ordens. |

---

## 3. Estratégia de Tipografia

Para garantir o equilíbrio ideal entre legibilidade executiva e leitores operacionais rápidos, adotamos estas fontes principais:

* **Fonte Sans Primária (Geral):** `Inter` para menus de navegação, corpos de mensagens, listas e textos descritivos gerais. É altamente legível e limpa.
* **Fonte Display (Títulos):** `Space Grotesk` ou `Outfit` em pesos médios/negritos chamativos para títulos de seções, vitrines e cartões principais. Dá o tom tecnológico e dinâmico ao hub.
* **Fonte Mono (Dados Técnicos):** `JetBrains Mono` ou `Fira Code` para percentuais químicos (Ex: *CaO: 45%*), CNPJs, numerações de caminhões, identificadores de pedidos e toneladas físicas de estoque. Traz rigor científico e precisão matemática para a interface.

---

## 4. Integração Harmoniosa: Tailwind CSS + Material UI

Para unificar o melhor dos dois ecossistemas sem conflitos visuais:
1. **Material UI (MUI):** Fornece os componentes operacionais ricos e interativos (tabs, inputs rotulados, drawers flutuantes, tabelas estatísticas completas e alertas contextuais) utilizando configurações de fonte e temas que mimetizam a paleta siderúrgica.
2. **Tailwind CSS:** Fornece a montagem responsiva rápida, margens exatas de distanciamento das views, comportamentos de grid refinados para celular/desktop e retoques rápidos de cores sem a necessidade de customizações profundas nos loaders originais do Emotion.

Exemplo de estrutura ideal B2B utilizando o melhor de ambos:
```tsx
import { Card, Button, Typography } from '@mui/material';
import { Leaf } from 'lucide-react';

export default function MetricCard() {
  return (
    <Card className="p-6 border border-gray-100 hover:border-orange-500 transition-all rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <Typography className="font-sans text-gray-500 text-sm font-medium">
          Pegada CO₂ Salva
        </Typography>
        <Leaf className="text-emerald-500" size={20} />
      </div>
      <Typography className="font-mono text-3xl font-bold text-gray-900">
        482,4 t
      </Typography>
    </Card>
  );
}
```

Esta robustez no layout é o que dita a excelência corporativa da marca ArcelorMittal sob a ótica dos seus clientes.
