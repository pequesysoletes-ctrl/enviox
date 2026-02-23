# 🎣 Oportunidades "Río Revuelto" — Shopify App Store
## Sectores con apps rotas, dolor real y poca competencia de calidad

> **Fecha análisis:** 20/02/2026  
> **Autor:** Investigación automatizada  
> **Método:** Análisis de reviews, Reddit, foros Shopify, Trustpilot, búsqueda competitiva  
> **Criterio:** Mismo que usamos para encontrar la oportunidad MRW/Correos:
> - ✅ Apps existentes con reviews 1-2⭐
> - ✅ Dolor real documentado en reviews públicas
> - ✅ Pocas o ninguna alternativa de calidad
> - ✅ Mercado suficiente para justificar desarrollo
> - ✅ Implementable sin barreras legales/regulatorias excesivas

---

## 📊 RANKING GENERAL (de más prometedor a menos)

| # | Oportunidad | Mercado | Implementable | Competencia rota | Moat | MRR estimado | Nota |
|---|------------|---------|:---:|:---:|:---:|---:|------|
| 🥇 | **Geolocation + Markets EU** | ~500K tiendas EU | ✅ | Shopify eliminó su app | 🟡 Medio | 5-15K€ | Vacío oficial |
| 🥈 | **Preorders inteligentes** | Tiendas de drops/launches | ✅ | Bug del doble envío | 🟡 Medio | 3-8K€ | 💎 Joya oculta — MVP 4 semanas |
| 🥉 | **Upsell/Cross-sell ultraligero** | 4.4M tiendas | ✅ | Apps slow/clunky | 🔴 Bajo | 10-30K€ | Feature #1 pedida |
| 4 | **Inventario Multi-canal** | Global (multi-channel) | ⚠️ | Apps multiplican stock | � Medio | 8-25K€ | ⛔ TRAMPA — soporte 24/7 |
| 5 | **ShopifyBundler Pro (IA)** | 4.4M tiendas | ✅ | 15+ apps, saturado | 🔴 Bajo | 10-80K€ | Alto riesgo, alto reward |
| ⚠️ | **Verifactu / Facturación Legal** | 52K tiendas ES | ❌ Barrera legal | Solo 2-3 apps (1.4⭐) | 🟢 Alto | 8-16K€ | Necesita certificación AEAT |

> **Nota:** Ranking actualizado tras revisión de experto externo (ver sección siguiente).

---

## 🧠 REVISIÓN DE EXPERTO EXTERNO (20/02/2026)

Se envió el documento a un experto en SaaS/Shopify. Sus conclusiones:

### ✅ Geolocation EU — "Ganadora indiscutible"
> *"Cuando Shopify elimina una app oficial, crea un vacío de mercado instantáneo y un pánico en los usuarios que necesitan una alternativa urgente."*

- Sinergía perfecta: si usa Enviox Carriers para enviar a Europa → necesita adaptar su tienda a esos países
- Puro software frontend + APIs de traducción (DeepL/Google). Sin dependencies externas.
- Cross-sell natural con Enviox Carriers

### ⛔ Inventario Multi-canal — "La TRAMPA"
> *"Si tu app falla 5 minutos y un cliente vende un producto sin stock en Amazon, le penalizan la cuenta. Te van a freír a tickets de soporte urgentes. Esto rompe la regla de crear un SaaS que te dé libertad; te convertiría en un esclavo del mantenimiento."*

- APIs de Amazon cambian constantemente y tienen rate limits estrictos
- Cada fallo = urgencia del merchant = soporte 24/7 obligatorio
- Producto atractivo en papel pero **destruye calidad de vida del dev**
- **DECISIÓN: Bajar de #2 a #4. No recomendado para maker individual.**

### 💎 Preorders Inteligentes — "La Joya Oculta"
> *"El bug del doble envío significa que el vendedor pierde dinero en cada pedido mixto. La venta es trivial: 'Nuestra app te ahorra los 6€ que pierdes cada vez que un cliente mezcla un preorder con un producto en stock'. Si la app cuesta 19$/mes, se paga sola con 3 pedidos."*

