#!/usr/bin/env python3
"""Fix blog pages: inject blog.css stylesheet and add article-page class to body"""
import os
import glob
import re

root = '/var/www/html/blog'
count = 0

for path in glob.glob(f'{root}/**/index.html', recursive=True):
    with open(path, 'r') as f:
        content = f.read()
    
    modified = False
    
    # 1. Add blog.css link if not present
    if 'blog.css' not in content:
        # Insert after styles.css link
        content = content.replace(
            '<link rel="stylesheet" href="/styles.css">',
            '<link rel="stylesheet" href="/styles.css">\n  <link rel="stylesheet" href="/blog.css">'
        )
        modified = True
    
    # 2. Add article-page class to body on article pages (not blog index)
    if path != f'{root}/index.html':
        if 'article-page' not in content:
            content = content.replace('<body>', '<body class="article-page">')
            modified = True
    else:
        # Blog index: wrap grid in blog-section
        if 'blog-section' not in content:
            # Add blog-section class to the section containing the grid
            content = content.replace(
                '<!-- ══════════ ARTICLES GRID ══════════ -->\n  <section class="container">',
                '<!-- ══════════ ARTICLES GRID ══════════ -->\n  <section class="container blog-section">'
            )
            modified = True
    
    # 3. Remove inline <style> blocks from article pages (replaced by blog.css)
    if path != f'{root}/index.html' and '<style>' in content:
        # Remove inline style blocks that contain article-specific styles
        content = re.sub(
            r'\s*<style>\s*\.article-hero\s*\{.*?</style>',
            '',
            content,
            flags=re.DOTALL
        )
        modified = True
    
    if modified:
        with open(path, 'w') as f:
            f.write(content)
        count += 1
        print(f'  ✅ {path}')
    else:
        print(f'  SKIP: {path}')

# Also fix blog index inline styles
blog_index = f'{root}/index.html'
with open(blog_index, 'r') as f:
    content = f.read()

if '<style>' in content and 'blog.css' in content:
    # Remove inline style block since blog.css handles it
    content = re.sub(
        r'\s*<style>\s*\.blog-hero\s*\{.*?</style>',
        '',
        content,
        flags=re.DOTALL
    )
    with open(blog_index, 'w') as f:
        f.write(content)
    print(f'  ✅ Cleaned inline styles from blog index')

print(f'\n🎉 Fixed {count} blog pages')
