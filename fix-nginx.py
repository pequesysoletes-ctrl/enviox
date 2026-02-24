#!/usr/bin/env python3
import re
files = ['/etc/nginx/sites-available/mrw-pro', '/etc/nginx/sites-available/correos-pro', '/etc/nginx/sites-available/dhl-pro']
for f in files:
    content = open(f).read()
    content = re.sub(r'try_files.*=404;', 'try_files $uri =404;', content)
    open(f, 'w').write(content)
    print(f"Fixed {f}")
