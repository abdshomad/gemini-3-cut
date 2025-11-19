import React from 'react';
import { Track, Clip } from '../../types';
import { useEditor } from '../../context/EditorContext';

interface TrackItemProps {
  track: Track;
}

const TrackItem: React.FC<TrackItemProps> = ({ track }) => {
  const { state, dispatch } = useEditor();

  const handleClipClick = (e: React.MouseEvent, clipId: string) => {
    e.stopPropagation();
    dispatch({ type: 'SET_SELECTED_CLIP', payload: clipId });
  };

  return (
    <div className="h-24 border-b border-zinc-800 relative bg-zinc-900/50">
        {track.clips.map(clip => {
            const isSelected = state.selectedClipId === clip.id;
            return (
                <div
                    key={clip.id}
                    onClick={(e) => handleClipClick(e, clip.id)}
                    className={`absolute top-2 bottom-2 rounded-md border overflow-hidden cursor-pointer transition-colors group
                        ${isSelected 
                            ? 'border-yellow-500 ring-1 ring-yellow-500 bg-zinc-700' 
                            : 'border-zinc-700 bg-zinc-800 hover:border-zinc-500'}
                    `}
                    style={{
                        left: clip.start * state.zoomLevel,
                        width: clip.duration * state.zoomLevel,
                    }}
                >
                    {/* Clip Content Preview */}
                    <div className="h-full w-full flex flex-col px-2 py-1">
                        <span className="text-xs text-white font-medium truncate shadow-black drop-shadow-md">{clip.name}</span>
                        {clip.type === 'video' && (
                            <div className="flex-1 opacity-30 flex items-center overflow-hidden gap-1 mt-1">
                                {/* Simulated thumbnails */}
                                {Array.from({length: 5}).map((_, i) => (
                                    <div key={i} className="h-full aspect-video bg-zinc-600 rounded-sm"></div>
                                ))}
                            </div>
                        )}
                        {clip.type === 'text' && (
                             <div className="flex-1 flex items-center justify-center text-[10px] text-zinc-400">
                                 T
                             </div>
                        )}
                    </div>

                    {/* Drag Handles (Visual Only for Demo) */}
                    {isSelected && (
                        <>
                             <div className="absolute left-0 top-0 bottom-0 w-2 bg-yellow-500/50 cursor-w-resize hover:bg-yellow-500"></div>
                             <div className="absolute right-0 top-0 bottom-0 w-2 bg-yellow-500/50 cursor-e-resize hover:bg-yellow-500"></div>
                        </>
                    )}
                </div>
            );
        })}
    </div>
  );
};

export default TrackItem;
