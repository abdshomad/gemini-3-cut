import React from 'react';
import { useEditor } from '../../context/EditorContext';
import { Trash2, Layers } from 'lucide-react';
import { TransformSection, TextSection, AudioSection } from './PropertySections';

const PropertiesPanel = () => {
  const { state, dispatch, getSelectedClip } = useEditor();
  const clip = getSelectedClip();

  if (!clip) {
    return (
      <div className="w-72 bg-zinc-900 border-l border-zinc-800 p-6 flex flex-col items-center justify-center text-center text-zinc-500">
        <Layers size={48} className="mb-4 opacity-20" />
        <p className="text-sm">Select a clip in the timeline to edit its properties.</p>
      </div>
    );
  }

  const updateProp = (key: string, value: any) => {
    dispatch({
      type: 'UPDATE_CLIP',
      payload: { clipId: clip.id, updates: { properties: { ...clip.properties, [key]: value } } }
    });
  };

  const updateRoot = (key: string, value: any) => {
    dispatch({
      type: 'UPDATE_CLIP',
      payload: { clipId: clip.id, updates: { [key]: value } }
    });
  };

  return (
    <div className="w-72 bg-zinc-900 border-l border-zinc-800 flex flex-col overflow-y-auto h-full z-30 shadow-xl">
      <div className="p-4 border-b border-zinc-800 bg-zinc-900 sticky top-0 z-10">
        <div className="flex items-center justify-between mb-2">
          <div className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">{clip.type}</div>
          <button onClick={() => dispatch({ type: 'DELETE_CLIP', payload: clip.id })} className="text-zinc-500 hover:text-red-400 p-1 transition-colors">
            <Trash2 size={14} />
          </button>
        </div>
        <input
          className="bg-transparent text-sm font-medium text-white focus:bg-zinc-800 outline-none border border-transparent focus:border-zinc-700 rounded w-full px-1"
          value={clip.name}
          onChange={(e) => updateRoot('name', e.target.value)}
        />
      </div>

      <div className="p-4 space-y-6 pb-20">
        <TransformSection clip={clip} updateProp={updateProp} updateRoot={updateRoot} />
        {clip.type === 'text' && <TextSection clip={clip} updateProp={updateProp} updateRoot={updateRoot} />}
        {(clip.type === 'audio' || clip.type === 'video') && <AudioSection clip={clip} updateProp={updateProp} updateRoot={updateRoot} />}
      </div>
    </div>
  );
};

export default PropertiesPanel;