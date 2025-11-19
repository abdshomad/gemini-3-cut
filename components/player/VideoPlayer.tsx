import React, { useRef, useEffect, useState } from 'react';
import { useEditor } from '../../context/EditorContext';
import { Clip, Project } from '../../types';

const VideoPlayer = () => {
  const { state, dispatch } = useEditor();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mediaRefs = useRef<{ [key: string]: HTMLVideoElement | HTMLImageElement | HTMLAudioElement }>({});
  const [scale, setScale] = useState(1);

  // Adjust canvas size to fit container
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current && canvasRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        const projectRatio = state.project.width / state.project.height;
        const containerRatio = width / height;

        let finalWidth, finalHeight;
        if (containerRatio > projectRatio) {
          finalHeight = height - 40; // Padding
          finalWidth = finalHeight * projectRatio;
        } else {
          finalWidth = width - 40;
          finalHeight = finalWidth / projectRatio;
        }
        
        setScale(finalWidth / state.project.width);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, [state.project.width, state.project.height]);

  // Main Rendering Loop
  useEffect(() => {
    let animationFrameId: number;
    const ctx = canvasRef.current?.getContext('2d');

    const render = () => {
      if (!ctx || !canvasRef.current) return;

      // Clear canvas
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      
      // Background
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);

      // Draw tracks from bottom to top (painter's algorithm)
      // We need to reverse tracks because usually track 1 is "bottom" but in UI it's top. 
      // Standard convention: Top track in timeline = Top layer.
      // Let's sort by ID or assumed index. In our state, index 0 is bottom most usually? 
      // Actually, common NLE: Track 1 (top visual) is obscure by Track 2? 
      // Let's assume visual stack order: index 0 is BACKGROUND, index N is FOREGROUND.
      const visibleTracks = [...state.project.tracks].reverse(); // Or whatever logic fits. Let's try standard order first.

      state.project.tracks.forEach((track) => {
        if (track.isHidden) return;

        const activeClip = track.clips.find(
          (clip) =>
            state.currentTime >= clip.start &&
            state.currentTime < clip.start + clip.duration
        );

        if (activeClip) {
          drawClip(ctx, activeClip, state.currentTime);
        } else {
            // Stop media if not active
            // Simplified for React: we handle play/pause in drawClip roughly or separate effect
        }
      });

      if (state.isPlaying) {
        dispatch({ type: 'SET_CURRENT_TIME', payload: state.currentTime + 1/60 });
        animationFrameId = requestAnimationFrame(render);
      }
    };

    if (state.isPlaying) {
        animationFrameId = requestAnimationFrame(render);
    } else {
        // Render one frame when paused to show updates
        render();
    }

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [state.isPlaying, state.currentTime, state.project, dispatch]);


  // Pre-load media elements
  useEffect(() => {
    state.project.tracks.forEach(track => {
      track.clips.forEach(clip => {
         if (clip.type === 'video' || clip.type === 'image' || clip.type === 'audio') {
             if (!mediaRefs.current[clip.id] && clip.src) {
                 let el;
                 if (clip.type === 'video') {
                     el = document.createElement('video');
                     el.src = clip.src;
                     el.muted = true; // We handle audio separately or mute for preview to avoid chaos
                     el.playsInline = true;
                     el.crossOrigin = "anonymous";
                     el.load();
                 } else if (clip.type === 'image') {
                     el = new Image();
                     el.src = clip.src;
                     el.crossOrigin = "anonymous";
                 } else if (clip.type === 'audio') {
                     el = document.createElement('audio');
                     el.src = clip.src;
                     el.crossOrigin = "anonymous";
                 }
                 
                 if(el) mediaRefs.current[clip.id] = el;
             }
         }
      });
    });
  }, [state.project.tracks]);


  const drawClip = (ctx: CanvasRenderingContext2D, clip: Clip, time: number) => {
      const { width, height } = state.project;
      
      // Calculate clip relative time
      const clipTime = time - clip.start + clip.offset;

      ctx.save();
      
      // Transform properties
      const centerX = width / 2 + clip.properties.x;
      const centerY = height / 2 + clip.properties.y;
      
      ctx.translate(centerX, centerY);
      ctx.rotate((clip.properties.rotation * Math.PI) / 180);
      ctx.scale(clip.properties.scale, clip.properties.scale);
      ctx.globalAlpha = clip.properties.opacity;

      if (clip.type === 'text' && clip.text) {
          ctx.font = `bold ${clip.properties.fontSize || 48}px Inter, sans-serif`;
          ctx.fillStyle = clip.properties.color || 'white';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.strokeStyle = 'black';
          ctx.lineWidth = 2;
          ctx.strokeText(clip.text, 0, 0);
          ctx.fillText(clip.text, 0, 0);
      } else if (clip.type === 'video') {
          const vid = mediaRefs.current[clip.id] as HTMLVideoElement;
          if (vid && vid.readyState >= 2) {
              vid.currentTime = clipTime; // Sync video time
              // Note: Setting currentTime constantly is heavy.
              // In production, you'd use a seek logic to only set if drifted.
              ctx.drawImage(vid, -width/2, -height/2, width, height);
          }
      } else if (clip.type === 'image') {
          const img = mediaRefs.current[clip.id] as HTMLImageElement;
          if (img && img.complete) {
              ctx.drawImage(img, -width/2, -height/2, width, height);
          }
      }
      
      // Handle Audio Playing
      if (clip.type === 'audio' || clip.type === 'video') {
          const media = mediaRefs.current[clip.id] as HTMLMediaElement;
          if (media) {
              if (state.isPlaying) {
                   // Simple sync check for audio
                   if (Math.abs(media.currentTime - clipTime) > 0.3) {
                       media.currentTime = clipTime;
                   }
                   if (media.paused) media.play().catch(e => {}); // Ignore play errors
                   media.volume = clip.properties.volume ?? 1;
              } else {
                  media.pause();
              }
          }
      }

      ctx.restore();
  };

  return (
    <div ref={containerRef} className="flex-1 bg-black relative flex items-center justify-center overflow-hidden">
      <canvas
        ref={canvasRef}
        width={state.project.width}
        height={state.project.height}
        style={{
             width: `${state.project.width * scale}px`,
             height: `${state.project.height * scale}px`,
             maxWidth: '100%',
             maxHeight: '100%',
             boxShadow: '0 0 50px rgba(0,0,0,0.5)'
        }}
        className="bg-black"
      />
    </div>
  );
};

export default VideoPlayer;
