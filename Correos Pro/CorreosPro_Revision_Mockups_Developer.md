# 🔍 Correos Pro — Revisión de Mockups + Guía de Coherencia para el Desarrollador

> **Fecha:** 19/02/2026  
> **Mockups revisados:** 17 pantallas generadas en Google Stitch  

> **Objetivo:** Identificar inconsistencias entre mockups y definir las reglas canónicas que el desarrollador debe seguir para que toda la app sea coherente.

---

## 📊 RESUMEN EJECUTIVO

| Aspecto | Valoración |
|---------|------------|
| **Calidad general** | ⭐⭐⭐⭐ Muy buena — Los mockups capturan correctamente la esencia dual-carrier |
| **Coherencia de navegación** | ⚠️ CRÍTICA — Hay **4 patrones de navegación diferentes** entre pantallas |
| **Coherencia de badges** | ⚠️ MODERADA — Los badges de carrier varían en estilo entre pantallas |
| **Coherencia de colores** | ✅ Buena — Los colores de marca son consistentes |
| **Funcionalidad capturada** | ✅ Excelente — Routing engine, dual-carrier, batch print, etc. |

---

## 🚨 PROBLEMA CRÍTICO #1: Navegación Inconsistente

Este es el problema más importante. Los 16 mockups presentan **4 patrones de navegación diferentes**. El desarrollador DEBE elegir UNO y aplicarlo en TODAS las pantallas.

### Variantes encontradas:

| Patrón | Pantallas que lo usan | Descripción |
|--------|----------------------|-------------|
| **A — Sidebar vertical** | Conexión Correos, Error de conexión | Sidebar izquierdo con: Dashboard, Envíos, Conexión Correos, Facturación, Ayuda + usuario abajo |
| **B — Top bar horizontal (simple)** | Envíos, Dashboard, Recogidas | Logo + nombre "Correos Pro" a la izquierda, iconos (🔔 ❓ 👤) a la derecha, sin menú de secciones |
| **C — Top bar horizontal (con menú)** | Devoluciones, Batch Print, Facturación, Estado vacío | Logo + menú horizontal de secciones (Envíos, Devoluciones, Facturación, Configuración...) + usuario |
| **D — Top bar contextual** | Crear envío, Crear devolución | ← Flecha atrás + título de la acción + avatar usuario |
| **E — Top bar (Routing)** | Reglas de enrutamiento | Logo + menú (Dashboard, Pedidos, Envíos, Configuración) + avatar |

### ✅ DECISIÓN CANÓNICA: Patrón C + D

**El desarrollador debe implementar:**

```
┌─────────────────────────────────────────────────────────────┐
│ 🚚 Correos Pro   Envíos  Devoluciones  Recogidas           │
│                  Dashboard  Facturación  Configuración      │
│                                          🔔  👤 Mi Cuenta  │
└─────────────────────────────────────────────────────────────┘
```

**Reglas:**
1. **Páginas principales** → Patrón C (top bar con menú horizontal)
2. **Páginas de acción/detalle** (crear envío, crear devolución, detalle envío) → Patrón D (← flecha + título)
3. **NUNCA** sidebar vertical — No es el patrón estándar de Shopify embedded apps
4. El menú horizontal debe incluir siempre las mismas secciones en el mismo orden

### Secciones del menú (orden definitivo):

| Posición | Sección | Ruta |
|----------|---------|------|
| 1 | Dashboard | `/dashboard` |
| 2 | Envíos | `/shipments` |
| 3 | Devoluciones | `/returns` |
| 4 | Recogidas | `/pickups` |
| 5 | Facturación | `/billing` |
| 6 | Configuración | `/settings` (incluye Conexión + Reglas) |

---

## ⚠️ PROBLEMA #2: Badges de Transportista Inconsistentes

Los badges que identifican "Correos Standard" vs "Correos Express" cambian de estilo entre pantallas.

### Variantes encontradas:

| Estilo | Pantallas | Ejemplo visual |
|--------|-----------|----------------|
| **Pill con fondo de color** | Envíos (lista) | `[Standard]` rojo con fondo, `[Express]` azul con fondo |
| **Dot + texto** | Devoluciones | `● Standard` con dot rojo, `● Express` con dot azul |
| **Pill con dot interno** | Routing rules | `● Correos Standard` pill rojo, `● Correos Express` pill azul |
| **Tag/badge lleno** | Batch print | `Correos Standard` badge rojo sólido, `Correos Express` badge azul sólido |

