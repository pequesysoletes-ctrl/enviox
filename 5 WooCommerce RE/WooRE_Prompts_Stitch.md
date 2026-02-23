# WooCommerce RE — Prompts para Google Stitch + Guía de Workflow

> **Versión optimizada para stitch.withgoogle.com**
> Febrero 2026

---

## PARTE 1: Cómo usar estos prompts en Stitch

### Flujo de trabajo recomendado

```
Por cada pantalla:
1. Copia el prompt en Stitch (modo Experimental para pantallas complejas)
2. Genera → Revisa → Itera con el chat ("cambia X", "alinea Y")
3. Cuando estés satisfecho → Exportar ZIP (imagen + HTML/CSS)
4. Repite para las 10 pantallas
5. Al final: unifica todo (ver Parte 3)
```

### Configuración en Stitch

- **Modo Standard**: Pantallas simples → 01, 04, 08
- **Modo Experimental**: Pantallas complejas → 02, 03, 05, 06, 07
- **Plataforma**: Selecciona siempre **"Web"** (no mobile)
- **Tema**: Light

### Tips para mejores resultados en Stitch

- Si no clava el estilo WordPress, di: "Make it look like a WordPress admin panel with WooCommerce purple #7F54B3 accents"
- UI es de panel de administración WordPress (no Shopify Polaris), usar estilo wp-admin
- Todo el contenido en español (mercado España)

---

## PARTE 2: Los 10 Prompts adaptados para Stitch

---

### PANTALLA 01 — Configuración del Plugin

```
Web app settings screen for "WooCommerce RE", a WordPress/WooCommerce plugin that manages Recargo de Equivalencia (Spanish tax surcharge for retail merchants). This runs inside the WordPress admin panel.

Colors: WooCommerce purple #7F54B3, WordPress admin dark sidebar #23282D, content background #F0F0F1, cards white, success green #46B450, warning amber #FFBA00. Font: -apple-system, BlinkMacSystemFont, Segoe UI. Style: WordPress admin panel (wp-admin style).

WordPress admin layout with dark sidebar on left showing WP menu items (Dashboard, Posts, Pages, WooCommerce, etc.) with "RE Equivalencia" highlighted in purple.

MAIN CONTENT AREA:

Page title: "Recargo de Equivalencia — Configuración"
Subtitle: "Gestiona el recargo de equivalencia para comerciantes minoristas"

Card 1 — "Configuración general" with WooCommerce purple header bar:
- Toggle ON: "☑ Activar Recargo de Equivalencia"
- Info box (light blue): "El Recargo de Equivalencia es un régimen especial de IVA para comerciantes minoristas en España. Los porcentajes actuales son: 5.2% (tipo general 21%), 1.4% (tipo reducido 10%), 0.5% (tipo superreducido 4%)."
- Table showing current RE rates:
  | Tipo IVA | % IVA | % Recargo | Total |
  | General | 21% | 5.2% | 26.2% |
  | Reducido | 10% | 1.4% | 11.4% |
  | Superreducido | 4% | 0.5% | 4.5% |
- Small text: "Estos tipos son los vigentes según la normativa fiscal española"

Card 2 — "Comportamiento":
- Radio buttons:
  ● "Aplicar RE automáticamente a clientes marcados como RE" — selected
  ○ "Preguntar al cliente en el checkout si es comerciante minorista"
  ○ "Solo aplicar RE manualmente desde el panel"
- Toggle: "☑ Mostrar desglose RE en facturas"
- Toggle: "☑ Mostrar RE como línea separada en el carrito"
- Toggle: "☐ Permitir al cliente solicitar RE desde su cuenta"

Card 3 — "Datos fiscales del vendedor":
- Input: "Nombre empresa" showing "Mi Tienda S.L."
- Input: "NIF / CIF" showing "B12345678"
- Input: "Dirección fiscal"
- Checkbox: "☑ Incluir estos datos en las facturas con RE"

Bottom: Purple button "Guardar cambios" in #7F54B3

All text in Spanish. WordPress admin style.
```