- **Argumento de venta perfecto**: ROI inmediato y medible
- **MVP realista**: 4 semanas de desarrollo
- **Esfuerzo vs recompensa**: la mejor ratio de todas las opciones
- **DECISIÓN: Subir de #4 a #2. Producto táctico ideal para generar cash rápido.**

### 🗑️ Upsell y Bundler — "Océanos rojos"
> *"Competir contra apps que tienen miles de reviews (como Selleasy o ReConvert) y equipos de marketing enteros es un desgaste enorme para una ventaja competitiva muy fina."*

- Confirma que están bien descartados como prioridad
- Upsell demasiado saturado, Bundler tiene Shopify nativo gratis como competidor

### Sobre Verifactu
> *"Aparcarla es la decisión correcta. Meterse en certificaciones de la AEAT y seguros de responsabilidad civil rompe la agilidad del modelo maker."*

### 🎯 Veredicto del experto
> *"El roadmap que propones es estratégicamente impecable: Consolidar Enviox Carriers primero, y atacar Geolocation EU como segundo producto."*

### 💡 Nota del equipo (post-revisión)
Geolocation es el producto **estratégico** (sinergía, marca, EU) y Preorders es el producto **táctico** (rápido, cash, ROI claro). Son técnicamente muy diferentes → podrían desarrollarse en paralelo.

---

# 🥇 OPORTUNIDAD #1 — Geolocation + Markets EU

## El problema

**Shopify eliminó su propia app de Geolocation** en Febrero 2025.
- Dejó de ser instalable: 1 Feb 2025
- Desinstalada de TODAS las tiendas: 24 Mar 2025
- Los merchants europeos se quedaron SIN solución oficial

Además, la app nativa **"Translate & Adapt"** tiene problemas graves:
- Traducciones que **desaparecen intermitentemente**
- Se queda **atascada semanas** sin completar
- **Rompe emojis y caracteres especiales** (crítico para mercados EU)
- Solo 2 idiomas gratuitos en traducción automática (insuficiente para Europa)

### Dato clave de Shopify.dev:
> *"Solo el 5-7% de las apps públicas están hechas para los mercados europeos prioritarios de Shopify"*

## La oportunidad

Una app tipo **"Enviox Markets"** o **"EuroCommerce"** que resuelva:
1. **Geolocalización inteligente** — Detectar país y redirigir/adaptar automáticamente
2. **Traducción fiable** — Que no pierda contenido ni se atasque
3. **IVA correcto por país** — Cálculo automático con reglas EU
4. **Multi-moneda real** — EUR, GBP, SEK, PLN, CZK...
5. **Cumplimiento legal EU** — RGPD, derecho de desistimiento 14 días

## Competencia actual

| App | Estado | Problema |
|-----|--------|----------|
| Shopify Geolocation (oficial) | ❌ **ELIMINADA** | Ya no existe |
| Translate & Adapt (oficial) | ⚠️ Activa | Pierde traducciones, bugs constantes |
| Apps 3rd party geolocation | ⚠️ Pocas | Difícil desinstalar, redirects rotos |
| Weglot | ✅ Funciona | **Caro** ($15-79/mes) |
| Langify | ✅ Funciona | Solo traducción, no markets completo |

## Análisis

| Factor | Valor | Comentario |
|--------|-------|-----------|
| **Mercado** | ~500K tiendas EU | Todas las tiendas que venden en Europa |
| **Urgencia** | 🟡 Media-Alta | Shopify quitó su app, hay vacío |
| **Moat** | 🟡 Medio | Conocimiento profundo de regulación EU |
| **Implementable** | ✅ Sí | Puro software, sin intermediarios |
| **Cross-sell Enviox** | ✅ Perfecto | "Envías con Enviox → configura tu tienda para España" |
| **Pricing sugerido** | $9.99-19.99/mes | Undercut a Weglot ($15-79) |

