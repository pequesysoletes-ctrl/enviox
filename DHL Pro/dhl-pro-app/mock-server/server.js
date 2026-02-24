/**
 * MRW Mock SOAP Server
 * 
 * Simulates the MRW SOAP API at sagec.mrw.es/MRWEnvio.asmx
 * Used for development and testing of MRW Pro Shopify app.
 * 
 * Endpoints:
 *   POST /MRWEnvio.asmx  → TransmitirEnvio, GetEtiquetaEnvio
 *   POST /wssgmntnvs.asmx → SeguimientoEnvio
 * 
 * Test credentials:
 *   CodigoFranquicia: "9999"
 *   CodigoAbonado: "123456"
 *   UserName: "testuser"
 *   Password: "testpass"
 */

const express = require('express');
const { parseStringPromise } = require('xml2js');

const app = express();
const PORT = 3001;

// ─── CONFIG ─────────────────────────────────────────────
const VALID_CREDENTIALS = {
  CodigoFranquicia: '9999',
  CodigoAbonado: '123456',
  CodigoDepartamento: '',
  UserName: 'testuser',
  Password: 'testpass',
};

// Counter for generating sequential shipment numbers
let shipmentCounter = 100000;
const shipments = new Map(); // Store created shipments

// ─── MIDDLEWARE ──────────────────────────────────────────
app.use(express.text({ type: '*/*', limit: '5mb' }));

// CORS for local development
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, SOAPAction');
  res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

// ─── SOAP HELPERS ───────────────────────────────────────

function soapEnvelope(bodyContent) {
  return `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"
               xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
               xmlns:xsd="http://www.w3.org/2001/XMLSchema">
  <soap:Body>
    ${bodyContent}
  </soap:Body>
</soap:Envelope>`;
}

async function extractAuthInfo(xmlBody) {
  try {
    const parsed = await parseStringPromise(xmlBody, {
      explicitArray: false,
      ignoreAttrs: false,
      tagNameProcessors: [name => name.replace(/.*:/, '')], // strip ns
    });
    
    const envelope = parsed.Envelope || parsed['soap:Envelope'] || parsed['soapenv:Envelope'];
    if (!envelope) return null;
    
    const header = envelope.Header || envelope['soap:Header'] || {};
    const body = envelope.Body || envelope['soap:Body'];
    
    // AuthInfo can be in Header or Body
    let auth = null;
    
    // Search recursively for AuthInfo
    const findAuth = (obj) => {
      if (!obj || typeof obj !== 'object') return null;
      if (obj.AuthInfo) return obj.AuthInfo;
      for (const key of Object.keys(obj)) {
        const result = findAuth(obj[key]);
        if (result) return result;
      }
      return null;
    };
    
    auth = findAuth(header) || findAuth(body);
    return { auth, body };
  } catch (err) {
    console.error('XML parse error:', err.message);
    return null;
  }
}

function validateAuth(auth) {
  if (!auth) return false;
  return (
    (auth.CodigoFranquicia === VALID_CREDENTIALS.CodigoFranquicia) &&
    (auth.CodigoAbonado === VALID_CREDENTIALS.CodigoAbonado) &&
    (auth.UserName === VALID_CREDENTIALS.UserName) &&
    (auth.Password === VALID_CREDENTIALS.Password)
  );
}

function authErrorResponse() {
  return soapEnvelope(`
    <TransmitirEnvioResponse xmlns="http://www.mrw.es/">
      <TransmitirEnvioResult>
        <Estado>0</Estado>
        <Mensaje>Error: código de cliente o password incorrectos</Mensaje>
        <NumeroEnvio></NumeroEnvio>
      </TransmitirEnvioResult>
    </TransmitirEnvioResponse>`);
}

// ─── GENERATE MOCK DATA ─────────────────────────────────

function generateTrackingNumber() {
  shipmentCounter++;
  const prefix = '0' + VALID_CREDENTIALS.CodigoAbonado;
  return prefix + String(shipmentCounter).padStart(10, '0');
}

function generateMockLabel(trackingNumber) {
  // Generate a simple base64-encoded "PDF" (actually just text, but simulates the response)
  const labelContent = `
    ╔══════════════════════════════════════╗
    ║          MRW - ETIQUETA             ║
    ║                                      ║
    ║  Tracking: ${trackingNumber}     ║
    ║  Servicio: MRW Ecommerce            ║
    ║  Fecha: ${new Date().toLocaleDateString('es-ES')}          ║
    ║                                      ║
    ║  ||||| |||| ||||| |||| |||||         ║
    ║  BARCODE: ${trackingNumber}      ║
    ║                                      ║
    ╚══════════════════════════════════════╝
  `;
  return Buffer.from(labelContent).toString('base64');
}