---

### PANTALLA 02 — Lista de Clientes RE

```
Web app customer list screen for "WooCommerce RE" plugin, inside WordPress admin.

Colors: WooCommerce purple #7F54B3, WP admin style. Font: system-ui.

WordPress admin layout with sidebar.

Page title: "Clientes con Recargo de Equivalencia"
Button top-right: "Añadir cliente RE" in purple #7F54B3

Filter bar: Search input "Buscar por nombre, email o NIF..." + Status dropdown (Todos, Activo RE, Inactivo)

WP-admin style data table with 6 rows:
Columns: ☑ | Cliente | Email | NIF/CIF | Tipo Comercio | Estado RE | Pedidos RE | Último pedido | Acciones

- ☑ | María García López | maria@tienda.es | A12345678 | Minorista alimentación | GREEN "Activo RE" | 23 | 15/02/2026 | Editar | Desactivar
- ☐ | Juan Pérez Ruiz | juan@comercio.es | B87654321 | Minorista textil | GREEN "Activo RE" | 15 | 14/02/2026 | Editar | Desactivar
- ☐ | Ana Martín Sanz | ana@bazar.es | C11223344 | Bazar/Regalo | GREEN "Activo RE" | 8 | 12/02/2026 | Editar | Desactivar
- ☐ | Pedro López Díaz | pedro@ferret.es | B99887766 | Ferretería | AMBER "Pendiente verificación" | 0 | — | Editar | Verificar
- ☐ | Laura Fernández | laura@papeleria.es | A55667788 | Papelería | RED "RE Desactivado" | 12 | 10/01/2026 | Editar | Reactivar
- ☐ | Carlos Rodríguez | carlos@bazarmax.es | B33445566 | Bazar/Regalo | GREEN "Activo RE" | 31 | 16/02/2026 | Editar | Desactivar

Bulk actions bar: "Acciones en lote ▼" (Activar RE, Desactivar RE, Exportar selección)

Pagination: "Mostrando 1-6 de 42 clientes RE"

Summary card below table:
- "42 clientes con RE activo"
- "€127.340 facturado con RE este año"
- "€6.621 total RE cobrado este año"

All text in Spanish. WordPress admin table style.
```

---

### PANTALLA 03 — Ficha Cliente RE (Crear/Editar)

```
Web app customer detail form for "WooCommerce RE" plugin. Form to mark a customer as RE (Recargo de Equivalencia) eligible.

Colors: WooCommerce purple #7F54B3, WP admin style. Font: system-ui.

WordPress admin layout.

Page title: "Ficha de Cliente RE" with back link "← Volver a la lista"

Card 1 — "Datos del cliente":
- Shows linked WooCommerce customer info (read-only gray fields):
  "Cliente WooCommerce: María García López (#145)"
  "Email: maria@tienda.es"
  "Fecha registro: 01/01/2025"

Card 2 — "Datos fiscales para Recargo de Equivalencia":
- Input: "NIF / CIF" showing "A12345678" with green check icon ✓ "NIF válido"
- Input: "Nombre fiscal / Razón social" showing "Alimentación García S.L."
- Dropdown: "Tipo de comercio" showing "Minorista alimentación"
- Input: "Dirección fiscal" showing "Calle Mayor 12, 28001 Madrid"

Card 3 — "Estado del Recargo":
- Toggle ON: "☑ Aplicar Recargo de Equivalencia a este cliente"
- Date: "RE activo desde: 15/01/2025"
- Select: "Tipo RE aplicable" — "Todos los tipos" / "Solo tipo general (5.2%)" / "Solo tipo reducido (1.4%)"
- Textarea: "Notas internas" showing "Cliente verificado con certificado de comerciante minorista"

Card 4 — "Documentación" (optional):
- File upload area: "Subir certificado de comerciante minorista (PDF, JPG)"
- Currently showing: "📄 certificado_minorista_garcia.pdf (subido 15/01/2025)"

Info box (amber):
"⚠ Recuerda: El vendedor es responsable de verificar que el cliente cumple los requisitos para el Recargo de Equivalencia. Solicita siempre el certificado de comerciante minorista."

Bottom buttons: "Guardar cliente RE" purple #7F54B3 | "Cancelar"

All text in Spanish.
```

