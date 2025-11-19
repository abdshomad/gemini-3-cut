export type MediaType = 'video' | 'image' | 'text' | 'audio';

export interface Clip {
  id: string;
  trackId: string;
  type: MediaType;
  src?: string; // URL for video/image/audio
  text?: string; // Content for text layers
  name: string;
  start: number; // Start time in the timeline (seconds)
  duration: number; // Duration of the clip (seconds)
  offset: number; // Start time within the source media (trimming)
  properties: {
    x: number;
    y: number;
    scale: number;
    opacity: number;
    rotation: number;
    color?: string;
    fontSize?: number;
    volume?: number;
  };
}

export interface Track {
  id: string;
  name: string;
  type: MediaType;
  clips: Clip[];
  isMuted: boolean;
  isHidden: boolean;
}

export interface Project {
  id: string;
  name: string;
  width: number;
  height: number;
  duration: number; // Total timeline duration
  tracks: Track[];
}

export enum EditorTool {
  SELECT = 'select',
  SPLIT = 'split',
}

export interface EditorState {
  project: Project;
  currentTime: number;
  isPlaying: boolean;
  selectedClipId: string | null;
  activeTool: EditorTool;
  zoomLevel: number; // Pixels per second
}
