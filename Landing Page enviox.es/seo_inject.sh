#!/bin/bash
# SEO Enhancement Script for enviox.es
# Adds OG tags, canonical URLs, structured data to all pages

# ═══════════ HOME ═══════════
sed -i '/<\/head>/i\
  <!-- SEO: Canonical -->\
  <link rel="canonical" href="https://enviox.es/" />\
  \
  <!-- SEO: Open Graph -->\
  <meta property="og:type" content="website" />\
  <meta property="og:url" content="https://enviox.es/" />\
  <meta property="og:title" content="Enviox — La suite de ecommerce para España" />\
  <meta property="og:description" content="Automatiza tus envíos y tu fiscalidad con Enviox. MRW Pro, Correos Pro, DHL Pro para Shopify, WooCommerce y PrestaShop." />\
  <meta property="og:image" content="https://enviox.es/assets/texto.png" />\
  <meta property="og:locale" content="es_ES" />\
  <meta property="og:site_name" content="Enviox" />\
  \
  <!-- SEO: Twitter Card -->\
  <meta name="twitter:card" content="summary_large_image" />\
  <meta name="twitter:title" content="Enviox — La suite de ecommerce para España" />\
  <meta name="twitter:description" content="Automatiza tus envíos y tu fiscalidad con Enviox." />\
  <meta name="twitter:image" content="https://enviox.es/assets/texto.png" />\
  \
  <!-- SEO: Structured Data -->\
  <script type="application/ld+json">\
  {\
    "@context": "https://schema.org",\
    "@type": "Organization",\
    "name": "Enviox",\
    "url": "https://enviox.es",\
    "logo": "https://enviox.es/assets/texto.png",\
    "description": "Suite de aplicaciones de ecommerce para el mercado español. Logística, fiscalidad e IA para Shopify, WooCommerce y PrestaShop.",\
    "contactPoint": {\
      "@type": "ContactPoint",\
      "email": "contacto@enviox.es",\
      "contactType": "customer service",\
      "availableLanguage": "Spanish"\
    },\
    "sameAs": []\
  }\
  </script>' /var/www/html/index.html

echo "✅ HOME done"

# ═══════════ MRW PRO ═══════════
sed -i '/<\/head>/i\
  <link rel="canonical" href="https://enviox.es/mrw-pro" />\
  <meta property="og:type" content="product" />\
  <meta property="og:url" content="https://enviox.es/mrw-pro" />\
  <meta property="og:title" content="MRW Pro para Shopify — Automatiza envíos MRW" />\
  <meta property="og:description" content="Crea envíos MRW desde Shopify en 1 clic. Etiquetas PDF, tracking automático, recogidas programadas. Usa TU contrato MRW. 14 días gratis." />\
  <meta property="og:image" content="https://enviox.es/assets/texto.png" />\
  <meta property="og:locale" content="es_ES" />\
  <meta property="og:site_name" content="Enviox" />\
  <meta name="twitter:card" content="summary_large_image" />\
  <meta name="twitter:title" content="MRW Pro para Shopify — Automatiza envíos MRW" />\
  <meta name="twitter:description" content="Crea envíos MRW desde Shopify en 1 clic. 14 días gratis." />\
  <meta name="twitter:image" content="https://enviox.es/assets/texto.png" />\
  <script type="application/ld+json">\
  {\
    "@context": "https://schema.org",\
    "@type": "SoftwareApplication",\
    "name": "MRW Pro para Shopify",\
    "applicationCategory": "BusinessApplication",\
    "operatingSystem": "Web",\
    "url": "https://enviox.es/mrw-pro",\
    "description": "Automatiza tus envíos MRW desde Shopify. Crea envíos en 1 clic, imprime etiquetas PDF, tracking automático y recogidas programadas.",\
    "offers": {\
      "@type": "Offer",\
      "price": "29",\
      "priceCurrency": "EUR",\
      "priceValidUntil": "2027-12-31"\
    },\
    "author": {\
      "@type": "Organization",\
      "name": "Enviox",\
      "url": "https://enviox.es"\
    }\
  }\
  </script>' /var/www/html/mrw-pro/index.html

