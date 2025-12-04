
import React, { useState, useEffect } from 'react';
import { User } from '../types';

interface HeaderProps {
    onLogoClick: () => void;
    currentUser: User | null;
    onLoginClick: () => void;
    onSignUpClick: () => void;
    onLogoutClick: () => void;
    onProfileClick: () => void;
    onAboutClick: () => void;
    onForProfessionalsClick: () => void;
    onAdminClick: () => void;
    onDashboardClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogoClick, currentUser, onLoginClick, onSignUpClick, onLogoutClick, onProfileClick, onAboutClick, onForProfessionalsClick, onAdminClick, onDashboardClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLinkClick = (action: () => void) => {
    action();
    setIsMenuOpen(false);
  }

  return (
    <header className={`bg-white sticky top-0 z-50 transition-shadow duration-300 ${isScrolled ? 'shadow-md' : 'shadow-xl'}`}>
      <div className={`container mx-auto px-4 flex justify-between items-center transition-all duration-300 ${isScrolled ? 'py-2' : 'py-3'}`}>
        <div 
          className="flex items-center cursor-pointer" 
          onClick={() => handleLinkClick(onLogoClick)}
          role="button"
          aria-label="Go to homepage"
        >
          <img 
            src="https://i.postimg.cc/GpYLrkHH/Whats-App-Image-2025-12-04-at-12-06-09-PM.jpg"
            alt="BookMyPhysiotherapy Logo"
            className={`w-auto transition-all duration-300 ${isScrolled ? 'h-10 md:h-12' : 'h-12 md:h-16'}`}
          />
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-6">
          <a href="#" onClick={(e) => { e.preventDefault(); onAboutClick(); }} className="text-gray-600 hover:text-teal-500 transition duration-300" aria-label="Navigate to the About Us page">About Us</a>
          <a href="#" onClick={(e) => { e.preventDefault(); onLogoClick(); }} className="text-gray-600 hover:text-teal-500 transition duration-300" aria-label="Navigate to the therapist search page">Find a Therapist</a>
          <a href="#" onClick={(e) => { e.preventDefault(); onForProfessionalsClick(); }} className="text-gray-600 hover:text-teal-500 transition duration-300" aria-label="Navigate to the page for professionals">For Professionals</a>
           {currentUser?.role === 'therapist' && (
             <a href="#" onClick={(e) => { e.preventDefault(); onDashboardClick(); }} className="font-semibold text-teal-600 hover:text-teal-500 transition duration-300" aria-label="Navigate to your therapist dashboard">My Dashboard</a>
           )}
           {currentUser?.role === 'admin' && (
            <a href="#" onClick={(e) => { e.preventDefault(); onAdminClick(); }} className="font-semibold text-teal-600 hover:text-teal-500 transition duration-300" aria-label="Navigate to the admin panel">Admin Panel</a>
          )}
        </nav>
        <div className="hidden md:flex items-center space-x-4">
          {currentUser ? (
            <>
              {currentUser.role === 'patient' ? (
                <button onClick={onProfileClick} className="text-gray-700 font-medium hover:text-teal-500 transition duration-300" aria-label="View your profile">
                  Hi, {currentUser.name.split(' ')[0]}
                </button>
              ) : (
                <span className="text-gray-700 font-medium">
                  Hi, {currentUser.name.split(' ')[0]}
                </span>
              )}
              <button onClick={onLogoutClick} className="text-gray-600 hover:text-teal-500 transition duration-300" aria-label="Log out of your account">Logout</button>
            </>
          ) : (
            <>
              <button onClick={onLoginClick} className="text-teal-600 border border-teal-500 px-4 py-2 rounded-full hover:bg-teal-500 hover:text-white transition duration-300 font-semibold" aria-label="Open login modal">Login</button>
              <button onClick={onSignUpClick} className="bg-amber-500 text-white px-4 py-2 rounded-full hover:bg-amber-600 transition duration-300 font-semibold" aria-label="Open sign up modal">Sign Up</button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)} 
            className="text-gray-600 hover:text-teal-500 focus:outline-none"
            aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isMenuOpen}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>
      
      {/* Mobile Menu Panel */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg absolute top-full left-0 w-full z-50">
          <nav className="flex flex-col space-y-2 px-4 py-4">
            <a href="#" onClick={(e) => { e.preventDefault(); handleLinkClick(onAboutClick); }} className="text-gray-600 hover:bg-gray-100 p-2 rounded" aria-label="Navigate to the About Us page">About Us</a>
            <a href="#" onClick={(e) => { e.preventDefault(); handleLinkClick(onLogoClick); }} className="text-gray-600 hover:bg-gray-100 p-2 rounded" aria-label="Navigate to the therapist search page">Find a Therapist</a>
            <a href="#" onClick={(e) => { e.preventDefault(); handleLinkClick(onForProfessionalsClick); }} className="text-gray-600 hover:bg-gray-100 p-2 rounded" aria-label="Navigate to the page for professionals">For Professionals</a>
            {currentUser?.role === 'therapist' && (
              <a href="#" onClick={(e) => { e.preventDefault(); handleLinkClick(onDashboardClick); }} className="font-semibold text-teal-600 hover:bg-gray-100 p-2 rounded" aria-label="Navigate to your therapist dashboard">My Dashboard</a>
            )}
            {currentUser?.role === 'admin' && (
              <a href="#" onClick={(e) => { e.preventDefault(); handleLinkClick(onAdminClick); }} className="font-semibold text-teal-600 hover:bg-gray-100 p-2 rounded" aria-label="Navigate to the admin panel">Admin Panel</a>
            )}
            <div className="border-t my-2"></div>
            {currentUser ? (
              <>
                {currentUser.role === 'patient' && (
                  <button onClick={() => handleLinkClick(onProfileClick)} className="text-left text-gray-700 font-medium hover:bg-gray-100 p-2 rounded" aria-label="View your profile">
                    My Profile ({currentUser.name.split(' ')[0]})
                  </button>
                )}
                <button onClick={() => handleLinkClick(onLogoutClick)} className="text-left text-gray-600 hover:bg-gray-100 p-2 rounded" aria-label="Log out of your account">Logout</button>
              </>
            ) : (
              <>
                <button onClick={() => handleLinkClick(onLoginClick)} className="text-left text-gray-600 hover:bg-gray-100 p-2 rounded" aria-label="Open login modal">Login</button>
                <button onClick={() => handleLinkClick(onSignUpClick)} className="w-full text-center bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition duration-300 font-semibold" aria-label="Open sign up modal">Sign Up</button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