---

### PANTALLA 04 — Preview RE en Carrito (Frontend)

```
Web page showing a WooCommerce shopping cart page as seen by the CUSTOMER (not admin). This shows how Recargo de Equivalencia appears to the buyer in the cart.

Colors: Clean white ecommerce theme, WooCommerce button purple #7F54B3, prices in dark #333. Font: system-ui.

Standard WooCommerce cart page layout (storefront theme):

CART TABLE:
Product | Price | Quantity | Subtotal
[img] Camiseta algodón orgánico | 25,00€ | 2 | 50,00€
[img] Pantalón chino slim | 45,00€ | 1 | 45,00€

CART TOTALS sidebar card:
- Subtotal: 95,00€
- IVA (21%): 19,95€
- Recargo de Equivalencia (5,2%): 4,94€ ← highlighted with subtle purple left border and small info icon (i)
- Divider
- TOTAL: 119,89€

Info tooltip (shown when hovering the (i) icon):
"El Recargo de Equivalencia (5,2%) se aplica automáticamente a su cuenta por ser comerciante minorista acogido al régimen especial."

Purple WooCommerce button: "Finalizar compra"

ALSO SHOW a small purple badge next to the customer's name in the header:
"🏪 Cliente RE verificado"

Clean, standard WooCommerce storefront appearance with the RE line clearly visible but not intrusive.
All text in Spanish.
```

---

### PANTALLA 05 — Lista de Pedidos con RE

```
Web app orders list screen for "WooCommerce RE" plugin inside WordPress admin. Shows only orders that include Recargo de Equivalencia.

Colors: WooCommerce purple #7F54B3, WP admin style. Font: system-ui.

WordPress admin layout.

Page title: "Pedidos con Recargo de Equivalencia"

Filter bar: Date range picker + Customer dropdown + Status dropdown (Todos, Completado, Procesando, Reembolsado)

WP-admin data table:
Columns: Pedido | Cliente | NIF | Subtotal | IVA | RE (5.2%) | Total | Estado | Fecha | Factura

- #1089 | María García | A12345678 | 95,00€ | 19,95€ | 4,94€ | 119,89€ | GREEN "Completado" | 15/02/2026 | 📄 Descargar
- #1085 | Juan Pérez | B87654321 | 230,00€ | 48,30€ | 11,96€ | 290,26€ | GREEN "Completado" | 14/02/2026 | 📄 Descargar
- #1082 | Carlos Rodríguez | B33445566 | 67,00€ | 14,07€ | 3,48€ | 84,55€ | BLUE "Procesando" | 13/02/2026 | 📄 Descargar
- #1078 | Ana Martín | C11223344 | 150,00€ | 31,50€ | 7,80€ | 189,30€ | GREEN "Completado" | 12/02/2026 | 📄 Descargar
- #1075 | María García | A12345678 | 45,00€ | 9,45€ | 2,34€ | 56,79€ | GREEN "Completado" | 10/02/2026 | 📄 Descargar
- #1071 | Juan Pérez | B87654321 | 320,00€ | 67,20€ | 16,64€ | 403,84€ | RED "Reembolsado" | 08/02/2026 | 📄 Descargar

Summary bar at bottom with purple background:
"Total RE cobrado (período): 47,16€ | Total facturado con RE: 907,00€ | 6 pedidos"

Bulk actions: "Descargar facturas seleccionadas (PDF)" | "Exportar datos seleccionados (CSV)"

All text in Spanish.
```

---

