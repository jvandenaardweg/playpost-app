interface ApiPlaylist {
  id: string
  name: string
  playlistItems: ApiPlaylistItem[]
}

interface ApiPlaylistItem {
  id: string
  article: ApiArticle
}

interface ApiArticle {
  id: string
  title: string
  description: string
  url: string
  categoryName: string
  sourceName: string
  authorName: string
  listenTimeInMinutes: number
}

interface ApiUser {
  id: string
  email: string
  playlists?: ApiPlaylist[]
}
