#!/usr/bin/env python3
"""
Migrate a WordPress journal post into the static site.

Reads a JSON payload (produced from the WordPress MCP connector) and writes
journal/<slug>/index.html using an existing article page as the structural
template, then wires up the hub card, manifest, sitemap and root redirect stub.

Usage:
  migrate-article.py <payload.json>

Payload is a list of objects:
  slug, title, title_es, excerpt, excerpt_es, date (YYYY-MM-DD), category,
  image (path under images/, relative to repo root), body (list of blocks)

Each body block is {"tag": "p"|"h3", "en": "...", "es": "..."}.

Placeholder note: the sandbox proxy blocks wolfblanc.com, so WordPress header
images cannot be downloaded. Articles migrated this way use an existing project
photograph and record it in placeholder-images.txt for later replacement.
"""
import json, re, sys, os, html as ihtml

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
TEMPLATE = 'journal/hiring-architect-spain-greece-foreign-buyer/index.html'

MONTH_EN = ['January','February','March','April','May','June','July','August',
            'September','October','November','December']
MONTH_ES = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto',
            'septiembre','octubre','noviembre','diciembre']
CAT_ES = {'Technology & Climate':'Tecnología y Clima','Places':'Lugares',
 'Property & Investment':'Propiedad e Inversión',
 'Hospitality & Commercial':'Hostelería y Comercial','Studio':'Estudio',
 'Design & Wellbeing':'Diseño y Bienestar'}


def ae(s):
    return re.sub(r'&(?!amp;|lt;|gt;|quot;|#)', '&amp;', s).replace('"', '&quot;')


def esc(s):
    """Escape for use as page text (bare & becomes &amp;)."""
    return re.sub(r'&(?!amp;|lt;|gt;|quot;|#)', '&amp;', s)


