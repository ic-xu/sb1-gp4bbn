import React, { useEffect } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import DocumentList from './components/DocumentList';
import Editor from './components/Editor';
import Preview from './components/Preview';
import Toolbar from './components/Toolbar';
import { useEditorStore } from './store/editorStore';
import { buildDocumentTree } from './utils/treeUtils';

const MIN_PANEL_SIZE = 15;

export default function App() {
  const { 
    documents, 
    content, 
    showSidebar, 
    showPreview, 
    setContent,
    setDocuments 
  } = useEditorStore();

  useEffect(() => {
    // Initialize with default documents
    setDocuments([
      {
        id: 'folder-1',
        title: 'Documentation',
        content: '',
        parentId: null,
        type: 'folder',
      },
      {
        id: 'file-1',
        title: 'Welcome',
        content: '# Welcome to Markdown Editor\n\nThis is a simple markdown editor with real-time preview.',
        parentId: 'folder-1',
        type: 'file',
      }
    ]);
  }, [setDocuments]);

  const documentTree = buildDocumentTree(documents);

  return (
    <div className="h-screen flex flex-col">
      <Toolbar />
      <div className="flex-1">
        <PanelGroup direction="horizontal">
          {showSidebar && (
            <>
              <Panel defaultSize={20} minSize={MIN_PANEL_SIZE}>
                <DocumentList documents={documentTree} />
              </Panel>
              <PanelResizeHandle className="w-1 hover:w-2 bg-gray-200 dark:bg-gray-700 hover:bg-blue-400 dark:hover:bg-blue-600 transition-all duration-150 cursor-col-resize" />
            </>
          )}
          <Panel defaultSize={showPreview ? 40 : 80} minSize={30}>
            <Editor value={content} onChange={setContent} />
          </Panel>
          {showPreview && (
            <>
              <PanelResizeHandle className="w-1 hover:w-2 bg-gray-200 dark:bg-gray-700 hover:bg-blue-400 dark:hover:bg-blue-600 transition-all duration-150 cursor-col-resize" />
              <Panel defaultSize={40} minSize={MIN_PANEL_SIZE}>
                <Preview content={content} />
              </Panel>
            </>
          )}
        </PanelGroup>
      </div>
    </div>
  );
}