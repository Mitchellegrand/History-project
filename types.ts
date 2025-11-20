export enum Category {
  WW2 = 'World War 2 & Nazism',
  RIGHTS = 'Rights and Freedoms',
}

export interface HistoryEvent {
  id: string;
  year: number;
  dateDisplay?: string;
  title: string;
  description: string;
  details: string[];
  category: Category;
  position: [number, number, number]; // x, y, z for 3D placement
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}