### ✅ DECISIÓN CANÓNICA: Badge pill con dot

**El desarrollador debe implementar UN SOLO estilo de badge:**

```css
/* Badge Correos Standard */
.badge-standard {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  background: #FEF2F2;     /* Rojo muy claro */
  color: #D4351C;           /* Rojo Correos */
  border: 1px solid #FECACA;
}
.badge-standard::before {
  content: '';
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #D4351C;
}

/* Badge Correos Express */
.badge-express {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  background: #EFF6FF;     /* Azul muy claro */
  color: #1C4F8A;           /* Azul Express */
  border: 1px solid #BFDBFE;
}
.badge-express::before {
  content: '';
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #1C4F8A;
}
```

**Usar SIEMPRE este badge en:**
- Lista de envíos (columna Transportista)
- Lista de devoluciones (columna Transportista)
- Detalle de envío (header)
- Batch print (tabla)
- Routing rules (columna Transportista)
- Recogidas (cards de próximas recogidas)
- Dashboard (incidencias recientes)

---

## ⚠️ PROBLEMA #3: Badges de Estado Inconsistentes

Los badges de estado del envío también varían:

### Variantes encontradas:

| Estilo | Pantallas |
|--------|-----------|
| `● Creado` dot + texto con fondo pill | Envíos (lista principal) |
| `Solicitada` texto coloreado sin dot | Devoluciones |
| `Listo` dot verde + texto con fondo | Batch print |

### ✅ DECISIÓN CANÓNICA: Dot + texto + fondo pill

```css
/* Estados de envío */
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

/* Colores por estado */
.status-creado     { background: #EFF6FF; color: #1D4ED8; }  /* Azul */
.status-transit    { background: #FFF7ED; color: #C2410C; }  /* Naranja */
.status-entregado  { background: #F0FDF4; color: #15803D; }  /* Verde */
.status-incidencia { background: #FEF2F2; color: #DC2626; }  /* Rojo */
.status-devuelto   { background: #FDF4FF; color: #9333EA; }  /* Púrpura */
.status-error      { background: #FEF2F2; color: #DC2626; }  /* Rojo */
.status-pendiente  { background: #FFFBEB; color: #D97706; }  /* Amarillo */
.status-confirmada { background: #F0FDF4; color: #15803D; }  /* Verde */
.status-solicitada { background: #EFF6FF; color: #1D4ED8; }  /* Azul */
.status-recibida   { background: #F0FDF4; color: #15803D; }  /* Verde */
```

Todos con dot circular del mismo color antes del texto.

---

## ⚠️ PROBLEMA #4: Logo e Identidad del Header

### Variantes encontradas:

| Pantalla | Logo | Texto |
|----------|------|-------|
| Onboarding | 📦 icono rojo | "Correos Pro" en rojo |
| Conexión Correos | Logo genérico dorado | "Shipping SaaS / Admin Panel" ❌ |
| Envíos (lista) | 🚚 camión rojo | "Correos Pro" |
| Routing rules | 🚚 camión rojo | "Correos Pro / Admin Panel" |
| Devoluciones | 📦 icono rojo | "Correos Pro" |
| Dashboard | 📦 icono rojo | "Correos Pro" |
| Facturación | Logo circular específico | "Correos Pro" |
| Error conexión | 💬 icono rojo | "Correos Pro / Gestión de Logística" |

### ✅ DECISIÓN CANÓNICA:

```
Logo: 📦 Icono package rojo (#D4351C) sobre fondo blanco/claro
Texto: "Correos Pro" en peso bold, color navy (#1E293B)
Subtítulo: NINGUNO (no poner "Admin Panel", "Shipping SaaS", etc.)
```

**Usar SIEMPRE el mismo logo+texto en todas las pantallas.**

---

## ⚠️ PROBLEMA #5: Elementos Usuario (Avatar / Mi Cuenta)

### Variantes encontradas:

