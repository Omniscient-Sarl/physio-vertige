export interface NormalizeDiff {
  h1Prefixed: number;
  h2Prefixed: number;
  h3Numbered: number;
  h3Faq: number;
  bulletLists: number;
  callouts: number;
  inlineLinks: number;
  tablesFixed: number;
  falsecitationsStripped: number;
}

const H2_PATTERNS = [
  "Qu'est-ce",
  "Quels sont",
  "Quelles",
  "Comment",
  "Quels traitements",
  "Que puis-je",
  "Que faire",
  "Quand consulter",
  "À quoi ressemble",
  "À retenir",
  "Sommaire",
  "FAQ",
  "Drapeaux rouges",
  "Vertige périphérique",
  "Les 7 signes",
  "Sources et références",
  "Articles liés",
  "Prenez rendez-vous",
];

function stripAccents(s: string): string {
  return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function fuzzyMatch(a: string, b: string): boolean {
  const na = stripAccents(a.toLowerCase().trim());
  const nb = stripAccents(b.toLowerCase().trim());
  return na === nb || na.includes(nb) || nb.includes(na);
}

// Known malformed table: CritèrePériphérique...Central...
const KNOWN_TABLE_MARKER = "CritèrePériphérique";
const KNOWN_TABLE_REPLACEMENT = `| Critère | Périphérique (vestibulaire) | Central (cérébral) |
|---------|------------------------------|---------------------|
| Intensité du vertige | Forte, avec nausées importantes | Plus légère, nausées moins marquées |
| Durée | Secondes à jours | Variable, souvent constant |
| Déclenchement | Souvent positionnel | Spontané ou avec signes neuro |
| Autres signes | Bourdonnements ou perte auditive possible | Troubles de la parole, vision double, faiblesse |`;

export function normalizeGrokMarkdown(
  body: string,
  frontmatter: Record<string, unknown>
): { normalized: string; diff: NormalizeDiff } {
  const diff: NormalizeDiff = {
    h1Prefixed: 0,
    h2Prefixed: 0,
    h3Numbered: 0,
    h3Faq: 0,
    bulletLists: 0,
    callouts: 0,
    inlineLinks: 0,
    tablesFixed: 0,
    falsecitationsStripped: 0,
  };

  const lines = body.split("\n");
  const title = (frontmatter.title as string) ?? "";
  const faqItems = (frontmatter.faq as Array<{ question: string; answer: string }>) ?? [];

  // === Transform 1: H1 detection ===
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    if (line.startsWith("# ")) break; // already has H1
    if (fuzzyMatch(line, title)) {
      lines[i] = `# ${line}`;
      diff.h1Prefixed++;
      break;
    }
    break; // only check first non-empty line
  }

  // === Transform 2: H2 detection ===
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith("## ") || line.startsWith("# ")) continue;
    if (line.length === 0 || line.length >= 100 || line.endsWith(".")) continue;

    const prevBlank = i === 0 || lines[i - 1].trim() === "";
    const nextBlank = i === lines.length - 1 || lines[i + 1].trim() === "";
    if (!prevBlank || !nextBlank) continue;

    const matchesH2 = H2_PATTERNS.some((p) =>
      stripAccents(line.toLowerCase()).startsWith(stripAccents(p.toLowerCase()))
    );
    if (matchesH2) {
      lines[i] = `## ${line}`;
      diff.h2Prefixed++;
    }
  }

  // === Transform 8: Malformed table (before numbered items, so line indices are stable) ===
  // Find contiguous block containing the known marker
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(KNOWN_TABLE_MARKER)) {
      // Find the extent of the jammed table block — collect contiguous non-empty lines
      let start = i;
      let end = i;
      while (end < lines.length - 1 && lines[end + 1].trim() !== "") end++;
      // Replace the block
      const removed = lines.splice(start, end - start + 1, KNOWN_TABLE_REPLACEMENT);
      if (removed.length > 0) diff.tablesFixed++;
      break;
    }
  }

  // Rejoin for section-aware passes
  let text = lines.join("\n");

  // === Transform 3: H3 numbered items (inside "7 signes" / numbered H2 sections) ===
  text = text.replace(
    /(## .*(?:\d+\s+(?:signes?|exercices?|conseils?|raisons?|astuces?)).*\n)([\s\S]*?)(?=\n## |\n$|$)/gi,
    (match, h2Line: string, sectionBody: string) => {
      const fixed = sectionBody.replace(
        /^(\d+)\. (.{3,100})$/gm,
        (m: string, num: string, rest: string) => {
          if (m.startsWith("### ")) return m; // idempotent
          if (rest.endsWith(".")) return m; // skip if trailing period
          diff.h3Numbered++;
          return `### ${num}. ${rest}`;
        }
      );
      return h2Line + fixed;
    }
  );

  // === Transform 4: H3 FAQ questions ===
  text = text.replace(
    /(## FAQ\n)([\s\S]*?)(?=\n## |\n$|$)/i,
    (match, h2Line: string, faqBody: string) => {
      const faqLines = faqBody.split("\n");
      for (let i = 0; i < faqLines.length; i++) {
        const line = faqLines[i].trim();
        if (!line.endsWith("?")) continue;
        if (line.startsWith("### ")) continue; // idempotent
        const isFaqQ = faqItems.some((fq) => fuzzyMatch(line, fq.question));
        if (isFaqQ) {
          faqLines[i] = `### ${line}`;
          diff.h3Faq++;
        }
      }
      return h2Line + faqLines.join("\n");
    }
  );

  // === Transform 5: Bullet lists ===
  // Sequences of 2+ consecutive non-empty short lines following a colon-terminated paragraph
  const allLines = text.split("\n");
  let i = 0;
  while (i < allLines.length) {
    const line = allLines[i].trim();
    // Check if this line ends with ":"
    if (line.endsWith(":") || line.endsWith(" :")) {
      // Look at following lines
      let j = i + 1;
      // skip one blank line if present
      if (j < allLines.length && allLines[j].trim() === "") j++;
      const start = j;
      while (
        j < allLines.length &&
        allLines[j].trim() !== "" &&
        allLines[j].trim().length < 200 &&
        !allLines[j].trim().startsWith("#")
      ) {
        j++;
      }
      const count = j - start;
      if (count >= 2) {
        for (let k = start; k < j; k++) {
          const trimmed = allLines[k].trim();
          if (/^[-*+]/.test(trimmed) || /^\d+\./.test(trimmed) || trimmed.startsWith("|")) continue;
          if (trimmed.startsWith("### ") || trimmed.startsWith("## ")) continue;
          allLines[k] = `- ${trimmed}`;
          diff.bulletLists++;
        }
      }
      i = j;
    } else {
      i++;
    }
  }
  text = allLines.join("\n");

  // Also handle "À retenir" and similar sections that have bare list items without a colon trigger
  // These are lines in "À retenir" section that aren't already bullets
  text = text.replace(
    /(## À retenir\n\n)([\s\S]*?)(?=\n## |\n$|$)/i,
    (match, h2Line: string, body: string) => {
      const bodyLines = body.split("\n");
      for (let k = 0; k < bodyLines.length; k++) {
        const trimmed = bodyLines[k].trim();
        if (!trimmed || trimmed.startsWith("-") || trimmed.startsWith("*") || trimmed.startsWith("#")) continue;
        if (trimmed.length < 200) {
          bodyLines[k] = `- ${trimmed}`;
          diff.bulletLists++;
        }
      }
      return h2Line + bodyLines.join("\n");
    }
  );

  // "Sommaire" section — lines should be bullets
  text = text.replace(
    /(## Sommaire\n\n)([\s\S]*?)(?=\n## |\n$|$)/i,
    (match, h2Line: string, body: string) => {
      const bodyLines = body.split("\n");
      for (let k = 0; k < bodyLines.length; k++) {
        const trimmed = bodyLines[k].trim();
        if (!trimmed || trimmed.startsWith("-") || trimmed.startsWith("*") || trimmed.startsWith("#")) continue;
        if (trimmed.length < 200) {
          bodyLines[k] = `- ${trimmed}`;
          diff.bulletLists++;
        }
      }
      return h2Line + bodyLines.join("\n");
    }
  );

  // "Que faire" section — bare lines should be bullets
  text = text.replace(
    /(## Que faire.*\n\n)([\s\S]*?)(?=\n## |\n$|$)/i,
    (match, h2Line: string, body: string) => {
      const bodyLines = body.split("\n");
      for (let k = 0; k < bodyLines.length; k++) {
        const trimmed = bodyLines[k].trim();
        if (!trimmed || trimmed.startsWith("-") || trimmed.startsWith("*") || trimmed.startsWith("#")) continue;
        if (trimmed.length < 200) {
          bodyLines[k] = `- ${trimmed}`;
          diff.bulletLists++;
        }
      }
      return h2Line + bodyLines.join("\n");
    }
  );

  // "Articles liés" section — lines should be bullets (if not already)
  text = text.replace(
    /(## Articles liés.*\n\n)([\s\S]*?)(?=\n## |\n$|$)/i,
    (match, h2Line: string, body: string) => {
      const bodyLines = body.split("\n");
      for (let k = 0; k < bodyLines.length; k++) {
        const trimmed = bodyLines[k].trim();
        if (!trimmed || trimmed.startsWith("-") || trimmed.startsWith("*") || trimmed.startsWith("#")) continue;
        if (trimmed.length < 200) {
          bodyLines[k] = `- ${trimmed}`;
          diff.bulletLists++;
        }
      }
      return h2Line + bodyLines.join("\n");
    }
  );

  // === Transform 6: Callout CTAs ===
  text = text.replace(/^([\u{1F4A1}]\s*)(.+)$/gmu, (match, emoji: string, rest: string) => {
    if (match.startsWith(">")) return match; // idempotent
    const periodIdx = rest.indexOf(".");
    if (periodIdx > 0) {
      const lead = rest.slice(0, periodIdx + 1);
      const tail = rest.slice(periodIdx + 1).trim();
      diff.callouts++;
      return `> ${emoji.trim()} **${lead}** ${tail}`;
    }
    diff.callouts++;
    return `> ${emoji.trim()} ${rest}`;
  });
  text = text.replace(/^([\u{26A0}\u{FE0F}]+\s*)(.+)$/gmu, (match, emoji: string, rest: string) => {
    if (match.startsWith(">")) return match; // idempotent
    const periodIdx = rest.indexOf(".");
    if (periodIdx > 0) {
      const lead = rest.slice(0, periodIdx + 1);
      const tail = rest.slice(periodIdx + 1).trim();
      diff.callouts++;
      return `> ${emoji.trim()} **${lead}** ${tail}`;
    }
    diff.callouts++;
    return `> ${emoji.trim()} ${rest}`;
  });

  // === Transform 7: Inline link injection (first occurrence only, no existing markdown link nearby) ===
  const linkReplacements: [string, string][] = [
    ["Prendre rendez-vous", "[Prendre rendez-vous](/contact)"],
    ["Prenez rendez-vous en ligne", "[Prenez rendez-vous en ligne](/contact)"],
    ["cabinet de Morges", "[cabinet de Morges](/le-physiotherapeute)"],
  ];
  // Do longer patterns first to avoid partial matches
  linkReplacements.sort((a, b) => b[0].length - a[0].length);
  for (const [phrase, replacement] of linkReplacements) {
    const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    // Only replace if not already inside a markdown link
    const regex = new RegExp(`(?<!\\[)${escaped}(?!\\]|\\()`, "");
    if (regex.test(text)) {
      text = text.replace(regex, replacement);
      diff.inlineLinks++;
    }
  }

  // === Transform 9: Strip false citations ===
  // Only strip lines that are unverifiable references (no real URL, no markdown link)
  const FALSE_CITATION_PATTERNS = [
    /Recommandations de la Société Suisse de Neurologie/i,
  ];
  // Known source replacements: bare text → proper markdown link
  const SOURCE_LINK_MAP: [RegExp, string][] = [
    [/^-?\s*Vertiges\s*-?\s*HUG\s*Genève$/i, "- [Informations sur les vertiges aux HUG (Genève)](https://www.hug.ch/orl-chirurgie-cervico-faciale/vertiges)"],
    [/^-?\s*Physioswiss\s*[–—-]\s*Association suisse de physiothérapie$/i, "- [Physioswiss – Association suisse de physiothérapie](https://physioswiss.ch/fr/)"],
  ];

  const sourcesLines = text.split("\n");
  let inSources = false;
  const filtered: string[] = [];
  for (const line of sourcesLines) {
    if (/^## Sources/.test(line)) inSources = true;
    if (inSources && /^## /.test(line) && !/^## Sources/.test(line)) inSources = false;

    if (inSources) {
      const trimmed = line.trim();
      // Check for false citations first
      const isFalse = FALSE_CITATION_PATTERNS.some((p) => p.test(trimmed));
      if (isFalse) {
        console.log(`[normalizer] Stripped false citation: "${trimmed}"`);
        diff.falsecitationsStripped++;
        continue;
      }
      // Check for known source replacements
      const sourceMatch = SOURCE_LINK_MAP.find(([pattern]) => pattern.test(trimmed));
      if (sourceMatch) {
        filtered.push(sourceMatch[1]);
      } else {
        filtered.push(line);
      }
    } else {
      filtered.push(line);
    }
  }
  text = filtered.join("\n");

  // Clean up excessive blank lines (more than 2 consecutive)
  text = text.replace(/\n{4,}/g, "\n\n\n");

  return { normalized: text.trim(), diff };
}

// ---- Sanity checks (idempotence) ----
if (typeof process !== "undefined" && process.argv[1]?.endsWith("normalize-grok-markdown.ts")) {
  const testBody = "# Already a heading\n\nSome text";
  const r1 = normalizeGrokMarkdown(testBody, { title: "Already a heading" });
  console.assert(r1.diff.h1Prefixed === 0, "Should not double-prefix H1");
  console.assert(r1.normalized.startsWith("# Already"), "H1 preserved");

  const r2 = normalizeGrokMarkdown(r1.normalized, { title: "Already a heading" });
  console.assert(r2.normalized === r1.normalized, "Idempotent on second pass");

  const testH2 = "\n\nFAQ\n\n### Already a question?\n\nAnswer here.";
  const r3 = normalizeGrokMarkdown(testH2, { title: "Test", faq: [{ question: "Already a question?", answer: "Yes" }] });
  console.assert(r3.diff.h3Faq === 0, "Should not double-prefix FAQ H3");

  console.log("[normalizer] All sanity checks passed.");
}
