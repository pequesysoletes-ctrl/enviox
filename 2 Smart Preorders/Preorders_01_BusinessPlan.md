# SMART PREORDERS
## Business Plan — Guía de Negocio
### Documento 1 de 5 — Febrero 2026

---

## 1. Resumen Ejecutivo

**Smart Preorders** es una app táctica de Shopify que resuelve el "bug del doble envío" — cuando un cliente compra un producto en stock y uno en preventa, el merchant paga dos envíos pero solo cobra uno. La app detecta carritos mixtos, avisa al cliente, y opcionalmente cobra el envío extra.

### Datos clave

| Parámetro | Definición |
|-----------|-----------|
| **Precio** | 9,99€ - 19,99€ / mes |
| **MVP** | 4 semanas |
| **Objetivo MRR** | 4.000€ netos/mes (12 meses) |
| **Argumento de venta** | "Te ahorra los 6€ que pierdes por pedido mixto" |

### Por qué es una "joya oculta"

- **ROI instantáneo y medible**: si la app cuesta 19€/mes y ahorra 6€ por pedido mixto → se paga sola con 3 pedidos
- **MVP en 4 semanas**: técnicamente simple comparado con Geolocation
- **El dolor es real y documentado**: threads en Reddit, Shopify Community con cientos de upvotes
- **Las apps existentes** son pesadas, caras, o no resuelven el problema del envío doble

---

## 2. El Problema — El "Double-Shipping Bug"

### Cómo funciona el problema

```
1. Cliente añade al carrito:
   - ✅ Camiseta (en stock, envío inmediato)
   - ⏳ Zapatillas edición limitada (preventa, envío en 3 meses)

2. Shopify calcula envío: 6€ (como si fuera 1 paquete)

3. Realidad:
   - Envío 1: Camiseta → 6€ (ahora)
   - Envío 2: Zapatillas → 6€ (en 3 meses)
   - Total envío real: 12€
   - Cobrado al cliente: 6€
   - 💸 El merchant pierde 6€
```

### El dolor es MEDIBLE

| Métrica | Ejemplo tienda de moda |
|---------|----------------------|
| Pedidos mixtos/mes | ~25 |
| Coste envío perdido | 6€ × 25 = **150€/mes** |
| Coste anual | **1.800€** |
| Coste de la app | 19,99€/mes = 240€/año |
| **ROI para el merchant** | **7.5x** |

### Fuentes del dolor

- **Reddit r/shopify**: múltiples threads con cientos de upvotes sobre preorders
- **Shopify Community**: threads sin respuesta oficial sobre envíos de preorders
- **Reviews de apps de preorder**: 1-3⭐ mencionando que no gestionan el envío
- **Facebook groups Shopify España**: quejas sobre envíos dobles en drops

---

## 3. La Solución — Smart Preorders

### Funcionalidades core:

1. **Etiquetado de productos preventa**
   - Marcar productos/variantes como "Pre-order" desde admin
   - Fecha estimada de envío (metafield)
   - Automático: si stock = 0, activar preorder

2. **Botón inteligente (Theme Extension)**
   - Sustituye "Añadir al carrito" por "Pre-order" automáticamente
   - Muestra fecha estimada: "Se enviará aprox. el 15/04/2026"
   - Editable: colores, texto, icono

3. **Detección de carrito mixto**
   - Al detectar producto en stock + preorder en carrito:
   - Mostrar aviso visual: "Tu pedido se enviará en 2 partes"
   - Timeline visual: "Parte 1: Camiseta → envío inmediato | Parte 2: Zapatillas → envío 15/04"

4. **Gestión del envío extra** (diferenciador clave)
   - **Opción A**: Cobrar envío extra automáticamente (Shopify Functions)
   - **Opción B**: Bloquear la compra mixta (forzar 2 pedidos separados)
   - **Opción C**: Solo avisar (el merchant asume el coste)
   - Configurable por el merchant

5. **Tags automáticos en pedidos**
   - Tag: `Contiene-Preorder`
   - Tag: `Envío-Pendiente`
   - Tag: `Carrito-Mixto`
   - Facilita filtrado en admin de Shopify

6. **Dashboard de ahorro**
   - "Este mes has ahorrado €150 en envíos dobles"
   - Pedidos con preorder, pedidos mixtos, envíos pendientes
   - ROI visible: "La app se ha pagado sola X veces este mes"

