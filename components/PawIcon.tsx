
import React from 'react';

interface PawIconProps {
  onClick: () => void;
  className?: string;
}

export const PawIcon: React.FC<PawIconProps> = ({ onClick, className }) => (
  <button
    onClick={onClick}
    className={`relative group transition-transform duration-150 ease-in-out active:scale-90 ${className}`}
    aria-label="Кликнуть по лапе"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      className="w-32 h-32 text-amber-800 group-hover:text-amber-600 transition-colors"
      fill="currentColor"
    >
      <path d="M73.2,54.2c-4.2-2.3-7-6.7-7-11.8c0-3.3,1.2-6.3,3.3-8.7c3.9-4.5,3.3-11.1-1.2-15c-4.5-3.9-11.1-3.3-15,1.2 c-2.3,2.7-5.5,4.3-8.9,4.3s-6.6-1.6-8.9-4.3c-3.9-4.5-10.5-5.1-15-1.2c-4.5,3.9-5.1,10.5-1.2,15c2.1,2.4,3.3,5.4,3.3,8.7 c0,5.1-2.8,9.5-7,11.8C5.5,56.5,2,61.6,2,67.6C2,76.7,9.3,84,18.4,84h63.3C90.7,84,98,76.7,98,67.6 C98,61.6,94.5,56.5,90.8,54.2L73.2,54.2z M27.8,30.3c1.7-2,4.6-2.5,7-0.9c2.5,1.7,3.1,5,1.4,7.5c-1.7,2.5-5,3.1-7.5,1.4 C26.2,36.7,25.6,32.8,27.8,30.3z M50,30.8c2.5-1.7,5.8-1,7.5,1.4c1.7,2.5,1,5.8-1.4,7.5c-2.5,1.7-5.8,1-7.5-1.4 C46.9,35.8,47.5,32.5,50,30.8z M72.2,30.3c2.3,1.6,2.8,4.6,0.9,7c-1.6,2.3-4.6,2.8-7,0.9c-2.3-1.6-2.8-4.6-0.9-7 C66.8,28.2,69.9,28.7,72.2,30.3z" />
    </svg>
    <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center animate-pulse">
      !
    </div>
  </button>
);

export default PawIcon;