| Estilo | Pantallas |
|--------|-----------|
| Solo icono avatar genérico | Envíos, Dashboard, Recogidas |
| "Admin User / Logística Global" + avatar | Batch print, Facturación |
| "Mi Cuenta" texto + icono | Devoluciones |
| "Juan Director / Logística Global S.L." en sidebar | Conexión Correos |
| Iniciales "CP" en circulo | Crear devolución |
| Iniciales "JL" en circulo | Crear envío |

### ✅ DECISIÓN CANÓNICA:

```
Formato: [Nombre] + Avatar con iniciales
Ejemplo: "Juan D." + círculo color brand con "JD"
```

Al hacer clic → dropdown con: Mi cuenta, Configuración, Cerrar sesión.

---

## 📋 REVISIÓN PANTALLA POR PANTALLA

### 01 — Bienvenida (Onboarding)
| Aspecto | Estado | Notas |
|---------|--------|-------|
| Layout | ✅ | Card centrada, limpia |
| Stepper 3 pasos | ✅ | Conecta → Configura reglas → Envía |
| CTA "Empezar configuración" | ✅ | Color correcto #D4351C |
| Link credenciales | ✅ | Funcional |
| Footer seguridad | ✅ | "Conexión segura cifrada vía API" |
| **Nav** | ⚠️ | N/A (pantalla standalone, OK) |

**Veredicto: ✅ Lista para implementar tal cual**

---

### 02 — Conexión Correos (Carrier Settings)
| Aspecto | Estado | Notas |
|---------|--------|-------|
| Layout dual | ✅ | Standard (izq) + Express (der) — excelente |
| Campos | ✅ | Código contrato + Password API por carrier |
| Verificación | ✅ | Estado éxito (verde) y error (rojo) |
| "Opcional si solo usas..." | ✅ | Buen detalle UX |
| Banner requisito | ✅ | Warning amarillo arriba |
| Link "¿Dónde encuentro mis credenciales?" | ✅ | Abre modal |
| **Nav** | ❌ | Usa sidebar vertical — cambiar a top bar |
| **Logo** | ❌ | Dice "Shipping SaaS" — cambiar a "Correos Pro" |

**Veredicto: ⚠️ Cambiar navegación a top bar + corregir logo**

---

### 02b — Modal Ayuda Credenciales
| Aspecto | Estado | Notas |
|---------|--------|-------|
| Layout 2 columnas | ✅ | Standard (izq) vs Express (der) |
| Pasos numerados | ✅ | 3 pasos por carrier |
| URLs correctas | ✅ | empresas.correos.es / correosexpress.es |
| Nota informativa | ✅ | "Si ya usaste la app oficial..." |
| Botón cerrar | ✅ | Rojo, consistente |
| Separación visual S/E | ✅ | Barra roja vs barra azul |

**Veredicto: ✅ Lista para implementar tal cual**

---

### 03 — Reglas de Enrutamiento (Routing Rules)
| Aspecto | Estado | Notas |
|---------|--------|-------|
| Tabla de reglas | ✅ | Prioridad, Condición, Transportista, Servicio, Acciones |
| Badge "IF" | ✅ | Detalle visual que ayuda legibilidad |
| Regla por defecto | ✅ | Con icono ∞, font italic |
| Botón "Añadir regla" | ✅ | En tabla y en header |
| **Simulador** | ✅⭐ | Excelente — Peso, Importe, Provincia, Método → Resultado |
| Warning Express no conectado | ✅ | Banner amarillo con link |
| Info prioridad | ✅ | Card explicativa |
| **Nav** | ❌ | Menú diferente (Dashboard, Pedidos, Envíos, Configuración) |
| Breadcrumb | ⚠️ | "Configuración > Envíos" — verificar que routing vive bajo Configuración |

**Veredicto: ⚠️ Corregir nav — Esta pantalla es la JOYA de la app, muy bien resuelta**

---

### 04 — Lista de Envíos
| Aspecto | Estado | Notas |
|---------|--------|-------|
| Tabla 8 columnas | ✅ | Pedido, Cliente, Destino, Transportista, Servicio, Estado, Fecha, Acciones |
| Filtros | ✅ | Búsqueda, Transportista, Estado, Fecha |
| Badges carrier | ⚠️ | Estilo "pill con fondo" — usar el canónico (dot + pill) |
| Badges estado | ✅ | Consistentes en esta pantalla |
| Paginación | ✅ | "1-8 de 456" + paginador |
| CTA | ✅ | "Crear envío manual" rojo |
| **Nav** | ❌ | Solo logo + iconos, sin menú de secciones |