## Ventaja competitiva nuestra
- Ya tenemos tiendas usando Enviox → canal de distribución
- Conocimiento del mercado español/europeo
- Soporte en español (pocas apps lo ofrecen)
- La app oficial ya NO EXISTE → marketing fácil

## TODO: Investigar más
- [ ] Cuántas tiendas usaban la Geolocation app de Shopify antes de eliminarla
- [ ] Qué apps de terceros han llenado ese vacío
- [ ] APIs de Shopify Markets — qué funcionalidad exponen
- [ ] Viabilidad técnica de una traducción fiable (¿Google Translate API? ¿DeepL?)
- [ ] Pricing detallado de Weglot y Langify por tier
- [ ] Reviews negativas de Weglot/Langify para entender sus puntos débiles

---

# ⛔ OPORTUNIDAD BAJADA A #4 — Sync Inventario Multi-canal

> **⚠️ ALERTA DEL EXPERTO:** Esta oportunidad parece atractiva por el MRR pero es una TRAMPA para un maker individual. Ver sección "Revisión de Experto" arriba.

## El problema

Los merchants que venden en **Shopify + Amazon + eBay + Etsy** necesitan sincronizar inventario en tiempo real. Las apps existentes **se rompen constantemente**:

### Casos documentados:

| App | Problema | Fuente |
|-----|----------|--------|
| **UniSync Multi Store** | **Multiplica inventario**: stock de 1 aparece como 5, stock de 3 como 15. Soporte desaparecido ("ghosted"). | Shopify reviews, Abril 2025 |
| **Fusion Inventory** | **Update rompió la app** — dejó de ser precisa. 20% de ratings son 1⭐. | Shopify reviews, 2025 |
| Apps genéricas | Sync no es en tiempo real → **overselling** → clientes enfadados | Reddit, comunidad Shopify |

### El dolor es medible:
- **Overselling** = cancelar pedido = review negativa = penalización en Amazon
- **Stockout** = venta perdida = margen perdido
- El merchant pierde dinero DIRECTAMENTE si la app falla

## La oportunidad

Una app **"Enviox Stock"** o **"StockSync Pro"** que:
1. **Sincronización en tiempo real** (no cada 15 min como muchas apps)
2. **Shopify ↔ Amazon ↔ eBay ↔ Etsy ↔ WooCommerce**
3. **Dashboard unificado** de inventario
4. **Alertas de stock bajo** con IA de predicción
5. **Reglas de "buffer"** — reservar X unidades por canal
6. **Historial de cambios** — audit trail de quién cambió qué

## Competencia actual

| App | Rating | Precio | Problema principal |
|-----|--------|--------|-------------------|
| UniSync | ⚠️ Problemas graves | Free-$19.99 | Multiplica stock, soporte ghost |
| Fusion Inventory | 3.6⭐ (20% × 1⭐) | $9.99-49.99 | Updates rompen la app |
| Stock Sync | 4.3⭐ | $5-49 | Básico, no multi-canal real |
| Sellbrite (GoDataFeed) | 4.1⭐ | $29-179 | Caro, complejo |
| Codisto | 4.3⭐ | $29-299 | Solo Amazon/eBay |

## Análisis

| Factor | Valor | Comentario |
|--------|-------|-----------|
| **Mercado** | 🌍 Global | Cualquier merchant multi-canal |
| **Urgencia** | 🔴 Alta | Cada fallo = dinero perdido |
| **Moat** | 🟡 Medio | APIs de Amazon/eBay son complejas; fiabilidad es difícil |
| **Implementable** | ✅ Sí | Software puro, APIs públicas |
| **Cross-sell Enviox** | 🟡 Parcial | Diferente tipo de cliente |
| **Pricing sugerido** | $14.99-49.99/mes | Sweet spot del mercado |
| **Dificultad técnica** | 🔴 Alta | Sync en tiempo real a gran escala es DIFÍCIL |

