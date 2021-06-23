declare module '*.png';
declare module '*.mp4';

type Season = {
  id: number;
  name: string;
  age: number;
  genre: string;
  current_episode: string;
  thumbnail: string;
  image: string;
  runningTime: number;
  progress: number;
  season: string;
  ratings: number;

  watching: boolean;
  isNew: boolean;
};