**Veredicto: ⚠️ Añadir menú de secciones + unificar badges**

---

### 05 — Detalle del Envío
| Aspecto | Estado | Notas |
|---------|--------|-------|
| Header con ID | ✅ | "Envío #COR-2026-02047" + badge carrier + link pedido Shopify |
| Badge estado | ✅ | "● Entregado" verde — coherente |
| **Badge carrier** | ✅ | "Correos Standard" pill rojo — correcto |
| Info envío | ✅ | Cliente, dirección, transportista+servicio, nº seguimiento con copiar |
| **Regla aplicada** | ✅⭐ | "Por defecto → Paq Estándar" — excelente link con routing engine |
| **Etiqueta QR** | ✅⭐ | Preview del código de barras + "Descargar etiqueta PDF" |
| **Timeline tracking** | ✅⭐ | 5 pasos: Pre-registrado → Admitido → En tránsito → En reparto → Entregado |
| Timestamps | ✅ | Formato DD/MM/AAAA HH:MM — coherente |!
| CTAs | ✅ | "Crear devolución" (secundario) + "Cancelar envío" (destructivo rojo) |
| **Nav** | ❌ | Solo logo + iconos, sin menú de secciones — aplicar Patrón D (← flecha) |

**Veredicto: ⚠️ Corregir nav (ya tiene ← flecha, pero falta menú arriba) — Contenido excelente, la timeline y el QR están muy bien**

---

### 06 — Crear Envío Manual
| Aspecto | Estado | Notas |
|---------|--------|-------|
| Buscador pedido | ✅ | Con resultado seleccionado |
| **Preview regla aplicada** | ✅⭐ | Banner púrpura "Por defecto → Correos Standard — Paq Estándar" |
| Override manual | ✅ | Checkbox + radio para cambiar carrier |
| Peso y dimensiones | ✅ | Con checkbox "usar valores por defecto" |
| Dirección destino | ✅ | Completa con todos los campos |
| Botones | ✅ | "Cancelar" + "Crear envío" rojo |
| **Nav** | ✅ | Patrón D correcto (← flecha + título) |

**Veredicto: ✅ Lista — La preview de regla aplicada es un detalle excelente**

---

### 07 — Batch Print (Impresión en Lote)
| Aspecto | Estado | Notas |
|---------|--------|-------|
| Resumen selección | ✅ | "5 envíos seleccionados — 3 Standard + 2 Express" |
| Tabla con checkboxes | ✅ | Selección individual |
| **Opciones descarga** | ✅⭐ | Separar por transportista / PDF combinado / ZIP |
| **Vista previa dual** | ✅⭐ | Preview PDF separado Standard (3) + Express (2) |
| Formato etiqueta | ✅ | Selector 10×15cm |
| Info post-descarga | ✅ | "Se marcarán como Impresas" |
| **Nav** | ❌ | Menú diferente (Envíos, Pedidos, Clientes) — normalizar |
| **Badges** | ⚠️ | Estilo "tag sólido" — usar canónico |
| **Fechas** | ⚠️ | Usan "23 Oct 2023" — deberían ser 2026 para coherencia |

**Veredicto: ⚠️ Corregir nav + badges + fechas — Funcionalidad excelente**

---

### 08 — Lista de Devoluciones
| Aspecto | Estado | Notas |
|---------|--------|-------|
| Tabla 8 columnas | ✅ | Pedido, Cliente (con avatar iniciales), Transportista, Motivo, Estado, Fecha, Etiqueta, Acciones |
| Filtros | ✅ | Búsqueda, Transportista, Estado + filtro extra |
| Avatares cliente | ✅ | Iniciales con color — buen detalle |
| Link "Descargar" etiqueta | ✅ | En rojo, directo |
| Paginación | ✅ | "1-6 de 84" |
| **Badges carrier** | ⚠️ | Estilo "dot + texto" sin fondo pill — adaptar al canónico |
| **Badges estado** | ⚠️ | Texto coloreado sin dot ni fondo — adaptar al canónico |
| **Nav** | ✅ | Patrón C con menú (Envíos, Devoluciones, Facturación, Configuración) |
| **Nav detalle** | ⚠️ | Falta "Recogidas" y "Dashboard" en el menú |

