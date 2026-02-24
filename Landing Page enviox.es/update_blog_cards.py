#!/usr/bin/env python3
"""Update blog index to use SVG images instead of emoji cards"""

path = '/var/www/html/blog/index.html'
with open(path, 'r') as f:
    content = f.read()

# Replace emoji card images with SVG images
replacements = [
    (
        '<div class="blog-card-img" style="background: linear-gradient(135deg, #3B82F6, #6366F1);">📦</div>',
        '<div class="blog-card-img"><img src="/assets/blog/shipping-apps.svg" alt="Las mejores apps de envío para Shopify España"></div>'
    ),
    (
        '<div class="blog-card-img" style="background: linear-gradient(135deg, #F59E0B, #EF4444);">🆚</div>',
        '<div class="blog-card-img"><img src="/assets/blog/mrw-vs-oficial.svg" alt="MRW Pro vs módulo oficial MRW"></div>'
    ),
    (
        '<div class="blog-card-img" style="background: linear-gradient(135deg, #10B981, #059669);">🧾</div>',
        '<div class="blog-card-img"><img src="/assets/blog/recargo-equivalencia.svg" alt="Recargo de Equivalencia en Shopify"></div>'
    ),
    (
        '<div class="blog-card-img" style="background: linear-gradient(135deg, #8B5CF6, #6D28D9);">🚀</div>',
        '<div class="blog-card-img"><img src="/assets/blog/automatizar-envios.svg" alt="Automatizar envíos en Shopify España"></div>'
    ),
    (
        '<div class="blog-card-img" style="background: linear-gradient(135deg, #EC4899, #BE185D);">🏷️</div>',
        '<div class="blog-card-img"><img src="/assets/blog/etiquetas-envio.svg" alt="Etiquetas de envío en Shopify"></div>'
    ),
]

for old, new in replacements:
    if old in content:
        content = content.replace(old, new)
        print(f'  ✅ Replaced card image')
    else:
        print(f'  ⚠️  Pattern not found: {old[:50]}...')

with open(path, 'w') as f:
    f.write(content)

print('\n🎉 Blog index updated with SVG images')
