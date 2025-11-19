import React, { useRef } from 'react';
import { Track, Clip } from '../../types';
import { useEditor } from '../../context/EditorContext';

interface TrackItemProps {
  track: Track;
}

const TrackItem: React.FC<TrackItemProps> = ({ track }) => {
  const { state, dispatch } = useEditor();
  const dragStartRef = useRef<number | null>(null);
  const originalClipRef = useRef<Clip | null>(null);

  const handleClipClick = (e: React.MouseEvent, clipId: string) => {
    e.stopPropagation();
    dispatch({ type: 'SET_SELECTED_CLIP', payload: clipId });
  };

  const handleResizeStart = (e: React.MouseEvent, clip: Clip, edge: 'left' | 'right') => {
    e.stopPropagation();
    e.preventDefault();
    dragStartRef.current = e.clientX;
    originalClipRef.current = { ...clip };

    const handleMouseMove = (moveEvent: MouseEvent) => {
        if (dragStartRef.current === null || !originalClipRef.current) return;
        
        const deltaPixels = moveEvent.clientX - dragStartRef.current;
        const deltaSeconds = deltaPixels / state.zoomLevel;
        
        const original = originalClipRef.current;

        if (edge === 'left') {
             const newStart = Math.max(0, original.start + deltaSeconds);
             const change = newStart - original.start;
             const newDuration = Math.max(0.1, original.duration - change);
             const newOffset = original.offset + change;
             
             // Only allow if duration > 0.1 and start >= 0
             if (newDuration > 0.1 && newStart >= 0) {
                 dispatch({
                     type: 'UPDATE_CLIP',
                     payload: { clipId: clip.id, updates: { start: newStart, duration: newDuration, offset: newOffset } }
                 });
             }
        } else {
             const newDuration = Math.max(0.1, original.duration + deltaSeconds);
             dispatch({
                 type: 'UPDATE_CLIP',
                 payload: { clipId: clip.id, updates: { duration: newDuration } }
             });
        }
    };

    const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        dragStartRef.current = null;
        originalClipRef.current = null;
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div className="h-24 border-b border-zinc-800 relative bg-zinc-900/20">
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
                    <div className="h-full w-full flex flex-col px-2 py-1 select-none pointer-events-none">
                        <span className="text-xs text-white font-medium truncate drop-shadow-md">{clip.name}</span>
                        {clip.type === 'video' && (
                            <div className="flex-1 opacity-30 flex items-center overflow-hidden gap-1 mt-1">
                                {Array.from({length: 5}).map((_, i) => (
                                    <div key={i} className="h-full aspect-video bg-zinc-600 rounded-sm"></div>
                                ))}
                            </div>
                        )}
                        {clip.type === 'audio' && (
                            <div className="flex-1 flex items-center opacity-50">
                                 <div className="w-full h-4 bg-repeat-x" style={{ backgroundImage: 'linear-gradient(90deg, transparent 0%, transparent 49%, #fff 50%, transparent 51%)', backgroundSize: '10px 100%' }}></div>
                            </div>
                        )}
                    </div>

                    {/* Drag Handles */}
                    {isSelected && (
                        <>
                             <div 
                                onMouseDown={(e) => handleResizeStart(e, clip, 'left')}
                                className="absolute left-0 top-0 bottom-0 w-4 bg-yellow-500/50 hover:bg-yellow-500 cursor-w-resize flex items-center justify-center z-20"
                             >
                                 <div className="h-4 w-px bg-black/50"></div>
                             </div>
                             <div 
                                onMouseDown={(e) => handleResizeStart(e, clip, 'right')}
                                className="absolute right-0 top-0 bottom-0 w-4 bg-yellow-500/50 hover:bg-yellow-500 cursor-e-resize flex items-center justify-center z-20"
                             >
                                 <div className="h-4 w-px bg-black/50"></div>
                             </div>
                        </>
                    )}
                </div>
            );
        })}
    </div>
  );
};

export default TrackItem;