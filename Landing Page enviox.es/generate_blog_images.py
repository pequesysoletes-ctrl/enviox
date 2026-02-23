#!/usr/bin/env python3
"""Generate SVG blog card banners and article hero images"""
import os

# Create assets directory for blog images
os.makedirs('/var/www/html/assets/blog', exist_ok=True)

# ═══════════════════════════════════════════
# SVG banner images for blog cards (700x400px)
# ═══════════════════════════════════════════

# 1. Shipping Apps Comparison
svg_shipping = '''<svg xmlns="http://www.w3.org/2000/svg" width="700" height="400" viewBox="0 0 700 400">
  <defs>
    <linearGradient id="bg1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#3B82F6"/><stop offset="100%" stop-color="#6366F1"/></linearGradient>
  </defs>
  <rect width="700" height="400" fill="url(#bg1)"/>
  <g opacity="0.15"><circle cx="600" cy="80" r="120" fill="white"/><circle cx="120" cy="350" r="80" fill="white"/></g>
  <!-- Boxes -->
  <g transform="translate(180,120)">
    <rect x="0" y="20" width="80" height="70" rx="6" fill="white" opacity="0.95"/>
    <polygon points="0,20 40,-5 80,20" fill="white" opacity="0.8"/>
    <rect x="30" y="45" width="20" height="25" rx="2" fill="#3B82F6" opacity="0.6"/>
  </g>
  <g transform="translate(310,100)">
    <rect x="0" y="20" width="90" height="80" rx="6" fill="white" opacity="0.95"/>
    <polygon points="0,20 45,-10 90,20" fill="white" opacity="0.8"/>
    <rect x="25" y="50" width="16" height="16" rx="2" fill="#6366F1" opacity="0.6"/>
    <rect x="47" y="50" width="16" height="16" rx="2" fill="#6366F1" opacity="0.6"/>
    <rect x="25" y="72" width="16" height="16" rx="2" fill="#6366F1" opacity="0.4"/>
    <rect x="47" y="72" width="16" height="16" rx="2" fill="#6366F1" opacity="0.4"/>
  </g>
  <g transform="translate(460,130)">
    <rect x="0" y="20" width="70" height="60" rx="6" fill="white" opacity="0.95"/>
    <polygon points="0,20 35,-5 70,20" fill="white" opacity="0.8"/>
    <line x1="15" y1="45" x2="55" y2="45" stroke="#6366F1" stroke-width="3" opacity="0.5"/>
    <line x1="15" y1="55" x2="45" y2="55" stroke="#6366F1" stroke-width="3" opacity="0.3"/>
  </g>
  <!-- Truck -->
  <g transform="translate(250,240)" opacity="0.9">
    <rect x="0" y="10" width="80" height="45" rx="5" fill="white"/>
    <rect x="80" y="20" width="40" height="35" rx="3" fill="rgba(255,255,255,0.85)"/>
    <circle cx="25" cy="60" r="10" fill="white" stroke="#3B82F6" stroke-width="3"/>
    <circle cx="95" cy="60" r="10" fill="white" stroke="#3B82F6" stroke-width="3"/>
    <rect x="85" y="25" width="15" height="12" rx="2" fill="#93C5FD"/>
  </g>
  <!-- Stars -->
  <g fill="white" opacity="0.6">
    <polygon points="550,200 553,210 563,210 555,216 558,226 550,220 542,226 545,216 537,210 547,210" transform="scale(0.8)"/>
    <polygon points="150,80 153,90 163,90 155,96 158,106 150,100 142,106 145,96 137,90 147,90" transform="scale(0.6)"/>
  </g>
  <text x="350" y="350" font-family="system-ui,-apple-system,sans-serif" font-size="22" fill="white" text-anchor="middle" font-weight="700" opacity="0.95">Las 5 mejores apps de envío</text>
  <text x="350" y="378" font-family="system-ui,-apple-system,sans-serif" font-size="15" fill="white" text-anchor="middle" opacity="0.7">Shopify España · 2026</text>
</svg>'''

