#!/usr/bin/env python3
"""Add full-page white background fix for blog pages"""

# Update blog.css to also handle the blog index page body
blog_css_path = '/var/www/html/blog.css'
with open(blog_css_path, 'r') as f:
    css = f.read()

# Add body override and blog-section full width
extra_css = '''
/* ═══════ FULL PAGE WHITE BACKGROUND ═══════ */
/* Override dark body on ALL blog pages */
body.blog-page,
body.article-page {
  background: #FFFFFF !important;
  color: #1E293B !important;
}

/* Ensure footer still looks correct */
body.blog-page .footer,
body.article-page .footer {
  background: #0F172A !important;
}
body.blog-page .footer a,
body.article-page .footer a {
  color: #94A3B8 !important;
}
body.blog-page .footer h4,
body.article-page .footer h4 {
  color: #FFFFFF !important;
}
body.blog-page .footer p,
body.article-page .footer p {
  color: #94A3B8 !important;
}
'''

if 'blog-page' not in css:
    css += extra_css
    with open(blog_css_path, 'w') as f:
        f.write(css)
    print('✅ Updated blog.css with full-page white background')

# Add blog-page class to blog index body
blog_index = '/var/www/html/blog/index.html'
with open(blog_index, 'r') as f:
    content = f.read()

if 'class="blog-page"' not in content and 'class="article-page"' not in content:
    content = content.replace('<body>', '<body class="blog-page">')
    with open(blog_index, 'w') as f:
        f.write(content)
    print('✅ Added blog-page class to blog index body')

print('\n🎉 Done')
