import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";

import { cn } from "@/lib/utils";
import "highlight.js/styles/base16/ir-black.css";
import { OlHTMLAttributes, HTMLAttributes } from "react";

function CodeArea({
  children,
  language,
  error,
}: {
  children: React.ReactNode;
  language?: React.ReactNode;
  error?: boolean;
}) {
  return (
    <pre
      className={cn(
        "rounded-md bg-zinc-800 flex flex-col items-stretch w-full text-white",
        error && "outline outline-red-950"
      )}
    >
      <div className="flex justify-between items-center px-3 py-2">
        {language && <span className="text-xs">{language}</span>}
      </div>
      {children}
    </pre>
  );
}

export default function MarkdownContent({ content }: { content: string }) {
  return (
    <Markdown
      components={{
        ol: ({
          className,
          children,
          ...props
        }: OlHTMLAttributes<HTMLOListElement>) => (
          <ol
            className={cn(
              "list-decimal list-inside pl-4 flex flex-col gap-1",
              className
            )}
            {...props}
          >
            {children}
          </ol>
        ),
        ul: ({
          className,
          children,
          ...props
        }: HTMLAttributes<HTMLUListElement>) => (
          <ul
            className={cn(
              "list-disc list-inside pl-4 flex flex-col gap-1",
              className
            )}
            {...props}
          >
            {children}
          </ul>
        ),
        code: ({
          className,
          children,
          ...props
        }: HTMLAttributes<HTMLElement>) => {
          return (
            <code
              className={cn("font-mono rounded-md p-1 bg-gray-800", className)}
              {...props}
            >
              {children}
            </code>
          );
        },
        pre: ({ children, node }: any) => {
          const classes: string[] | undefined =
            node.children[0].properties.className;
          const language = classes
            ?.find((c) => c.startsWith("language-"))
            ?.slice(9);

          return <CodeArea language={language}>{children}</CodeArea>;
        },
      }}
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeRaw, rehypeHighlight, rehypeSanitize]}
    >
      {content}
    </Markdown>
  );
}
