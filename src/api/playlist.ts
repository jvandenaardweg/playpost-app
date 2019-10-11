import { apiClient } from './index';

export const postArticleToPlaylistById = (articleId: string) => {
  return apiClient.post(`v1/playlist/articles/${articleId}`);
};

export const patchArchivePlaylistItem = (articleId: string) => {
  return apiClient.patch(`v1/playlist/articles/${articleId}/archivedat`, { archivedAt: new Date() });
};

export const patchUnarchivePlaylistItem = (articleId: string) => {
  return apiClient.patch(`v1/playlist/articles/${articleId}/archivedat`, { archivedAt: null });
};

export const patchFavoritePlaylistItem = (articleId: string) => {
  return apiClient.patch(`v1/playlist/articles/${articleId}/favoritedat`, { favoritedAt: new Date() });
};

export const patchUnFavoritePlaylistItem = (articleId: string) => {
  return apiClient.patch(`v1/playlist/articles/${articleId}/favoritedat`, { favoritedAt: null });
};

export const deleteArticleFromPlaylist = (articleId: string) => {
  return apiClient.delete(`v1/playlist/articles/${articleId}`);
};
