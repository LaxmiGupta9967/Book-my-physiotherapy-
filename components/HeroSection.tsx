
import React, { useState, useEffect, useRef } from 'react';
import { SPECIALTIES, MOCK_THERAPISTS } from '../constants';

interface HeroSectionProps {
  onSearch: (searchTerm: string, specialty: string) => void;
}

// Get unique locations from the mock data to populate the datalist
const uniqueLocations = [...new Set(MOCK_THERAPISTS.map(therapist => therapist.location))];

const searchSuggestions = [
  "e.g., Sports Injury",
  "e.g., Vashi, Navi Mumbai",
  "e.g., Post-Op Recovery",
  "e.g., Kharghar, Navi Mumbai",
  "e.g., Orthopedic",
  "e.g., Kamothe, Navi Mumbai",
];

const HeroSection: React.FC<HeroSectionProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [placeholder, setPlaceholder] = useState(searchSuggestions[0]);
  const placeholderIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    let index = 0;
    placeholderIntervalRef.current = window.setInterval(() => {
      index = (index + 1) % searchSuggestions.length;
      setPlaceholder(searchSuggestions[index]);
    }, 3000);

    return () => {
      if (placeholderIntervalRef.current) {
        clearInterval(placeholderIntervalRef.current);
      }
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm, specialty);
  };

  const popularSearches = ["Back Pain", "Sports Injury", "Neck Pain", "Post-Op"];

  return (
    <section className="relative pt-12 pb-20 lg:pt-24 lg:pb-32 overflow-hidden bg-gradient-to-b from-teal-50/50 to-white">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 rounded-full bg-teal-100/50 blur-3xl opacity-70 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-80 h-80 rounded-full bg-amber-100/50 blur-3xl opacity-70"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
          
          {/* Text Content - Left Side */}
          <div className="w-full lg:w-1/2 text-center lg:text-left">
            
            <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-[1.1] mb-6 animate-fade-in-up delay-100">
               Expert Care for a <br/>
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-500">Pain-Free Life</span>.
            </h1>

            <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed animate-fade-in-up delay-200">
               Book certified physiotherapists for home visits or clinic appointments instantly. Your recovery starts here.
            </p>

            {/* Search Card */}
            <div className="bg-white p-3 rounded-2xl shadow-xl shadow-teal-900/5 border border-gray-100 animate-fade-in-up delay-300">
               <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-3">
                   {/* Location Input */}
                   <div className="relative flex-1 group">
                       <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 group-focus-within:text-amber-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                           </svg>
                       </div>
                       <input
                           type="text"
                           list="locations-list"
                           placeholder={placeholder}
                           value={searchTerm}
                           onChange={(e) => setSearchTerm(e.target.value)}
                           className="w-full pl-11 pr-4 py-3.5 bg-gray-50 rounded-xl border-transparent focus:bg-white focus:border-amber-500 focus:ring-0 transition-all text-gray-800 placeholder-gray-400 font-medium outline-none border border-gray-200"
                       />
                       <datalist id="locations-list">
                        {uniqueLocations.map(loc => (
                            <option key={loc} value={loc} />
                        ))}
                       </datalist>
                   </div>

                   {/* Specialty Input */}
                   <div className="relative flex-1 group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 group-focus-within:text-teal-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                           </svg>
                       </div>
                       <select
                           value={specialty}
                           onChange={(e) => setSpecialty(e.target.value)}
                           className="w-full pl-11 pr-10 py-3.5 bg-gray-50 rounded-xl border-transparent focus:bg-white focus:border-teal-500 focus:ring-0 transition-all appearance-none text-gray-800 font-medium outline-none border border-gray-200 cursor-pointer"
                       >
                           <option value="" className="text-gray-500">All Specialties</option>
                           {SPECIALTIES.map(s => <option key={s} value={s}>{s}</option>)}
                       </select>
                       <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                           <svg className="h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                               <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                           </svg>
                       </div>
                   </div>
                   
                   {/* Search Button */}
                   <button className="w-full md:w-auto bg-teal-600 hover:bg-teal-700 text-white px-8 py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-teal-600/20 hover:shadow-teal-600/40 active:transform active:scale-95 flex items-center justify-center gap-2">
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                       </svg>
                       <span>Search</span>
                   </button>
               </form>
            </div>

            {/* Popular Searches */}
            <div className="mt-6 flex flex-wrap justify-center lg:justify-start gap-2 animate-fade-in-up delay-400">
               <span className="text-sm font-semibold text-gray-500 mr-2 pt-1">Popular:</span>
               {popularSearches.map((term) => (
                   <button 
                       key={term}
                       onClick={() => {
                           if (SPECIALTIES.includes(term)) {
                               setSpecialty(term);
                               onSearch('', term);
                           } else {
                               setSearchTerm(term);
                               onSearch(term, '');
                           }
                       }}
                       className="px-3 py-1 rounded-full bg-white border border-gray-200 text-xs font-medium text-gray-600 hover:bg-teal-50 hover:text-teal-700 hover:border-teal-200 transition-colors"
                   >
                       {term}
                   </button>
               ))}
            </div>

            {/* Social Proof */}
            <div className="mt-10 flex items-center justify-center lg:justify-start gap-6 animate-fade-in-up delay-500">
                <div className="flex -space-x-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className={`w-10 h-10 rounded-full border-2 border-white bg-gray-200 bg-[url('https://randomuser.me/api/portraits/thumb/women/${i + 20}.jpg')] bg-cover`}></div>
                    ))}
                    <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">+2k</div>
                </div>
                <div>
                    <div className="flex text-amber-400 text-sm">
                        {[1, 2, 3, 4, 5].map((_, i) => (
                            <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.955a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.368 2.446a1 1 0 00-.364 1.118l1.287 3.955c.3.921-.755 1.688-1.539 1.118l-3.368-2.445a1 1 0 00-1.175 0l-3.368 2.445c-.783.57-1.838-.197-1.539-1.118l1.287-3.955a1 1 0 00-.364-1.118L2.07 9.382c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69L9.049 2.927z" />
                            </svg>
                        ))}
                    </div>
                    <p className="text-sm font-medium text-gray-600"><span className="font-bold text-gray-900">4.9/5</span> from 10k+ reviews</p>
                </div>
            </div>

          </div>

          {/* Image Content - Right Side */}
          <div className="w-full lg:w-1/2 relative hidden lg:block animate-fade-in-up delay-200">
            <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white transform hover:scale-[1.01] transition-transform duration-500">
                <img 
                    src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80" 
                    alt="Physiotherapy Session" 
                    className="w-full h-auto object-cover"
                />
                
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>

                {/* Floating Card 1: Expert Doctors */}
                <div className="absolute bottom-8 left-8 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-lg flex items-center gap-4 animate-bounce-slow max-w-[200px]">
                    <div className="bg-teal-100 p-3 rounded-xl text-teal-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 font-bold uppercase tracking-wide">Certified</p>
                        <p className="text-sm font-bold text-gray-900">50+ Specialists</p>
                    </div>
                </div>

                 {/* Floating Card 2: Quick Recovery */}
                 <div className="absolute top-10 right-8 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-lg flex items-center gap-4 animate-pulse max-w-[180px]">
                    <div className="bg-amber-100 p-3 rounded-xl text-amber-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 font-bold uppercase tracking-wide">Fast</p>
                        <p className="text-sm font-bold text-gray-900">Recovery</p>
                    </div>
                </div>

            </div>
            
            {/* Background Blob for Image */}
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-teal-400/20 rounded-full blur-3xl -z-10"></div>
            <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-amber-400/20 rounded-full blur-3xl -z-10"></div>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
