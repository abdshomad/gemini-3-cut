import React, { useState } from 'react';
import { Film, Sparkles, Type, Music, Sticker, Smile } from 'lucide-react';
import MediaPanel from './panels/MediaPanel';
import AudioPanel from './panels/AudioPanel';
import TextPanel from './panels/TextPanel';
import AIPanel from './panels/AIPanel';

type Tab = 'media' | 'audio' | 'text' | 'ai';

const Sidebar = () => {
  const [activeTab, setActiveTab] = useState<Tab>('media');

  const TabButton = ({ id, label, icon: Icon, color = 'text-zinc-400' }: { id: Tab, label: string, icon: any, color?: string }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex-1 py-3 flex flex-col items-center justify-center gap-1 text-[10px] font-medium transition-colors border-b-2 
        ${activeTab === id 
            ? `text-white bg-zinc-800/50 border-${color.split('-')[1]}-500` 
            : 'text-zinc-500 border-transparent hover:text-zinc-300 hover:bg-zinc-900'}`}
    >
      <Icon size={18} className={activeTab === id ? color : 'text-zinc-500'} />
      {label}
    </button>
  );

  return (
    <div className="w-80 flex flex-col bg-zinc-900 border-r border-zinc-800 h-full z-40">
      <div className="grid grid-cols-4 border-b border-zinc-800 bg-zinc-950">
        <TabButton id="media" label="Media" icon={Film} color="text-blue-400" />
        <TabButton id="audio" label="Audio" icon={Music} color="text-green-400" />
        <TabButton id="text" label="Text" icon={Type} color="text-yellow-400" />
        <TabButton id="ai" label="AI" icon={Sparkles} color="text-purple-400" />
      </div>

      <div className="flex-1 overflow-y-auto p-4 scrollbar-thin bg-zinc-900">
        {activeTab === 'media' && <MediaPanel />}
        {activeTab === 'audio' && <AudioPanel />}
        {activeTab === 'text' && <TextPanel />}
        {activeTab === 'ai' && <AIPanel />}
      </div>
    </div>
  );
};

export default Sidebar;