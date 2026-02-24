# SHOPIFY RE
## Business Plan — Guía de Negocio
### Documento 1 de 5 — Febrero 2026

---

## 1. Resumen Ejecutivo

**Shopify RE** es una app de Shopify que gestiona automáticamente el **Recargo de Equivalencia** (RE), un régimen especial de IVA obligatorio en España para comerciantes minoristas. La app permite a los vendedores identificar clientes RE, calcular y cobrar el recargo automáticamente en el checkout y exportar datos fiscales para que la gestoría emita las facturas con su software certificado (Holded, A3, Sage, etc.).

> **Nota importante**: La app NO genera facturas. Actúa como motor de cálculo fiscal + cobro en checkout. La responsabilidad de facturación (Verifactu, SII) queda del lado del merchant y su gestoría.

### Diferencias clave vs WooCommerce RE

| Aspecto | WooCommerce RE | Shopify RE |
|---------|---------------|------------|
| **Plataforma** | Plugin WordPress / WooCommerce | Shopify App (Polaris UI) |
| **Distribución** | Freemius / WordPress.org | Shopify App Store |
| **Instalación** | ZIP + FTP / Dashboard WP | 1-click desde App Store |
| **Revenue model** | Licencia anual | Suscripción mensual (Shopify Billing API) |
| **API de impuestos** | Hooks WooCommerce (woocommerce_calc_tax) | Shopify Tax API + metafields |
| **Gestión de datos** | WordPress Options + Order Meta + User Meta | Shopify Metafields + Metaobjects |
| **UI** | WordPress wp-admin style | Shopify Polaris componentes |
| **Autenticación** | WordPress nonce + capabilities | Shopify OAuth 2.0 + Session Tokens |
| **SCI** | HPOS (High Performance Order Storage) | Shopify GraphQL Admin API |

### Ventaja competitiva

- **No existe NINGUNA app de RE en el Shopify App Store** (verificado feb 2026)
- Los ~8,000 comercios Shopify en España que venden a minoristas gestionan el RE manualmente o con facturas externas
- Oportunidad de ser **first mover** con monopolio temporal

---

## 2. El Problema — Dolor Real

El Recargo de Equivalencia es una obligación fiscal española (Art. 154-163 Ley 37/1992 del IVA) que afecta a:
- **Autónomos y empresas** que compran mercancía para revender
- **Comerciantes minoristas** acogidos al régimen simplificado

### El dolor específico en Shopify:
1. **Shopify no tiene funcionalidad nativa de RE** — ni siquiera tiene concepto de "tipos de impuesto múltiples por cliente"
2. **Los vendedores B2B/B2C en España** que venden a minoristas necesitan:
   - Identificar qué clientes son RE
   - Aplicar el recargo (5.2%, 1.4%, 0.5%) en cada pedido
   - Desglosar RE separado del IVA en el cobro
   - Exportar datos para el modelo 309/349
3. **Actualmente** estas tiendas usan hojas de Excel o simplemente no cobran el RE correctamente, perdiendo dinero o arriesgando sanciones

### Porcentajes actuales de RE:

| Tipo IVA | % IVA | % Recargo Equivalencia | Total |
|----------|-------|----------------------|-------|
| General | 21% | 5.2% | 26.2% |
| Reducido | 10% | 1.4% | 11.4% |
| Superreducido | 4% | 0.5% | 4.5% |

---

## 3. La Solución — Shopify RE App

### Funcionalidades core:

1. **Gestión de clientes RE**
   - Marcar/desmarcar clientes como RE vía metafields
   - Almacenar NIF, tipo comercio, documentación
   - Verificación de NIF (formato)

2. **Cálculo automático de RE**
   - Detectar productos con diferentes tipos de IVA
   - Aplicar el % de RE correspondiente
   - Mostrar desglose en checkout (via Shopify Functions)

3. **Integración en checkout**
   - Shopify Checkout UI Extension
   - Mostrar línea de RE separada
   - Compatible con Shopify Checkout Extensibility

4. **Datos listos para la gestoría**
   - La app NO genera facturas (evita complejidad Verifactu/SII)
   - Exporta todos los datos necesarios para que la gestoría facture con su software certificado
   - Compatible con cualquier ERP o software de facturación

5. **Dashboard e informes**
   - Total RE cobrado por período
   - Desglose por tipo de IVA
   - Exportación CSV para gestoría
   - Recordatorios modelo 309

---

## 4. Mercado, Competencia y Pricing

### TAM (Total Addressable Market)

- ~52,000 tiendas Shopify activas en España (2025)
- **~8,000** venden B2B o mixto B2B/B2C (target)
- De esas, **~2,500** tienen clientes minoristas frecuentes que necesitan RE

### Competencia directa

