import { Project, Track } from './types';

export const DEFAULT_PROJECT: Project = {
  id: 'default-project',
  name: 'Untitled Project',
  width: 1280,
  height: 720,
  duration: 60, // 60 seconds default timeline
  tracks: [
    {
      id: 'track-video-1',
      name: 'Video Track 1',
      type: 'video',
      clips: [],
      isMuted: false,
      isHidden: false,
    },
    {
      id: 'track-text-1',
      name: 'Text Overlay',
      type: 'text',
      clips: [],
      isMuted: false,
      isHidden: false,
    },
    {
      id: 'track-audio-1',
      name: 'Background Music',
      type: 'audio',
      clips: [],
      isMuted: false,
      isHidden: false,
    }
  ],
};

export const SAMPLE_VIDEOS = [
  'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
  'https://vjs.zencdn.net/v/oceans.mp4',
];

export const SAMPLE_IMAGES = [
  'https://picsum.photos/1280/720',
  'https://picsum.photos/800/600',
];
