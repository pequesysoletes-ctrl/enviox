# GEOMARKETS EU
## Business Plan — Guía de Negocio
### Documento 1 de 5 — Febrero 2026

---

## 1. Resumen Ejecutivo

**GeoMarkets EU** es una app de Shopify que reemplaza la app oficial de Geolocation (eliminada por Shopify en Feb-Mar 2025). Detecta el país del visitante por IP, redirige al mercado correcto de Shopify Markets, y ofrece un selector de país/idioma/moneda como App Block integrado en el tema.

### Datos clave

| Parámetro | Definición |
|-----------|-----------|
| **Precio** | 9,99€ - 29,99€ / mes |
| **MVP** | 6-8 semanas |
| **Objetivo MRR** | 6.000€ netos/mes (12 meses) |
| **Ventana de oportunidad** | AHORA — Shopify eliminó su app, vacío oficial |

### Ventaja competitiva

- **Shopify eliminó su app de Geolocation** (Feb 2025) → vacío de mercado real
- Solo 5-7% de las apps públicas atienden mercados europeos
- Cross-sell natural con Enviox Carriers (enviar + adaptar tienda)
- Detección en el Edge (Cloudflare Workers) → sin parpadeo, latencia <100ms

---

## 2. El Problema — Dolor Real

### Lo que pasó

Shopify eliminó su propia app de Geolocation:
- **1 Feb 2025**: dejó de ser instalable
- **24 Mar 2025**: desinstalada de TODAS las tiendas
- Miles de merchants europeos se quedaron sin solución

### El dolor específico documentado:

1. **Sin redirección geográfica** — visitantes de Francia ven precios en USD, idioma inglés, y se van
2. **Translate & Adapt (nativa)** tiene bugs graves:
   - Traducciones que desaparecen intermitentemente
   - Se queda atascada semanas sin completar
   - Rompe emojis y caracteres especiales
   - Solo 2 idiomas automáticos gratuitos
3. **Apps de terceros** son caras ($15-79/mes Weglot) o solo cubren traducción, no la geolocalización completa
4. **Falta de cumplimiento EU**: IVA mal calculado, monedas incorrectas, sin adaptación legal (desistimiento 14 días, RGPD)

### Dato clave de Shopify.dev:
> *"Solo el 5-7% de las apps públicas están hechas para los mercados europeos prioritarios de Shopify"*

---

## 3. La Solución — GeoMarkets EU

### Funcionalidades core:

1. **Detección geográfica en el Edge**
   - IP → país → mercado correcto
   - Cloudflare Workers + MaxMind/ipstack
   - Latencia <100ms, sin parpadeo (no useEffect)
   - Script ligero en `<head>` (<5KB)

2. **Integración nativa con Shopify Markets**
   - Lee automáticamente los mercados configurados (GraphQL Admin API)
   - Redirige a subdominio, subcarpeta o dominio según config
   - Sincronización de idiomas y monedas

3. **Selector País/Idioma (App Block)**
   - Bloque Shopify 2.0 editable desde el tema
   - Posición: flotante, header integrado, o footer
   - Customizable: colores, banderas, tipografía
   - Mobile responsive

4. **Lógica inteligente**
   - No redirige bots de Google/SEO (evita penalizaciones)
   - Respeta elección manual del usuario (cookie `app_geo_override`)
   - Banner de confirmación antes de redirigir (configurable)
   - Reglas de exclusión por URL/path

5. **Dashboard de tráfico geográfico**
   - Visitantes por país
   - Redirecciones realizadas
   - Conversión por mercado
   - Países sin mercado configurado → sugerir crear uno

---

## 4. Mercado, Competencia y Pricing

### TAM (Total Addressable Market)

- ~500,000 tiendas Shopify activas en Europa
- De esas, **~200,000** venden en más de un país EU
- Target inicial: **tiendas en España que venden a EU** (~15,000-25,000)
- Expansión: cualquier tienda Shopify con Shopify Markets configurado

### Competencia directa

| Competidor | Estado | Precio | Problema |
|-----------|--------|--------|----------|
| Shopify Geolocation (oficial) | ❌ **ELIMINADA** | Gratis | Ya no existe |
| Translate & Adapt (oficial) | ⚠️ Activa | Gratis | Solo traducción, bugs |
| Weglot | ✅ Funciona | $15-79/mes | **MUY caro**, no markets completo |
| Langify | ✅ Funciona | $17.50/mes | Solo traducción |
| Geolocation Redirects (3rd party) | ⚠️ | $5-20/mes | Difícil desinstalar, redirects rotos |

### Competencia indirecta:
- Shopify Markets (nativo) — gestión de mercados pero SIN geolocation
- Hreflang Tags apps — solo SEO, no redireccionan
- Apps de traducción puras — no detectan país

