export interface Situationship {
  id: string;
  name: string;
  causeOfDeath: CauseOfDeath;
  imageUri?: string;
  dateStarted: Date;
  dateEnded: Date;
  emotionalLog: EmotionalLog;
  reviveCount: number;
  isRevived: boolean;
  epitaph?: string;
  createdAt: Date;
  color?: string;
  deleted?: boolean;
}

export type CauseOfDeath = 
  | 'ghosted'
  | 'breadcrumbed'
  | 'situationship'
  | 'friendzoned'
  | 'lovebombed'
  | 'slowfaded'
  | 'cheated'
  | 'other';

export interface EmotionalLog {
  metInPerson: boolean;
  numberOfDates: number;
  kissed: boolean;
  hookedUp: boolean;
  fellInLove: boolean;
  fought: boolean;
  talkedForWeeks: number;
  wasExclusive: boolean;
  summary: string;
}

export interface GraveTheme {
  id: string;
  name: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  isPremium: boolean;
}

export interface AppContextType {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  situationships: Situationship[];
  setSituationships: (situationships: Situationship[] | ((prev: Situationship[]) => Situationship[])) => void;
  clearGraveyard: () => void;
  addSoul: (soul: Situationship) => void;
  updateSoul: (soul: Situationship) => void;
  deleteSoul: (id: string) => void;
  restoreSoul: (id: string) => void;
} 