import React, { useState } from 'react';
import { FileText, Folder, FolderOpen, ChevronRight, ChevronDown, Plus } from 'lucide-react';
import { useEditorStore } from '../store/editorStore';
import type { DocumentTreeItem } from '../types';

interface TreeNodeProps {
  item: DocumentTreeItem;
  level: number;
}

function TreeNode({ item, level }: TreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showActions, setShowActions] = useState(false);
  const { selectedId, setSelectedId, setContent, createDocument } = useEditorStore();

  const handleSelect = () => {
    if (item.type === 'file') {
      setSelectedId(item.id);
      setContent(item.content);
    }
  };

  const handleCreateItem = (type: 'file' | 'folder') => {
    createDocument(item.id, type);
  };

  return (
    <div>
      <div
        className="relative group"
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
      >
        <div
          onClick={handleSelect}
          className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer
            ${selectedId === item.id && item.type === 'file' ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200' : ''}
            ${item.type === 'folder' ? 'font-medium' : ''}`}
          style={{ paddingLeft: `${(level + 1) * 12}px` }}
        >
          {item.type === 'folder' && (
            <span 
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded cursor-pointer"
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </span>
          )}
          {item.type === 'folder' ? (
            isExpanded ? (
              <FolderOpen className="w-4 h-4 text-yellow-500" />
            ) : (
              <Folder className="w-4 h-4 text-yellow-500" />
            )
          ) : (
            <FileText className="w-4 h-4 text-gray-500" />
          )}
          <span className="truncate">{item.title}</span>
        </div>
        
        {showActions && item.type === 'folder' && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1 bg-white dark:bg-gray-800 px-2 py-1 rounded-md shadow-sm">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleCreateItem('file');
              }}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              title="New File"
            >
              <FileText className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleCreateItem('folder');
              }}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              title="New Folder"
            >
              <Folder className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
      
      {item.type === 'folder' && isExpanded && item.children.length > 0 && (
        <div className="ml-2">
          {item.children.map((child) => (
            <TreeNode
              key={child.id}
              item={child}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface DocumentListProps {
  documents: DocumentTreeItem[];
}

export default function DocumentList({ documents }: DocumentListProps) {
  const { createDocument } = useEditorStore();

  return (
    <div className="h-screen overflow-y-auto flex flex-col bg-gray-50 dark:bg-gray-900">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Documents</h2>
          <button
            onClick={() => createDocument(null, 'folder')}
            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded cursor-pointer"
            title="New Root Folder"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {documents.map((doc) => (
          <TreeNode
            key={doc.id}
            item={doc}
            level={0}
          />
        ))}
      </div>
    </div>
  );
}