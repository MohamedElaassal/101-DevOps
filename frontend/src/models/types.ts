export interface Checkpoint {
  id: number;
  step: number;
  title: string;
  phase: string;
  done: boolean;
  memo: string | null;
  finished_at: string | null;
}

export interface Wisdom {
  id: number;
  message: string;
  author: string;
  category: string;
  stars: number;
}

export interface Tool {
  id: number;
  name: string;
  domain: string;
  rating: number;
}