| Competidor | Plataforma | Estado | Precio |
|-----------|-----------|--------|--------|
| Ninguno | Shopify | — | — |

**No hay competencia directa en Shopify App Store.** El RE es legislación española específica y Shopify es plataforma global. Esto es una ventaja brutal.

### Competencia indirecta (soluciones alternativas):
- Facturación con RE manual (Holded, Billin, Quaderno) — no integrada en el checkout de Shopify
- Excel manual — propenso a errores
- Apps genéricas de impuestos — no entienden RE

### Pricing propuesto

| Plan | Precio | Target | Incluye |
|------|--------|--------|---------|
| **Starter** | 9,90€/mes | Autónomos, poco volumen RE | 10 clientes RE, cálculo auto, checkout |
| **Growth** | 19,90€/mes | PYMEs, volumen medio | 50 clientes RE, dashboard, soporte email |
| **Pro** | 39,90€/mes | B2B pesado | Ilimitado, API, soporte prioritario, multi-idioma |

### MRR objetivo (18 meses):
- Meta conservadora: 100 tiendas × ~20€ = **2,000€ MRR**
- Meta optimista: 250 tiendas × ~25€ = **6,250€ MRR**

---

## 5. Adquisición — Primeros 50 Clientes

### Canal 1 — Shopify App Store SEO (Clientes 1-20)

**Keywords target:**
- "recargo de equivalencia"
- "recargo equivalencia shopify"
- "impuestos españa shopify"
- "IVA recargo shopify"

Al ser la **única app** que resuelve esto, el posicionamiento orgánico será natural. Cualquier búsqueda relacionada con RE + Shopify nos encontrará.

### Canal 2 — Content Marketing (Clientes 21-35)

- Blog post: "Cómo gestionar el Recargo de Equivalencia en Shopify (2026)"
- Video YouTube: "Tutorial: Cobrar el RE automáticamente en Shopify"
- Guía: "Todo lo que necesitas saber sobre el RE en ecommerce"
- Estos contenidos se posicionarán bien porque no hay competencia

### Canal 3 — Comunidades y foros (Clientes 36-50)

- Comunidad Shopify España en Facebook (~3,200 miembros)
- r/shopify (buscando posts sobre impuestos España)
- Foros de emprendedores (forobeta, etc.)
- Responder preguntas en Shopify Community sobre RE

### Canal 4 — Cross-sell desde MRW Pro / Correos Pro

- **Este es el canal más valioso.** Las tiendas que ya usan nuestras apps de logística en España son el target perfecto para RE
- Banner in-app: "¿Vendes a comerciantes minoristas? Prueba Shopify RE"
- Email cross-sell a base de usuarios existente

---

## 6. Riesgos y KPIs

### Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|-------------|---------|------------|
| Shopify lanza RE nativo | Baja | Alto | Diferenciarnos con dashboard fiscal avanzado |
| Cambio legislativo RE | Media | Medio | Monitorizar BOE, actualización rápida |
| Checkout Extensibility cambia | Media | Alto | Seguir Shopify changelog, adaptarse |
| Mercado demasiado pequeño | Media | Alto | Cross-sell con logística, ampliar a Portugal |

### KPIs

| KPI | Meta 6 meses | Meta 12 meses |
|-----|-------------|---------------|
| Instalaciones | 80 | 200 |
| Conversión trial → pago | >15% | >20% |
| MRR | 800€ | 2,000€ |
| Churn mensual | <5% | <3% |
| Rating App Store | >4.5★ | >4.7★ |
| Clientes RE gestionados | 500 | 2,000 |

---

## 7. Reutilización de Código desde WooCommerce RE

### Lo que se reutiliza (concepto + lógica):
- Lógica de cálculo de RE (porcentajes, tipos de IVA)
- Estructura de datos de cliente RE
- Formato de datos con desglose RE (para export CSV)
- Dashboard de reportes (métricas, gráficos)
- Exportación CSV (formato compatible con gestorías)
- Validación de NIF (algoritmo)

### Lo que hay que reescribir (plataforma):
- Stack técnico: PHP → Node.js/Remix (Shopify App)
- UI: WordPress wp-admin → Shopify Polaris
- Almacenamiento: WordPress Options/Meta → Shopify Metafields/Metaobjects
- Auth: WordPress nonce → Shopify OAuth + Session Tokens
- Billing: Freemius → Shopify Billing API
- Checkout: WooCommerce hooks → Shopify Checkout UI Extensions
- Distribución: WordPress.org → Shopify App Store

### Estimación de ahorro:
- Sin reutilización: **12 semanas**
- Con reutilización conceptual: **7-8 semanas** (35% ahorro)
- El ahorro es menor que entre MRW↔Correos porque cambiamos de plataforma

---

*Documento 1 de 5 — Business Plan*
*Shopify RE — Febrero 2026*
