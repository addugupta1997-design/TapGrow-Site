import React from 'react';
import ReactMarkdown, { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

// Sanitization schema: allows standard markdown elements, tables, links with safe protocols
const sanitizeSchema = {
  ...defaultSchema,
  tagNames: [
    ...(defaultSchema.tagNames || []),
    'table',
    'thead',
    'tbody',
    'tr',
    'th',
    'td',
    'del',
    's',
    'strike',
    'code',
    'pre',
    'blockquote',
    'hr',
    'span',
  ],
  attributes: {
    ...defaultSchema.attributes,
    a: ['href', 'target', 'rel', 'title'],
    code: ['className'],
    th: ['align', 'colSpan', 'rowSpan'],
    td: ['align', 'colSpan', 'rowSpan'],
  },
  protocols: {
    ...defaultSchema.protocols,
    href: ['http', 'https', 'mailto'],
  },
};

const customComponents: Components = {
  p: ({ children }) => (
    <p className="my-1.5 leading-relaxed text-slate-800 dark:text-[#F2F7F5] last:mb-0 first:mt-0">
      {children}
    </p>
  ),
  h1: ({ children }) => (
    <h1 className="text-base sm:text-lg font-extrabold tracking-tight text-[#142A36] dark:text-[#F2F7F5] mt-3.5 mb-1.5 first:mt-0 border-b border-slate-200/60 dark:border-[#304650] pb-1">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-sm sm:text-base font-bold tracking-tight text-[#142A36] dark:text-[#F2F7F5] mt-3 mb-1.5 first:mt-0">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-xs sm:text-sm font-bold text-[#16866F] dark:text-[#65D6B2] mt-2.5 mb-1 first:mt-0">
      {children}
    </h3>
  ),
  h4: ({ children }) => (
    <h4 className="text-xs font-bold text-slate-800 dark:text-[#E2E8F0] mt-2 mb-1 first:mt-0">
      {children}
    </h4>
  ),
  strong: ({ children }) => (
    <strong className="font-bold text-[#142A36] dark:text-white">
      {children}
    </strong>
  ),
  em: ({ children }) => (
    <em className="italic text-slate-700 dark:text-[#E2E8F0]">
      {children}
    </em>
  ),
  del: ({ children }) => (
    <del className="line-through text-slate-400 dark:text-slate-500">
      {children}
    </del>
  ),
  ul: ({ children }) => (
    <ul className="my-1.5 pl-5 list-disc space-y-1 text-slate-800 dark:text-[#F2F7F5] [&_ul]:my-0.5 [&_ul]:pl-4 [&_ul]:list-[circle]">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="my-1.5 pl-5 list-decimal space-y-1 text-slate-800 dark:text-[#F2F7F5] [&_ol]:my-0.5 [&_ol]:pl-4 [&_ol]:list-[lower-alpha]">
      {children}
    </ol>
  ),
  li: ({ children }) => (
    <li className="leading-relaxed pl-0.5 marker:text-[#16866F] dark:marker:text-[#65D6B2]">
      {children}
    </li>
  ),
  blockquote: ({ children }) => (
    <blockquote className="my-2 border-l-3 border-[#16866F] dark:border-[#65D6B2] bg-[#E0F5EE]/40 dark:bg-[#16866F]/15 px-3 py-1.5 rounded-r-md text-xs sm:text-sm italic text-slate-700 dark:text-[#B5C5C7]">
      {children}
    </blockquote>
  ),
  code: ({ className, children, ...props }) => {
    const isInline = !className && typeof children === 'string' && !children.includes('\n');
    if (isInline) {
      return (
        <code
          className="rounded bg-slate-200/80 dark:bg-[#223640] px-1.5 py-0.5 font-mono text-[11px] sm:text-xs font-semibold text-emerald-800 dark:text-[#65D6B2] border border-slate-300/60 dark:border-[#304650]"
          {...props}
        >
          {children}
        </code>
      );
    }
    return (
      <code
        className={`block font-mono text-xs leading-relaxed text-slate-100 ${className || ''}`}
        {...props}
      >
        {children}
      </code>
    );
  },
  pre: ({ children }) => (
    <pre className="my-2.5 overflow-x-auto rounded-lg bg-slate-900 dark:bg-black/70 p-3 text-xs border border-slate-800 dark:border-[#304650] text-slate-100 font-mono">
      {children}
    </pre>
  ),
  a: ({ href, children, ...props }) => {
    const isExternal = href?.startsWith('http://') || href?.startsWith('https://');
    return (
      <a
        href={href}
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'noopener noreferrer' : undefined}
        className="text-[#16866F] dark:text-[#65D6B2] font-semibold underline underline-offset-2 hover:text-[#0F5C4D] dark:hover:text-[#88ECCB] transition-colors"
        {...props}
      >
        {children}
      </a>
    );
  },
  table: ({ children }) => (
    <div className="my-2.5 overflow-x-auto rounded-lg border border-slate-200 dark:border-[#304650] shadow-2xs">
      <table className="min-w-full divide-y divide-slate-200 dark:divide-[#304650] text-left text-xs">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="bg-slate-100 dark:bg-[#1D3039] text-[#142A36] dark:text-[#F2F7F5] font-bold">
      {children}
    </thead>
  ),
  tbody: ({ children }) => (
    <tbody className="divide-y divide-slate-100 dark:divide-[#263D47] bg-white dark:bg-[#172830]">
      {children}
    </tbody>
  ),
  tr: ({ children }) => (
    <tr className="hover:bg-slate-50/70 dark:hover:bg-[#1F333E] transition-colors">
      {children}
    </tr>
  ),
  th: ({ children }) => (
    <th className="px-3 py-2 text-xs font-semibold text-slate-900 dark:text-[#F2F7F5] border-b border-slate-200 dark:border-[#304650]">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="px-3 py-2 text-xs text-slate-700 dark:text-[#B5C5C7]">
      {children}
    </td>
  ),
  hr: () => (
    <hr className="my-3 border-t border-slate-200 dark:border-[#304650]" />
  ),
};

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className = '' }) => {
  return (
    <div className={`markdown-content text-xs sm:text-sm ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[[rehypeSanitize, sanitizeSchema]]}
        components={customComponents}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
