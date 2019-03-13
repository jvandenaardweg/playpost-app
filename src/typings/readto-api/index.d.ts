namespace Api {

  export interface Auth {
    token: string;
  }

  export interface Playlist {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    playlistItems?: PlaylistItem[];
  }

  export interface PlaylistItem {
    id: string;
    order: number;
    lastPlayedAt?: Date | null;
    plays: number;
    createdAt: Date;
    updatedAt: Date;
    article: Article;
  }

  export interface Article {
    id: string;
    title: string;
    description: string;
    url: string;
    languageCode: string;
    sourceName: string;
    imageUrl?: string | null;
    readingTime?: string | null;
    authorName?: string | null;
    authorUrl?: string | null;
    categoryName?: string | null;
    ssml?: string | null;
    text?: string | null;
    createdAt: Date;
    updatedAt: Date;
    audiofiles: Audiofile[];
  }

  export interface User {
    id: string;
    email: string;
    onboardAt?: Date | null;
    activatedAt?: Date | null;
    authenticatedAt?: Date | null;
    createdAt: Date;
    updatedAt: Date;
    playlists?: Playlist[];
  }

  export interface Audiofile {
    id: string;
    url: string;
    bucket: string;
    filename: string;
    length: number | null;
    languageCode: string;
    encoding: string;
    voice: string;
    synthesizer: string;
    partialPlays: number;
    completedPlays: number;
    lastPlayedAt?: Date | null;
    createdAt: Date;
    updatedAt: Date;
  }

}
