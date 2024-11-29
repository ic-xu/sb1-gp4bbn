import { create } from 'zustand';
import type { Document } from '../types/document';

interface EditorState {
  documents: Document[];
  selectedId: string | null;
  content: string;
  showSidebar: boolean;
  showPreview: boolean;
  theme: string;
  setDocuments: (documents: Document[]) => void;
  setSelectedId: (id: string | null) => void;
  setContent: (content: string) => void;
  toggleSidebar: () => void;
  togglePreview: () => void;
  setTheme: (theme: string) => void;
  createDocument: (parentId: string | null, type: 'file' | 'folder') => void;
}

export const useEditorStore = create<EditorState>((set, get) => ({
  documents: [],
  selectedId: null,
  content: '',
  showSidebar: true,
  showPreview: true,
  theme: 'default',
  setDocuments: (documents) => set({ documents }),
  setSelectedId: (selectedId) => set({ selectedId }),
  setContent: (content) => set({ content }),
  toggleSidebar: () => set((state) => ({ showSidebar: !state.showSidebar })),
  togglePreview: () => set((state) => ({ showPreview: !state.showPreview })),
  setTheme: (theme) => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    set({ theme });
  },
  createDocument: (parentId, type) => {
    const newId = `${type}-${Date.now()}`;
    const newDoc: Document = {
      id: newId,
      title: type === 'folder' ? 'New Folder' : 'New File',
      content: type === 'file' ? '# New Document\n\nStart writing here...' : '',
      parentId,
      type,
    };
    
    set((state) => ({
      documents: [...state.documents, newDoc],
      ...(type === 'file' ? {
        selectedId: newId,
        content: newDoc.content,
      } : {}),
    }));
  },
}));