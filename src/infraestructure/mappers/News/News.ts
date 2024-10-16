import {NewsData, News, HighlightResult} from '../../../domain';
import {
  NewsDto,
  NewsDtoData,
  HighlightResultDto,
} from '../../../infraestructure';

const getHighlightResults = (
  highlightResults: HighlightResultDto,
): HighlightResult => {
  return {
    author: highlightResults?.author,
    commentText: highlightResults?.comment_text,
    storyTitle: highlightResults?.story_title,
    storyUrl: highlightResults?.story_url,
  };
};
export const newsMap = (response: NewsDto): News => {
  const dataNews: NewsData[] = [];
  response.hits.forEach((dto: NewsDtoData) => {
    const exist = dataNews.some(item => item.storyId === dto.story_id);

    if (!exist) {
      dataNews.push({
        // highlightResult: getHighlightResults(dto._highlightResult),
        // tags: dto?._tags,
        author: dto?.author,
        children: dto?.children,
        commentText: 'dto?.comment_text',
        createdAt: dto?.created_at,
        createdAtI: dto?.created_at_i,
        // objectID: dto?.objectID,
        // parentId: dto?.parent_id,
        storyId: dto?.story_id,
        storyTitle: dto?.story_title ?? dto.title,
        storyUrl: dto?.story_url,
        updatedAt: dto?.updated_at,
      });
    }
  });

  dataNews.sort((a: NewsData, b: NewsData) => {
    return b.createdAtI - a.createdAtI;
  });

  return {data: dataNews};
};