## Ventaja competitiva potencial
- Fiabilidad como USP: "El sync que NO rompe tu stock"
- UI más clean que las alternativas
- Soporte proactivo (alertas antes de que haya problemas)

## ⚠️ Riesgos
- **Técnicamente complejo**: APIs de Amazon cambian constantemente
- **Soporte intensivo**: si algo falla, el merchant llama inmediatamente
- **Competencia fuerte**: Linnworks, ChannelAdvisor son monstruos (pero caros: $200+/mes)

## TODO: Investigar más
- [ ] APIs de Amazon, eBay, Etsy — complejidad de integración real
- [ ] Cuántas tiendas Shopify venden también en Amazon (datos)
- [ ] Análisis detallado de reviews negativas de UniSync, Fusion
- [ ] Coste de infraestructura para sync en tiempo real
- [ ] Case studies de fallos de sincronización y su impacto económico

---

# 🥉 OPORTUNIDAD #3 — Upsell/Cross-sell Ultraligero

## El problema

Es la **feature más pedida por los merchants** en Reddit y foros de Shopify:
> *"¿Por qué tengo que pagar $30/mes para mostrar 'También te puede gustar' debajo de un producto?"*

Las apps existentes de upsell/cross-sell:
- **Ralentizan la tienda** (inyectan JavaScript pesado)
- Son **difíciles de configurar** (interfaces complejas)
- **Caras** para lo que hacen ($20-50/mes)
- No se integran bien con los temas

### Shopify NO lo ofrece nativamente (a propósito):
Shopify mantiene su core "lean" para que los developers creen apps → comisión del 15% para Shopify. Los merchants sufren.

## La oportunidad

Una app **"LightSell"** o **"Enviox Boost"** que sea:
1. **Ultra-rápido** — 0 impacto en page speed (< 5KB de JS)
2. **Setup en 1 clic** — "Activar upsells" y listo
3. **IA ligera** — recomienda productos basándose en historial de compras (no GPT-4, sino simple co-occurrence analysis)
4. **3 tipos de upsell**: product page, cart, post-purchase
5. **A/B testing** incluido (el diferenciador del Bundler, reutilizado aquí)
6. **Dashboard de revenue** — "Este mes tus upsells generaron +$2,340 extra"

## Competencia actual

| App | Rating | Precio | Problema principal |
|-----|--------|--------|-------------------|
| ReConvert | 4.9⭐ | Free-$14.99 | Solo post-purchase |
| Frequently Bought Together | 4.9⭐ | Free-$9.99 | Solo "comprados juntos" |
| Bold Upsell | 4.3⭐ | $9.99-59.99 | Ralentiza tienda, caro |
| Zipify OCU | 4.7⭐ | $35-75 | Muy caro para SMBs |
| Selleasy | 4.9⭐ | Free-$14.99 | Buen competidor, difícil desbancar |

## Análisis

| Factor | Valor | Comentario |
|--------|-------|-----------|
| **Mercado** | 🌍 4.4M tiendas | Universal — todos quieren vender más |
| **Urgencia** | 🟡 Media | Nice to have, no must-have |
| **Moat** | 🔴 Bajo | Fácil de copiar |
| **Implementable** | ✅ Sí | Software puro |
| **Cross-sell Enviox** | 🔴 Poco | Producto diferente para diferente audiencia |
| **Pricing sugerido** | Free-$14.99/mes | Tiene que ser barato para competir |
| **Competencia** | 🔴 FUERTE | Selleasy y ReConvert son muy buenos |

## ⚠️ Análisis honesto
Este mercado está **más saturado** que los carriers. Apps como Selleasy (4.9⭐, miles de reviews) son difíciles de desbancar. El ángulo diferenciador tendría que ser:
- **Performance**: "0 impacto en velocidad" (medible via Lighthouse)
- **Simplicidad**: "Setup en 30 segundos"
- **A/B testing incluido**: ninguna app barata lo tiene

