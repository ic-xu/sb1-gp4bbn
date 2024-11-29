import { Document, DocumentTreeItem } from '../types';

export function buildDocumentTree(documents: Document[]): DocumentTreeItem[] {
  const map = new Map<string, DocumentTreeItem>();
  const tree: DocumentTreeItem[] = [];

  // First, convert all documents to tree items
  documents.forEach(doc => {
    map.set(doc.id, { ...doc, children: [] });
  });

  // Then, build the tree structure
  documents.forEach(doc => {
    const item = map.get(doc.id)!;
    if (doc.parentId === null) {
      tree.push(item);
    } else {
      const parent = map.get(doc.parentId);
      if (parent) {
        parent.children.push(item);
      }
    }
  });

  return tree;
}