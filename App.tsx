import React from 'react';
import Header from './components/Header';
import Sidebar from './components/sidebar/Sidebar';
import VideoPlayer from './components/player/VideoPlayer';
import Timeline from './components/timeline/Timeline';
import PropertiesPanel from './components/properties/PropertiesPanel';
import { EditorProvider } from './context/EditorContext';

const App = () => {
  return (
    <EditorProvider>
        <div className="h-screen w-screen flex flex-col bg-zinc-950 text-zinc-100 overflow-hidden font-sans select-none">
        <Header />
        
        <div className="flex-1 flex overflow-hidden">
            {/* Left Sidebar */}
            <Sidebar />
            
            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0">
            {/* Player Area */}
            <div className="flex-1 flex bg-black relative">
                <VideoPlayer />
                <PropertiesPanel />
            </div>
            
            {/* Timeline Area */}
            <Timeline />
            </div>
        </div>
        </div>
    </EditorProvider>
  );
};

export default App;
