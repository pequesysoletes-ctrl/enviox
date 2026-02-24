import re
with open('/var/www/html/index.html', 'r') as f:
    c = f.read()
# Fix the blog link
c = re.sub(r'<a href=["\s]*/blog[>"].*?Blog', '<a href="/blog">Blog', c)
with open('/var/www/html/index.html', 'w') as f:
    f.write(c)
print('Blog link fixed')