### Pricing propuesto (undercut a Weglot)

| Plan | Precio | Target | Incluye |
|------|--------|--------|---------|
| **Basic** | 9,99€/mes | Tiendas pequeñas | Geolocation + redirect, 3 mercados, selector básico |
| **Pro** | 19,99€/mes | PYMEs, multi-idioma | Mercados ilimitados, CSS custom, analytics de tráfico |
| **Agency** | 29,99€/mes | Agencias Shopify | Multi-tienda, soporte prioritario, API access |

### MRR objetivo:

| Meta | Tiendas | Ticket medio | MRR |
|------|---------|-------------|-----|
| Conservadora (12 meses) | 200 | 15€ | **3.000€** |
| Optimista (12 meses) | 400 | 17€ | **6.800€** |
| Ambiciosa (18 meses) | 800 | 18€ | **14.400€** |

---

## 5. Adquisición — Primeros 50 Clientes

### Canal 1 — Shopify App Store SEO (Clientes 1-15)

**Keywords target:**
- "shopify geolocation alternative"
- "shopify geolocation replacement"
- "country redirect shopify"
- "shopify markets redirect"
- "geolocalización shopify"
- "selector país shopify"

Al reemplazar una app **oficial eliminada**, cualquier búsqueda relacionada nos encontrará. El volumen de búsqueda será alto porque miles de merchants buscan alternativa.

### Canal 2 — Infiltración en comunidades (Clientes 16-30)

**"Asistencia Técnica Oportunista"** (no spam):
- Reddit r/shopify — responder posts sobre "geolocation app removed"
- Shopify Community Forums — threads sobre Markets + geolocation
- Facebook "Shopify España" (~3,200 miembros)
- **Oferta beta**: "Estamos lanzando una alternativa gratuita durante 3 meses"

### Canal 3 — Cross-sell desde Enviox Carriers (Clientes 31-40)

- Banner in-app en MRW Pro / Correos Pro: *"¿Envías a Europa? Adapta tu tienda automáticamente"*
- **Este canal es exclusivo nuestro** — ningún competidor tiene una app de logística instalada en las mismas tiendas
- El pitch es natural: si envías con Enviox a Francia → tu tienda debería estar en francés

### Canal 4 — Content Marketing SEO (Clientes 41-50)

- Blog: "Guía definitiva: qué hacer tras el cierre de la app de Geolocation de Shopify"
- Blog: "Cómo configurar Shopify Markets para vender en toda Europa (2026)"
- YouTube: "Tutorial: selector de país y redirección en Shopify sin Geolocation"
- Estos contenidos se posicionarán solos — hay vacío de contenido

### Canal 5 — Partners / Agencias

- ~20-30 agencias Shopify en España
- Oferta: "Cuenta Partner gratuita + soporte prioritario si lo recomendáis a vuestros clientes"
- Una agencia puede traer 10 clientes de golpe en una semana

---

## 6. Riesgos y KPIs

### Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|-------------|---------|-----------|
| Shopify relanza Geolocation nativa | Media | Alto | Diferenciarnos con analytics EU + cumplimiento legal |
| Weglot baja precios | Baja | Medio | Nuestro precio ya es 50-80% más bajo |
| APIs de Markets cambian | Baja | Medio | Seguir Shopify changelog, GraphQL versionado |
| Pocas tiendas usan Markets realmente | Media | Alto | Content marketing educando sobre Markets |
| Regulación RGPD con geolocation | Baja | Medio | No almacenamos IP, procesamos y descartamos |

### KPIs

| KPI | Meta 6 meses | Meta 12 meses |
|-----|-------------|---------------|
| Instalaciones | 150 | 500 |
| Conversión trial → pago | >12% | >18% |
| MRR | 1.500€ | 6.000€ |
| Churn mensual | <5% | <3% |
| Rating App Store | >4.5★ | >4.8★ |
| Redirecciones procesadas/día | 10K | 100K |

---

## 7. Sinergias con Ecosistema Enviox

### Cross-sell bidireccional

```
Enviox Carriers → GeoMarkets EU
"Si envías a Europa, tu tienda tiene que estar adaptada"

GeoMarkets EU → Enviox Carriers  
"Tu tienda ya está en francés — ¿necesitas enviar con Correos/DHL?"
```

### Datos compartidos
- Si un merchant tiene Markets configurados para FR, DE, IT → Enviox puede preconfigurar carriers para esos países
- Dashboard unificado potencial: Envíos + Tráfico por país

### Branding
- GeoMarkets EU usa el ecosistema Enviox como marca paraguas
- Misma paleta de colores (Enviox green), misma experiencia de admin

---

*Documento 1 de 5 — Business Plan*
*GeoMarkets EU — Febrero 2026*