echo "✅ MRW-PRO done"

# ═══════════ CORREOS PRO ═══════════
sed -i '/<\/head>/i\
  <link rel="canonical" href="https://enviox.es/correos-pro" />\
  <meta property="og:type" content="product" />\
  <meta property="og:url" content="https://enviox.es/correos-pro" />\
  <meta property="og:title" content="Correos Pro para Shopify — Standard + Express en una sola app" />\
  <meta property="og:description" content="Integra Correos Standard y Correos Express en tu Shopify. Enrutamiento inteligente, etiquetas, tracking y devoluciones. Usa TU contrato." />\
  <meta property="og:image" content="https://enviox.es/assets/texto.png" />\
  <meta property="og:locale" content="es_ES" />\
  <meta property="og:site_name" content="Enviox" />\
  <meta name="twitter:card" content="summary_large_image" />\
  <meta name="twitter:title" content="Correos Pro para Shopify" />\
  <meta name="twitter:description" content="Correos Standard + Express en una sola app para Shopify." />\
  <meta name="twitter:image" content="https://enviox.es/assets/texto.png" />\
  <script type="application/ld+json">\
  {\
    "@context": "https://schema.org",\
    "@type": "SoftwareApplication",\
    "name": "Correos Pro para Shopify",\
    "applicationCategory": "BusinessApplication",\
    "operatingSystem": "Web",\
    "url": "https://enviox.es/correos-pro",\
    "description": "Integra Correos Standard y Correos Express en tu tienda Shopify con enrutamiento inteligente.",\
    "offers": {\
      "@type": "Offer",\
      "price": "29",\
      "priceCurrency": "EUR",\
      "priceValidUntil": "2027-12-31"\
    },\
    "author": {\
      "@type": "Organization",\
      "name": "Enviox",\
      "url": "https://enviox.es"\
    }\
  }\
  </script>' /var/www/html/correos-pro/index.html

echo "✅ CORREOS-PRO done"

# ═══════════ DHL PRO ═══════════
sed -i '/<\/head>/i\
  <link rel="canonical" href="https://enviox.es/dhl-pro" />\
  <meta property="og:type" content="product" />\
  <meta property="og:url" content="https://enviox.es/dhl-pro" />\
  <meta property="og:title" content="DHL Pro para Shopify — Envíos DHL Express y Paket" />\
  <meta property="og:description" content="Integra DHL Express y DHL Paket en tu tienda Shopify. Envíos internacionales y nacionales automatizados." />\
  <meta property="og:image" content="https://enviox.es/assets/texto.png" />\
  <meta property="og:locale" content="es_ES" />\
  <meta property="og:site_name" content="Enviox" />\
  <meta name="twitter:card" content="summary_large_image" />\
  <meta name="twitter:title" content="DHL Pro para Shopify" />\
  <meta name="twitter:description" content="Envíos DHL Express y Paket desde Shopify. Próximamente." />\
  <meta name="twitter:image" content="https://enviox.es/assets/texto.png" />\
  <script type="application/ld+json">\
  {\
    "@context": "https://schema.org",\
    "@type": "SoftwareApplication",\
    "name": "DHL Pro para Shopify",\
    "applicationCategory": "BusinessApplication",\
    "operatingSystem": "Web",\
    "url": "https://enviox.es/dhl-pro",\
    "description": "Integra DHL Express y DHL Paket en tu tienda Shopify para envíos nacionales e internacionales.",\
    "author": {\
      "@type": "Organization",\
      "name": "Enviox",\
      "url": "https://enviox.es"\
    }\
  }\
  </script>' /var/www/html/dhl-pro/index.html

echo "✅ DHL-PRO done"

