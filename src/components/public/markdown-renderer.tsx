"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CTABlock } from "./cta-block";
import { Callout } from "./callout";
import { slugify } from "@/lib/markdown-utils";

let wordCounter = 0;

export function MarkdownRenderer({ content }: { content: string }) {
  wordCounter = 0;

  return (
    <div className="prose-article">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h2: ({ children }) => {
            const text = String(children);
            const id = slugify(text);
            wordCounter += 100;
            const showCta = wordCounter >= 600;
            if (showCta) wordCounter = 0;
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
          p: ({ children }) => {
            const text = String(children);
            wordCounter += text.split(/\s+/).length;
            return <p>{children}</p>;
          },
        }}
      />
    </div>
  );
}