## TODO: Investigar más
- [ ] Benchmark de velocidad: medir el impacto real de Bold, Selleasy, etc. en page speed
- [ ] Reviews negativas de las apps top — ¿dónde fallan?
- [ ] Viabilidad de un USP de "zero performance impact"
- [ ] ¿Puede el A/B testing ser realmente un diferenciador a este precio?
- [ ] Análisis del funnel de conversión: free → paid

---

# 🥈 OPORTUNIDAD #2 — Preorders Inteligentes (sin overselling) 💎

> **💎 JOYA OCULTA:** El experto la marcó como su favorita en ratio esfuerzo/recompensa. MVP en 4 semanas, argumento de venta trivial, ROI inmediato para el merchant.

## El problema

Tiendas de **moda, sneakers, tech, ediciones limitadas** usan preorders, pero:

### Bug del "Doble Envío" 💸
> Si un cliente compra 1 producto en stock + 1 en preorder, Shopify cobra shipping UNA vez.
> Pero el merchant tiene que enviar DOS paquetes (uno ahora, otro cuando llegue el preorder).
> **Resultado: pierde el coste de un envío en cada pedido mixto.**

### Overselling de preorders
> Shopify NO permite limitar la cantidad de preorders nativamente.
> Resultado: un merchant promete 500 unidades que no va a recibir → cancelaciones masivas.

### Comunicación confusa
> Las apps no comunican bien las fechas estimadas de entrega cuando hay múltiples preorders en un lote.

## La oportunidad

Una app **"PreOrder Smart"** que:
1. **Separa automáticamente** pedidos mixtos (stock + preorder)
2. **Calcula shipping correcto** para envíos separados
3. **Limita cantidad** de preorders por producto
4. **Email automático** con fecha estimada y tracking cuando llega
5. **Dashboard** de preorders pendientes y su estado
6. **Countdown/hype** — widget de "solo quedan X disponibles"

## Competencia actual

| App | Rating | Precio | Problema principal |
|-----|--------|--------|-------------------|
| Pre-Order Manager | 4.5⭐ | Free-$24.95 | No resuelve el doble shipping |
| PreOrder Globo | 4.7⭐ | Free-$19.90 | Limitado en customización |
| Amai PreOrder | 4.3⭐ | $14.99-49.99 | Caro, complejo |
| Timesact | 4.8⭐ | Free-$29 | Mejor competidor |

## Análisis

| Factor | Valor | Comentario |
|--------|-------|-----------|
| **Mercado** | 🌍 Nicho (drops, launches, moda) | No universal pero alto valor |
| **Urgencia** | 🟡 Media | Solo para tiendas que hacen preorders |
| **Moat** | 🔴 Bajo | Feature, no plataforma |
| **Implementable** | ✅ Sí | Software puro, Shopify APIs |
| **Pricing sugerido** | Free-$19.99/mes | Competitivo |

## TODO: Investigar más
- [ ] Cuántas tiendas Shopify usan preorders activamente
- [ ] El bug del doble shipping — ¿alguna app lo resuelve ya?
- [ ] APIs de Shopify para split orders / partial fulfillment
- [ ] Mercado de sneakers/drops — tamaño y disposición a pagar

---

# #5 — ShopifyBundler Pro (IA Bundles)

## El problema

Los merchants crean bundles manualmente. No saben qué productos combinar ni si funciona.

## La oportunidad

Ya documentado extensamente en `ShopifyBundler_1_Business_Plan.md` (52 páginas).

**Resumen rápido de diferenciadores:**
1. IA que analiza ventas y recomienda qué bundlear (market basket analysis)
2. GPT-4 genera títulos/descripciones en 1 clic
3. A/B testing nativo (único en mercado a este precio)
4. Bundles estacionales automáticos
5. Segmentación por tipo de cliente

## Análisis (opinión post-investigación)