# ═══════════ SHOPIFY RE ═══════════
sed -i '/<\/head>/i\
  <link rel="canonical" href="https://enviox.es/shopify-re" />\
  <meta property="og:type" content="product" />\
  <meta property="og:url" content="https://enviox.es/shopify-re" />\
  <meta property="og:title" content="Shopify RE — Recargo de Equivalencia automático en Shopify" />\
  <meta property="og:description" content="Gestiona el Recargo de Equivalencia automáticamente en tu tienda Shopify. Cumple con Hacienda sin errores. Para comerciantes minoristas en España." />\
  <meta property="og:image" content="https://enviox.es/assets/texto.png" />\
  <meta property="og:locale" content="es_ES" />\
  <meta property="og:site_name" content="Enviox" />\
  <meta name="twitter:card" content="summary_large_image" />\
  <meta name="twitter:title" content="Shopify RE — Recargo de Equivalencia" />\
  <meta name="twitter:description" content="Recargo de Equivalencia automático en Shopify para minoristas españoles." />\
  <meta name="twitter:image" content="https://enviox.es/assets/texto.png" />\
  <script type="application/ld+json">\
  {\
    "@context": "https://schema.org",\
    "@type": "SoftwareApplication",\
    "name": "Shopify RE - Recargo de Equivalencia",\
    "applicationCategory": "FinanceApplication",\
    "operatingSystem": "Web",\
    "url": "https://enviox.es/shopify-re",\
    "description": "Gestiona el Recargo de Equivalencia automáticamente en Shopify para comerciantes minoristas en España.",\
    "author": {\
      "@type": "Organization",\
      "name": "Enviox",\
      "url": "https://enviox.es"\
    }\
  }\
  </script>' /var/www/html/shopify-re/index.html

echo "✅ SHOPIFY-RE done"

# ═══════════ BUNDLER ═══════════
sed -i '/<\/head>/i\
  <link rel="canonical" href="https://enviox.es/bundler" />\
  <meta property="og:type" content="product" />\
  <meta property="og:url" content="https://enviox.es/bundler" />\
  <meta property="og:title" content="ShopifyBundler Pro — Bundles inteligentes con IA para Shopify" />\
  <meta property="og:description" content="Crea bundles de productos inteligentes con IA que aumentan tu AOV. Analiza tu catálogo y sugiere las mejores combinaciones." />\
  <meta property="og:image" content="https://enviox.es/assets/texto.png" />\
  <meta property="og:locale" content="es_ES" />\
  <meta property="og:site_name" content="Enviox" />\
  <meta name="twitter:card" content="summary_large_image" />\
  <meta name="twitter:title" content="ShopifyBundler Pro — Bundles con IA" />\
  <meta name="twitter:description" content="Bundles inteligentes con IA para aumentar ventas en Shopify." />\
  <meta name="twitter:image" content="https://enviox.es/assets/texto.png" />\
  <script type="application/ld+json">\
  {\
    "@context": "https://schema.org",\
    "@type": "SoftwareApplication",\
    "name": "ShopifyBundler Pro",\
    "applicationCategory": "BusinessApplication",\
    "operatingSystem": "Web",\
    "url": "https://enviox.es/bundler",\
    "description": "Crea bundles de productos inteligentes con IA que aumentan tu AOV en Shopify.",\
    "author": {\
      "@type": "Organization",\
      "name": "Enviox",\
      "url": "https://enviox.es"\
    }\
  }\
  </script>' /var/www/html/bundler/index.html

echo "✅ BUNDLER done"

