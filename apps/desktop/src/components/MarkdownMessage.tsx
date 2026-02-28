import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';

export function MarkdownMessage({ content }: { content: string }) {
  return (
    <div className="copilot-markdown">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSanitize]}
        components={{
          a: ({ children, ...props }) => (
            <a {...props} target="_blank" rel="noreferrer noopener" className="copilot-markdown-link">
              {children}
            </a>
          ),
          code: ({ children, className, ...props }) => (
            <code {...props} className={className ? `${className} copilot-markdown-code` : 'copilot-markdown-code'}>
              {children}
            </code>
          ),
          pre: ({ children, ...props }) => (
            <pre {...props} className="copilot-markdown-pre">
              {children}
            </pre>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
