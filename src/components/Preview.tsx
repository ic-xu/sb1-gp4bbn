import React from 'react';
import MarkdownRenderer from './MarkdownRenderer';

interface PreviewProps {
  content: string;
}

export default function Preview({ content }: PreviewProps) {
  return (
    <div className="h-full flex-1 flex flex-col border-l border-gray-200 dark:border-gray-700">
      <div className="border-b border-gray-200 dark:border-gray-700 p-4">
        <h2 className="text-lg font-semibold">Preview</h2>
      </div>
      <div className="flex-1 p-8 overflow-y-auto bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 prose dark:prose-invert">
          <MarkdownRenderer content={content} />
        </div>
      </div>
    </div>
  );
}