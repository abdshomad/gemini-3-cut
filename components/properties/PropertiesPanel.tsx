import React from 'react';
import { useEditor } from '../../context/EditorContext';
import { Trash2, Volume2, Type as TypeIcon, Layers } from 'lucide-react';
import { Clip } from '../../types';

interface SectionProps {
  clip: Clip;
  updateProp: (key: string, value: any) => void;
  updateRoot: (key: string, value: any) => void;
}

const TransformSection: React.FC<SectionProps> = ({ clip, updateProp }) => (
  <div className="space-y-4">
    <h3 className="text-xs font-bold text-zinc-500 uppercase">Transform</h3>
    <div className="grid grid-cols-2 gap-3">
      {['scale', 'rotation', 'x', 'y'].map((prop) => (
        <div key={prop} className="space-y-1">
          <label className="text-[10px] text-zinc-400 capitalize">{prop === 'scale' ? 'Scale' : prop === 'rotation' ? 'Rotation' : `${prop.toUpperCase()} Position`}</label>
          <input
            type="number"
            step={prop === 'scale' ? "0.1" : "1"}
            value={clip.properties[prop as keyof typeof clip.properties]}
            onChange={(e) => updateProp(prop, parseFloat(e.target.value))}
            className="w-full bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-xs text-white"
          />
        </div>
      ))}
    </div>
    <div className="space-y-1">
      <div className="flex justify-between">
        <label className="text-[10px] text-zinc-400">Opacity</label>
        <span className="text-[10px] text-zinc-400">{Math.round(clip.properties.opacity * 100)}%</span>
      </div>
      <input
        type="range" min="0" max="1" step="0.01"
        value={clip.properties.opacity}
        onChange={(e) => updateProp('opacity', parseFloat(e.target.value))}
        className="w-full accent-blue-500 h-1 bg-zinc-700 rounded-full appearance-none"
      />
    </div>
  </div>
);

const TextSection: React.FC<SectionProps> = ({ clip, updateRoot, updateProp }) => (
  <div className="space-y-4 pt-4 border-t border-zinc-800">
    <h3 className="text-xs font-bold text-zinc-500 uppercase flex items-center gap-2"><TypeIcon size={12} /> Text</h3>
    <div className="space-y-2">
      <textarea
        value={clip.text || ''}
        onChange={(e) => updateRoot('text', e.target.value)}
        className="w-full bg-zinc-800 border border-zinc-700 rounded p-2 text-sm text-white resize-y min-h-[60px]"
      />
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-[10px] text-zinc-400">Font Size</label>
          <input
            type="number"
            value={clip.properties.fontSize}
            onChange={(e) => updateProp('fontSize', parseFloat(e.target.value))}
            className="w-full bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-xs text-white"
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] text-zinc-400">Color</label>
          <input
            type="color"
            value={clip.properties.color}
            onChange={(e) => updateProp('color', e.target.value)}
            className="w-full h-6 bg-zinc-800 border border-zinc-700 rounded cursor-pointer"
          />
        </div>
      </div>
    </div>
  </div>
);

const AudioSection: React.FC<SectionProps> = ({ clip, updateProp }) => (
  <div className="space-y-4 pt-4 border-t border-zinc-800">
    <h3 className="text-xs font-bold text-zinc-500 uppercase flex items-center gap-2"><Volume2 size={12} /> Audio</h3>
    <div className="space-y-1">
      <div className="flex justify-between">
        <label className="text-[10px] text-zinc-400">Volume</label>
        <span className="text-[10px] text-zinc-400">{Math.round((clip.properties.volume || 1) * 100)}%</span>
      </div>
      <input
        type="range" min="0" max="1" step="0.01"
        value={clip.properties.volume ?? 1}
        onChange={(e) => updateProp('volume', parseFloat(e.target.value))}
        className="w-full accent-blue-500 h-1 bg-zinc-700 rounded-full appearance-none"
      />
    </div>
  </div>
);

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
    <div className="w-72 bg-zinc-900 border-l border-zinc-800 flex flex-col overflow-y-auto">
      <div className="p-4 border-b border-zinc-800">
        <div className="flex items-center justify-between mb-1">
          <h2 className="font-semibold text-sm text-white">{clip.type.toUpperCase()} CLIP</h2>
          <button onClick={() => dispatch({ type: 'DELETE_CLIP', payload: clip.id })} className="text-red-400 hover:text-red-300 p-1">
            <Trash2 size={16} />
          </button>
        </div>
        <input
          className="bg-transparent text-xs text-zinc-400 focus:text-white outline-none border-none w-full"
          value={clip.name}
          onChange={(e) => updateRoot('name', e.target.value)}
        />
      </div>

      <div className="p-4 space-y-6">
        <TransformSection clip={clip} updateProp={updateProp} updateRoot={updateRoot} />
        {clip.type === 'text' && <TextSection clip={clip} updateProp={updateProp} updateRoot={updateRoot} />}
        {(clip.type === 'video' || clip.type === 'audio') && <AudioSection clip={clip} updateProp={updateProp} updateRoot={updateRoot} />}
      </div>
    </div>
  );
};

export default PropertiesPanel;