export interface GeneratedPost {
  id?: string;
  actorName: string;
  postText: string;
  headshotUrl: string;
  isFavorite?: boolean;
  createdAt?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  plan: "free" | "pro" | "agency";
  generationsToday: number;
  generationsTotal: number;
  lastGenerationDate: string | null;
}
