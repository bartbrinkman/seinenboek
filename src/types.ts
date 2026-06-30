export interface Signal {
  id: string;
  section: string;
  sectionTitle: string | null;
  subsection: string | null;
  subsectionTitle: string | null;
  images: string[];
  meaning: string;
  label: string;
}

export interface SignalData {
  sections: Record<string, string>;
  signals: Signal[];
}

export interface Question {
  signal: Signal;
  options: string[];
  correctIndex: number;
}

export interface Stats {
  correct: number;
  total: number;
}
