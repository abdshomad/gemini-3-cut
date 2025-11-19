import React, { useRef, useEffect, useState } from 'react';
import { useEditor } from '../../context/EditorContext';
import { Clip } from '../../types';

const VideoPlayer = () => {
  const { state, dispatch } = useEditor();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mediaRefs = useRef<{ [key: string]: HTMLVideoElement | HTMLImageElement | HTMLAudioElement }>({});
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current && canvasRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        const projectRatio = state.project.width / state.project.height;
        const containerRatio = width / height;
        const s = containerRatio > projectRatio ? (height - 40) / state.project.height : (width - 40) / state.project.width;
        setScale(s);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, [state.project.width, state.project.height]);

  useEffect(() => {
    let animationFrameId: number;
    const ctx = canvasRef.current?.getContext('2d');

    const render = () => {
      if (!ctx || !canvasRef.current) return;
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);

      // Simple z-index based on track order (reverse to paint top tracks last)
      [...state.project.tracks].reverse().forEach((track) => {
        if (track.isHidden) return;
        const clip = track.clips.find(c => state.currentTime >= c.start && state.currentTime < c.start + c.duration);
        if (clip) drawClip(ctx, clip, state.currentTime);
      });

      if (state.isPlaying) {
        dispatch({ type: 'SET_CURRENT_TIME', payload: state.currentTime + 1/60 });
        animationFrameId = requestAnimationFrame(render);
      }
    };
    
    state.isPlaying ? (animationFrameId = requestAnimationFrame(render)) : render();
    return () => animationFrameId && cancelAnimationFrame(animationFrameId);
  }, [state.isPlaying, state.currentTime, state.project]);

  useEffect(() => {
    state.project.tracks.forEach(t => t.clips.forEach(c => {
      if (['video', 'image', 'audio'].includes(c.type) && c.src && !mediaRefs.current[c.id]) {
        let el: any;
        if (c.type === 'video') { el = document.createElement('video'); el.muted = true; }
        else if (c.type === 'image') { el = new Image(); }
        else if (c.type === 'audio') { el = document.createElement('audio'); }
        if(el) { el.src = c.src; el.crossOrigin = "anonymous"; el.load?.(); mediaRefs.current[c.id] = el; }
      }
    }));
  }, [state.project.tracks]);

  const drawClip = (ctx: CanvasRenderingContext2D, clip: Clip, time: number) => {
      const { width, height } = state.project;
      const clipTime = time - clip.start + clip.offset;
      const relativeTime = time - clip.start;
      
      ctx.save();
      const centerX = width / 2 + clip.properties.x;
      const centerY = height / 2 + clip.properties.y;
      ctx.translate(centerX, centerY);
      ctx.rotate((clip.properties.rotation * Math.PI) / 180);
      ctx.scale(clip.properties.scale, clip.properties.scale);
      ctx.globalAlpha = clip.properties.opacity;

      // Calculate Fade for Video/Audio
      let volume = clip.properties.volume ?? 1;
      if (clip.properties.fadeIn && relativeTime < clip.properties.fadeIn) {
          const fade = relativeTime / clip.properties.fadeIn;
          ctx.globalAlpha *= fade;
          volume *= fade;
      } else if (clip.properties.fadeOut && relativeTime > clip.duration - clip.properties.fadeOut) {
          const fade = (clip.duration - relativeTime) / clip.properties.fadeOut;
          ctx.globalAlpha *= fade;
          volume *= fade;
      }

      if (clip.type === 'text' && clip.text) {
          ctx.font = `bold ${clip.properties.fontSize || 48}px ${clip.properties.fontFamily || 'Inter'}, sans-serif`;
          ctx.fillStyle = clip.properties.color || 'white';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          // Simple Shadow
          ctx.shadowColor = "rgba(0,0,0,0.5)";
          ctx.shadowBlur = 4;
          ctx.fillText(clip.text, 0, 0);
      } else if (clip.type === 'video') {
          const vid = mediaRefs.current[clip.id] as HTMLVideoElement;
          if (vid?.readyState >= 2) {
              vid.currentTime = clipTime;
              ctx.drawImage(vid, -width/2, -height/2, width, height);
          }
      } else if (clip.type === 'image') {
          const img = mediaRefs.current[clip.id] as HTMLImageElement;
          if (img?.complete) ctx.drawImage(img, -width/2, -height/2, width, height);
      }
      
      // Audio Playback
      if (['audio', 'video'].includes(clip.type)) {
          const media = mediaRefs.current[clip.id] as HTMLMediaElement;
          if (media) {
              if (state.isPlaying) {
                   if (Math.abs(media.currentTime - clipTime) > 0.3) media.currentTime = clipTime;
                   if (media.paused) media.play().catch(() => {});
                   media.volume = Math.max(0, Math.min(1, volume));
              } else media.pause();
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
        style={{ width: state.project.width * scale, height: state.project.height * scale, boxShadow: '0 0 50px rgba(0,0,0,0.5)' }}
        className="bg-black"
      />
    </div>
  );
};

export default VideoPlayer;