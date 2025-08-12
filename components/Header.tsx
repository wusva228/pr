import React from 'react';

export const Header: React.FC = () => {
    return (
        <header className="w-full text-center py-1 sm:py-2 mb-1 sm:mb-2 relative">
            <h1 className="text-3xl sm:text-4xl font-black text-amber-900 drop-shadow-lg -mt-1 sm:-mt-2">
                Приключения <span className="text-lime-700">Степана</span>
            </h1>
        </header>
    )
}