function generateTrackingEvents(trackingNumber, delivered = false) {
  const now = new Date();
  const events = [
    {
      fecha: new Date(now - 3 * 86400000).toLocaleDateString('es-ES'),
      hora: '09:00',
      estado: 'RECOGIDO',
      descripcion: 'Envío recogido en origen',
      poblacion: 'Barcelona',
    },
    {
      fecha: new Date(now - 2 * 86400000).toLocaleDateString('es-ES'),
      hora: '14:30',
      estado: 'EN_TRANSITO',
      descripcion: 'En tránsito - Centro logístico',
      poblacion: 'Zaragoza',
    },
    {
      fecha: new Date(now - 1 * 86400000).toLocaleDateString('es-ES'),
      hora: '06:00',
      estado: 'EN_REPARTO',
      descripcion: 'En reparto - Delegación destino',
      poblacion: 'Madrid',
    },
  ];

  if (delivered) {
    events.push({
      fecha: now.toLocaleDateString('es-ES'),
      hora: '12:45',
      estado: 'ENTREGADO',
      descripcion: 'Entregado - Firmado por destinatario',
      poblacion: 'Madrid',
    });
  }

  return events;
}

// ─── ROUTE: MRWEnvio.asmx ──────────────────────────────

app.post('/MRWEnvio.asmx', async (req, res) => {
  console.log('\n📦 [MRWEnvio] Request received');
  
  const xmlBody = req.body;
  const result = await extractAuthInfo(xmlBody);
  
  if (!result) {
    console.log('❌ Could not parse SOAP XML');
    return res.status(400).send('Invalid SOAP XML');
  }
  
  const { auth, body } = result;
  
  // Determine which operation was called
  const bodyStr = JSON.stringify(body);
  
  res.set('Content-Type', 'text/xml; charset=utf-8');
  
  // ── TransmitirEnvio ──
  if (bodyStr.includes('TransmitirEnvio') || bodyStr.includes('TransmEnvio')) {
    console.log('📤 Operation: TransmitirEnvio');
    
    if (!validateAuth(auth)) {
      console.log('🔒 Auth failed');
      return res.send(authErrorResponse());
    }
    
    const trackingNumber = generateTrackingNumber();
    
    // Store shipment data
    shipments.set(trackingNumber, {
      numero: trackingNumber,
      fecha: new Date().toISOString(),
      estado: 'CREADO',
      delivered: false,
    });
    
    console.log(`✅ Shipment created: ${trackingNumber}`);
    
    return res.send(soapEnvelope(`
    <TransmitirEnvioResponse xmlns="http://www.mrw.es/">
      <TransmitirEnvioResult>
        <Estado>1</Estado>
        <Mensaje>Envío creado correctamente</Mensaje>
        <NumeroEnvio>${trackingNumber}</NumeroEnvio>
        <NumeroSolicitud>${Date.now()}</NumeroSolicitud>
      </TransmitirEnvioResult>
    </TransmitirEnvioResponse>`));
  }
  
  // ── GetEtiquetaEnvio ──
  if (bodyStr.includes('EtiquetaEnvio') || bodyStr.includes('GetEtiqueta')) {
    console.log('🏷️  Operation: GetEtiquetaEnvio');
    
    if (!validateAuth(auth)) {
      return res.send(authErrorResponse());
    }
    
    // Extract tracking number from request
    let trackingNum = 'UNKNOWN';
    const numMatch = bodyStr.match(/"numero":\s*"([^"]+)"/i) || 
                     bodyStr.match(/NumeroEnvio[^>]*>([^<]+)/i);
    if (numMatch) trackingNum = numMatch[1];
    
    const labelBase64 = generateMockLabel(trackingNum);
    
    console.log(`✅ Label generated for: ${trackingNum}`);
    
    return res.send(soapEnvelope(`
    <GetEtiquetaEnvioResponse xmlns="http://www.mrw.es/">
      <GetEtiquetaEnvioResult>
        <Estado>1</Estado>
        <Mensaje>Etiqueta generada correctamente</Mensaje>
        <EtiquetaFile>${labelBase64}</EtiquetaFile>
      </GetEtiquetaEnvioResult>
    </GetEtiquetaEnvioResponse>`));
  }
  
  // ── Unknown operation ──
  console.log('❓ Unknown operation');
  return res.send(soapEnvelope(`
    <Fault>
      <faultcode>soap:Client</faultcode>
      <faultstring>Operación no reconocida</faultstring>
    </Fault>`));
});

