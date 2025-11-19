import React, { createContext, useContext, useReducer, ReactNode, useCallback } from 'react';
import { Project, Track, Clip, EditorTool, EditorState } from '../types';
import { DEFAULT_PROJECT } from '../constants';
import { v4 as uuidv4 } from 'uuid';

type Action =
  | { type: 'SET_PROJECT'; payload: Project }
  | { type: 'SET_CURRENT_TIME'; payload: number }
  | { type: 'TOGGLE_PLAYBACK' }
  | { type: 'SET_SELECTED_CLIP'; payload: string | null }
  | { type: 'ADD_CLIP'; payload: { trackId: string; clip: Clip } }
  | { type: 'UPDATE_CLIP'; payload: { clipId: string; updates: Partial<Clip> } }
  | { type: 'DELETE_CLIP'; payload: string }
  | { type: 'SPLIT_CLIP' }
  | { type: 'SET_TOOL'; payload: EditorTool }
  | { type: 'SET_ZOOM'; payload: number };

const initialState: EditorState = {
  project: DEFAULT_PROJECT,
  currentTime: 0,
  isPlaying: false,
  selectedClipId: null,
  activeTool: EditorTool.SELECT,
  zoomLevel: 20, // 20px per second
};

const editorReducer = (state: EditorState, action: Action): EditorState => {
  switch (action.type) {
    case 'SET_CURRENT_TIME':
      return { ...state, currentTime: Math.max(0, Math.min(state.project.duration, action.payload)) };
    case 'TOGGLE_PLAYBACK':
      return { ...state, isPlaying: !state.isPlaying };
    case 'SET_SELECTED_CLIP':
      return { ...state, selectedClipId: action.payload };
    case 'ADD_CLIP':
      const updatedTracksAdd = state.project.tracks.map(track => {
        if (track.id === action.payload.trackId) {
          return { ...track, clips: [...track.clips, action.payload.clip] };
        }
        return track;
      });
      return { ...state, project: { ...state.project, tracks: updatedTracksAdd } };
    case 'UPDATE_CLIP':
      const updatedTracksUpd = state.project.tracks.map(track => ({
        ...track,
        clips: track.clips.map(c => 
          c.id === action.payload.clipId ? { ...c, ...action.payload.updates } : c
        )
      }));
      return { ...state, project: { ...state.project, tracks: updatedTracksUpd } };
    case 'DELETE_CLIP':
       const updatedTracksDel = state.project.tracks.map(track => ({
        ...track,
        clips: track.clips.filter(c => c.id !== action.payload)
       }));
       return { 
           ...state, 
           project: { ...state.project, tracks: updatedTracksDel },
           selectedClipId: state.selectedClipId === action.payload ? null : state.selectedClipId
        };
    case 'SPLIT_CLIP':
        const clipToSplit = state.project.tracks
            .flatMap(t => t.clips)
            .find(c => c.id === state.selectedClipId);
        
        if (!clipToSplit) return state;
        
        // Validation: Playhead must be inside the clip
        if (state.currentTime <= clipToSplit.start || state.currentTime >= clipToSplit.start + clipToSplit.duration) {
            return state;
        }

        const splitPointRelative = state.currentTime - clipToSplit.start;
        const firstHalfDuration = splitPointRelative;
        const secondHalfDuration = clipToSplit.duration - splitPointRelative;

        const secondClip: Clip = {
            ...clipToSplit,
            id: uuidv4(),
            start: state.currentTime,
            duration: secondHalfDuration,
            offset: clipToSplit.offset + firstHalfDuration,
            name: `${clipToSplit.name} (Split)`
        };

        const updatedTracksSplit = state.project.tracks.map(track => {
            if (track.id === clipToSplit.trackId) {
                return {
                    ...track,
                    clips: [
                        ...track.clips.filter(c => c.id !== clipToSplit.id),
                        { ...clipToSplit, duration: firstHalfDuration },
                        secondClip
                    ]
                };
            }
            return track;
        });

        return { 
            ...state, 
            project: { ...state.project, tracks: updatedTracksSplit },
            selectedClipId: secondClip.id // Select the new part
        };

    case 'SET_TOOL':
        return { ...state, activeTool: action.payload };
    case 'SET_ZOOM':
        return { ...state, zoomLevel: action.payload };
    default:
      return state;
  }
};

const EditorContext = createContext<{
  state: EditorState;
  dispatch: React.Dispatch<Action>;
  getSelectedClip: () => Clip | undefined;
} | null>(null);

export const EditorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(editorReducer, initialState);

  const getSelectedClip = useCallback(() => {
    if (!state.selectedClipId) return undefined;
    for (const track of state.project.tracks) {
        const clip = track.clips.find(c => c.id === state.selectedClipId);
        if (clip) return clip;
    }
    return undefined;
  }, [state.project.tracks, state.selectedClipId]);

  return (
    <EditorContext.Provider value={{ state, dispatch, getSelectedClip }}>
      {children}
    </EditorContext.Provider>
  );
};

export const useEditor = () => {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error('useEditor must be used within an EditorProvider');
  }
  return context;
};