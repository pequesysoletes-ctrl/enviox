# MRW Pro — Plan de Proyecto

> Shopify Embedded App para automatización de envíos MRW
> Febrero 2026

---

## Arquitectura

```
┌─────────────────────────────────────────────────┐
│                 SHOPIFY STORE                    │
│  (merchant instala MRW Pro desde App Store)      │
└──────────┬──────────────────────────┬────────────┘
           │ OAuth + Admin API        │ Webhooks
           ▼                          ▼
┌─────────────────────────────────────────────────┐
│              MRW PRO BACKEND (Node.js)           │
│                                                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────────┐   │
│  │ Shopify  │  │  MRW     │  │   Database   │   │
│  │ Service  │  │  SOAP    │  │   (SQLite/   │   │
│  │          │  │  Client  │  │    Prisma)   │   │
│  └──────────┘  └────┬─────┘  └──────────────┘   │
│                      │                            │
└──────────────────────┼────────────────────────────┘
                       │ SOAP/XML
                       ▼
           ┌───────────────────────┐
           │  MRW API (SOAP)       │
           │                       │
           │  MOCK: localhost:3001  │
           │  TEST: sagec-test.mrw │
           │  PROD: sagec.mrw.es   │
           └───────────────────────┘
```

## Stack Tecnológico

| Componente | Tecnología |
|---|---|
| **Framework** | Shopify App (Remix + @shopify/shopify-app-remix) |
| **Frontend** | React + Polaris (Shopify Design System) |
| **Backend** | Node.js + Remix |
| **SOAP Client** | soap (npm) / xml2js |
| **Database** | SQLite + Prisma |
| **Mock Server** | Express.js (puerto 3001) |
| **Deployment** | Heroku / Railway / VPS |

## Fases de Desarrollo

### FASE 0: Mock Server MRW (1-2h) ✅ COMPLETADA
- [x] Servidor Express que simula sagec.mrw.es/MRWEnvio.asmx
- [x] Endpoints SOAP: TransmitirEnvio, GetEtiquetaEnvio, SeguimientoEnvio
- [x] Respuestas XML realistas basadas en la doc oficial
- [x] Credenciales de test hardcodeadas (franquicia: 9999, abonado: 123456)

### FASE 1: Scaffold Shopify App (2-3h) ✅ COMPLETADA
- [x] npx @shopify/create-app
- [x] Configurar Shopify Partners (app privada)
- [x] Auth OAuth con tienda de desarrollo
- [x] Database schema (Prisma)
- [x] Navegación con Polaris

### FASE 2: Onboarding + Configuración (4-6h) ✅ COMPLETADA
- [x] P01: Pantalla Bienvenida (stepper)
- [x] P02: Formulario Conexión MRW (credenciales)
- [x] P02b: Modal Ayuda Credenciales
- [x] P03: Configuración de Envíos (servicio, peso, automatización)
- [x] Verificación de conexión contra mock/real

### FASE 3: Gestión de Envíos (8-12h) ✅ COMPLETADA
- [x] P04: Lista de Envíos (DataTable con filtros)
- [x] P05: Detalle de Envío (timeline + etiqueta)
- [x] P06: Crear Envío Manual
- [x] P07: Impresión Batch de Etiquetas
- [x] SOAP client: TransmitirEnvio real
- [x] SOAP client: GetEtiquetaEnvio (PDF)
- [x] Webhook: order/created → auto-crear envío

### FASE 4: Devoluciones + Recogidas (6-8h) ✅ COMPLETADA
- [x] P08: Lista de Devoluciones
- [x] P09: Crear Devolución
- [x] P10: Recogidas (calendario)

### FASE 5: Dashboard + Billing (4-6h) ✅ PARCIAL
- [x] P11: Dashboard (métricas + gráficos) — stats reales de DB
- [ ] P12: Facturación (planes + Shopify Billing API) — requiere App Store

### FASE 6: Testing + Deploy (4-6h) ✅ COMPLETADA
- [x] Testing contra mock server
- [ ] Switch a sagec-test.mrw.es (cuando haya credenciales reales)
- [x] Deploy a producción (enviox.es)
- [ ] Shopify App Store listing

## Servicios MRW soportados

| Código | Servicio | Descripción |
|--------|----------|-------------|
| 0000 | Urgente 10 | Entrega antes 10:00 |
| 0100 | Urgente 12 | Entrega antes 12:00 |
| 0110 | Urgente 14 | Entrega antes 14:00 |
| 0200 | Urgente 19 | Entrega antes 19:00 |
| 0300 | Económico | 48-72h |
| **0800** | **Ecommerce** | **El principal** |
| 0810 | Ecommerce Canje | Con reembolso |

## API MRW — Referencia técnica

### URLs
- Producción: `https://sagec.mrw.es/MRWEnvio.asmx`
- Test: `http://sagec-test.mrw.es/MRWEnvio.asmx`
- Mock local: `http://localhost:3001/MRWEnvio.asmx`

### Auth (SOAP Header)
```xml
<AuthInfo>
  <CodigoFranquicia>XXXX</CodigoFranquicia>
  <CodigoAbonado>XXXXXX</CodigoAbonado>
  <CodigoDepartamento></CodigoDepartamento>
  <UserName>user</UserName>
  <Password>pass</Password>
</AuthInfo>
```

### Operaciones
1. **TransmitirEnvio** → Crea envío, devuelve NumeroEnvio
2. **GetEtiquetaEnvio** → PDF en base64
3. **SeguimientoEnvio** → Estados del envío