# 2. MRW Pro vs Official
svg_versus = '''<svg xmlns="http://www.w3.org/2000/svg" width="700" height="400" viewBox="0 0 700 400">
  <defs>
    <linearGradient id="bg2" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#F59E0B"/><stop offset="100%" stop-color="#EF4444"/></linearGradient>
  </defs>
  <rect width="700" height="400" fill="url(#bg2)"/>
  <g opacity="0.1"><circle cx="150" cy="200" r="200" fill="white"/><circle cx="550" cy="200" r="200" fill="white"/></g>
  <!-- Left shield (PRO) -->
  <g transform="translate(200,80)">
    <path d="M0,30 L50,0 L100,30 L100,120 L50,150 L0,120Z" fill="white" opacity="0.95"/>
    <text x="50" y="85" font-family="system-ui,sans-serif" font-size="16" fill="#059669" text-anchor="middle" font-weight="800">PRO</text>
    <text x="50" y="110" font-family="system-ui,sans-serif" font-size="24" fill="#059669" text-anchor="middle">★★★★★</text>
  </g>
  <!-- VS circle -->
  <g transform="translate(315,130)">
    <circle cx="35" cy="35" r="35" fill="white" opacity="0.95"/>
    <text x="35" y="44" font-family="system-ui,sans-serif" font-size="28" fill="#EF4444" text-anchor="middle" font-weight="900">VS</text>
  </g>
  <!-- Right shield (Official) -->
  <g transform="translate(400,80)">
    <path d="M0,30 L50,0 L100,30 L100,120 L50,150 L0,120Z" fill="white" opacity="0.6"/>
    <text x="50" y="80" font-family="system-ui,sans-serif" font-size="12" fill="#DC2626" text-anchor="middle" font-weight="600">OFICIAL</text>
    <text x="50" y="110" font-family="system-ui,sans-serif" font-size="24" fill="#DC2626" text-anchor="middle">★☆☆☆☆</text>
  </g>
  <text x="350" y="300" font-family="system-ui,sans-serif" font-size="22" fill="white" text-anchor="middle" font-weight="700" opacity="0.95">Comparativa completa</text>
  <text x="350" y="328" font-family="system-ui,sans-serif" font-size="15" fill="white" text-anchor="middle" opacity="0.7">MRW Pro vs módulo oficial</text>
</svg>'''

# 3. Recargo de Equivalencia
svg_tax = '''<svg xmlns="http://www.w3.org/2000/svg" width="700" height="400" viewBox="0 0 700 400">
  <defs>
    <linearGradient id="bg3" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#10B981"/><stop offset="100%" stop-color="#059669"/></linearGradient>
  </defs>
  <rect width="700" height="400" fill="url(#bg3)"/>
  <g opacity="0.1"><rect x="100" y="50" width="500" height="300" rx="20" fill="white"/></g>
  <!-- Document / invoice -->
  <g transform="translate(250,50)">
    <rect x="0" y="0" width="200" height="250" rx="12" fill="white" opacity="0.95"/>
    <rect x="20" y="20" width="100" height="14" rx="3" fill="#10B981" opacity="0.3"/>
    <rect x="20" y="44" width="160" height="8" rx="2" fill="#CBD5E1"/>
    <rect x="20" y="60" width="140" height="8" rx="2" fill="#CBD5E1"/>
    <rect x="20" y="76" width="150" height="8" rx="2" fill="#CBD5E1"/>
    <line x1="20" y1="100" x2="180" y2="100" stroke="#E2E8F0" stroke-width="2"/>
    <text x="20" y="125" font-family="system-ui,sans-serif" font-size="11" fill="#64748B">IVA 21%</text>
    <text x="160" y="125" font-family="system-ui,sans-serif" font-size="11" fill="#0F172A" text-anchor="end" font-weight="600">€42,00</text>
    <text x="20" y="148" font-family="system-ui,sans-serif" font-size="11" fill="#059669" font-weight="700">RE 5,2%</text>
    <text x="160" y="148" font-family="system-ui,sans-serif" font-size="11" fill="#059669" text-anchor="end" font-weight="600">€10,40</text>
    <line x1="20" y1="165" x2="180" y2="165" stroke="#E2E8F0" stroke-width="2"/>
    <text x="20" y="190" font-family="system-ui,sans-serif" font-size="13" fill="#0F172A" font-weight="700">TOTAL</text>
    <text x="160" y="190" font-family="system-ui,sans-serif" font-size="13" fill="#0F172A" text-anchor="end" font-weight="700">€252,40</text>
    <!-- Stamp -->
    <g transform="translate(110,180) rotate(-15)">
      <rect x="0" y="0" width="70" height="30" rx="4" fill="none" stroke="#10B981" stroke-width="3" opacity="0.6"/>
      <text x="35" y="22" font-family="system-ui,sans-serif" font-size="12" fill="#10B981" text-anchor="middle" font-weight="800" opacity="0.6">R.E.</text>
    </g>
  </g>
  <text x="350" y="340" font-family="system-ui,sans-serif" font-size="22" fill="white" text-anchor="middle" font-weight="700" opacity="0.95">Recargo de Equivalencia</text>
  <text x="350" y="368" font-family="system-ui,sans-serif" font-size="15" fill="white" text-anchor="middle" opacity="0.7">Guía completa para Shopify</text>
</svg>'''

