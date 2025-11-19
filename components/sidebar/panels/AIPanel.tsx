import React, { useState } from 'react';
import { Sparkles, Loader2, Wand2, MessageSquare, Image as ImageIcon, Mic } from 'lucide-react';
import { generateScript, generateImage, generateSpeech } from '../../../services/geminiService';
import { useEditor } from '../../../context/EditorContext';
import { v4 as uuidv4 } from 'uuid';

const AIPanel = () => {
  const { dispatch, state } = useEditor();
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'script' | 'image' | 'audio'>('script');
  const [result, setResult] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt) return;
    setLoading(true);
    setResult(null);
    
    try {
      if (mode === 'script') {
        const text = await generateScript(prompt);
        setResult(text);
      } else if (mode === 'image') {
        const url = await generateImage(prompt);
        if (url) {
             const newClip: any = {
                id: uuidv4(),
                trackId: state.project.tracks[0].id,
                type: 'image',
                src: url,
                name: `AI Image: ${prompt.slice(0, 10)}...`,
                start: state.currentTime,
                duration: 5,
                offset: 0,
                properties: { x: 0, y: 0, scale: 1, opacity: 1, rotation: 0 }
            };
            dispatch({ type: 'ADD_CLIP', payload: { trackId: state.project.tracks[0].id, clip: newClip } });
            setResult("Image added to timeline!");
        }
      } else if (mode === 'audio') {
          const audioUrl = await generateSpeech(prompt);
          if (audioUrl) {
            const newClip: any = {
                id: uuidv4(),
                trackId: state.project.tracks[2].id, // Audio track
                type: 'audio',
                src: audioUrl,
                name: `AI Speech`,
                start: state.currentTime,
                duration: 5, // Approximate, ideally we detect metadata
                offset: 0,
                properties: { x: 0, y: 0, scale: 1, opacity: 1, rotation: 0, volume: 1 }
            };
            dispatch({ type: 'ADD_CLIP', payload: { trackId: state.project.tracks[2].id, clip: newClip } });
            setResult("Voiceover added to timeline!");
          }
      }
    } catch (e) {
      setResult("Error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const addScriptAsText = () => {
      if(!result) return;
      const newClip: any = {
          id: uuidv4(),
          trackId: state.project.tracks[1].id,
          type: 'text',
          text: result,
          name: 'AI Script',
          start: state.currentTime,
          duration: 5,
          offset: 0,
          properties: { x: 0, y: 0, scale: 1, opacity: 1, rotation: 0, color: '#ffffff', fontSize: 24 }
      };
      dispatch({ type: 'ADD_CLIP', payload: { trackId: state.project.tracks[1].id, clip: newClip } });
  };

  return (
    <div className="space-y-6">
        <div className="flex gap-2 bg-zinc-800 p-1 rounded-lg">
            <button 
                onClick={() => setMode('script')}
                className={`flex-1 py-2 rounded text-xs font-medium flex items-center justify-center gap-1 ${mode === 'script' ? 'bg-zinc-700 text-white shadow' : 'text-zinc-400 hover:text-zinc-200'}`}>
                <MessageSquare size={14} /> Script
            </button>
            <button 
                onClick={() => setMode('image')}
                className={`flex-1 py-2 rounded text-xs font-medium flex items-center justify-center gap-1 ${mode === 'image' ? 'bg-zinc-700 text-white shadow' : 'text-zinc-400 hover:text-zinc-200'}`}>
                <ImageIcon size={14} /> Image
            </button>
            <button 
                onClick={() => setMode('audio')}
                className={`flex-1 py-2 rounded text-xs font-medium flex items-center justify-center gap-1 ${mode === 'audio' ? 'bg-zinc-700 text-white shadow' : 'text-zinc-400 hover:text-zinc-200'}`}>
                <Mic size={14} /> Voice
            </button>
        </div>

      <div className="space-y-3">
        <label className="text-xs font-semibold text-zinc-400">
            {mode === 'script' ? 'What is the video about?' : mode === 'image' ? 'Describe the image' : 'Text to speak'}
        </label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={mode === 'script' ? "A serene nature documentary..." : "A futuristic city..."}
          className="w-full h-32 bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-sm text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none"
        />
      </div>

      <button
        disabled={loading || !prompt}
        onClick={handleGenerate}
        className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-medium rounded-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
        {loading ? 'Generating...' : 'Generate with Gemini'}
      </button>

      {result && mode === 'script' && (
        <div className="p-4 bg-zinc-800/50 rounded-lg border border-zinc-800 space-y-3">
          <h4 className="text-xs font-semibold text-zinc-400">Result:</h4>
          <p className="text-sm text-zinc-200 leading-relaxed">{result}</p>
          <button onClick={addScriptAsText} className="text-xs text-purple-400 hover:text-purple-300 font-medium flex items-center gap-1">
            <PlusSmall /> Add as Text Layer
          </button>
        </div>
      )}
       {result && mode !== 'script' && (
        <div className="p-4 bg-green-900/20 rounded-lg border border-green-900/50">
            <p className="text-sm text-green-400">{result}</p>
        </div>
      )}
    </div>
  );
};

const PlusSmall = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
);

export default AIPanel;