# ═══════════ WOOCOMMERCE RE ═══════════
sed -i '/<\/head>/i\
  <link rel="canonical" href="https://enviox.es/woocommerce-re" />\
  <meta property="og:type" content="product" />\
  <meta property="og:url" content="https://enviox.es/woocommerce-re" />\
  <meta property="og:title" content="WooCommerce RE — Recargo de Equivalencia para WooCommerce" />\
  <meta property="og:description" content="Gestiona el Recargo de Equivalencia en WooCommerce automáticamente. Para comerciantes minoristas en España." />\
  <meta property="og:image" content="https://enviox.es/assets/texto.png" />\
  <meta property="og:locale" content="es_ES" />\
  <meta property="og:site_name" content="Enviox" />\
  <meta name="twitter:card" content="summary_large_image" />\
  <meta name="twitter:title" content="WooCommerce RE — Recargo de Equivalencia" />\
  <meta name="twitter:description" content="Recargo de Equivalencia automático en WooCommerce." />\
  <meta name="twitter:image" content="https://enviox.es/assets/texto.png" />\
  <script type="application/ld+json">\
  {\
    "@context": "https://schema.org",\
    "@type": "SoftwareApplication",\
    "name": "WooCommerce RE - Recargo de Equivalencia",\
    "applicationCategory": "FinanceApplication",\
    "operatingSystem": "Web",\
    "url": "https://enviox.es/woocommerce-re",\
    "description": "Recargo de Equivalencia automatizado para WooCommerce. Para minoristas españoles.",\
    "author": {\
      "@type": "Organization",\
      "name": "Enviox",\
      "url": "https://enviox.es"\
    }\
  }\
  </script>' /var/www/html/woocommerce-re/index.html

echo "✅ WOOCOMMERCE-RE done"

# ═══════════ CORREOS PRESTASHOP ═══════════
sed -i '/<\/head>/i\
  <link rel="canonical" href="https://enviox.es/correos-prestashop" />\
  <meta property="og:type" content="product" />\
  <meta property="og:url" content="https://enviox.es/correos-prestashop" />\
  <meta property="og:title" content="Correos PrestaShop — Módulo Correos para PrestaShop" />\
  <meta property="og:description" content="Integra Correos en tu tienda PrestaShop. Envíos automáticos, etiquetas PDF, tracking y recogidas." />\
  <meta property="og:image" content="https://enviox.es/assets/texto.png" />\
  <meta property="og:locale" content="es_ES" />\
  <meta property="og:site_name" content="Enviox" />\
  <meta name="twitter:card" content="summary_large_image" />\
  <meta name="twitter:title" content="Correos PrestaShop" />\
  <meta name="twitter:description" content="Módulo Correos para PrestaShop. Próximamente." />\
  <meta name="twitter:image" content="https://enviox.es/assets/texto.png" />\
  <script type="application/ld+json">\
  {\
    "@context": "https://schema.org",\
    "@type": "SoftwareApplication",\
    "name": "Correos PrestaShop",\
    "applicationCategory": "BusinessApplication",\
    "operatingSystem": "Web",\
    "url": "https://enviox.es/correos-prestashop",\
    "description": "Módulo de Correos para PrestaShop con envíos automáticos, etiquetas y tracking.",\
    "author": {\
      "@type": "Organization",\
      "name": "Enviox",\
      "url": "https://enviox.es"\
    }\
  }\
  </script>' /var/www/html/correos-prestashop/index.html

echo "✅ CORREOS-PRESTASHOP done"

# ═══════════ CONTACTO ═══════════
sed -i '/<\/head>/i\
  <link rel="canonical" href="https://enviox.es/contacto" />\
  <meta property="og:type" content="website" />\
  <meta property="og:url" content="https://enviox.es/contacto" />\
  <meta property="og:title" content="Contacto — Enviox" />\
  <meta property="og:description" content="¿Tienes preguntas sobre nuestras apps? Contacta con el equipo de Enviox." />\
  <meta property="og:locale" content="es_ES" />\
  <meta property="og:site_name" content="Enviox" />' /var/www/html/contacto/index.html

echo "✅ CONTACTO done"

# ═══════════ PRIVACIDAD ═══════════
sed -i '/<\/head>/i\
  <link rel="canonical" href="https://enviox.es/privacidad" />\
  <meta name="robots" content="noindex, follow" />' /var/www/html/privacidad/index.html

echo "✅ PRIVACIDAD done"

# ═══════════ TÉRMINOS ═══════════
sed -i '/<\/head>/i\
  <link rel="canonical" href="https://enviox.es/terminos" />\
  <meta name="robots" content="noindex, follow" />' /var/www/html/terminos/index.html

echo "✅ TÉRMINOS done"

echo ""
echo "🎉 ALL PAGES ENHANCED WITH SEO TAGS"