**Veredicto: ⚠️ Completar menú + unificar badges — Buen layout base**

---

### 09 — Crear Devolución
| Aspecto | Estado | Notas |
|---------|--------|-------|
| Buscador pedido | ✅ | Con badge ENTREGADO + badge CORREOS STANDARD |
| Motivo | ✅ | Selector + notas adicionales |
| **Transportista para devolución** | ✅⭐ | Radio: Standard (Paq Retorno) / Express (Retorno Express) |
| Info "puede ser diferente al original" | ✅ | Buen detalle UX |
| Dirección recogida | ✅ | Con toggle "Usar dirección del pedido original" |
| **Método devolución** | ✅⭐ | "Generar etiqueta" vs "Solicitar recogida" |
| **Nav** | ✅ | Patrón D correcto (← flecha + título) |
| **CTA** | ⚠️ | "Generar etiqueta de devolución" — posición flotante rara, parece estar en medio del form |

**Veredicto: ⚠️ Mover el CTA al final del formulario — Contenido excelente**

---

### 10 — Recogidas
| Aspecto | Estado | Notas |
|---------|--------|-------|
| **Tabs Standard/Express** | ✅⭐ | Separación por carrier arriba |
| **Calendario** | ✅⭐ | Con dots rojo/azul por carrier |
| Leyenda calendario | ✅ | ● Standard ● Express |
| Próximas recogidas | ✅ | Cards con hora, paquetes, carrier, estado |
| **Formulario nueva recogida** | ✅ | Carrier, fecha, franja, nº paquetes, notas |
| **Nav** | ❌ | Solo logo + iconos, sin menú de secciones |
| **Fecha** | ⚠️ | Formato MM/DD/YYYY en campo — debería ser DD/MM/YYYY (España) |

**Veredicto: ⚠️ Corregir nav + formato fecha — Pantalla muy completa**

---

### 11 — Dashboard
| Aspecto | Estado | Notas |
|---------|--------|-------|
| 4 KPIs superiores | ✅ | Envíos hoy, En tránsito, Incidencias, Entregados (semana) |
| **Barras Standard vs Express** | ✅⭐ | 78 envíos (70%) Standard + 34 envíos (30%) Express |
| **Gráfico barras apiladas** | ⚠️ | Está vacío/sin renderizar — el mockup no muestra las barras |
| Incidencias recientes | ✅ | Con badges carrier + timestamp |
| **Distribución por servicio** | ✅⭐ | Barras horizontales con colores rojo/azul por servicio |
| Selector período | ✅ | "Últimos 7 días" dropdown |
| **Nav** | ❌ | Solo logo + iconos, sin menú de secciones |

**Veredicto: ⚠️ Corregir nav + el gráfico necesita datos visibles — Excelente estructura**

---

### 12 — Facturación y Plan
| Aspecto | Estado | Notas |
|---------|--------|-------|
| Plan actual | ✅ | "Plan Profesional — Activo — 49€/mes" |
| Próxima renovación | ✅ | Fecha visible |
| **Barra uso dual** | ✅⭐ | "342 total — 245 Standard (72%) + 97 Express (28%)" |
| 3 planes comparados | ✅ | Starter / Profesional / Business |
| Historial facturación | ✅ | Tabla con descarga PDF |
| CTA upgrade/downgrade | ✅ | Botones claros |
| Soporte | ✅ | CTA "Contactar Soporte" |
| **Nav** | ✅ | Patrón C con menú |
| **Nav detalle** | ⚠️ | Menú: Dashboard, Envíos, Seguimiento, Facturación — falta Devoluciones, Recogidas |

**Veredicto: ⚠️ Completar menú — Pantalla muy bien resuelta**

---

### Estado: Aviso Conexión Necesaria
| Aspecto | Estado | Notas |
|---------|--------|-------|
| Banner superior | ✅ | "Conecta al menos Correos Standard o Express para empezar" |
| Tabla deshabilitada | ✅ | Contenido visible pero opacidad reducida |
| CTA "Configurar ahora" | ✅ | Botón naranja en banner |
| **Nav** | ❌ | Solo logo + iconos |

**Veredicto: ⚠️ Corregir nav — Buen patrón de estado degradado**

---

