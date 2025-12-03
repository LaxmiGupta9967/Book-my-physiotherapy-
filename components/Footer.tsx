
import React from 'react';

interface FooterProps {
  onFindTherapistClick: () => void;
  onAboutClick: () => void;
  onForProfessionalsClick: () => void;
}

const Footer: React.FC<FooterProps> = ({ onFindTherapistClick, onAboutClick, onForProfessionalsClick }) => {
  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center sm:text-left">
          <div>
            <img 
              src="https://i.postimg.cc/fbGcxrk9/Whats-App-Image-2025-12-03-at-3-02-17-PM.jpg"
              alt="BookMyPhysiotherapy Logo"
              className="h-16 mb-4 mx-auto sm:mx-0"
            />
          </div>
          <div>
            <h3 className="font-semibold mb-4">For Patients</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" onClick={(e) => { e.preventDefault(); onFindTherapistClick(); }} className="text-gray-400 hover:text-white">Find a Therapist</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); onAboutClick(); }} className="text-gray-400 hover:text-white">How it Works</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); onAboutClick(); }} className="text-gray-400 hover:text-white">FAQs</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">For Therapists</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" onClick={(e) => { e.preventDefault(); onForProfessionalsClick(); }} className="text-gray-400 hover:text-white">Join as a Professional</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); onForProfessionalsClick(); }} className="text-gray-400 hover:text-white">Pricing</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); onForProfessionalsClick(); }} className="text-gray-400 hover:text-white">Benefits</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm mb-6">
              <li><a href="#" onClick={(e) => { e.preventDefault(); onAboutClick(); }} className="text-gray-400 hover:text-white">About Us</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); onAboutClick(); }} className="text-gray-400 hover:text-white">Contact</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); onAboutClick(); }} className="text-gray-400 hover:text-white">Privacy Policy</a></li>
            </ul>
            <h3 className="font-semibold mb-4">Follow Us</h3>
            <div className="flex justify-center sm:justify-start space-x-4">
              <a href="https://www.facebook.com/share/1HDABZRuT6/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white" aria-label="Facebook">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v2.385z" />
                </svg>
              </a>
              <a href="https://www.instagram.com/book.myphysiotherapy?igsh=N3RqMWFrMjVvcnpi" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white" aria-label="Instagram">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.011 3.584-.069 4.85c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.85-.07c-3.252-.148-4.771-1.691-4.919-4.919-.058-1.265-.069-1.645-.069-4.85s.011-3.584.069-4.85c.149-3.225 1.664-4.771 4.919-4.919 1.266-.057 1.644-.069 4.85-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948s.014 3.667.072 4.947c.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072s3.667-.014 4.947-.072c4.358-.2 6.78-2.618 6.98-6.98.059-1.281.073-1.689.073-4.948s-.014-3.667-.072-4.947c-.2-4.358-2.618-6.78-6.98-6.98-1.281-.059-1.689-.073-4.948-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a href="https://www.linkedin.com/in/ravindrapratapgupta" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white" aria-label="LinkedIn">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </div>
        <div className="mt-10 border-t border-gray-700 pt-6 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} BookMyPhysiotherapy.com. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
