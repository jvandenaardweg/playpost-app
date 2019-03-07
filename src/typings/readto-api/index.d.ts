interface ApiPlaylist {
  id: string
  name: string
  playlistItems: ApiPlaylistItem[]
}

interface ApiPlaylistItem {
  id: string
  article: Article
}

interface Article {
  id: string
  title: string
  description: string
}

interface ApiUser {
  id: string
  email: string
  playlists?: ApiPlaylist[]
}
