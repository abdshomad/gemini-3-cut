import React from 'react';
import { useEditor } from '../../../context/EditorContext';
import { SAMPLE_STICKERS } from '../../../constants';
import { Plus, Type } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

const TextPanel = () => {
  const { dispatch, state } = useEditor();

  const addText = (preset: string = 'Default Text', fontSize: number = 48, color: string = '#ffffff') => {
    const newClip: any = {
      id: uuidv4(),
      trackId: state.project.tracks[1].id,
      type: 'text',
      text: preset,
      name: 'Text Layer',
      start: state.currentTime,
      duration: 3,
      offset: 0,
      properties: { x: 0, y: 0, scale: 1, opacity: 1, rotation: 0, color, fontSize, fontFamily: 'Inter' }
    };
    dispatch({ type: 'ADD_CLIP', payload: { trackId: state.project.tracks[1].id, clip: newClip } });
  };

  const addSticker = (src: string) => {
      const newClip: any = {
        id: uuidv4(),
        trackId: state.project.tracks[1].id, // Put stickers on text/overlay track
        type: 'image', // Treat stickers as images for rendering
        src,
        name: 'Sticker',
        start: state.currentTime,
        duration: 3,
        offset: 0,
        properties: { x: 0, y: 0, scale: 0.5, opacity: 1, rotation: 0 }
      };
      dispatch({ type: 'ADD_CLIP', payload: { trackId: state.project.tracks[1].id, clip: newClip } });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Text Presets</h3>
        <div className="grid grid-cols-2 gap-2">
             <button 
                onClick={() => addText('Heading', 64, '#ffffff')}
                className="h-20 bg-zinc-800 border border-zinc-700 rounded-lg flex items-center justify-center hover:border-yellow-500 transition-colors"
             >
                 <span className="text-2xl font-bold text-white">Title</span>
             </button>
             <button 
                onClick={() => addText('Subtitle', 32, '#cccccc')}
                className="h-20 bg-zinc-800 border border-zinc-700 rounded-lg flex items-center justify-center hover:border-yellow-500 transition-colors"
             >
                 <span className="text-lg font-medium text-zinc-300">Subtitle</span>
             </button>
              <button 
                onClick={() => addText('Body Text', 24, '#ffffff')}
                className="h-20 bg-zinc-800 border border-zinc-700 rounded-lg flex items-center justify-center hover:border-yellow-500 transition-colors"
             >
                 <span className="text-sm text-zinc-400">Body Text</span>
             </button>
              <button 
                onClick={() => addText('NEON', 64, '#00ff00')}
                className="h-20 bg-zinc-900 border border-zinc-700 rounded-lg flex items-center justify-center hover:border-yellow-500 transition-colors"
             >
                 <span className="text-xl font-bold text-green-400 drop-shadow-[0_0_10px_rgba(74,222,128,0.8)]">NEON</span>
             </button>
        </div>
      </div>

      <div>
        <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Stickers</h3>
        <div className="grid grid-cols-4 gap-2">
          {SAMPLE_STICKERS.map((sticker, idx) => (
            <button
              key={idx}
              onClick={() => addSticker(sticker)}
              className="aspect-square bg-zinc-800 rounded-lg p-2 hover:bg-zinc-700 transition-colors flex items-center justify-center"
            >
              <img src={sticker} alt="sticker" className="w-full h-full object-contain" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TextPanel;