# 4. Automatizar envíos
svg_automate = '''<svg xmlns="http://www.w3.org/2000/svg" width="700" height="400" viewBox="0 0 700 400">
  <defs>
    <linearGradient id="bg4" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#8B5CF6"/><stop offset="100%" stop-color="#6D28D9"/></linearGradient>
  </defs>
  <rect width="700" height="400" fill="url(#bg4)"/>
  <g opacity="0.1"><circle cx="350" cy="200" r="250" fill="white"/></g>
  <!-- Automation workflow -->
  <g transform="translate(130,100)">
    <!-- Step 1: Order -->
    <rect x="0" y="30" width="100" height="70" rx="10" fill="white" opacity="0.95"/>
    <text x="50" y="55" font-family="system-ui,sans-serif" font-size="24" text-anchor="middle">🛒</text>
    <text x="50" y="82" font-family="system-ui,sans-serif" font-size="10" fill="#6D28D9" text-anchor="middle" font-weight="600">PEDIDO</text>
    <!-- Arrow -->
    <line x1="105" y1="65" x2="155" y2="65" stroke="white" stroke-width="3" opacity="0.7"/>
    <polygon points="155,58 170,65 155,72" fill="white" opacity="0.7"/>
    <!-- Step 2: Auto -->
    <rect x="175" y="20" width="100" height="90" rx="10" fill="white" opacity="0.95"/>
    <text x="225" y="52" font-family="system-ui,sans-serif" font-size="28" text-anchor="middle">⚡</text>
    <text x="225" y="75" font-family="system-ui,sans-serif" font-size="10" fill="#6D28D9" text-anchor="middle" font-weight="600">AUTO</text>
    <text x="225" y="92" font-family="system-ui,sans-serif" font-size="9" fill="#A78BFA" text-anchor="middle">10 seg</text>
    <!-- Arrow -->
    <line x1="280" y1="65" x2="330" y2="65" stroke="white" stroke-width="3" opacity="0.7"/>
    <polygon points="330,58 345,65 330,72" fill="white" opacity="0.7"/>
    <!-- Step 3: Shipped -->
    <rect x="350" y="30" width="100" height="70" rx="10" fill="white" opacity="0.95"/>
    <text x="400" y="55" font-family="system-ui,sans-serif" font-size="24" text-anchor="middle">📦</text>
    <text x="400" y="82" font-family="system-ui,sans-serif" font-size="10" fill="#6D28D9" text-anchor="middle" font-weight="600">ENVIADO</text>
  </g>
  <!-- Dotted circle around auto -->
  <circle cx="355" cy="165" r="65" fill="none" stroke="white" stroke-width="2" stroke-dasharray="8 4" opacity="0.3"/>
  <text x="350" y="300" font-family="system-ui,sans-serif" font-size="22" fill="white" text-anchor="middle" font-weight="700" opacity="0.95">Automatiza tus envíos</text>
  <text x="350" y="328" font-family="system-ui,sans-serif" font-size="15" fill="white" text-anchor="middle" opacity="0.7">De 5 minutos a 10 segundos por pedido</text>
</svg>'''

