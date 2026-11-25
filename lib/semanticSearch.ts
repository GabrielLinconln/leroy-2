import { CATALOG, getStockForStore } from "./catalog";
import { Product, SemanticSearchMatch } from "./types";

/**
 * Motor de busca semântica local (zero dependência externa):
 * - Normalização de acentos e pontuação
 * - Expansão semântica de linguagem leiga → termos técnicos Leroy Merlin
 * - Pontuação ponderada (nome, termos leigos, tags, descrição) + similaridade por trigramas (typos)
 */

const STOPWORDS = new Set([
  "de", "da", "do", "das", "dos", "a", "o", "as", "os", "um", "uma", "uns", "umas",
  "em", "no", "na", "nos", "nas", "para", "pra", "por", "com", "sem", "que", "esta",
  "ta", "tá", "meu", "minha", "quero", "preciso", "como", "fazer", "arrumar", "consertar",
  "resolver", "muito", "mais", "menos", "aqui", "loja", "onde", "tem", "qual", "e", "ou",
]);

const SEMANTIC_SYNONYMS: Record<string, string[]> = {
  pingando: ["reparo", "vedacao", "torneira", "veda-rosca", "gotejando", "vazamento"],
  gotejando: ["reparo", "vedacao", "torneira", "veda-rosca", "pingando"],
  vazando: ["vedacao", "reparo", "sifao", "veda-rosca", "silicone", "torneira"],
  vazamento: ["vedacao", "reparo", "sifao", "veda-rosca", "silicone", "torneira"],
  borrachinha: ["reparo", "vedacao", "torneira", "cartucho"],
  carrapeta: ["reparo", "vedacao", "torneira"],
  sanfonado: ["sifao", "pia", "cano", "esgoto"],
  rabicho: ["engate", "flexivel", "mangueira", "torneira"],
  embaixo: ["sifao", "pia", "engate", "cano"],
  pia: ["torneira", "sifao", "engate", "silicone", "hidraulica"],
  pintar: ["tinta", "rolo", "fita", "crepe", "lona", "lixa", "trincha", "selador"],
  quarto: ["tinta", "acrilica", "parede", "pintura", "prateleira", "lampada", "led"],
  cor: ["tinta", "acrilica", "fosca", "acetinada"],
  trinca: ["massa", "acrilica", "fita", "telada", "espatula", "lixa", "rachadura"],
  rachadura: ["massa", "acrilica", "fita", "telada", "espatula", "trinca"],
  fissura: ["massa", "acrilica", "fita", "telada", "trinca"],
  infiltracao: ["impermeabilizante", "mofo", "umidade", "massa", "acrilica"],
  umidade: ["impermeabilizante", "mofo", "bolor", "silicone", "massa"],
  mofo: ["removedor", "bolor", "impermeabilizante", "silicone", "antimofo"],
  bolor: ["removedor", "mofo", "impermeabilizante", "antimofo"],
  descascando: ["fundo", "preparador", "espatula", "lixa", "massa"],
  prateleira: ["bucha", "parafuso", "mao", "francesa", "nivel", "broca", "furadeira", "mdf"],
  quadro: ["bucha", "parafuso", "nivel", "broca", "fixacao"],
  pendurar: ["bucha", "parafuso", "suporte", "fixacao", "nivel", "furadeira"],
  furar: ["furadeira", "broca", "videa", "bucha"],
  gesso: ["drywall", "bucha", "fixacao"],
  oca: ["drywall", "bucha"],
  chuveiro: ["resistencia", "conector", "wago", "fita", "isolante", "chave", "teste", "ducha"],
  esquenta: ["resistencia", "chuveiro", "queimado"],
  queimou: ["resistencia", "chuveiro", "lampada", "led"],
  queimado: ["resistencia", "chuveiro", "lampada", "led"],
  fio: ["conector", "wago", "fita", "isolante", "chave", "teste", "eletrica"],
  choque: ["chave", "teste", "fita", "isolante", "wago"],
  luz: ["led", "lampada", "plafon", "painel", "iluminacao"],
  escuro: ["led", "lampada", "plafon", "painel", "iluminacao"],
  iluminar: ["led", "lampada", "plafon", "painel"],
  teto: ["tinta", "branco", "plafon", "led", "rolo"],
};

export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s/.-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenize(text: string): string[] {
  return normalizeText(text)
    .split(" ")
    .filter((t) => t.length >= 2 && !STOPWORDS.has(t));
}

function trigrams(s: string): Set<string> {
  const padded = `  ${s} `;
  const set = new Set<string>();
  for (let i = 0; i <= padded.length - 3; i++) {
    set.add(padded.slice(i, i + 3));
  }
  return set;
}

