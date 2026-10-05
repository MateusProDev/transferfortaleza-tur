import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownDescriptionProps {
  content: string;
  className?: string;
}

export default function MarkdownDescription({ content, className = "" }: MarkdownDescriptionProps) {
  const containsLegacyHtml = /<\/?[a-z][^>]*>/i.test(content);
  const containsMarkdown = /(^|\n)\s{0,3}(#{1,6}\s|[-*+]\s|\d+\.\s|>\s|(?:-{3,}|\*{3,}))|(\*\*|__|~~|`|\*[^*\n]+\*|_[^_\n]+_|\[[^\]]+\]\([^)]+\)|\|[^|\n]+\|)/.test(content);

  if (containsLegacyHtml || !containsMarkdown) {
    return (
      <p className={`whitespace-pre-line ${className}`}>
        {content}
      </p>
    );
  }

  return (
    <div className={`package-markdown ${className}`}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} skipHtml>
        {content}
      </ReactMarkdown>
    </div>
  );
}
