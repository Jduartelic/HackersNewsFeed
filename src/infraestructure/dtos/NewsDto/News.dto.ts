export interface NewsDto {
  hits: NewsDtoData[];
}

export interface NewsDtoData {
  _highlightResult: HighlightResultDto;
  _tags: TagsInfoDto;
  author: string;
  children: number[];
  comment_text: string;
  created_at: string;
  created_at_i: number;
  objectID: string;
  parent_id: number;
  story_id: number;
  story_title: string;
  title: string;
  story_url: string;
  updated_at: string;
}

export interface HighlightResultDto {
  author: InfoHighlightResultDto;
  comment_text: InfoHighlightResultDto;
  story_title: InfoHighlightResultDto;
  story_url: InfoHighlightResultDto;
}

interface InfoHighlightResultDto {
  fullyHighlighted?: boolean;
  matchLevel?: string;
  matchedWords?: string[];
  value?: string;
}

type TagsInfoDto = string[];
