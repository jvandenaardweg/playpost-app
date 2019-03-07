namespace Api {
  export interface Playlist {
    id: string
    name: string
    playlistItems: PlaylistItem[]
  }

  export interface PlaylistItem {
    id: string
    article: Article
  }

  export interface Article {
    id: string
    title: string
    description: string
    url: string
    categoryName: string
    sourceName: string
    authorName: string
    listenTimeInMinutes: number
  }

  export interface User {
    id: string
    email: string
    onboardAt: Date | null
    activatedAt: Date | null
    authenticatedAt: Date | null
    createdAt: Date
    updatedAt: Date
    playlists?: Playlist[]
  }

}
