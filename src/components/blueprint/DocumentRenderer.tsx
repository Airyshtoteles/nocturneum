'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { SpecDocument } from '@/types';

export interface DocumentRendererProps {
  document: SpecDocument | null;
  className?: string;
}

/**
 * Renders specification documents (.md or .json) with gothic styling,
 * syntax-highlighted code blocks, and formatted markdown tables.
 * Validates Requirements 5.6, 5.7, 5.8
 */
export default function DocumentRenderer({
  document,
  className = '',
}: DocumentRendererProps) {
  if (!document) {
    return (
      <div className={`flex flex-col items-center justify-center h-full min-h-[300px] text-mist/60 text-center p-8 ${className}`}>
        <span className="text-4xl mb-3 text-gold/40 font-serif">📜</span>
        <h3 className="font-cinzel text-lg text-gold/70 mb-1">No Document Selected</h3>
        <p className="text-sm font-serif max-w-sm">
          Select an architectural specification or sacred rule from the grimoire index to reveal its contents.
        </p>
      </div>
    );
  }

  // Handle JSON document formatting (Requirement 5.8)
  if (document.type === 'json') {
    let prettyJson = document.content;
    try {
      const parsed = JSON.parse(document.content);
      prettyJson = JSON.stringify(parsed, null, 2);
    } catch {
      // Keep original content if already string or malformed
    }

    return (
      <div className={`p-4 overflow-x-auto ${className}`}>
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-gold/20 text-xs font-mono text-mist">
          <span className="text-gold font-semibold uppercase">{document.name}</span>
          <span className="px-2 py-0.5 rounded bg-obsidian border border-gold/20">JSON Hook / Config</span>
        </div>
        <div className="rounded-lg overflow-hidden border border-gold/20 shadow-gothic-glow">
          <SyntaxHighlighter
            language="json"
            style={vscDarkPlus}
            customStyle={{
              margin: 0,
              padding: '1.25rem',
              background: '#0B0A0E',
              fontSize: '0.875rem',
              lineHeight: '1.5',
            }}
          >
            {prettyJson}
          </SyntaxHighlighter>
        </div>
      </div>
    );
  }

  // Handle Markdown document formatting (Requirements 5.6, 5.7, 5.8)
  return (
    <div className={`p-6 text-mist font-serif overflow-y-auto max-w-full ${className}`}>
      {/* Document Header */}
      <div className="flex items-center justify-between pb-3 mb-6 border-b border-gold/20 text-xs font-mono">
        <span className="text-gold font-semibold uppercase tracking-wider font-cinzel text-sm">
          {document.name}
        </span>
        <span className="px-2.5 py-0.5 rounded-full bg-crimson/20 border border-crimson/40 text-gold text-[11px] capitalize">
          Category: {document.category}
        </span>
      </div>

      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="font-cinzel text-2xl font-bold text-gold border-b border-gold/30 pb-2 mt-6 mb-4 tracking-wider">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="font-cinzel text-xl font-semibold text-gold mt-6 mb-3 tracking-wide">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="font-cinzel text-lg font-medium text-gold/90 mt-4 mb-2">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="mb-4 leading-relaxed text-[#D6CFB4] text-[15px]">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-inside mb-4 space-y-1.5 pl-2 text-[#D6CFB4]">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside mb-4 space-y-1.5 pl-2 text-[#D6CFB4]">
              {children}
            </ol>
          ),
          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-crimson bg-[#16131D]/80 p-3 my-4 italic text-gold/90 rounded-r shadow-inner">
              {children}
            </blockquote>
          ),
          // Formatted Tables (Requirement 5.8)
          table: ({ children }) => (
            <div className="overflow-x-auto my-6 border border-gold/25 rounded-lg shadow-lg">
              <table className="w-full border-collapse text-left text-sm font-serif">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-[#120F18] border-b-2 border-gold/40 text-gold font-cinzel uppercase text-xs tracking-wider">
              {children}
            </thead>
          ),
          th: ({ children }) => (
            <th className="p-3 border-r border-gold/15 last:border-r-0 font-semibold">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="p-3 border-t border-gold/10 border-r border-gold/10 last:border-r-0 text-[#C8BF9F]">
              {children}
            </td>
          ),
          tr: ({ children }) => (
            <tr className="even:bg-obsidian/40 hover:bg-gold/5 transition-colors">
              {children}
            </tr>
          ),
          // Code Blocks and Inline Code (Requirement 5.7)
          code({ className: codeClass, children, ...rest }) {
            const match = /language-(\w+)/.exec(codeClass || '');
            const isInline = !match && !String(children).includes('\n');

            if (isInline) {
              return (
                <code
                  className="bg-obsidian border border-gold/20 text-[#F5C270] px-1.5 py-0.5 rounded text-xs font-mono"
                  {...rest}
                >
                  {children}
                </code>
              );
            }

            const language = match ? match[1] : 'text';
            const codeString = String(children).replace(/\n$/, '');

            return (
              <div className="rounded-lg overflow-hidden border border-gold/20 my-4 shadow-gothic-glow">
                <div className="bg-[#120F18] px-3 py-1 border-b border-gold/15 text-[11px] font-mono text-mist/70 flex justify-between">
                  <span>{language}</span>
                  <span className="text-gold/50 select-none">✦ code block</span>
                </div>
                <SyntaxHighlighter
                  language={language}
                  style={vscDarkPlus}
                  customStyle={{
                    margin: 0,
                    padding: '1rem',
                    background: '#0B0A0E',
                    fontSize: '0.85rem',
                    lineHeight: '1.45',
                  }}
                >
                  {codeString}
                </SyntaxHighlighter>
              </div>
            );
          },
        }}
      >
        {document.content}
      </ReactMarkdown>
    </div>
  );
}
