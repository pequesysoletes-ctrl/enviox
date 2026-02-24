# SHOPIFY RE
## UI/UX Design Specifications
### Documento 3 de 5 — Febrero 2026

---

## 1. Design System

### Plataforma: Shopify Polaris

A diferencia de WooCommerce RE (WordPress wp-admin style), Shopify RE usa **Shopify Polaris** como sistema de diseño. Esto significa:
- Componentes nativos de Polaris (Card, Page, DataTable, Badge, Banner, etc.)
- Paleta de colores Shopify
- Tipografía del sistema Shopify
- Misma experiencia que el admin de Shopify → el merchant se siente "en casa"

### Colores clave

```css
/* Shopify Polaris */
--p-color-bg-primary: #008060;        /* Shopify green */
--p-color-bg-critical: #d72c0d;       /* Errors */
--p-color-bg-warning: #916a00;        /* Warnings */
--p-color-bg-success: #008060;        /* Success */
--p-color-bg-info: #2c6ecb;          /* Info */
--p-color-bg: #f6f6f7;              /* Page background */
--p-color-bg-surface: #ffffff;       /* Card background */

/* RE Custom accent */
--re-accent: #6B21A8;               /* Purple for RE-specific elements */
--re-badge: #7C3AED;                /* RE customer badge */
```

---

## 2. Las 10 Pantallas de la App

### Pantalla 01 — Configuración de la App

**Contenido:**
- Activar/desactivar RE
- Tabla de tipos RE vigentes (21%→5.2%, 10%→1.4%, 4%→0.5%)
- Comportamiento: automático vs manual vs solicitud del cliente
- Datos fiscales del vendedor (nombre, NIF, dirección)
- Opciones de export (prefijo referencia, formato CSV)

**Componentes Polaris:** Page, Card, FormLayout, TextField, Checkbox, Select, Banner (info con explicación RE)

---

### Pantalla 02 — Lista de Clientes RE

**Contenido:**
- Data table con todos los clientes marcados como RE
- Columnas: nombre, email, NIF, tipo comercio, estado RE, pedidos RE, último pedido
- Filtros: buscar, estado (activo/inactivo/pendiente)
- Acciones bulk: activar, desactivar, exportar
- Resumen: total clientes RE, RE cobrado, pedidos procesados

**Componentes Polaris:** Page, IndexTable, Badge, Filters, Button (añadir cliente)

---

### Pantalla 03 — Ficha de Cliente RE (Crear/Editar)

**Contenido:**
- Info del cliente Shopify (read-only, vinculado)
- Formulario datos fiscales: NIF con validación, razón social, tipo comercio, dirección fiscal
- Estado del recargo: toggle, fecha activo, tipo aplicable
- Documentación: upload certificado comerciante
- Aviso legal: responsabilidad del vendedor

**Componentes Polaris:** Page, Card, FormLayout, TextField, Select, DropZone (upload), Banner (warning)

---

### Pantalla 04 — Preview RE en Checkout (Customer-facing)

**Contenido:**
- Así se ve el checkout para un cliente con RE activo
- Línea separada: "Recargo de Equivalencia (5.2%): X,XX€"
- Badge "🏪 Cliente RE verificado"
- Es una Checkout UI Extension, no es admin

**Nota:** Esta pantalla se muestra dentro del checkout de Shopify, usando componentes de `@shopify/ui-extensions-react/checkout`, no Polaris

---

### Pantalla 05 — Lista de Pedidos con RE

**Contenido:**
- Data table con pedidos que incluyen RE
- Columnas: pedido, cliente, NIF, subtotal, IVA, RE, total, estado, fecha
- Filtros: fecha, cliente, estado
- Resumen: total RE cobrado en período, total pedidos RE
- Bulk actions: exportar CSV para gestoría

**Componentes Polaris:** Page, IndexTable, Badge, Filters, DatePicker, Button

---

### Pantalla 06 — Dashboard de Reportes

**Contenido:**
- 4 KPIs: total RE cobrado (mes), pedidos con RE, clientes activos, ticket medio RE
- Gráfico barras: RE cobrado por mes (6 meses)
- Desglose por tipo de IVA (general/reducido/superreducido)
- Top clientes RE del mes
- Próximas obligaciones fiscales (modelo 309)

**Componentes Polaris:** Page, Card, Layout, IndexTable
**Charts:** @shopify/polaris-viz (LineChart, BarChart)

---

### Pantalla 07 — Export CSV / Datos Fiscales

**Contenido:**
- Selector de período: mes, trimestre, año, personalizado
- Datos a incluir: checklist (pedido, cliente, IVA, RE, totales)
- Formato: CSV, Excel, PDF
- Vista previa de los datos
- Resumen del período
- Botones: descargar, enviar por email

**Componentes Polaris:** Page, Card, ChoiceList, RadioButton, DataTable (preview)

---

### ~~Pantalla 08 — Factura con RE~~ (ELIMINADA)

> **NOTA**: La app NO genera facturas. La facturación queda del lado del merchant/gestoría con su software certificado (Verifactu compliant). Esta pantalla se sustituye por un botón de export de datos del pedido RE en formato CSV.

---

### Pantalla 09 — Billing / Plan

**Contenido:**
- 3 planes via Shopify Billing API:
  - Starter (9.90€): 10 clientes RE, cálculo checkout, CSV
  - Growth (19.90€): 50 clientes, dashboard, soporte
  - Pro (39.90€): ilimitado, API, soporte prioritario
- Plan actual, próximo cobro de Shopify
- Historial de pagos (gestionado por Shopify)

**Componentes Polaris:** Page, Card, CalloutCard, Badge

---

### Pantalla 10 — Onboarding / Welcome

**Contenido:**
- Bienvenida a Shopify RE
- 3 pasos: Configurar datos fiscales → Añadir primer cliente RE → Ver pedidos
- Explicación breve del RE
- CTA: "Empezar configuración"
- Trust: "Plugin certificado, datos encriptados"

**Componentes Polaris:** Page, Card, ProgressBar, Button, TextContainer

---

## 3. Integración en el Frontend (Checkout)

### Checkout UI Extension

La extensión de checkout muestra:
1. **Badge** en el resumen: "🏪 Régimen RE"
2. **Línea adicional** en el desglose de impuestos: "Recargo de Equivalencia (5.2%): €4.94"
3. **Info tooltip**: explicación breve del RE para el comprador

### Order Status Page Extension

Después del pago:
- Nota en la página de confirmación: "Este pedido incluye Recargo de Equivalencia"
- Botón para exportar datos RE del pedido (CSV)

---

*Documento 3 de 5 — UI/UX Design Specifications*
*Shopify RE — Febrero 2026*
