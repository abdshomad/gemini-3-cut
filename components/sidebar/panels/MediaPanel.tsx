import React from 'react';
import { useEditor } from '../../../context/EditorContext';
import { SAMPLE_VIDEOS, SAMPLE_IMAGES } from '../../../constants';
import { Plus, Upload } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

const MediaPanel = () => {
  const { dispatch, state } = useEditor();

  const addVideo = (src: string) => {
    const newClip: any = {
      id: uuidv4(),
      trackId: state.project.tracks[0].id, // Default to first video track
      type: 'video',
      src,
      name: 'Video Clip',
      start: state.currentTime,
      duration: 5,
      offset: 0,
      properties: { x: 0, y: 0, scale: 1, opacity: 1, rotation: 0 }
    };
    dispatch({ type: 'ADD_CLIP', payload: { trackId: state.project.tracks[0].id, clip: newClip } });
  };

  const addImage = (src: string) => {
    const newClip: any = {
      id: uuidv4(),
      trackId: state.project.tracks[0].id,
      type: 'image',
      src,
      name: 'Image Clip',
      start: state.currentTime,
      duration: 3,
      offset: 0,
      properties: { x: 0, y: 0, scale: 1, opacity: 1, rotation: 0 }
    };
    dispatch({ type: 'ADD_CLIP', payload: { trackId: state.project.tracks[0].id, clip: newClip } });
  };

  return (
    <div className="space-y-6">
      <button className="w-full py-8 border-2 border-dashed border-zinc-700 rounded-lg flex flex-col items-center justify-center text-zinc-500 hover:text-zinc-300 hover:border-zinc-500 transition-colors bg-zinc-800/20">
          <Upload size={24} className="mb-2" />
          <span className="text-xs font-medium">Click to Upload Media</span>
      </button>

      <div>
        <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Sample Videos</h3>
        <div className="grid grid-cols-2 gap-2">
          {SAMPLE_VIDEOS.map((video, idx) => (
            <button
              key={idx}
              onClick={() => addVideo(video)}
              className="relative group aspect-video rounded-lg overflow-hidden bg-zinc-950 border border-zinc-800 hover:border-blue-500/50 transition-all"
            >
              <video src={video} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/20">
                <Plus className="text-white drop-shadow-md" />
              </div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Sample Images</h3>
        <div className="grid grid-cols-2 gap-2">
          {SAMPLE_IMAGES.map((img, idx) => (
            <button
              key={idx}
              onClick={() => addImage(img)}
              className="relative group aspect-video rounded-lg overflow-hidden bg-zinc-950 border border-zinc-800 hover:border-blue-500/50 transition-all"
            >
              <img src={img} alt="sample" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/20">
                <Plus className="text-white drop-shadow-md" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MediaPanel;