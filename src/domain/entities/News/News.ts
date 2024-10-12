export interface News {
  data: NewsData[];
}

export interface NewsData {
  highlightResult?: HighlightResult;
  tags?: TagsInfo;
  author?: string;
  children?: number[];
  commentText?: string;
  createdAt?: string;
  createdAtI?: number;
  objectID?: string;
  parentId?: number;
  storyId: number;
  storyTitle?: string;
  storyUrl?: string;
  updatedAt?: string;
}

export interface HighlightResult {
  author?: InfoHighlightResult;
  commentText?: InfoHighlightResult;
  storyTitle?: InfoHighlightResult;
  storyUrl?: InfoHighlightResult;
}

type InfoHighlightResult = {
  fullyHighlighted?: boolean;
  matchLevel?: string;
  matchedWords?: string[];
  value?: string;
};

type TagsInfo = string[];
