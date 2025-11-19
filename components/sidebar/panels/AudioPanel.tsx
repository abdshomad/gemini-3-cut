import React from 'react';
import { useEditor } from '../../../context/EditorContext';
import { SAMPLE_AUDIO, SAMPLE_SFX } from '../../../constants';
import { Play, Plus } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface AudioItemProps {
  item: { name: string; src: string };
  onAdd: (src: string, name: string) => void;
}

const AudioItem: React.FC<AudioItemProps> = ({ item, onAdd }) => (
  <div className="group flex items-center justify-between p-3 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 transition-all">
    <div className="flex items-center gap-3 overflow-hidden">
      <div className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-500 group-hover:text-green-400">
        <Play size={12} fill="currentColor" />
      </div>
      <span className="text-sm font-medium text-zinc-300 truncate">{item.name}</span>
    </div>
    <button 
      onClick={() => onAdd(item.src, item.name)}
      className="p-1.5 rounded-md bg-zinc-700 text-zinc-400 hover:text-white hover:bg-green-600 transition-colors"
    >
      <Plus size={14} />
    </button>
  </div>
);

const AudioPanel = () => {
  const { dispatch, state } = useEditor();

  const addAudio = (src: string, name: string) => {
    const newClip: any = {
      id: uuidv4(),
      trackId: state.project.tracks[2].id, // Audio track
      type: 'audio',
      src,
      name: name,
      start: state.currentTime,
      duration: 10, // Default duration, should ideally be detected
      offset: 0,
      properties: { volume: 1, fadeIn: 0, fadeOut: 0 }
    };
    dispatch({ type: 'ADD_CLIP', payload: { trackId: state.project.tracks[2].id, clip: newClip } });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Music</h3>
        <div className="space-y-2">
          {SAMPLE_AUDIO.map((audio, idx) => (
            <AudioItem key={idx} item={audio} onAdd={addAudio} />
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Sound Effects</h3>
        <div className="space-y-2">
          {SAMPLE_SFX.map((sfx, idx) => (
            <AudioItem key={idx} item={sfx} onAdd={addAudio} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AudioPanel;