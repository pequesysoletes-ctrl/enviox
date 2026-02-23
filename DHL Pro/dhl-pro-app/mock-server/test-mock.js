/**
 * Test script for MRW Mock Server
 * Run: node test-mock.js
 * 
 * Prerequisites: Start mock server first with `npm start`
 */

const MOCK_URL = 'http://localhost:3001';

// ─── SOAP XML Templates ────────────────────────────────

const TRANSMITIR_ENVIO_XML = `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"
               xmlns:mrw="http://www.mrw.es/">
  <soap:Header>
    <mrw:AuthInfo>
      <mrw:CodigoFranquicia>9999</mrw:CodigoFranquicia>
      <mrw:CodigoAbonado>123456</mrw:CodigoAbonado>
      <mrw:CodigoDepartamento></mrw:CodigoDepartamento>
      <mrw:UserName>testuser</mrw:UserName>
      <mrw:Password>testpass</mrw:Password>
    </mrw:AuthInfo>
  </soap:Header>
  <soap:Body>
    <mrw:TransmitirEnvio>
      <mrw:request>
        <mrw:DatosEntrega>
          <mrw:Direccion>
            <mrw:Via>Calle Gran Vía 28</mrw:Via>
            <mrw:CodigoPostal>28013</mrw:CodigoPostal>
            <mrw:Poblacion>Madrid</mrw:Poblacion>
            <mrw:Provincia>Madrid</mrw:Provincia>
          </mrw:Direccion>
          <mrw:Nif>12345678A</mrw:Nif>
          <mrw:Nombre>María García López</mrw:Nombre>
          <mrw:Telefono>612345678</mrw:Telefono>
          <mrw:Contacto>María García</mrw:Contacto>
          <mrw:ALaAtencionDe>María García</mrw:ALaAtencionDe>
          <mrw:Observaciones>Portero automático 2B</mrw:Observaciones>
        </mrw:DatosEntrega>
        <mrw:DatosServicio>
          <mrw:Fecha>19/02/2026</mrw:Fecha>
          <mrw:Referencia>SHOP-1234</mrw:Referencia>
          <mrw:CodigoServicio>0800</mrw:CodigoServicio>
          <mrw:NumeroBultos>1</mrw:NumeroBultos>
          <mrw:Peso>2</mrw:Peso>
          <mrw:Reembolso>N</mrw:Reembolso>
          <mrw:ImporteReembolso>0</mrw:ImporteReembolso>
        </mrw:DatosServicio>
      </mrw:request>
    </mrw:TransmitirEnvio>
  </soap:Body>
</soap:Envelope>`;

const BAD_AUTH_XML = `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"
               xmlns:mrw="http://www.mrw.es/">
  <soap:Header>
    <mrw:AuthInfo>
      <mrw:CodigoFranquicia>0000</mrw:CodigoFranquicia>
      <mrw:CodigoAbonado>000000</mrw:CodigoAbonado>
      <mrw:CodigoDepartamento></mrw:CodigoDepartamento>
      <mrw:UserName>wronguser</mrw:UserName>
      <mrw:Password>wrongpass</mrw:Password>
    </mrw:AuthInfo>
  </soap:Header>
  <soap:Body>
    <mrw:TransmitirEnvio>
      <mrw:request></mrw:request>
    </mrw:TransmitirEnvio>
  </soap:Body>
</soap:Envelope>`;

const GET_ETIQUETA_XML = (trackingNumber) => `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"
               xmlns:mrw="http://www.mrw.es/">
  <soap:Header>
    <mrw:AuthInfo>
      <mrw:CodigoFranquicia>9999</mrw:CodigoFranquicia>
      <mrw:CodigoAbonado>123456</mrw:CodigoAbonado>
      <mrw:CodigoDepartamento></mrw:CodigoDepartamento>
      <mrw:UserName>testuser</mrw:UserName>
      <mrw:Password>testpass</mrw:Password>
    </mrw:AuthInfo>
  </soap:Header>
  <soap:Body>
    <mrw:GetEtiquetaEnvio>
      <mrw:request>
        <mrw:NumeroEnvio>${trackingNumber}</mrw:NumeroEnvio>
      </mrw:request>
    </mrw:GetEtiquetaEnvio>
  </soap:Body>
</soap:Envelope>`;

const SEGUIMIENTO_XML = `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"
               xmlns:mrw="http://www.mrw.es/">
  <soap:Header>
    <mrw:AuthInfo>
      <mrw:CodigoFranquicia>9999</mrw:CodigoFranquicia>
      <mrw:CodigoAbonado>123456</mrw:CodigoAbonado>
      <mrw:CodigoDepartamento></mrw:CodigoDepartamento>
      <mrw:UserName>testuser</mrw:UserName>
      <mrw:Password>testpass</mrw:Password>
    </mrw:AuthInfo>
  </soap:Header>
  <soap:Body>
    <mrw:GetSeguimientoEnvio>
      <mrw:request>
        <mrw:NumeroEnvio>0123456000100001</mrw:NumeroEnvio>
      </mrw:request>
    </mrw:GetSeguimientoEnvio>
  </soap:Body>
</soap:Envelope>`;

