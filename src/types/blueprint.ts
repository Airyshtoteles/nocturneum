export type DocumentCategory = 'specs' | 'steering' | 'hooks';

export interface SpecDocument {
  path: string;
  name: string;
  category: DocumentCategory;
  content: string; // markdown or JSON
  type: 'markdown' | 'json';
}

export interface BlueprintState {
  documents: SpecDocument[];
  selectedDocId: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface AlchemistBlueprintModalProps {
  isOpen: boolean;
  onClose: () => void;
}
