export interface Track {
  id: string;
  title: string;
  artist: string;
  src: string;
  duration?: number; // Duration in seconds
  formattedDuration?: string; // Preformatted duration string like "4:04"
  artwork?: string;
}

export interface MusicPlayerState {
  currentTrack: Track;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  progress: number; // 0 to 1
  volume: number;
  isMuted: boolean;
  isLoading: boolean;
}

export interface MusicPlayerActions {
  play: () => Promise<void>;
  pause: () => void;
  togglePlay: () => void;
  selectTrack: (track: Track, autoPlay?: boolean) => void;
  nextTrack: () => void;
  previousTrack: () => void;
  seek: (timeInSeconds: number) => void;
  setVolume: (vol: number) => void;
  toggleMute: () => void;
}