// ─── TEST RUNNER ────────────────────────────────────────

async function soapRequest(endpoint, xml) {
  const res = await fetch(`${MOCK_URL}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'text/xml; charset=utf-8' },
    body: xml,
  });
  return res.text();
}

async function runTests() {
  console.log('🧪 MRW Mock Server — Test Suite\n');
  console.log('='.repeat(50));
  
  let passed = 0;
  let failed = 0;
  
  // Test 1: Health check
  try {
    const res = await fetch(`${MOCK_URL}/health`);
    const data = await res.json();
    console.log(`\n✅ TEST 1: Health check — ${data.status}`);
    passed++;
  } catch (e) {
    console.log(`\n❌ TEST 1: Health check FAILED — Is the server running?`);
    console.log('   Start it with: cd mock-server && npm start');
    failed++;
    return;
  }
  
  // Test 2: WSDL endpoint
  try {
    const res = await fetch(`${MOCK_URL}/MRWEnvio.asmx?WSDL`);
    const text = await res.text();
    const ok = text.includes('MRWEnvioService') && text.includes('TransmitirEnvio');
    console.log(`${ok ? '✅' : '❌'} TEST 2: WSDL endpoint — ${ok ? 'Valid WSDL' : 'Invalid'}`);
    ok ? passed++ : failed++;
  } catch (e) {
    console.log(`❌ TEST 2: WSDL endpoint FAILED`);
    failed++;
  }
  
  // Test 3: Bad auth returns error
  try {
    const response = await soapRequest('/MRWEnvio.asmx', BAD_AUTH_XML);
    const ok = response.includes('incorrectos') && response.includes('Estado>0');
    console.log(`${ok ? '✅' : '❌'} TEST 3: Bad auth rejected — ${ok ? 'Correct error' : 'Unexpected response'}`);
    ok ? passed++ : failed++;
  } catch (e) {
    console.log(`❌ TEST 3: Bad auth test FAILED`);
    failed++;
  }
  
  // Test 4: Create shipment (TransmitirEnvio)
  let trackingNumber = '';
  try {
    const response = await soapRequest('/MRWEnvio.asmx', TRANSMITIR_ENVIO_XML);
    const numMatch = response.match(/NumeroEnvio>([^<]+)/);
    trackingNumber = numMatch ? numMatch[1] : '';
    const ok = response.includes('Estado>1') && trackingNumber.length > 0;
    console.log(`${ok ? '✅' : '❌'} TEST 4: TransmitirEnvio — Tracking: ${trackingNumber}`);
    ok ? passed++ : failed++;
  } catch (e) {
    console.log(`❌ TEST 4: TransmitirEnvio FAILED`);
    failed++;
  }
  
  // Test 5: Get label (GetEtiquetaEnvio)
  try {
    const response = await soapRequest('/MRWEnvio.asmx', GET_ETIQUETA_XML(trackingNumber));
    const ok = response.includes('EtiquetaFile>') && response.includes('Estado>1');
    console.log(`${ok ? '✅' : '❌'} TEST 5: GetEtiquetaEnvio — ${ok ? 'Label generated' : 'No label'}`);
    ok ? passed++ : failed++;
  } catch (e) {
    console.log(`❌ TEST 5: GetEtiquetaEnvio FAILED`);
    failed++;
  }
  
  // Test 6: Tracking (SeguimientoEnvio)
  try {
    const response = await soapRequest('/wssgmntnvs.asmx', SEGUIMIENTO_XML);
    const ok = response.includes('SeguimientoEnvioItem') && response.includes('Estado>1');
    console.log(`${ok ? '✅' : '❌'} TEST 6: SeguimientoEnvio — ${ok ? 'Events returned' : 'No events'}`);
    ok ? passed++ : failed++;
  } catch (e) {
    console.log(`❌ TEST 6: SeguimientoEnvio FAILED`);
    failed++;
  }
  
  // Test 7: API shipments list
  try {
    const res = await fetch(`${MOCK_URL}/api/shipments`);
    const data = await res.json();
    const ok = data.count >= 1;
    console.log(`${ok ? '✅' : '❌'} TEST 7: Shipments list — ${data.count} shipment(s)`);
    ok ? passed++ : failed++;
  } catch (e) {
    console.log(`❌ TEST 7: Shipments list FAILED`);
    failed++;
  }
  
  // Summary
  console.log('\n' + '='.repeat(50));
  console.log(`\n📊 Results: ${passed} passed, ${failed} failed (${passed + failed} total)`);
  console.log(failed === 0 ? '\n🎉 ALL TESTS PASSED!' : '\n⚠️  Some tests failed');
}

runTests().catch(console.error);