### Estado: Loading Skeleton
| Aspecto | Estado | Notas |
|---------|--------|-------|
| Skeleton table | ✅ | Bloques grises animados |
| Header skeleton | ✅ | Título + filtros como bloques |
| Paginación skeleton | ✅ | Con un dot naranja de acento |
| **Nav skeleton** | ⚠️ | Demasiado simplificado — debería mostrar el nav real con contenido skeleton solo en el body |

**Veredicto: ⚠️ El nav debería ser siempre real, solo skeleton en el contenido**

---

### Estado: Vacío
| Aspecto | Estado | Notas |
|---------|--------|-------|
| Ilustración paquete | ✅ | Icono Correos grande |
| Mensaje | ✅ | "Aún no tienes envíos" |
| CTA primario | ✅ | "Crear envío manual" rojo |
| CTA secundario | ✅ | "Configurar reglas de enrutamiento" link |
| Contadores abajo | ✅ | Pendientes: 0, En tránsito: 0, Entregados: 0 |
| **Nav** | ❌ | Menú diferente (Envíos, Pedidos, Almacén, Configuración) — no coincide |

**Veredicto: ⚠️ Corregir menú — Buen patrón de empty state**

---

### Estado: Error de Conexión
| Aspecto | Estado | Notas |
|---------|--------|-------|
| Banner error superior | ✅ | Rojo con "Reintentar" |
| Icono wifi cortado | ✅ | Claro y reconocible |
| Mensaje error | ✅ | Texto explicativo |
| 2 CTAs | ✅ | "Reintentar" (primario) + "Volver a la lista" (secundario) |
| Breadcrumb | ✅ | Inicio > Envíos > Detalles del Envío #CP-90231 |
| **Nav** | ❌ | Usa sidebar vertical — cambiar a top bar |
| **Subtítulo** | ❌ | Dice "Gestión de Logística" — eliminar |

**Veredicto: ⚠️ Cambiar a top bar + eliminar subtítulo**

---

## 🛡️ REGLAS CANÓNICAS PARA EL DESARROLLADOR

### 1. Navegación

```
REGLA: Todas las pantallas principales usan TOP BAR HORIZONTAL con menú.
       Las pantallas de acción/detalle usan ← flecha + título.
       NUNCA sidebar vertical.

Menú fijo: Dashboard | Envíos | Devoluciones | Recogidas | Facturación | Configuración
Derecha: 🔔 + 👤 [Nombre]

Subpáginas de "Configuración":
  - Conexión Correos
  - Reglas de Enrutamiento
  - Preferencias
```

### 2. Colores

```
REGLA: Usar SIEMPRE estos colores exactos.

Correos Standard (rojo):
  - Primario:    #D4351C
  - Fondo badge: #FEF2F2
  - Borde badge: #FECACA

Correos Express (azul):
  - Primario:    #1C4F8A
  - Fondo badge: #EFF6FF
  - Borde badge: #BFDBFE

UI General:
  - Texto heading:  #1E293B (navy)
  - Texto body:     #475569 (slate)
  - Fondo página:   #F8FAFC
  - Borde cards:    #E2E8F0
  - CTA primario:   #D4351C (siempre rojo Correos)
  - CTA secundario: #1C4F8A (azul Express, solo cuando es acción Express)
  - Éxito:          #15803D
  - Error:          #DC2626
  - Warning:        #D97706
  - Info:           #1D4ED8
```

### 3. Tipografía

```
REGLA: Usar Inter (Google Fonts) como ÚNICA fuente.

Heading h1:       24px, weight 700, #1E293B
Heading h2:       20px, weight 600, #1E293B
Subtítulo:        14px, weight 400, #64748B
Tabla header:     12px, weight 600, uppercase, #64748B, tracking 0.05em
Tabla body:       14px, weight 400, #334155
Badge carrier:    13px, weight 500
Badge estado:     12px, weight 500
Botón CTA:        14px, weight 600
```

### 4. Componentes Reutilizables

```
REGLA: Crear estos componentes UNA VEZ y usarlos en TODAS las pantallas.

<CarrierBadge carrier="standard|express" />
<StatusBadge status="creado|transit|entregado|incidencia|devuelto|error|pendiente" />
<AppNavbar activePage="dashboard|shipments|returns|pickups|billing|settings" />
<PageHeader title="..." subtitle="..." action={<Button>CTA</Button>} />
<DataTable columns={[...]} rows={[...]} pagination={true} />
<FilterBar filters={[search, carrier, status, date]} />
<ActionPageHeader title="..." backUrl="..." />
```

