import React from 'react';
import { Clip } from '../../types';
import { Type as TypeIcon, Volume2, Move, Clock } from 'lucide-react';
import { FONTS } from '../../constants';

interface SectionProps {
  clip: Clip;
  updateProp: (key: string, value: any) => void;
  updateRoot: (key: string, value: any) => void;
}

export const TransformSection: React.FC<SectionProps> = ({ clip, updateProp }) => (
  <div className="space-y-4">
    <h3 className="text-xs font-bold text-zinc-500 uppercase flex items-center gap-2"><Move size={12} /> Transform</h3>
    <div className="grid grid-cols-2 gap-3">
      {['scale', 'rotation', 'x', 'y'].map((prop) => (
        <div key={prop} className="space-y-1">
          <label className="text-[10px] text-zinc-400 capitalize">{prop === 'scale' ? 'Scale' : prop === 'rotation' ? 'Rotation' : `${prop.toUpperCase()} Position`}</label>
          <input
            type="number"
            step={prop === 'scale' ? "0.1" : "10"}
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

export const TextSection: React.FC<SectionProps> = ({ clip, updateRoot, updateProp }) => (
  <div className="space-y-4 pt-4 border-t border-zinc-800">
    <h3 className="text-xs font-bold text-zinc-500 uppercase flex items-center gap-2"><TypeIcon size={12} /> Text</h3>
    <div className="space-y-2">
      <textarea
        value={clip.text || ''}
        onChange={(e) => updateRoot('text', e.target.value)}
        className="w-full bg-zinc-800 border border-zinc-700 rounded p-2 text-sm text-white resize-y min-h-[60px]"
      />
      <div className="space-y-1">
         <label className="text-[10px] text-zinc-400">Font Family</label>
         <select 
            value={clip.properties.fontFamily || 'Inter'}
            onChange={(e) => updateProp('fontFamily', e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-xs text-white"
         >
             {FONTS.map(f => <option key={f} value={f}>{f}</option>)}
         </select>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-[10px] text-zinc-400">Size</label>
          <input
            type="number"
            value={clip.properties.fontSize}
            onChange={(e) => updateProp('fontSize', parseFloat(e.target.value))}
            className="w-full bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-xs text-white"
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] text-zinc-400">Color</label>
          <div className="flex gap-2">
            <input
                type="color"
                value={clip.properties.color}
                onChange={(e) => updateProp('color', e.target.value)}
                className="h-6 w-8 bg-zinc-800 border border-zinc-700 rounded cursor-pointer p-0"
            />
            <input 
                type="text" 
                value={clip.properties.color} 
                onChange={(e) => updateProp('color', e.target.value)}
                className="flex-1 bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-xs text-white"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
);

export const AudioSection: React.FC<SectionProps> = ({ clip, updateProp }) => (
  <div className="space-y-4 pt-4 border-t border-zinc-800">
    <h3 className="text-xs font-bold text-zinc-500 uppercase flex items-center gap-2"><Volume2 size={12} /> Audio</h3>
    <div className="space-y-3">
      <div className="space-y-1">
        <div className="flex justify-between">
          <label className="text-[10px] text-zinc-400">Volume</label>
          <span className="text-[10px] text-zinc-400">{Math.round((clip.properties.volume || 1) * 100)}%</span>
        </div>
        <input
          type="range" min="0" max="1" step="0.01"
          value={clip.properties.volume ?? 1}
          onChange={(e) => updateProp('volume', parseFloat(e.target.value))}
          className="w-full accent-green-500 h-1 bg-zinc-700 rounded-full appearance-none"
        />
      </div>
      
      <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
              <label className="text-[10px] text-zinc-400">Fade In (s)</label>
              <input
                type="number" step="0.1" min="0"
                value={clip.properties.fadeIn || 0}
                onChange={(e) => updateProp('fadeIn', parseFloat(e.target.value))}
                className="w-full bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-xs text-white"
              />
          </div>
          <div className="space-y-1">
              <label className="text-[10px] text-zinc-400">Fade Out (s)</label>
              <input
                type="number" step="0.1" min="0"
                value={clip.properties.fadeOut || 0}
                onChange={(e) => updateProp('fadeOut', parseFloat(e.target.value))}
                className="w-full bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-xs text-white"
              />
          </div>
      </div>
    </div>
  </div>
);