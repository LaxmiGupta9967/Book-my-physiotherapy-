import React from 'react';

interface MobileFooterNavProps {
    activePage: 'home' | 'search' | 'profile' | 'none';
    onHomeClick: () => void;
    onSearchClick: () => void;
    onProfileClick: () => void;
}

const NavButton: React.FC<{
    label: string;
    icon: React.ReactElement;
    isActive: boolean;
    onClick: () => void;
}> = ({ label, icon, isActive, onClick }) => {
    const activeClass = 'text-teal-500';
    const inactiveClass = 'text-gray-500';

    return (
        <button
            onClick={onClick}
            className={`flex flex-col items-center justify-center w-full pt-2 pb-1 transition-colors duration-200 ${isActive ? activeClass : inactiveClass} hover:text-teal-500`}
            aria-label={`Go to ${label}`}
        >
            {icon}
            <span className={`text-xs font-medium mt-1 ${isActive ? 'font-bold' : ''}`}>{label}</span>
        </button>
    );
};


const MobileFooterNav: React.FC<MobileFooterNavProps> = ({ activePage, onHomeClick, onSearchClick, onProfileClick }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] md:hidden z-40">
      <div className="flex justify-around items-stretch h-full">
        <NavButton
            label="Home"
            isActive={activePage === 'home'}
            onClick={onHomeClick}
            icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            }
        />
        <NavButton
            label="Find a Therapist"
            isActive={activePage === 'search'}
            onClick={onSearchClick}
            icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            }
        />
         <NavButton
            label="Profile"
            isActive={activePage === 'profile'}
            onClick={onProfileClick}
            icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            }
        />
      </div>
    </div>
  );
};

export default MobileFooterNav;