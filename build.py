#!/usr/bin/env python3
"""Sudeda puslapius: src/pages/*.html + src/partials/*.html -> ./*.html
Naudojimas: python3 build.py
Žymos puslapiuose: {{sprite}} {{header}} {{header_slim}} {{footer}}
"""
import pathlib, re
root = pathlib.Path(__file__).parent
partials = {p.stem.replace('-', '_'): p.read_text(encoding='utf-8') for p in (root / 'src/partials').glob('*.html')}
for page in sorted((root / 'src/pages').glob('*.html')):
    html = page.read_text(encoding='utf-8')
    html = re.sub(r'\{\{(\w+)\}\}', lambda m: partials.get(m.group(1), m.group(0)), html)
    (root / page.name).write_text(html, encoding='utf-8')
    print('built', page.name, len(html), 'bytes')
