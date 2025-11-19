import { Project, Track } from './types';

export const DEFAULT_PROJECT: Project = {
  id: 'default-project',
  name: 'My Gemini Edit',
  width: 1280,
  height: 720,
  duration: 60, // 60 seconds default timeline
  tracks: [
    {
      id: 'track-video-1',
      name: 'Video Track',
      type: 'video',
      clips: [],
      isMuted: false,
      isHidden: false,
    },
    {
      id: 'track-text-1',
      name: 'Text & Stickers',
      type: 'text',
      clips: [],
      isMuted: false,
      isHidden: false,
    },
    {
      id: 'track-audio-1',
      name: 'Audio',
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
  'https://picsum.photos/id/10/1280/720',
];

export const SAMPLE_AUDIO = [
    { name: 'Inspirational', src: 'https://assets.mixkit.co/active_storage/sfx/2514/2514-preview.mp3' }, // Placeholder
    { name: 'Cinematic', src: 'https://assets.mixkit.co/active_storage/sfx/212/212-preview.mp3' },
];

export const SAMPLE_SFX = [
    { name: 'Whoosh', src: 'https://assets.mixkit.co/active_storage/sfx/1507/1507-preview.mp3' },
    { name: 'Pop', src: 'https://assets.mixkit.co/active_storage/sfx/2050/2050-preview.mp3' },
    { name: 'Camera Snap', src: 'https://assets.mixkit.co/active_storage/sfx/1529/1529-preview.mp3' }
];

export const SAMPLE_STICKERS = [
    'https://cdn-icons-png.flaticon.com/512/740/740935.png', 
    'https://cdn-icons-png.flaticon.com/512/4712/4712109.png',
    'https://cdn-icons-png.flaticon.com/512/1055/1055668.png',
    'https://cdn-icons-png.flaticon.com/512/14034/14034486.png',
    'https://cdn-icons-png.flaticon.com/512/9471/9471745.png'
];

export const FONTS = [
    'Inter',
    'Arial',
    'Courier New',
    'Georgia',
    'Impact',
    'Verdana'
];