# 5. Etiquetas de envío
svg_labels = '''<svg xmlns="http://www.w3.org/2000/svg" width="700" height="400" viewBox="0 0 700 400">
  <defs>
    <linearGradient id="bg5" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#EC4899"/><stop offset="100%" stop-color="#BE185D"/></linearGradient>
  </defs>
  <rect width="700" height="400" fill="url(#bg5)"/>
  <g opacity="0.1"><circle cx="200" cy="300" r="200" fill="white"/><circle cx="500" cy="100" r="150" fill="white"/></g>
  <!-- Shipping label -->
  <g transform="translate(220,50)">
    <rect x="0" y="0" width="260" height="200" rx="12" fill="white" opacity="0.95"/>
    <!-- Header bar -->
    <rect x="0" y="0" width="260" height="35" rx="12" fill="#0F172A" opacity="0.9"/>
    <rect x="210" y="35" width="50" height="0" rx="0" fill="#0F172A"/>
    <text x="20" y="24" font-family="system-ui,sans-serif" font-size="14" fill="white" font-weight="700">MRW</text>
    <text x="240" y="24" font-family="system-ui,sans-serif" font-size="10" fill="#94A3B8" text-anchor="end">URGENTE</text>
    <!-- Content -->
    <text x="20" y="60" font-family="system-ui,sans-serif" font-size="9" fill="#94A3B8">DESTINATARIO</text>
    <text x="20" y="78" font-family="system-ui,sans-serif" font-size="12" fill="#0F172A" font-weight="600">Juan García López</text>
    <text x="20" y="95" font-family="system-ui,sans-serif" font-size="10" fill="#64748B">C/ Gran Vía 45, 2ºB</text>
    <text x="20" y="110" font-family="system-ui,sans-serif" font-size="10" fill="#64748B">28013 Madrid</text>
    <!-- Barcode-like -->
    <g transform="translate(20,125)">
      <rect x="0" y="0" width="3" height="40" fill="#0F172A"/><rect x="5" y="0" width="2" height="40" fill="#0F172A"/>
      <rect x="9" y="0" width="4" height="40" fill="#0F172A"/><rect x="16" y="0" width="2" height="40" fill="#0F172A"/>
      <rect x="20" y="0" width="3" height="40" fill="#0F172A"/><rect x="26" y="0" width="1" height="40" fill="#0F172A"/>
      <rect x="30" y="0" width="4" height="40" fill="#0F172A"/><rect x="36" y="0" width="2" height="40" fill="#0F172A"/>
      <rect x="41" y="0" width="3" height="40" fill="#0F172A"/><rect x="47" y="0" width="1" height="40" fill="#0F172A"/>
      <rect x="51" y="0" width="4" height="40" fill="#0F172A"/><rect x="58" y="0" width="2" height="40" fill="#0F172A"/>
      <rect x="63" y="0" width="3" height="40" fill="#0F172A"/><rect x="69" y="0" width="2" height="40" fill="#0F172A"/>
      <rect x="74" y="0" width="4" height="40" fill="#0F172A"/><rect x="81" y="0" width="1" height="40" fill="#0F172A"/>
      <rect x="85" y="0" width="3" height="40" fill="#0F172A"/><rect x="91" y="0" width="2" height="40" fill="#0F172A"/>
      <rect x="96" y="0" width="4" height="40" fill="#0F172A"/>
    </g>
    <text x="20" y="180" font-family="monospace" font-size="10" fill="#64748B">0662 7845 3210 9876</text>
    <!-- Printer icon -->
    <g transform="translate(170,120)" opacity="0.5">
      <rect x="0" y="15" width="60" height="35" rx="5" fill="#E2E8F0"/>
      <rect x="10" y="5" width="40" height="15" rx="3" fill="#CBD5E1"/>
      <rect x="15" y="45" width="30" height="20" rx="2" fill="white" stroke="#CBD5E1" stroke-width="1"/>
    </g>
  </g>
  <text x="350" y="300" font-family="system-ui,sans-serif" font-size="22" fill="white" text-anchor="middle" font-weight="700" opacity="0.95">Etiquetas de envío</text>
  <text x="350" y="328" font-family="system-ui,sans-serif" font-size="15" fill="white" text-anchor="middle" opacity="0.7">MRW · Correos · DHL</text>
</svg>'''

# Save all SVGs
images = {
    'shipping-apps.svg': svg_shipping,
    'mrw-vs-oficial.svg': svg_versus,
    'recargo-equivalencia.svg': svg_tax,
    'automatizar-envios.svg': svg_automate,
    'etiquetas-envio.svg': svg_labels,
}

for name, svg in images.items():
    path = f'/var/www/html/assets/blog/{name}'
    with open(path, 'w') as f:
        f.write(svg)
    print(f'  ✅ {path}')

print(f'\n🎉 Generated {len(images)} blog SVG images')