| Factor | Valor | Comentario |
|--------|-------|-----------|
| **Mercado** | 🌍 4.4M tiendas | Enorme pero ultra-competido |
| **Urgencia** | 🟡 Media | Nice to have |
| **Moat** | 🔴 Bajo | Fast Bundle ya dice "AI-powered". Shopify tiene bundles gratis. |
| **Implementable** | ✅ Sí | Software puro |
| **Riesgo** | 🔴 Alto | 15+ competidores con miles de reviews |
| **Reward** | 🟢 Alto | Si despega, el MRR es masivo |
| **Pricing sugerido** | $19-49/mes | Según Business Plan |

## Diferencias vs análisis original del experto
- El Plan dice "ningún competidor usa IA" → **FALSO en 2026** (Fast Bundle, AOV.ai ya lo anuncian)
- Shopify Bundles nativo es **gratis** → aplasta el bottom del funnel
- LTV/CAC de 33x → probablemente **optimista** en mercado tan saturado

## Recomendación
**Viable pero arriesgado.** Mejor como 3er o 4º producto, no como siguiente prioridad. El ángulo debería pivotar de "IA genérica" a **"predicción de revenue + A/B testing"** como USP más defendible.

## TODO: Investigar más
- [ ] Auditar qué hace realmente Fast Bundle con "AI" (¿es real o marketing?)
- [ ] Benchmark: instalar las top 5 apps y probar UX
- [ ] ¿El A/B testing sigue siendo único?
- [ ] Modelo freemium: ¿puede un plan gratis competir con Shopify Bundles nativo?

---

# ⚠️ OPORTUNIDAD APARCADA — Verifactu / Facturación Legal España

## Por qué está aparcada

**Barrera legal/regulatoria insalvable sin certificación:**
- Para conectarse directamente con la AEAT se necesita ser **operador intermediario certificado**
- Requiere **seguro de responsabilidad civil** (las sanciones son enormes)
- Las apps como Easy Verifactu y Comply probablemente operan a través de intermediarios certificados
- No es viable "hacerlo tú mismo" como con una API de carrier

## Pero sigue siendo ORO si se resuelve la barrera

| Factor | Valor |
|--------|-------|
| **Mercado** | 52.000 tiendas España (TODAS necesitan esto) |
| **Urgencia** | 🔴 OBLIGATORIO por ley: 1 Ene 2027 (empresas), 1 Jul 2027 (autónomos) |
| **Competencia** | Billin 1.4⭐, Easy Verifactu 5⭐ (2 reviews), Comply 5⭐ (2 reviews) |
| **Moat** | 🟢 Altísimo — la certificación ES el moat |
| **Cross-sell** | ✅ Perfecto — mismos clientes que Enviox Carriers |

### Posible vía: actuar como RESELLER de un operador certificado
En vez de certificarnos nosotros, ser un **frontend bonito** sobre un backend certificado (como Easy Verifactu o Quaderno). Cobrar menos, ofrecer mejor UX.

## TODO: Investigar más
- [ ] ¿Es posible actuar como reseller/white-label de un operador certificado?
- [ ] Requisitos exactos de la AEAT para ser operador
- [ ] Coste del seguro de responsabilidad civil
- [ ] ¿Quaderno tiene API/programa de partners?
- [ ] ¿Billin tiene white-label?

---

# ❌ DESCARTADOS (investigados y descartados)

| Categoría | Investigado | Por qué NO |
|-----------|:---:|-----------|
| **Reviews de producto** | ✅ | Ultra-saturado: Yotpo (45K+ tiendas), Judge.me (25K+), Loox, Stamped |
| **SEO** | ✅ | Shopify mejora constantemente su SEO nativo, apps genéricas |
| **Email marketing** | ✅ | Klaviyo domina absolutamente (~100K tiendas) |
| **Loyalty / Fidelización** | ✅ | Smile.io y LoyaltyLion dominan, barrera de red |
| **Print on demand** | ✅ | Printful y Printify dominan, margen muy bajo |
| **Page builders** | ✅ | Shogun y PageFly dominan, Shopify mejora secciones nativas |
| **Returns genéricos** | ✅ | Loop, AfterShip, ReturnGO funcionan bien (4-5⭐) |
| **Cookie/RGPD** | ✅ | Muchas apps decentes, no hay dolor extremo |
| **Verificación de edad** | ✅ | Nicho muy pequeño, regulación UK no aplica a España |

