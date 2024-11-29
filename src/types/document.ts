export interface Document {
  id: string;
  title: string;
  content: string;
  parentId: string | null;
  type: 'file' | 'folder';
}