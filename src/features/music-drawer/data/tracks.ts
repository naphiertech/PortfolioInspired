import { Track } from "../types/music";

/**
 * Curated playlist for the Music Drawer.
 * Synchronized with the real local files in `public/audio/favorites/`.
 */
export const FAVORITE_TRACKS: Track[] = [
  {
    id: "every-breath-you-take",
    title: "Every Breath You Take",
    artist: "The Police",
    src: "/audio/favorites/Every Breath You Take.mp3",
    duration: 276,
    formattedDuration: "4:36",
    artwork: "/audio/favorites/cd-artwork.jpg",
  },
  {
    id: "iris",
    title: "Iris",
    artist: "The Goo Goo Dolls",
    src: "/audio/favorites/Iris.mp3",
    duration: 315,
    formattedDuration: "5:15",
    artwork: "/audio/favorites/cd-artwork.jpg",
  },
  {
    id: "the-man-who-cant-be-moved",
    title: "The Man Who Can't Be Moved",
    artist: "The Script",
    src: "/audio/favorites/The Man Who Can't Be Moved.mp3",
    duration: 263,
    formattedDuration: "4:22",
    artwork: "/audio/favorites/cd-artwork.jpg",
  },
  {
    id: "wherever-you-will-go",
    title: "Wherever You Will Go",
    artist: "The Calling",
    src: "/audio/favorites/Wherever You Will Go.mp3",
    duration: 209,
    formattedDuration: "3:28",
    artwork: "/audio/favorites/cd-artwork.jpg",
  },
  {
    id: "ill-be",
    title: "I'll Be",
    artist: "Edwin McCain",
    src: "/audio/favorites/I'll Be.mp3",
    duration: 290,
    formattedDuration: "4:50",
    artwork: "/audio/favorites/cd-artwork.jpg",
  },
  {
    id: "drag-path",
    title: "Drag Path",
    artist: "Twenty One Pilots",
    src: "/audio/favorites/Drag Path.mp3",
    duration: 224,
    formattedDuration: "3:44",
    artwork: "/audio/favorites/cd-artwork.jpg",
  },
  {
    id: "merry-christmas-please-dont-call",
    title: "Merry Christmas, Please Don't Call",
    artist: "Bleachers",
    src: "/audio/favorites/Merry Christmas, Please Don't Call.mp3",
    duration: 202,
    formattedDuration: "3:22",
    artwork: "/audio/favorites/cd-artwork.jpg",
  },
];

export const DEFAULT_TRACK = FAVORITE_TRACKS[0];