### PANTALLA 06 — Dashboard de Reportes

```
Web app reporting dashboard for "WooCommerce RE" plugin inside WordPress admin. Fiscal overview of Recargo de Equivalencia.

Colors: WooCommerce purple #7F54B3, WP admin style. Font: system-ui. Background #F0F0F1.

WordPress admin layout.

Page title: "Dashboard RE — Informes Fiscales"
Period selector top-right: "Febrero 2026 ▼" with options for monthly/quarterly/annual

TOP ROW — 4 metric cards:
- "Total RE cobrado (mes)" — "€847,32" — purple indicator
- "Pedidos con RE (mes)" — "38" — up arrow "+12 vs enero"
- "Clientes RE activos" — "42" — stable
- "Ticket medio RE" — "€127,50" — up "+8%"

CHART — "Recargo de Equivalencia cobrado por mes":
Bar chart, 6 months (Sep 2025 - Feb 2026), purple bars #7F54B3
Values increasing trend: €320, €450, €512, €678, €735, €847
Clean WP-style chart

MIDDLE ROW — Two cards side by side:

Left: "Desglose por tipo de IVA":
- Horizontal bars:
  - General (21% → RE 5.2%): €712,40 (84%) — purple bar
  - Reducido (10% → RE 1.4%): €98,50 (12%) — lighter purple
  - Superreducido (4% → RE 0.5%): €36,42 (4%) — lightest purple

Right: "Top clientes RE (mes)":
Small table:
- María García — 12 pedidos — €234,50 RE
- Carlos Rodríguez — 8 pedidos — €189,20 RE
- Juan Pérez — 6 pedidos — €156,80 RE
- Ana Martín — 5 pedidos — €134,00 RE
- Link: "Ver todos →"

BOTTOM — "Próximas obligaciones fiscales" card:
- Amber reminder: "📅 Modelo 309: presentar antes del 20/04/2026 (Q1 2026)"
- "Datos disponibles para exportación CSV para tu gestoría"
- Button: "Exportar datos fiscales Q1 2026" purple outlined

All text in Spanish.
```

---

### PANTALLA 07 — Export CSV / Datos Fiscales

```
Web app data export screen for "WooCommerce RE" plugin.

Colors: WooCommerce purple #7F54B3, WP admin style. Font: system-ui.

WordPress admin layout.

Page title: "Exportar datos fiscales RE"

Card 1 — "Período de exportación":
- Radio buttons:
  ○ "Mes actual (Febrero 2026)"
  ● "Trimestre (Q1 2026: Enero - Marzo)" — selected
  ○ "Año fiscal (2026)"
  ○ "Rango personalizado" with date pickers

Card 2 — "Datos a incluir":
- Checklist with all checked:
  ☑ Datos del pedido (número, fecha, estado)
  ☑ Datos del cliente RE (nombre, NIF, tipo comercio)
  ☑ Desglose IVA (base, tipo, cuota)
  ☑ Desglose RE (base, tipo, cuota)
  ☑ Totales por pedido
  ☑ Resumen por tipo de IVA

Card 3 — "Formato de exportación":
- Radio buttons:
  ● "CSV (compatible con Excel y gestorías)" — selected
  ○ "Excel (.xlsx)"
  ○ "PDF (informe formateado)"

Card 4 — "Vista previa" (collapsible, expanded):
Small preview table showing first 3 rows of the export:
Pedido | Fecha | Cliente | NIF | Base | IVA % | IVA € | RE % | RE € | Total
#1089 | 15/02 | María García | A12345678 | 95,00 | 21% | 19,95 | 5.2% | 4,94 | 119,89
#1085 | 14/02 | Juan Pérez | B87654321 | 230,00 | 21% | 48,30 | 5.2% | 11,96 | 290,26
"... 36 filas más"

Summary in green bordered box:
"Resumen Q1 2026: 38 pedidos | Base total: €4.850,00 | IVA total: €1.018,50 | RE total: €252,20"

Bottom: "Descargar exportación" purple button #7F54B3 | "Enviar por email" outlined

All text in Spanish.
```

