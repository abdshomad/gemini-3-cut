import React, { useState } from 'react';
import { Download, Settings, Share2, PlayCircle, Scissors } from 'lucide-react';
import { useEditor } from '../context/EditorContext';

const Header = () => {
    const { state } = useEditor();
    const [isExporting, setIsExporting] = useState(false);

    const handleExport = () => {
        setIsExporting(true);
        setTimeout(() => {
            setIsExporting(false);
            alert("Export simulation complete!");
        }, 2000);
    };

  return (
    <header className="h-14 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between px-4 z-50">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Scissors size={20} className="text-white" />
        </div>
        <h1 className="font-bold text-lg tracking-tight text-white">Gemini 3 Cut</h1>
        <span className="text-xs bg-zinc-800 px-2 py-0.5 rounded text-zinc-400 border border-zinc-700">Beta</span>
      </div>

      <div className="absolute left-1/2 -translate-x-1/2">
          <div className="text-sm text-zinc-400 font-medium bg-zinc-900 px-4 py-1.5 rounded-full border border-zinc-800">
             {state.project.name}
          </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-full transition-colors">
            <Settings size={18} />
        </button>
        <button 
            onClick={handleExport}
            disabled={isExporting}
            className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-4 py-2 rounded-md flex items-center gap-2 transition-all"
        >
            {isExporting ? (
                <>Processing...</>
            ) : (
                <>
                    <Download size={16} /> Export
                </>
            )}
        </button>
      </div>
    </header>
  );
};

export default Header;