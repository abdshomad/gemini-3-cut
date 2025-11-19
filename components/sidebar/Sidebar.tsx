import React, { useState } from 'react';
import { Film, Type, Music, Sparkles, Video, Images } from 'lucide-react';
import MediaPanel from './panels/MediaPanel';
import AIPanel from './panels/AIPanel';
import { useEditor } from '../../context/EditorContext';
import { Clip } from '../../types';
import { v4 as uuidv4 } from 'uuid';

const Sidebar = () => {
  const [activeTab, setActiveTab] = useState<'media' | 'ai'>('media');

  return (
    <div className="w-80 flex flex-col bg-zinc-900 border-r border-zinc-800 h-full">
      <div className="flex border-b border-zinc-800">
        <button
          onClick={() => setActiveTab('media')}
          className={`flex-1 py-4 flex flex-col items-center justify-center gap-2 text-xs font-medium transition-colors ${
            activeTab === 'media' ? 'text-blue-400 bg-zinc-800/50' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Film size={20} />
          Media
        </button>
        <button
          onClick={() => setActiveTab('ai')}
          className={`flex-1 py-4 flex flex-col items-center justify-center gap-2 text-xs font-medium transition-colors ${
            activeTab === 'ai' ? 'text-purple-400 bg-zinc-800/50' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Sparkles size={20} />
          AI Tools
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 scrollbar-thin">
        {activeTab === 'media' && <MediaPanel />}
        {activeTab === 'ai' && <AIPanel />}
      </div>
    </div>
  );
};

export default Sidebar;