function trigramSimilarity(a: string, b: string): number {
  if (a.length < 3 || b.length < 3) return 0;
  const ta = trigrams(a);
  const tb = trigrams(b);
  let overlap = 0;
  ta.forEach((g) => {
    if (tb.has(g)) overlap++;
  });
  return (2 * overlap) / (ta.size + tb.size);
}

function scoreProduct(
  product: Product,
  rawQuery: string,
  queryTokens: string[],
  expandedTokens: Set<string>
): { score: number; matchedTerms: string[] } {
  const normQuery = normalizeText(rawQuery);
  const normName = normalizeText(product.name);
  const normDesc = normalizeText(product.description);
  const normCat = normalizeText(product.category);
  const normLayman = product.laymanTerms.map(normalizeText);
  const normTags = product.tags.map(normalizeText);

  let rawScore = 0;
  const matched = new Set<string>();

  // 1. Direct phrase match against layman terms (strongest signal of bridging asymmetry)
  for (const phrase of normLayman) {
    if (normQuery.includes(phrase) || (normQuery.length >= 4 && phrase.includes(normQuery))) {
      rawScore += 32;
      matched.add(phrase);
    }
  }

  // 2. Direct token matches (weighted by field)
  for (const qt of queryTokens) {
    if (normName.includes(qt)) {
      rawScore += 18;
      matched.add(qt);
    }
    if (normCat.includes(qt)) {
      rawScore += 10;
      matched.add(product.category);
    }
    if (normTags.some((t) => t === qt || t.includes(qt))) {
      rawScore += 14;
      matched.add(qt);
    }
    if (normLayman.some((l) => l.includes(qt))) {
      rawScore += 15;
      matched.add(qt);
    }
    if (normDesc.includes(qt)) {
      rawScore += 7;
    }

    // Typo tolerance via trigrams against tags
    for (const tag of normTags) {
      if (tag !== qt && trigramSimilarity(qt, tag) >= 0.62) {
        rawScore += 9;
        matched.add(tag);
      }
    }
  }

  // 3. Semantic synonym expansion matches
  expandedTokens.forEach((syn) => {
    if (queryTokens.includes(syn)) return;
    if (normName.includes(syn)) {
      rawScore += 11;
      matched.add(syn);
    } else if (normTags.includes(syn)) {
      rawScore += 9;
      matched.add(syn);
    } else if (normDesc.includes(syn)) {
      rawScore += 4;
    }
  });

  if (rawScore <= 0) return { score: 0, matchedTerms: [] };

  // Normalize to clean 0–99 relevance percentage
  const normalized = Math.min(99, Math.round(35 + Math.log2(1 + rawScore) * 12.5));
  return {
    score: normalized,
    matchedTerms: Array.from(matched).slice(0, 4),
  };
}

export function semanticSearchCatalog(
  query: string,
  storeId: string,
  options?: { category?: string; limit?: number; onlyInStock?: boolean }
): SemanticSearchMatch[] {
  const trimmed = query.trim();
  const limit = options?.limit ?? 12;

  let pool = CATALOG;
  if (options?.category && options.category !== "Todos") {
    pool = pool.filter((p) => p.category === options.category);
  }

  if (!trimmed) {
    return pool
      .map((product) => {
        const stockQty = getStockForStore(product, storeId);
        return {
          product,
          score: 100,
          matchedTerms: [product.category],
          stockQty,
          inStock: stockQty > 0,
        };
      })
      .filter((m) => (!options?.onlyInStock ? true : m.inStock))
      .slice(0, limit);
  }

  const queryTokens = tokenize(trimmed);
  const expandedTokens = new Set<string>(queryTokens);

  for (const t of queryTokens) {
    const syns = SEMANTIC_SYNONYMS[t];
    if (syns) syns.forEach((s) => expandedTokens.add(s));
    // Partial prefix match against synonym keys
    for (const [key, vals] of Object.entries(SEMANTIC_SYNONYMS)) {
      if (t.length >= 4 && (key.startsWith(t) || t.startsWith(key))) {
        vals.forEach((s) => expandedTokens.add(s));
      }
    }
  }

  const results: SemanticSearchMatch[] = [];
  for (const product of pool) {
    const { score, matchedTerms } = scoreProduct(
      product,
      trimmed,
      queryTokens,
      expandedTokens
    );
    if (score >= 48) {
      const stockQty = getStockForStore(product, storeId);
      if (options?.onlyInStock && stockQty <= 0) continue;
      results.push({
        product,
        score,
        matchedTerms,
        stockQty,
        inStock: stockQty > 0,
      });
    }
  }

  results.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return Number(b.inStock) - Number(a.inStock);
  });

  return results.slice(0, limit);
}