---

### PANTALLA 08 — Factura con RE (PDF Preview)

```
Web page showing a PDF invoice preview generated by "WooCommerce RE" plugin. The invoice includes the Recargo de Equivalencia line.

Colors: Clean white document, WooCommerce purple #7F54B3 for accents. Font: system-ui.

Professional A4 invoice layout:

HEADER:
- Left: Company logo placeholder + "Mi Tienda S.L." + NIF: B12345678 + Address
- Right: "FACTURA" large text + Invoice number: RE-2026-0089 + Date: 15/02/2026

CLIENT DATA:
- "Cliente:" María García López
- "NIF: A12345678"
- "Alimentación García S.L."
- "Calle Mayor 12, 28001 Madrid"
- Small purple badge: "🏪 Régimen Recargo de Equivalencia"

ITEMS TABLE:
Concepto | Cantidad | Precio | Subtotal
Camiseta algodón orgánico | 2 | 25,00€ | 50,00€
Pantalón chino slim | 1 | 45,00€ | 45,00€

TOTALS (right-aligned, clear hierarchy):
- Base imponible: 95,00€
- IVA (21%): 19,95€
- **Recargo de Equivalencia (5,2%): 4,94€** ← highlighted with purple left border
- Divider double line
- **TOTAL: 119,89€** (large, bold)

FOOTER:
- "Factura generada automáticamente por WooCommerce RE"
- "Régimen especial del Recargo de Equivalencia — Art. 154-163 Ley 37/1992 del IVA"

Buttons above the invoice: "Descargar PDF" | "Enviar al cliente" | "Imprimir"

All text in Spanish. Professional invoice design.
```

---

### ESTADOS — Empty State (Sin clientes RE)

```
Web app empty state shown when no RE customers exist yet in "WooCommerce RE" plugin.

Colors: WooCommerce purple #7F54B3, WP admin background #F0F0F1. Font: system-ui.

WordPress admin layout.

Page title: "Clientes con Recargo de Equivalencia"

Centered content:
- Simple illustration: a small shop/store icon with a tax document (line art, minimal)
- Heading: "Aún no tienes clientes con Recargo de Equivalencia"
- Description: "El Recargo de Equivalencia es un régimen especial de IVA para comerciantes minoristas en España. Añade tus clientes mayoristas que necesitan RE para que se aplique automáticamente en sus compras."
- Primary button: "Añadir primer cliente RE" purple #7F54B3
- Small link: "¿Qué es el Recargo de Equivalencia? →"

All text in Spanish.
```

---

### ESTADOS — Error / Warning

```
Web app error state for "WooCommerce RE" plugin when tax rates are misconfigured.

Colors: error red #DC3232, warning amber #FFBA00. Font: system-ui.

WordPress admin error notice (standard WP red border-left bar):
"⚠ Error de configuración: Los tipos de IVA en WooCommerce no coinciden con los tipos configurados en el plugin RE. El tipo reducido (10%) no tiene un tipo de IVA correspondiente en WooCommerce > Ajustes > Impuestos. Esto puede causar cálculos incorrectos del recargo."

Below: link "Ir a WooCommerce > Ajustes > Impuestos" and button "Verificar configuración"

WordPress admin styling (red left border notice).
All text in Spanish.
```

---

## PARTE 3: Workflow completo — De Stitch a entregable final

### Carpeta de organización

```
WooRE_Mockups/
├── 01_configuracion/
│   ├── mockup.png
│   └── index.html
├── 02_lista_clientes_re/
├── 03_ficha_cliente_re/
├── 04_preview_carrito/
├── 05_lista_pedidos_re/
├── 06_dashboard_reportes/
├── 07_export_csv/
├── 08_factura_preview/
└── estados/
    ├── empty_state.png
    └── error_warning.png
```