def build(a, tpl):
    slug, title, cat = a['slug'], a['title'], a['category']
    y, m, d = a['date'].split('-')
    date_en = f'{int(d)} {MONTH_EN[int(m)-1]} {y}'
    date_es = f'{int(d)} de {MONTH_ES[int(m)-1]} de {y}'
    cat_es = CAT_ES.get(cat, cat)
    url = f'https://wolfblanc.com/journal/{slug}/'
    img = a['image']

    h = tpl
    # head: title, description, canonical, og, twitter, JSON-LD
    h = re.sub(r'<title>.*?</title>', f'<title>{esc(title)} | Wolfblanc Journal</title>', h, 1, re.S)
    h = re.sub(r'<meta name="description" content="[^"]*">',
               f'<meta name="description" content="{ae(a["excerpt"])}">', h, 1)
    h = re.sub(r'<link rel="canonical" href="[^"]*">',
               f'<link rel="canonical" href="{url}">', h, 1)
    h = re.sub(r'(<link rel="alternate" hreflang="en" href=")[^"]*(">)', rf'\g<1>{url}\g<2>', h, 1)
    h = re.sub(r'(<link rel="alternate" hreflang="x-default" href=")[^"]*(">)', rf'\g<1>{url}\g<2>', h, 1)
    h = re.sub(r'<meta property="og:title" content="[^"]*">',
               f'<meta property="og:title" content="{ae(title)}">', h, 1)
    h = re.sub(r'<meta property="og:description" content="[^"]*">',
               f'<meta property="og:description" content="{ae(a["excerpt"])}">', h, 1)
    h = re.sub(r'<meta property="og:url" content="[^"]*">',
               f'<meta property="og:url" content="{url}">', h, 1)
    h = re.sub(r'<meta property="og:image" content="[^"]*">',
               f'<meta property="og:image" content="https://wolfblanc.com/{img}">', h, 1)
    h = re.sub(r'<meta name="twitter:title" content="[^"]*">',
               f'<meta name="twitter:title" content="{ae(title)}">', h, 1)
    h = re.sub(r'<meta name="twitter:description" content="[^"]*">',
               f'<meta name="twitter:description" content="{ae(a["excerpt"])}">', h, 1)
    h = re.sub(r'<meta name="twitter:image" content="[^"]*">',
               f'<meta name="twitter:image" content="https://wolfblanc.com/{img}">', h, 1)

    # JSON-LD: rewrite the whole block from scratch so nothing stale survives
    ld = {
      "@context": "https://schema.org",
      "@graph": [
        {"@type": "BlogPosting",
         "@id": url + "#article",
         "headline": title,
         "description": a['excerpt'],
         "datePublished": a['date'],
         "dateModified": a.get('modified', a['date']),
         "inLanguage": "en",
         "articleSection": cat,
         "image": f"https://wolfblanc.com/{img}",
         "author": {"@type": "Organization", "name": "Wolfblanc Architects",
                    "url": "https://wolfblanc.com/"},
         "publisher": {"@type": "Organization", "name": "Wolfblanc Architects",
                       "url": "https://wolfblanc.com/",
                       "logo": {"@type": "ImageObject",
                                "url": "https://wolfblanc.com/images/210-sq-white-02.webp"}},
         "mainEntityOfPage": {"@type": "WebPage", "@id": url}},
        {"@type": "BreadcrumbList",
         "itemListElement": [
           {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://wolfblanc.com/"},
           {"@type": "ListItem", "position": 2, "name": "Journal", "item": "https://wolfblanc.com/journal/"},
           {"@type": "ListItem", "position": 3, "name": title, "item": url}]}]}
    h = re.sub(r'<script type="application/ld\+json">.*?</script>',
               '<script type="application/ld+json">\n' +
               json.dumps(ld, ensure_ascii=False, indent=2) + '\n  </script>', h, 1, re.S)

    # hero
    meta = (f'<div class="art-meta">'
            f'<span data-en="{ae(cat)}" data-es="{ae(cat_es)}">{esc(cat)}</span>'
            f'<span class="dot"></span>'
            f'<span class="dim" data-en="{ae(date_en)}" data-es="{ae(date_es)}">{date_en}</span>'
            f'<span class="dot"></span>'
            f'<span class="dim" data-en="Wolfblanc Architects" data-es="Wolfblanc Architects">Wolfblanc Architects</span>'
            f'</div>')
    h = re.sub(r'<div class="art-meta">.*?</div>', meta, h, 1, re.S)
    h = re.sub(r'<h1[^>]*>.*?</h1>',
               f'<h1 data-en="{ae(title)}" data-es="{ae(a["title_es"])}">{esc(title)}</h1>', h, 1, re.S)
    h = re.sub(r'<p class="art-lead"[^>]*>.*?</p>',
               f'<p class="art-lead" data-en="{ae(a["excerpt"])}" data-es="{ae(a["excerpt_es"])}">{esc(a["excerpt"])}</p>',
               h, 1, re.S)
    h = re.sub(r'<div class="hero-img">.*?</div>\s*</div>',
               f'<div class="hero-img"><div class="hero-img-wrap">'
               f'<img src="../../{img}" alt="{ae(title)}" loading="eager" fetchpriority="high" decoding="async">'
               f'</div><p class="img-caption" data-en="Wolfblanc Architects" data-es="Wolfblanc Architects">Wolfblanc Architects</p></div>',
               h, 1, re.S)

    # body
    parts = []
    for blk in a['body']:
        t, en, es = blk['tag'], blk['en'], blk['es']
        parts.append(f'<{t} data-en="{ae(en)}" data-es="{ae(es)}">{esc(en)}</{t}>')
    h = re.sub(r'(<main><article class="wb-body">).*?(</article>)',
               lambda mm: mm.group(1) + ''.join(parts) + mm.group(2), h, 1, re.S)

    # cta watermark
    h = re.sub(r'<div class="cta-bg"[^>]*>[^<]*</div>',
               '<div class="cta-bg" data-en="JOURNAL" data-es="JOURNAL">JOURNAL</div>', h, 1)
    return h


def main(payload_path):
    arts = json.load(open(payload_path, encoding='utf-8'))
    tpl = open(TEMPLATE, encoding='utf-8').read()
    manifest = json.load(open('journal/articles-manifest.json', encoding='utf-8'))
    known = {e['slug'] for e in manifest}
    notes = []

    for a in arts:
        slug = a['slug']
        os.makedirs(f'journal/{slug}', exist_ok=True)
        open(f'journal/{slug}/index.html', 'w', encoding='utf-8').write(build(a, tpl))
        if slug not in known:
            manifest.append({'slug': slug, 'title': a['title'], 'excerpt': a['excerpt'],
                             'date': a['date'], 'modified': a.get('modified', a['date']),
                             'category': a['category'], 'sourceImage': a.get('sourceImage', ''),
                             'localImage': a['image']})
        # retarget the legacy root stub at the real page
        stub = f'{slug}/index.html'
        if os.path.exists(stub):
            s = open(stub, encoding='utf-8').read()
            s = re.sub(r'(url=)/journal[^"\']*', rf'\g<1>/journal/{slug}', s)
            s = re.sub(r"(replace\(')/journal[^']*", rf"\g<1>/journal/{slug}", s)
            s = re.sub(r'(href=")/journal[^"]*', rf'\g<1>/journal/{slug}', s)
            s = re.sub(r'(<link rel="canonical" href="https://wolfblanc\.com)/journal[^"]*',
                       rf'\g<1>/journal/{slug}/', s)
            open(stub, 'w', encoding='utf-8').write(s)
        notes.append(f'{slug}  ->  {a["image"]}')
        print(f'  built journal/{slug}/')

    manifest.sort(key=lambda e: e['date'], reverse=True)
    json.dump(manifest, open('journal/articles-manifest.json', 'w', encoding='utf-8'),
              ensure_ascii=False, indent=2)
    print(f'  manifest now {len(manifest)} entries')

    with open('journal/placeholder-images.txt', 'a', encoding='utf-8') as f:
        f.write('# Articles using a project-gallery placeholder instead of the\n'
                '# original WordPress header. Replace when the real images are available.\n')
        for n in notes:
            f.write(n + '\n')
    print('  placeholder note written to journal/placeholder-images.txt')


if __name__ == '__main__':
    if len(sys.argv) != 2:
        print(__doc__); sys.exit(1)
    main(sys.argv[1])
