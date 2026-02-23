#!/usr/bin/env python3
"""Inject Google Analytics GA4 tag into all HTML pages"""
import os
import glob

GA_TAG = '''<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-8NN7N8GR8D"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-8NN7N8GR8D');
</script>'''

root = '/var/www/html'
count = 0

for path in glob.glob(f'{root}/**/index.html', recursive=True):
    with open(path, 'r') as f:
        content = f.read()
    
    # Skip if already has GA
    if 'G-8NN7N8GR8D' in content:
        print(f'  SKIP (already has GA): {path}')
        continue
    
    # Inject after <head> tag
    if '<head>' in content:
        content = content.replace('<head>', '<head>\n' + GA_TAG, 1)
        with open(path, 'w') as f:
            f.write(content)
        count += 1
        print(f'  ✅ {path}')
    else:
        print(f'  ⚠️  No <head> found: {path}')

print(f'\n🎉 GA4 injected into {count} pages')
