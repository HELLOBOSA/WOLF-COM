#!/usr/bin/env python3
"""
Journal article EN/ES tooling.

The site renders English by default and swaps to Spanish from data-es attributes,
so translating an article means adding data-en/data-es to each body block. This
script handles the mechanical half so a translator only supplies Spanish text.

  extract <slug>            dump untranslated blocks as a numbered TSV skeleton
  apply <slug> <tsv>        write data-en/data-es back onto the matching blocks
  status [slug ...]         report translated / untranslated block counts

The TSV is: index <TAB> spanish. Lines starting with # are ignored, so the
extract output can be edited in place and fed straight back to apply.
Run from the repo root.
"""
import re, sys, os, glob

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BLOCK = re.compile(r'<(h1|h2|h3|h4|p|li)([^>]*)>(.*?)</\1>', re.S)


def page(slug):
    return os.path.join(ROOT, 'journal', slug, 'index.html')


def body_span(html):
    """Article body only: stop at the related-articles strip, drop script/style/nav/footer."""
    end = html.find('<section class="related"')
    return 0, end if end > 0 else len(html)


def skip(html, pos):
    for tag in ('script', 'style', 'nav', 'footer'):
        for m in re.finditer(rf'<{tag}[^>]*>.*?</{tag}>', html, re.S):
            if m.start() <= pos < m.end():
                return True
    return False


def blocks(slug, untranslated_only=True):
    html = open(page(slug), encoding='utf-8').read()
    lo, hi = body_span(html)
    out = []
    for m in BLOCK.finditer(html, lo, hi):
        inner = m.group(3)
        text = re.sub(r'<[^>]+>', '', inner).strip()
        if len(text) < 3 or skip(html, m.start()):
            continue
        done = 'data-es' in m.group(2) or 'data-es' in inner
        if untranslated_only and done:
            continue
        out.append({'tag': m.group(1), 'attrs': m.group(2), 'inner': inner,
                    'text': re.sub(r'\s+', ' ', text), 'done': done,
                    'start': m.start(), 'end': m.end()})
    return html, out


def ae(s):
    return re.sub(r'&(?!amp;|lt;|gt;|quot;|#)', '&amp;', s).replace('"', '&quot;')


def cmd_extract(slug):
    _, bs = blocks(slug)
    print(f'# {slug}: {len(bs)} untranslated blocks, '
          f'{sum(len(b["text"].split()) for b in bs)} words')
    print('# edit the second column into Spanish, keep the index, then run apply')
    for i, b in enumerate(bs):
        print(f'# [{b["tag"]}] {b["text"]}')
        print(f'{i}\t')


def cmd_apply(slug, tsv):
    es = {}
    for line in open(tsv, encoding='utf-8'):
        if line.startswith('#') or '\t' not in line:
            continue
        i, txt = line.rstrip('\n').split('\t', 1)
        if txt.strip():
            es[int(i)] = txt.strip()
    html, bs = blocks(slug)
    if not es:
        print('  nothing to apply'); return
    # rewrite back to front so offsets stay valid
    applied = 0
    for i in sorted(es, reverse=True):
        if i >= len(bs):
            print(f'  index {i} out of range'); continue
        b = bs[i]
        en = b['inner'].strip()
        new = (f'<{b["tag"]}{b["attrs"]} data-en="{ae(en)}" data-es="{ae(es[i])}">'
               f'{en}</{b["tag"]}>')
        html = html[:b['start']] + new + html[b['end']:]
        applied += 1
    open(page(slug), 'w', encoding='utf-8').write(html)
    print(f'  {slug}: {applied} blocks translated')


def cmd_status(slugs):
    if not slugs:
        slugs = sorted(os.path.basename(os.path.dirname(p))
                       for p in glob.glob(os.path.join(ROOT, 'journal', '*', 'index.html')))
    tw = tu = 0
    for s in slugs:
        _, todo = blocks(s)
        _, allb = blocks(s, untranslated_only=False)
        w = sum(len(b['text'].split()) for b in todo)
        tw += w; tu += len(todo)
        state = 'done' if not todo else f'{len(todo)}/{len(allb)} blocks, {w} words'
        print(f'  {s[:64]:66} {state}')
    print(f'\n  outstanding: {tu} blocks / {tw} words across {len(slugs)} articles')


if __name__ == '__main__':
    if len(sys.argv) < 2:
        print(__doc__); sys.exit(1)
    c = sys.argv[1]
    if c == 'extract': cmd_extract(sys.argv[2])
    elif c == 'apply': cmd_apply(sys.argv[2], sys.argv[3])
    elif c == 'status': cmd_status(sys.argv[2:])
    else: print(__doc__); sys.exit(1)
