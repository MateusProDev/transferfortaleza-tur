import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";

interface MarkdownDescriptionProps {
  content: string;
  className?: string;
}

export default function MarkdownDescription({ content, className = "" }: MarkdownDescriptionProps) {
  return (
    <div className={`package-markdown ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeSanitize]}
        components={{ h1: "h2" }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