---

# 🎯 RECOMENDACIÓN ESTRATÉGICA (actualizada post-experto)

## Roadmap refinado

```
AHORA (Q1 2026)
└── ✅ Enviox Carriers (MRW + Correos + DHL) — EN PRODUCCIÓN
    └── Conseguir primeros 10-20 clientes de pago
    └── Iterar con feedback real

SIGUIENTE (Q2 2026) — DOBLE VÍA:
├── 🥇 Geolocation + Markets EU     ← Producto ESTRATÉGICO (sinergía, marca)
└── 🥈 Preorders Inteligentes       ← Producto TÁCTICO (cash rápido, MVP 4 sem)

DESPUÉS (Q3-Q4 2026):
├── Verifactu (si encontramos partner certificado)
├── Expansión carriers (SEUR, GLS, Nacex...)
└── Evaluar Bundler Pro (solo si hay tracción y caja)

❌ DESCARTADO DEL ROADMAP:
└── Inventario Multi-canal (trampa técnica, soporte 24/7)
```

## Por qué doble vía (Geolocation + Preorders):

| | Geolocation EU | Preorders |
|--|:---:|:---:|
| **Tipo** | Estratégico | Táctico |
| **Sinergía Enviox** | ✅ Perfecta | 🟡 Parcial |
| **Tiempo de desarrollo** | 8-12 semanas | 4 semanas |
| **Argumento de venta** | "Tu tienda lista para Europa" | "Ahorra 6€ por pedido mixto" |
| **Cross-sell** | Carriers → Markets | Independiente |
| **Complejidad técnica** | Media | Baja |
| **Se pisan entre sí** | ❌ No | ❌ No |

---

# 📎 FUENTES Y METODOLOGÍA

## Búsquedas realizadas (20/02/2026)

1. `Shopify app store worst rated apps 1 star reviews broken complaints 2025 2026`
2. `Shopify app store Spain "no funciona" "1 estrella" reviews complaints`
3. `Shopify app store invoicing billing Spain "recargo equivalencia" "factura" bad reviews`
4. `Shopify app store "worst app" OR "terrible" OR "doesn't work" most complaints 2025`
5. `Shopify app "Verifactu" OR "SII" OR "TicketBAI" Spain tax compliance`
6. `Shopify app store Europe "returns" OR "devoluciones" app bad reviews`
7. `Shopify app store "POS" point of sale Spain Europe problems complaints`
8. `Shopify app store "print on demand" OR "dropshipping" Spain supplier problems`
9. `Shopify app store categories fewest apps low competition underserved niches 2025`
10. `Shopify app "age verification" OR "B2B wholesale" OR "preorder" problems Europe`
11. `Shopify app "warranty" OR "size guide" OR "product customizer" low competition`
12. `Shopify app Spain "etiquetado" OR "customs" OR "RGPD" OR "cookie" compliance`
13. `Shopify app "inventory management" OR "stock sync" multi-channel problems`
14. `Shopify app "translation" OR "multi-language" OR "geolocation" Europe problems`
15. `Shopify app "subscription" OR "recurring" OR "membership" complaints broken`
16. `Shopify app most requested features missing native gaps merchants frustrated reddit`

## Datos clave del ecosistema Shopify (2026)

- **4.4M** tiendas activas globalmente
- **~52.000** tiendas en España
- **~500.000** tiendas en Europa
- **Revenue share Shopify**: 0% primeros $1M/año, 15% después
- **Solo 5-7%** de apps públicas atienden mercados EU prioritarios
- **App Geolocation oficial eliminada** Feb-Mar 2025
- **Verifactu obligatorio**: Ene 2027 (empresas), Jul 2027 (autónomos)
- **REST API deprecation**: Shopify migrando a GraphQL en 2025-2026
