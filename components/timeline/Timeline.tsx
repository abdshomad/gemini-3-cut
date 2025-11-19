import React, { useRef, useState } from 'react';
import { useEditor } from '../../context/EditorContext';
import TrackItem from './TrackItem';
import { Play, Pause, SkipBack, SkipForward, ZoomIn, ZoomOut, Scissors } from 'lucide-react';

const Timeline = () => {
  const { state, dispatch } = useEditor();
  const timelineRef = useRef<HTMLDivElement>(null);

  const handleTimelineClick = (e: React.MouseEvent) => {
      if (!timelineRef.current) return;
      const rect = timelineRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const scrollLeft = timelineRef.current.scrollLeft;
      const time = (x + scrollLeft) / state.zoomLevel;
      dispatch({ type: 'SET_CURRENT_TIME', payload: time });
  };

  const formatTime = (seconds: number) => {
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      const ms = Math.floor((seconds % 1) * 100);
      return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-1/3 bg-zinc-900 border-t border-zinc-800 flex flex-col z-30">
      {/* Timeline Toolbar */}
      <div className="h-12 border-b border-zinc-800 flex items-center px-4 justify-between bg-zinc-900 select-none">
         <div className="flex items-center gap-4">
             <span className="text-mono font-bold text-blue-400 text-lg w-28">{formatTime(state.currentTime)}</span>
             <div className="h-6 w-px bg-zinc-700 mx-2"></div>
             <button 
                onClick={() => dispatch({ type: 'SPLIT_CLIP' })}
                className={`flex items-center gap-1 px-3 py-1 rounded text-xs font-medium transition-colors ${state.selectedClipId ? 'bg-zinc-800 text-white hover:bg-zinc-700' : 'text-zinc-600 cursor-not-allowed'}`}
                disabled={!state.selectedClipId}
             >
                 <Scissors size={14} /> Split
             </button>
         </div>
         
         <div className="flex items-center gap-4">
             <button onClick={() => dispatch({ type: 'SET_CURRENT_TIME', payload: 0 })} className="text-zinc-400 hover:text-white"><SkipBack size={18} /></button>
             <button 
                onClick={() => dispatch({ type: 'TOGGLE_PLAYBACK' })}
                className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:bg-zinc-200 transition-colors"
             >
                 {state.isPlaying ? <Pause fill="black" size={18} /> : <Play fill="black" className="ml-1" size={18} />}
             </button>
             <button className="text-zinc-400 hover:text-white"><SkipForward size={18} /></button>
         </div>

         <div className="flex items-center gap-2">
             <button onClick={() => dispatch({ type: 'SET_ZOOM', payload: Math.max(5, state.zoomLevel - 5) })} className="p-2 hover:bg-zinc-800 rounded text-zinc-400"><ZoomOut size={16} /></button>
             <input 
                type="range" 
                min="5" 
                max="100" 
                value={state.zoomLevel} 
                onChange={(e) => dispatch({ type: 'SET_ZOOM', payload: Number(e.target.value) })}
                className="w-24 accent-zinc-500"
            />
             <button onClick={() => dispatch({ type: 'SET_ZOOM', payload: Math.min(200, state.zoomLevel + 5) })} className="p-2 hover:bg-zinc-800 rounded text-zinc-400"><ZoomIn size={16} /></button>
         </div>
      </div>

      {/* Tracks Container */}
      <div className="flex-1 flex overflow-hidden">
          {/* Track Headers */}
          <div className="w-64 bg-zinc-900 border-r border-zinc-800 flex-shrink-0 z-20 shadow-lg">
              <div className="h-8 bg-zinc-900 border-b border-zinc-800"></div> {/* Ruler spacer */}
              {state.project.tracks.map(track => (
                  <div key={track.id} className="h-24 border-b border-zinc-800 p-3 flex flex-col justify-center relative">
                      <div className="font-medium text-sm text-zinc-300">{track.name}</div>
                      <div className="flex gap-2 mt-2">
                          <button className="text-zinc-600 hover:text-zinc-400 text-xs bg-zinc-800 px-2 py-1 rounded">M</button>
                          <button className="text-zinc-600 hover:text-zinc-400 text-xs bg-zinc-800 px-2 py-1 rounded">H</button>
                      </div>
                  </div>
              ))}
          </div>

          {/* Ruler & Clips Area */}
          <div 
            className="flex-1 overflow-x-auto overflow-y-hidden relative scrollbar-thin"
            ref={timelineRef}
          >
               <div 
                className="h-full relative bg-zinc-900/50"
                style={{ width: `${Math.max(state.project.duration * state.zoomLevel, 2000)}px` }}
               >
                   {/* Ruler */}
                   <div 
                        className="h-8 border-b border-zinc-800 bg-zinc-900 sticky top-0 z-10 cursor-pointer"
                        onClick={handleTimelineClick}
                    >
                        {Array.from({ length: Math.ceil(state.project.duration) + 1 }).map((_, i) => (
                            <div 
                                key={i} 
                                className="absolute top-0 bottom-0 border-l border-zinc-700 text-[10px] text-zinc-500 pl-1 pt-1 select-none"
                                style={{ left: i * state.zoomLevel }}
                            >
                                {i % 5 === 0 ? i + 's' : ''}
                            </div>
                        ))}
                        
                        <div 
                            className="absolute top-0 h-full w-4 -ml-2 flex justify-center z-20 pointer-events-none"
                             style={{ left: state.currentTime * state.zoomLevel }}
                        >
                            <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-blue-500"></div>
                        </div>
                   </div>

                   {/* Playhead Line */}
                   <div 
                        className="absolute top-0 bottom-0 w-px bg-blue-500 z-30 pointer-events-none"
                        style={{ left: state.currentTime * state.zoomLevel }}
                   ></div>

                   {/* Track Rows */}
                   {state.project.tracks.map(track => (
                       <TrackItem key={track.id} track={track} />
                   ))}
               </div>
          </div>
      </div>
    </div>
  );
};

export default Timeline;