---

## 4. Mercado, Competencia y Pricing

### TAM

- ~4.4M tiendas Shopify activas globalmente
- **~300,000** venden productos con preventa (moda, tech, coleccionismo, gaming)
- Target inicial: **tiendas de moda con "drops"** y tiendas de tech con lanzamientos
- Nicho secundario: Kickstarter/crowdfunding que migran a Shopify

### Competencia directa

| Competidor | Rating | Precio | Problema |
|-----------|--------|--------|----------|
| Pre-Order Manager (Amai) | 4.4⭐ | Free-$29.99 | No gestiona envío doble |
| PreOrder Now (SpurIT) | 3.8⭐ | $19.95 | Pesado, lento, features antiguos |
| Pre-Order Alpha | 4.6⭐ | Free-$14.99 | Básico, solo cambia botón |
| Timesact | 4.9⭐ | Free-$29.99 | Buen competidor pero no envío |
| Purple Dot Pre-Order | 4.7⭐ | Custom | Enterprise, caro |

### Insight clave
**NINGUNA app de preorder resuelve el problema del envío doble.** Todas cambian el botón a "Pre-order" pero ninguna detecta el carrito mixto ni cobra el envío extra. Este es nuestro moat.

### Pricing propuesto

| Plan | Precio | Target | Incluye |
|------|--------|--------|---------|
| **Lite** | 9,99€/mes | Tiendas pequeñas | 50 preorders/mes, botón custom, aviso carrito |
| **Pro** | 19,99€/mes | Tiendas medianas | Ilimitado, envío extra, dashboard ahorro, tags |

### MRR objetivo:

| Meta | Tiendas | Ticket | MRR |
|------|---------|--------|-----|
| Conservadora (12m) | 150 | 14€ | **2.100€** |
| Optimista (12m) | 350 | 16€ | **5.600€** |

---

## 5. Adquisición — Primeros 50 Clientes

### Canal 1 — App Store SEO (Clientes 1-20)

**Keywords target:**
- "shopify pre-order"
- "preorder app shopify"
- "split shipping shopify"
- "double shipping preorder"
- "partial fulfillment shopify"
- "preventa shopify"
- "backorder shopify"

**Diferenciador en listing:** el subtítulo dice "Stop Double-Ship" — ninguna otra app menciona esto.

### Canal 2 — Content Marketing "Pain-Point" (Clientes 21-35)

- Blog: "El error de los 6€: por qué las preventas están matando tu margen en Shopify"
- Blog: "Cómo evitar pagar envíos dobles en pedidos con preorder"
- Video: "Shopify Pre-orders: el bug que te cuesta dinero (y cómo arreglarlo)"
- Estos posicionan rápido porque nadie ha escrito sobre el "double-shipping bug"

### Canal 3 — Comunidades (Clientes 36-45)

- Reddit r/shopify — responder threads sobre preorders
- Shopify Community — búsqueda "pre-order" + "shipping"
- Facebook "Shopify España"
- **Oferta beta**: "3 meses gratis si nos das feedback"

### Canal 4 — Cross-sell desde Enviox (Clientes 46-50)

- Banner in-app: "¿Vendes productos en preventa? Ahorra en envíos dobles"
- Relevante para merchants que ya usan logística (envían muchos paquetes)

---

## 6. Riesgos y KPIs

### Riesgos

| Riesgo | Prob | Impacto | Mitigación |
|--------|------|---------|-----------|
| Shopify añade preorders nativos | Media | Alto | Nuestro USP es el envío doble, no el botón |
| Shopify Functions limitado | Media | Medio | Alternativa: draft orders |
| Preorders es nicho pequeño | Media | Medio | Expandir a backorders + coming soon |
| Timesact mejora su app | Baja | Medio | Time-to-market: lanzar antes |

### KPIs

| KPI | Meta 6 meses | Meta 12 meses |
|-----|-------------|---------------|
| Instalaciones | 100 | 300 |
| Conversión trial → pago | >15% | >20% |
| MRR | 800€ | 4.000€ |
| Churn | <6% | <4% |
| Rating | >4.5★ | >4.8★ |
| Ahorro medio/merchant | >100€/mes | >150€/mes |

---

*Documento 1 de 5 — Business Plan*
*Smart Preorders — Febrero 2026*
