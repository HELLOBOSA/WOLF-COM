import fs from 'node:fs';

const additions = [
  {
    id: 8847,
    slug: 'nie-nif-buy-property-spain-checklist-foreigners',
    titleEs: 'NIE, NIF y cómo prepararse para comprar una propiedad en España: lista práctica para compradores extranjeros',
    excerptEs: 'Una lista paso a paso sobre NIE, NIF, apertura de cuenta bancaria y todo lo que los compradores extranjeros deben tener preparado antes de completar una compra inmobiliaria en España.',
    sourceImage: 'https://wolfblanc.com/wp-content/uploads/2026/06/56-nie-nif-buy-property-spain-checklist-foreigners-1.webp'
  },
  {
    id: 8770,
    slug: 'building-permits-madrid-licencia-obras-guide',
    titleEs: 'Licencias de obra en Madrid: licencia de obras, obra mayor, obra menor y cómo funciona el proceso',
    excerptEs: 'Licencia de obras, obra mayor y obra menor: una explicación clara del sistema de licencias de Madrid. Qué requiere licencia, cuánto tarda y cómo evitar los errores costosos de omitir el proceso.',
    sourceImage: 'https://wolfblanc.com/wp-content/uploads/2026/06/42-building-permits-madrid-licencia-obras-guide.webp'
  },
  {
    id: 8713,
    slug: 'cost-building-house-spain-honest-guide-2026',
    titleEs: 'El coste real de construir una casa en España: guía honesta para 2026',
    excerptEs: 'Construir una casa en España cuesta más de lo que sugieren muchas estimaciones. Un desglose honesto de materiales, mano de obra, licencias, honorarios profesionales e imprevistos para 2026.',
    sourceImage: 'https://wolfblanc.com/wp-content/uploads/2026/06/09-cost-building-house-spain-honest-guide-2026.webp'
  },
  {
    id: 8843,
    slug: 'find-manage-contractor-spain-no-spanish',
    titleEs: 'Cómo encontrar y gestionar un contratista en España cuando no hablas español',
    excerptEs: 'Cómo encontrar, evaluar y gestionar un contratista fiable en España cuando no hablas español: estrategias prácticas para compradores internacionales ante la cultura constructiva española.',
    sourceImage: 'https://wolfblanc.com/wp-content/uploads/2026/06/51-find-manage-contractor-spain-no-spanish-1.webp'
  },
  {
    id: 8855,
    slug: 'architect-interior-designer-project-manager-spain-difference',
    titleEs: 'Arquitecto, interiorista o gestor de proyectos en España: ¿a quién necesitas realmente?',
    excerptEs: 'Arquitecto, interiorista o gestor de proyectos: una explicación clara de sus funciones, responsabilidades legales y del momento en que cada profesional aporta más valor a una reforma en España.',
    sourceImage: 'https://wolfblanc.com/wp-content/uploads/2026/06/55-architect-interior-designer-project-manager-spain-difference-1.webp'
  },
  {
    id: 8675,
    slug: 'working-with-architect-spain-process-guide',
    titleEs: 'Qué esperar al trabajar con un arquitecto en España: del primer contacto a la entrega',
    excerptEs: 'Trabajar con un arquitecto en España desde el primer contacto hasta la entrega final suele durar entre 8 y 24 meses. Una guía clara, fase por fase, sobre responsabilidades y control del proceso.',
    sourceImage: 'https://wolfblanc.com/wp-content/uploads/2026/06/29-working-with-architect-spain-process-guide.webp'
  },
  {
    id: 8745,
    slug: 'madrid-real-estate-investment-architecture-roi',
    titleEs: 'Inversión inmobiliaria y arquitectura en Madrid: cómo el diseño afecta a la rentabilidad y al valor de reventa',
    excerptEs: 'Las decisiones arquitectónicas afectan directamente a la rentabilidad y al valor de reventa en Madrid. Cómo la distribución, la luz, los acabados y el diseño espacial mueven las cifras.',
    sourceImage: 'https://wolfblanc.com/wp-content/uploads/2026/06/39-madrid-real-estate-investment-architecture-roi.webp'
  },
  {
    id: 8861,
    slug: 'buying-rural-property-spain-land-classification-building-rights',
    titleEs: 'Comprar una propiedad rural en España: clasificación del suelo, derechos de edificación y reforma',
    excerptEs: 'La clasificación del suelo en España determina qué se puede construir, reformar o habitar legalmente. Una guía práctica sobre suelo rústico, urbano y urbanizable para compradores internacionales.',
    sourceImage: 'https://wolfblanc.com/wp-content/uploads/2026/06/20-buying-rural-property-spain-land-classification-building-rights.webp'
  },
  {
    id: 8807,
    slug: 'golden-visa-greece-property-renovation-architect',
    titleEs: 'La Golden Visa en Grecia: lo que los arquitectos quieren que sepan los inversores inmobiliarios',
    excerptEs: 'La Golden Visa en Grecia ofrece residencia mediante inversión inmobiliaria, pero las normas, los umbrales y los tipos de propiedad elegibles cambian. Lo que inversores y arquitectos deben saber en 2026.',
    sourceImage: 'https://wolfblanc.com/wp-content/uploads/2026/06/10-golden-visa-greece-property-renovation-architect.webp'
  }
];