// ─── ROUTE: Seguimiento ─────────────────────────────────

app.post('/wssgmntnvs.asmx', async (req, res) => {
  console.log('\n🔍 [Seguimiento] Request received');
  
  const xmlBody = req.body;
  const result = await extractAuthInfo(xmlBody);
  
  if (!result) {
    return res.status(400).send('Invalid SOAP XML');
  }
  
  const { auth } = result;
  
  res.set('Content-Type', 'text/xml; charset=utf-8');
  
  if (!validateAuth(auth)) {
    return res.send(authErrorResponse());
  }
  
  // Determine if shipment is "delivered" (random for mock)
  const delivered = Math.random() > 0.3; // 70% delivered
  const events = generateTrackingEvents('MOCK', delivered);
  
  const eventsXml = events.map(e => `
        <SeguimientoEnvioItem>
          <Fecha>${e.fecha}</Fecha>
          <Hora>${e.hora}</Hora>
          <EstadoEnvio>${e.estado}</EstadoEnvio>
          <Descripcion>${e.descripcion}</Descripcion>
          <Poblacion>${e.poblacion}</Poblacion>
        </SeguimientoEnvioItem>`).join('');
  
  console.log(`✅ Tracking: ${events.length} events, delivered: ${delivered}`);
  
  return res.send(soapEnvelope(`
    <GetSeguimientoEnvioResponse xmlns="http://www.mrw.es/">
      <GetSeguimientoEnvioResult>
        <Estado>1</Estado>
        <Mensaje>OK</Mensaje>
        <SeguimientoEnvioItems>${eventsXml}
        </SeguimientoEnvioItems>
      </GetSeguimientoEnvioResult>
    </GetSeguimientoEnvioResponse>`));
});

// ─── ROUTE: WSDL (for SOAP clients that need it) ────────

app.get('/MRWEnvio.asmx', (req, res) => {
  if (req.query.WSDL !== undefined || req.query.wsdl !== undefined) {
    console.log('📄 WSDL requested');
    res.set('Content-Type', 'text/xml; charset=utf-8');
    return res.send(WSDL_CONTENT);
  }
  
  res.send(`
    <html>
      <head><title>MRW Mock Server</title></head>
      <body>
        <h1>MRW Mock SOAP Server</h1>
        <h2>Operaciones disponibles:</h2>
        <ul>
          <li><strong>TransmitirEnvio</strong> — Crear envío</li>
          <li><strong>GetEtiquetaEnvio</strong> — Obtener etiqueta PDF</li>
          <li><strong>SeguimientoEnvio</strong> — Tracking</li>
        </ul>
        <h2>Credenciales de test:</h2>
        <pre>
CodigoFranquicia: 9999
CodigoAbonado: 123456
UserName: testuser
Password: testpass
        </pre>
        <h2>Envíos creados: ${shipments.size}</h2>
        <p><a href="/MRWEnvio.asmx?WSDL">Ver WSDL</a></p>
      </body>
    </html>
  `);
});

// ─── HEALTH CHECK ───────────────────────────────────────

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'MRW Mock SOAP Server',
    shipments: shipments.size,
    uptime: process.uptime(),
  });
});

// ─── API INFO (JSON, for quick testing) ─────────────────

app.get('/api/shipments', (req, res) => {
  const all = Array.from(shipments.values());
  res.json({ count: all.length, shipments: all });
});

// ─── SIMPLIFIED WSDL ───────────────────────────────────

