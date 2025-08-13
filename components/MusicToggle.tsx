import React from 'react';

interface MusicToggleProps {
  isPlaying: boolean;
  onToggle: () => void;
}

export const MusicToggle: React.FC<MusicToggleProps> = ({ isPlaying, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className="fixed top-4 right-4 z-50 w-12 h-12 rounded-full bg-black/30 backdrop-blur-sm text-white flex items-center justify-center text-2xl shadow-lg border-2 border-white/50 transition-transform hover:scale-110"
      aria-label="Toggle Music"
    >
      {isPlaying ? <div className="music-btn-on">🎵</div> : <div className="music-btn-off">🔇</div>}
    </button>
  );
};