### 5. Formato de Fechas

```
REGLA: SIEMPRE formato europeo (España).

En tablas:        17/02/2026
En cards:         18/02/2026
En inputs:        DD/MM/AAAA (placeholder)
En rango:         DD/MM/AAAA - DD/MM/AAAA
Relativo:         Hace 2h, Ayer
NUNCA:            MM/DD/YYYY, "Oct 2023", formatos anglosajones
```

### 6. Identificadores de Envío

```
REGLA: Formato consistente para IDs.

Pedidos Shopify:  #2047, #2046, etc.
ID Correos Pro:   CP-90231 (para tracking interno)
ID suscripción:   SUB-992-KLA-12
```

---

## ✅ CHECKLIST PRE-IMPLEMENTACIÓN

Antes de escribir código, el desarrollador debe:

- [ ] **Definir el componente `<AppNavbar>`** con el menú definitivo (6 secciones)
- [ ] **Definir el componente `<CarrierBadge>`** con el estilo canónico
- [ ] **Definir el componente `<StatusBadge>`** con el estilo canónico
- [ ] **Configurar variables CSS** con los colores canónicos
- [ ] **Instalar Inter font** desde Google Fonts
- [ ] **Decidir el logo definitivo** (SVG del paquete Correos rojo)
- [ ] Verificar que TODAS las pantallas comparten estos componentes base
- [ ] Adaptar las fechas al formato DD/MM/AAAA en cada formulario e input

---

## 📊 RESUMEN FINAL

| Pantalla | Nav | Badges | Colores | Funcionalidad | Acción dev |
|----------|-----|--------|---------|---------------|------------|
| 01 Bienvenida | ✅ | — | ✅ | ✅ | Tal cual |
| 02 Conexión | ❌ Nav | ✅ | ✅ | ✅ | Cambiar nav+logo |
| 02b Modal | ✅ | — | ✅ | ✅ | Tal cual |
| 03 Routing | ❌ Nav | ⚠️ | ✅ | ✅⭐ | Cambiar nav |
| 04 Envíos | ❌ Nav | ⚠️ | ✅ | ✅ | Cambiar nav+badges |
| 05 Detalle | ❌ Nav | ✅ | ✅ | ✅⭐ | Corregir nav |
| 06 Crear envío | ✅ | ✅ | ✅ | ✅⭐ | Tal cual |
| 07 Batch | ❌ Nav | ⚠️ | ✅ | ✅⭐ | Cambiar nav+badges+fechas |
| 08 Devoluciones | ⚠️ Nav | ⚠️ | ✅ | ✅ | Completar nav+badges |
| 09 Crear devol. | ✅ | ✅ | ✅ | ✅⭐ | Mover CTA al final |
| 10 Recogidas | ❌ Nav | ✅ | ✅ | ✅⭐ | Cambiar nav+formato fecha |
| 11 Dashboard | ❌ Nav | ✅ | ✅ | ⚠️ Gráfico | Cambiar nav+rellenar gráfico |
| 12 Facturación | ⚠️ Nav | ✅ | ✅ | ✅ | Completar menú |
| Warning | ❌ Nav | ✅ | ✅ | ✅ | Cambiar nav |
| Skeleton | ⚠️ | — | ✅ | ✅ | Nav real + skeleton solo body |
| Vacío | ❌ Nav | — | ✅ | ✅ | Cambiar menú |
| Error | ❌ Nav | — | ✅ | ✅ | Cambiar a top bar |

**Pantallas listas tal cual:** 3 de 17  
**Pantallas con ajustes menores (badges/fechas):** 6 de 17  
**Pantallas que requieren cambio de navegación:** 8 de 17  
**Pantallas faltantes:** 0 ✅

> **Conclusión:** Los 17 mockups están completos y son de alta calidad en cuanto a funcionalidad y diseño visual. El problema principal es la **inconsistencia de navegación** — un problema esperado al generar pantallas de forma independiente en Stitch. Al crear el componente `<AppNavbar>` reutilizable como primer paso, el 80% de los problemas se resuelve automáticamente.
