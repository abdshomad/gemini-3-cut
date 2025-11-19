import React from 'react';
import { useEditor } from '../../../context/EditorContext';
import { SAMPLE_VIDEOS, SAMPLE_IMAGES } from '../../../constants';
import { Plus, Film, Image as ImageIcon, Type } from 'lucide-react';
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

  const addText = () => {
    const newClip: any = {
      id: uuidv4(),
      trackId: state.project.tracks[1].id, // Default to text track
      type: 'text',
      text: 'Double Click to Edit',
      name: 'Text Layer',
      start: state.currentTime,
      duration: 3,
      offset: 0,
      properties: { x: 0, y: 0, scale: 1, opacity: 1, rotation: 0, color: '#ffffff', fontSize: 48 }
    };
    dispatch({ type: 'ADD_CLIP', payload: { trackId: state.project.tracks[1].id, clip: newClip } });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Tools</h3>
        <button
          onClick={addText}
          className="w-full flex items-center gap-3 p-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors group"
        >
          <div className="p-2 rounded bg-zinc-900 group-hover:bg-zinc-800">
            <Type size={18} className="text-emerald-400" />
          </div>
          <span className="text-sm font-medium">Add Text Layer</span>
          <Plus size={14} className="ml-auto text-zinc-500" />
        </button>
      </div>

      <div>
        <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Sample Videos</h3>
        <div className="grid grid-cols-2 gap-2">
          {SAMPLE_VIDEOS.map((video, idx) => (
            <button
              key={idx}
              onClick={() => addVideo(video)}
              className="relative group aspect-video rounded-lg overflow-hidden bg-zinc-950 border border-zinc-800 hover:border-blue-500/50 transition-all"
            >
              <video src={video} className="w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-opacity" />
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
      
      <div className="p-4 rounded-lg bg-zinc-800/50 border border-zinc-800 mt-4">
        <p className="text-xs text-zinc-400 text-center">
           Drag & Drop local files not supported in demo. Use the samples above.
        </p>
      </div>
    </div>
  );
};

export default MediaPanel;
