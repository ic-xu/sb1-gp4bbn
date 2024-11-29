import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import { usePluginManager } from '../hooks/usePluginManager';
import 'katex/dist/katex.min.css';

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const pluginManager = usePluginManager();
  const renderers = pluginManager.getRenderers();

  const components = renderers.reduce((acc: Record<string, any>, renderer) => {
    acc[renderer.id] = ({ node, children }: { node: any; children: React.ReactNode }) => {
      if (renderer.test(node)) {
        return renderer.render(node, children);
      }
      return children;
    };
    return acc;
  }, {});

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeKatex, rehypeRaw]}
      components={components}
    >
      {content}
    </ReactMarkdown>
  );
}