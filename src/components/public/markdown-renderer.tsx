import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CTABlock } from "./cta-block";
import { Callout } from "./callout";
import { slugify } from "@/lib/markdown-utils";

export function MarkdownRenderer({ content }: { content: string }) {
  // Pre-compute which h2 indices should show a CTA before them
  const lines = content.split("\n");
  let wordCount = 0;
  const ctaBeforeH2 = new Set<number>();
  let h2Index = 0;
  for (const line of lines) {
    if (line.startsWith("## ")) {
      wordCount += 100;
      if (wordCount >= 600) {
        ctaBeforeH2.add(h2Index);
        wordCount = 0;
      }
      h2Index++;
    } else {
      wordCount += line.split(/\s+/).filter(Boolean).length;
    }
  }

  let currentH2 = 0;

  return (
    <div className="prose-article">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h2: ({ children }) => {
            const text = String(children);
            const id = slugify(text);
            const showCta = ctaBeforeH2.has(currentH2);
            currentH2++;
            return (
              <>
                {showCta && <CTABlock />}
                <h2 id={id}>{children}</h2>
              </>
            );
          },
          h3: ({ children }) => {
            const text = String(children);
            const id = slugify(text);
            return <h3 id={id}>{children}</h3>;
          },
          blockquote: ({ children }) => {
            const text = String(
              (children as React.ReactNode[])?.find?.(
                (c) => typeof c === "object"
              ) ?? children
            );
            if (text.startsWith("[!info]") || text.startsWith("[!INFO]")) {
              return (
                <Callout variant="info" title="À retenir">
                  {text.replace(/\[!info\]/i, "").trim()}
                </Callout>
              );
            }
            if (text.startsWith("[!warning]") || text.startsWith("[!WARNING]")) {
              return (
                <Callout variant="warning" title="Important">
                  {text.replace(/\[!warning\]/i, "").trim()}
                </Callout>
              );
            }
            if (text.startsWith("[!tip]") || text.startsWith("[!TIP]")) {
              return (
                <Callout variant="tip" title="Conseil">
                  {text.replace(/\[!tip\]/i, "").trim()}
                </Callout>
              );
            }
            if (text.startsWith("[!consult]") || text.startsWith("[!CONSULT]")) {
              return (
                <Callout variant="consult" title="Quand consulter">
                  {text.replace(/\[!consult\]/i, "").trim()}
                </Callout>
              );
            }
            return <blockquote>{children}</blockquote>;
          },
        }}
      />
    </div>
  );
}