function decodeEntities(value = '') {
  return value
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, number) => String.fromCodePoint(Number(number)))
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&apos;|&#039;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>');
}

function normalize(value = '') {
  return decodeEntities(value)
    .replaceAll(' \u2014 ', ': ')
    .replaceAll('\u2014', ',')
    .replace(/\s+([,.;:!?])/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

function strip(value = '') {
  return normalize(value.replace(/<[^>]+>/g, ' '));
}

function cleanInline(value = '') {
  return normalize(value
    .replace(/<a\b[^>]*>/gi, '')
    .replace(/<\/a>/gi, '')
    .replace(/<(?!\/?(?:strong|em|br)\b)[^>]+>/gi, ''));
}

function normalizeContactInvitation(value = '') {
  return value
    .replace(/using the form below/gi, 'using the contact options below')
    .replace(/use the form below/gi, 'use the contact options below')
    .replace(/through the form below/gi, 'through the contact options below')
    .replace(/ and we will respond within 48 hours/gi, ', and a senior partner will reply within two business days')
    .replace(/\. We respond within 48 hours/gi, '. A senior partner will reply within two business days')
    .replace(/we will respond within 48 hours/gi, 'a senior partner will reply within two business days')
    .replace(/we respond within 48 hours/gi, 'a senior partner will reply within two business days');
}

function bodyBlocks(post) {
  let raw = post.content?.rendered || '';
  const formPositions = [
    raw.search(/<form\b/i),
    raw.search(/<div\b[^>]*class="[^"]*forminator/i)
  ].filter(index => index >= 0);
  if (formPositions.length) raw = raw.slice(0, Math.min(...formPositions));
  raw = raw
    .replace(/<figure[\s\S]*?<\/figure>/gi, '')
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '');

  const blocks = [];
  for (const match of raw.matchAll(/<(h3|p)\b[^>]*>([\s\S]*?)<\/\1>/gi)) {
    const en = normalizeContactInvitation(cleanInline(match[2]));
    if (!strip(en)) continue;
    blocks.push({ tag: match[1].toLowerCase(), en, es: en });
  }
  if (blocks.length < 10) throw new Error(`Unexpectedly short body: ${post.slug}`);
  return blocks;
}

const payload = additions.map(config => {
  const sourcePath = `/tmp/wolfblanc-post-${config.id}.json`;
  if (!fs.existsSync(sourcePath)) throw new Error(`Missing WordPress source: ${sourcePath}`);
  const post = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));
  if (post.slug !== config.slug) throw new Error(`Slug mismatch for WordPress post ${config.id}`);
  return {
    slug: config.slug,
    title: strip(post.title?.rendered),
    title_es: config.titleEs,
    excerpt: strip(post.excerpt?.rendered),
    excerpt_es: config.excerptEs,
    date: post.date.slice(0, 10),
    modified: post.modified.slice(0, 10),
    sitemapModified: '2026-07-28',
    category: 'Property & Investment',
    image: `images/journal/${config.slug}.webp`,
    sourceImage: config.sourceImage,
    placeholder: false,
    body: bodyBlocks(post)
  };
});

fs.writeFileSync('/tmp/wolfblanc-journal-additions.json', JSON.stringify(payload, null, 2));
console.log(`Prepared ${payload.length} articles with ${payload.reduce((sum, article) => sum + article.body.length, 0)} body blocks.`);
