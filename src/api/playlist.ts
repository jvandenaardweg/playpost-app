import { apiClient } from './index';

export const postArticleToPlaylistById = (articleId: string) => {
  return apiClient.post(`v1/playlist/articles/${articleId}`);
};
