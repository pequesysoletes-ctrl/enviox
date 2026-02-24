---
description: Deploy the Enviox landing page to the VPS and backup to GitHub
---
// turbo-all

## Deploy Enviox Landing Page to VPS

1. Upload all landing page files to the VPS:
```powershell
scp -r "c:\Users\jovi3\.gemini\antigravity\scratch\1 MRW Shopify\Landing Page enviox.es\index.html" "c:\Users\jovi3\.gemini\antigravity\scratch\1 MRW Shopify\Landing Page enviox.es\styles.css" "c:\Users\jovi3\.gemini\antigravity\scratch\1 MRW Shopify\Landing Page enviox.es\product-page.css" "c:\Users\jovi3\.gemini\antigravity\scratch\1 MRW Shopify\Landing Page enviox.es\blog.css" "c:\Users\jovi3\.gemini\antigravity\scratch\1 MRW Shopify\Landing Page enviox.es\script.js" "c:\Users\jovi3\.gemini\antigravity\scratch\1 MRW Shopify\Landing Page enviox.es\sitemap.xml" "c:\Users\jovi3\.gemini\antigravity\scratch\1 MRW Shopify\Landing Page enviox.es\robots.txt" root@49.13.132.241:/var/www/html/
```

2. Upload all subdirectories (products, legal, blog, assets):
```powershell
scp -r "c:\Users\jovi3\.gemini\antigravity\scratch\1 MRW Shopify\Landing Page enviox.es\mrw-pro" "c:\Users\jovi3\.gemini\antigravity\scratch\1 MRW Shopify\Landing Page enviox.es\correos-pro" "c:\Users\jovi3\.gemini\antigravity\scratch\1 MRW Shopify\Landing Page enviox.es\dhl-pro" "c:\Users\jovi3\.gemini\antigravity\scratch\1 MRW Shopify\Landing Page enviox.es\shopify-re" "c:\Users\jovi3\.gemini\antigravity\scratch\1 MRW Shopify\Landing Page enviox.es\geomarkets-eu" "c:\Users\jovi3\.gemini\antigravity\scratch\1 MRW Shopify\Landing Page enviox.es\smart-preorders" "c:\Users\jovi3\.gemini\antigravity\scratch\1 MRW Shopify\Landing Page enviox.es\bundler" "c:\Users\jovi3\.gemini\antigravity\scratch\1 MRW Shopify\Landing Page enviox.es\correos-prestashop" "c:\Users\jovi3\.gemini\antigravity\scratch\1 MRW Shopify\Landing Page enviox.es\woocommerce-re" "c:\Users\jovi3\.gemini\antigravity\scratch\1 MRW Shopify\Landing Page enviox.es\blog" "c:\Users\jovi3\.gemini\antigravity\scratch\1 MRW Shopify\Landing Page enviox.es\privacidad" "c:\Users\jovi3\.gemini\antigravity\scratch\1 MRW Shopify\Landing Page enviox.es\terminos" "c:\Users\jovi3\.gemini\antigravity\scratch\1 MRW Shopify\Landing Page enviox.es\contacto" "c:\Users\jovi3\.gemini\antigravity\scratch\1 MRW Shopify\Landing Page enviox.es\assets" root@49.13.132.241:/var/www/html/
```

3. Set permissions:
```powershell
ssh root@49.13.132.241 "chmod -R 755 /var/www/html/ && echo 'Permisos OK'"
```

4. Verify the deployment:
```powershell
ssh root@49.13.132.241 "curl -s -o /dev/null -w '%{http_code}' https://enviox.es/ && echo ' homepage' && curl -s -o /dev/null -w '%{http_code}' https://enviox.es/mrw-pro/ && echo ' mrw-pro' && curl -s -o /dev/null -w '%{http_code}' https://enviox.es/geomarkets-eu/ && echo ' geomarkets' && curl -s -o /dev/null -w '%{http_code}' https://enviox.es/smart-preorders/ && echo ' preorders' && curl -s -o /dev/null -w '%{http_code}' https://enviox.es/privacidad/ && echo ' privacidad'"
```

5. Backup to GitHub (commit + push):
```powershell
ssh root@49.13.132.241 "cd /var/www/html && git add -A && git diff --cached --quiet && echo 'No changes to commit' || (git commit -m 'deploy: update landing page' && git push origin main && echo 'Pushed to GitHub')"
```

## VPS Info
- **IP**: 49.13.132.241
- **SSH**: root@49.13.132.241
- **Web root**: /var/www/html
- **Domain**: enviox.es
- **GitHub**: https://github.com/pequesysoletes-ctrl/enviox
- **Deploy key**: enviox-vps-deploy (ed25519, write access)
