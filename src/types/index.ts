export type PostCategory = "announcement" | "event" | "community" | "resource";

export interface Post {
  id: number;
  author: string;
  avatar: string;
  category: PostCategory;
  content: string;
  createdAt: string;
  likes: number;
  liked: boolean;
}

export interface CreatePostInput {
  content: string;
  category: PostCategory;
}

export interface UpdatePostInput {
  liked?: boolean;
}

export type OpportunityType =
  | "job"
  | "internship"
  | "scholarship"
  | "volunteer";

export type WorkMode = "remote" | "hybrid" | "on-site";

export interface Opportunity {
  id: number;
  title: string;
  company: string;
  companyLogo: string;
  type: OpportunityType;
  workMode: WorkMode;
  location: string;
  skills: string[];
  description: string;
  deadline: string;
  postedAt: string;
  level: string;
  applied: boolean;
}

export interface UpdateOpportunityInput {
  applied?: boolean;
}

export interface CommunityFilters {
  search: string;
  category: PostCategory | "all";
  onlyLiked: boolean;
}

export interface OpportunityFilters {
  search: string;
  type: OpportunityType | "all";
  workMode: WorkMode | "all";
  showSavedOnly: boolean;
}
