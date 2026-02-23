#!/usr/bin/env python3
"""
Inject Enviox branding into all MRW Pro app pages.
Adds: import + EnvioBrandFooter at the bottom of each page.
"""
import re
import os

APP_DIR = r"c:\Users\jovi3\.gemini\antigravity\scratch\1 MRW Shopify\MRW Pro\mrw-pro-app\app\routes"

# Files to brand (exclude app.tsx which is the shell, and webhooks)
FILES_TO_BRAND = [
    "app.shipments._index.tsx",
    "app.shipments.new.tsx",
    "app.shipments.$id.tsx",
    "app.shipments.labels.tsx",
    "app.settings._index.tsx",
    "app.settings.mrw.tsx",
    "app.pickups.tsx",
    "app.returns._index.tsx",
    "app.returns.new.tsx",
    "app.billing.tsx",
]

IMPORT_LINE = 'import { EnvioBrandHeader, EnvioBrandFooter } from "../components/EnvioBrand";'
FOOTER_JSX = """
        {/* Brand footer */}
        <Layout.Section>
          <EnvioBrandFooter />
        </Layout.Section>"""

for filename in FILES_TO_BRAND:
    filepath = os.path.join(APP_DIR, filename)
    if not os.path.exists(filepath):
        print(f"  ⚠️  SKIP (not found): {filename}")
        continue
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    modified = False
    
    # 1. Add import if not present
    if 'EnvioBrand' not in content:
        # Insert after the last import line
        # Find the last import statement
        lines = content.split('\n')
        last_import_idx = 0
        for i, line in enumerate(lines):
            stripped = line.strip().replace('\r', '')
            if stripped.startswith('import ') or stripped.startswith('} from '):
                last_import_idx = i
        
        lines.insert(last_import_idx + 1, IMPORT_LINE)
        content = '\n'.join(lines)
        modified = True
    
    # 2. Add footer before </Layout> </Page>
    if 'EnvioBrandFooter' not in content or modified:
        # Find the pattern </Layout>\n    </Page> and insert footer before </Layout>
        # Use regex to find the last </Layout>
        pattern = r'(      </Layout>\s*\n\s*</Page>)'
        match = re.search(pattern, content)
        if match:
            replacement = FOOTER_JSX + '\n      </Layout>\n    </Page>'
            content = content[:match.start()] + replacement + content[match.end():]
            modified = True
        else:
            # Try alternative pattern
            pattern2 = r'(    </Layout>\s*\r?\n\s*</Page>)'
            match2 = re.search(pattern2, content)
            if match2:
                replacement2 = FOOTER_JSX + '\n    </Layout>\n    </Page>'
                content = content[:match2.start()] + replacement2 + content[match2.end():]
                modified = True
    
    if modified:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"  ✅ {filename}")
    else:
        print(f"  SKIP (already branded): {filename}")

print(f"\n🎉 Branding injection complete!")
