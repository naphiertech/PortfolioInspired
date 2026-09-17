export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  duration: string; // Preformatted duration string like "4:13"
  spotifyUrl: string;
  youtubeMusicUrl: string;
  artwork?: string;
}

export type Track = MusicTrack;