const WSDL_CONTENT = `<?xml version="1.0" encoding="utf-8"?>
<wsdl:definitions xmlns:wsdl="http://schemas.xmlsoap.org/wsdl/"
                  xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/"
                  xmlns:tns="http://www.mrw.es/"
                  xmlns:xsd="http://www.w3.org/2001/XMLSchema"
                  targetNamespace="http://www.mrw.es/"
                  name="MRWEnvioService">
  
  <wsdl:types>
    <xsd:schema targetNamespace="http://www.mrw.es/">
      <xsd:element name="AuthInfo">
        <xsd:complexType>
          <xsd:sequence>
            <xsd:element name="CodigoFranquicia" type="xsd:string"/>
            <xsd:element name="CodigoAbonado" type="xsd:string"/>
            <xsd:element name="CodigoDepartamento" type="xsd:string"/>
            <xsd:element name="UserName" type="xsd:string"/>
            <xsd:element name="Password" type="xsd:string"/>
          </xsd:sequence>
        </xsd:complexType>
      </xsd:element>
      
      <xsd:element name="TransmitirEnvio">
        <xsd:complexType>
          <xsd:sequence>
            <xsd:element name="request" type="tns:TransmitirEnvioRequest"/>
          </xsd:sequence>
        </xsd:complexType>
      </xsd:element>
      
      <xsd:complexType name="TransmitirEnvioRequest">
        <xsd:sequence>
          <xsd:element name="DatosEntrega" type="tns:DatosEntregaRequest"/>
          <xsd:element name="DatosServicio" type="tns:DatosServicioRequest"/>
        </xsd:sequence>
      </xsd:complexType>
      
      <xsd:complexType name="DatosEntregaRequest">
        <xsd:sequence>
          <xsd:element name="Direccion" type="tns:DireccionRequest"/>
          <xsd:element name="Nif" type="xsd:string"/>
          <xsd:element name="Nombre" type="xsd:string"/>
          <xsd:element name="Telefono" type="xsd:string"/>
          <xsd:element name="Contacto" type="xsd:string"/>
          <xsd:element name="ALaAtencionDe" type="xsd:string"/>
          <xsd:element name="Observaciones" type="xsd:string"/>
        </xsd:sequence>
      </xsd:complexType>
      
      <xsd:complexType name="DireccionRequest">
        <xsd:sequence>
          <xsd:element name="CodigoDireccion" type="xsd:string"/>
          <xsd:element name="CodigoTipoVia" type="xsd:string"/>
          <xsd:element name="Via" type="xsd:string"/>
          <xsd:element name="Numero" type="xsd:string"/>
          <xsd:element name="Resto" type="xsd:string"/>
          <xsd:element name="CodigoPostal" type="xsd:string"/>
          <xsd:element name="Poblacion" type="xsd:string"/>
          <xsd:element name="Provincia" type="xsd:string"/>
        </xsd:sequence>
      </xsd:complexType>
      
      <xsd:complexType name="DatosServicioRequest">
        <xsd:sequence>
          <xsd:element name="Fecha" type="xsd:string"/>
          <xsd:element name="Referencia" type="xsd:string"/>
          <xsd:element name="CodigoServicio" type="xsd:string"/>
          <xsd:element name="NumeroBultos" type="xsd:string"/>
          <xsd:element name="Peso" type="xsd:string"/>
          <xsd:element name="Reembolso" type="xsd:string"/>
          <xsd:element name="ImporteReembolso" type="xsd:string"/>
        </xsd:sequence>
      </xsd:complexType>
    </xsd:schema>
  </wsdl:types>
  
  <wsdl:message name="TransmitirEnvioInput">
    <wsdl:part name="parameters" element="tns:TransmitirEnvio"/>
  </wsdl:message>
  
  <wsdl:portType name="MRWEnvioPortType">
    <wsdl:operation name="TransmitirEnvio">
      <wsdl:input message="tns:TransmitirEnvioInput"/>
    </wsdl:operation>
  </wsdl:portType>
  
  <wsdl:binding name="MRWEnvioBinding" type="tns:MRWEnvioPortType">
    <soap:binding style="document" transport="http://schemas.xmlsoap.org/soap/http"/>
    <wsdl:operation name="TransmitirEnvio">
      <soap:operation soapAction="http://www.mrw.es/TransmitirEnvio"/>
    </wsdl:operation>
  </wsdl:binding>
  
  <wsdl:service name="MRWEnvioService">
    <wsdl:port name="MRWEnvioPort" binding="tns:MRWEnvioBinding">
      <soap:address location="http://localhost:${PORT}/MRWEnvio.asmx"/>
    </wsdl:port>
  </wsdl:service>
</wsdl:definitions>`;

// ─── START SERVER ───────────────────────────────────────

app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════╗
║           MRW Mock SOAP Server v1.0               ║
╠═══════════════════════════════════════════════════╣
║                                                   ║
║  🚀 Running on http://localhost:${PORT}              ║
║                                                   ║
║  Endpoints:                                       ║
║    POST /MRWEnvio.asmx   → Create shipment        ║
║    POST /MRWEnvio.asmx   → Get label (PDF)        ║
║    POST /wssgmntnvs.asmx → Tracking               ║
║    GET  /MRWEnvio.asmx   → Info page              ║
║    GET  /MRWEnvio.asmx?WSDL → WSDL definition     ║
║    GET  /health          → Health check            ║
║    GET  /api/shipments   → List mock shipments     ║
║                                                   ║
║  Test credentials:                                ║
║    Franquicia: 9999                               ║
║    Abonado:    123456                             ║
║    User:       testuser                           ║
║    Password:   testpass                           ║
║                                                   ║
╚═══════════════════════════════════════════════════╝
  `);
});
