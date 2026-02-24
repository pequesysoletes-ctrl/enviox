#!/usr/bin/env python3
"""Update blog index cards to use real Sora photos and add hero images to articles"""
import re

# ═══════════════════════════════════════════
# 1. Update blog index cards
# ═══════════════════════════════════════════
blog_index = '/var/www/html/blog/index.html'
with open(blog_index, 'r') as f:
    content = f.read()

# Replace SVG images with JPG photos
card_replacements = [
    ('shipping-apps.svg', 'hero-shipping-apps.jpg', 'Las mejores apps de envío para Shopify España'),
    ('mrw-vs-oficial.svg', 'hero-mrw-vs-oficial.jpg', 'MRW Pro vs módulo oficial MRW'),
    ('recargo-equivalencia.svg', 'hero-recargo-equivalencia.jpg', 'Recargo de Equivalencia en Shopify'),
    ('automatizar-envios.svg', 'hero-automatizar-envios.jpg', 'Automatizar envíos en Shopify España'),
    ('etiquetas-envio.svg', 'hero-etiquetas-envio.jpg', 'Etiquetas de envío en Shopify'),
]

for old_file, new_file, alt in card_replacements:
    content = content.replace(
        f'/assets/blog/{old_file}',
        f'/assets/blog/{new_file}'
    )

with open(blog_index, 'w') as f:
    f.write(content)
print('✅ Blog index: cards updated with Sora photos')


# ═══════════════════════════════════════════
# 2. Add hero images to each article page
# ═══════════════════════════════════════════
article_images = {
    '/var/www/html/blog/mejores-apps-envio-shopify-espana/index.html': 'hero-shipping-apps.jpg',
    '/var/www/html/blog/mrw-pro-vs-modulo-oficial-mrw/index.html': 'hero-mrw-vs-oficial.jpg',
    '/var/www/html/blog/que-es-recargo-equivalencia-shopify/index.html': 'hero-recargo-equivalencia.jpg',
    '/var/www/html/blog/como-automatizar-envios-shopify-espana/index.html': 'hero-automatizar-envios.jpg',
    '/var/www/html/blog/etiquetas-envio-shopify-mrw-correos/index.html': 'hero-etiquetas-envio.jpg',
}

for path, img in article_images.items():
    with open(path, 'r') as f:
        content = f.read()
    
    # Skip if already has hero image
    if 'article-featured-img' in content:
        print(f'  SKIP (already has hero): {path}')
        continue
    
    # Insert hero image between article-hero section and article-content
    hero_img_html = f'''
  <div class="article-featured-img">
    <img src="/assets/blog/{img}" alt="Imagen destacada del artículo" loading="lazy" width="1200" height="800">
  </div>
'''
    
    # Find the end of article-hero section and insert before article-content
    content = content.replace(
        '<article class="article-content">',
        hero_img_html + '\n  <article class="article-content">'
    )
    
    with open(path, 'w') as f:
        f.write(content)
    print(f'  ✅ Added hero image: {path}')


# ═══════════════════════════════════════════
# 3. Update OG images to use the real photos
# ═══════════════════════════════════════════
og_images = {
    '/var/www/html/blog/mejores-apps-envio-shopify-espana/index.html': 'hero-shipping-apps.jpg',
    '/var/www/html/blog/mrw-pro-vs-modulo-oficial-mrw/index.html': 'hero-mrw-vs-oficial.jpg',
    '/var/www/html/blog/que-es-recargo-equivalencia-shopify/index.html': 'hero-recargo-equivalencia.jpg',
    '/var/www/html/blog/como-automatizar-envios-shopify-espana/index.html': 'hero-automatizar-envios.jpg',
    '/var/www/html/blog/etiquetas-envio-shopify-mrw-correos/index.html': 'hero-etiquetas-envio.jpg',
}

for path, img in og_images.items():
    with open(path, 'r') as f:
        content = f.read()
    
    # Replace OG image with the real photo
    content = content.replace(
        'content="https://enviox.es/assets/texto.png"',
        f'content="https://enviox.es/assets/blog/{img}"'
    )
    
    with open(path, 'w') as f:
        f.write(content)

print('✅ OG images updated with Sora photos')
print('\n🎉 All done!')
