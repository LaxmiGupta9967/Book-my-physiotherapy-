
import React from 'react';

const ValueCard = ({ icon, title, description, animationClass, iconBgClass }: { icon: React.ReactElement, title: string, description: string, animationClass?: string, iconBgClass?: string }) => (
    <div className={`bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 group h-full ${animationClass}`}>
        <div className={`flex items-center justify-center h-16 w-16 rounded-2xl mb-6 transition-transform duration-300 group-hover:scale-110 ${iconBgClass}`}>
            {icon}
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-amber-600 transition-colors">{title}</h3>
        <p className="text-gray-600 text-base leading-relaxed">{description}</p>
    </div>
);

const AboutPage: React.FC = () => {
  return (
    <div className="bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        {/* Our Story Section */}
        <div className="max-w-4xl mx-auto text-center mb-24">
            <div className="fade-in-up">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Story</h2>
              <div className="w-24 h-1.5 bg-amber-500 mx-auto mb-8 rounded-full"></div>
            </div>
            <div className="fade-in-up delay-200">
                <p className="text-gray-700 leading-loose mb-6 text-lg">
                    BookMyPhysiotherapy was born from a simple observation: finding the right physiotherapist can be a challenging and stressful process. Navigating clinics, matching specialties, and scheduling appointments often adds an unnecessary burden to the recovery journey.
                </p>
                <p className="text-gray-700 leading-loose text-lg">
                    We envisioned a platform where anyone could easily find certified, highly-reviewed physiotherapists in their area. A place built on trust, transparency, and the shared goal of better health. Today, we are proud to be that bridge, connecting thousands of patients to the care they deserve.
                </p>
            </div>
        </div>

        {/* Our Values Section */}
        <div className="mb-24">
            <div className="text-center fade-in-up mb-16">
                <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Core Values</h2>
                <p className="text-gray-600 max-w-2xl mx-auto text-lg">These principles guide every decision we make, ensuring we provide the best possible experience for our patients and professionals.</p>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
                {/* Value 1 */}
                <ValueCard 
                    animationClass="fade-in-up delay-100"
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>}
                    title="Patient-First Approach"
                    description="Your health is our priority. We design every interaction to be simple, supportive, and centered around your recovery goals."
                    iconBgClass="bg-gradient-to-br from-rose-100 to-rose-200 text-rose-600"
                />
                {/* Value 2 */}
                <ValueCard 
                    animationClass="fade-in-up delay-200"
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                    title="Verified Excellence"
                    description="Trust is non-negotiable. We rigorously vet every physiotherapist to ensure you receive care from certified, high-caliber professionals."
                    iconBgClass="bg-gradient-to-br from-emerald-100 to-emerald-200 text-emerald-600"
                />
                {/* Value 3 */}
                <ValueCard 
                    animationClass="fade-in-up delay-300"
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                    title="Accessible Healthcare"
                    description="We believe quality physiotherapy should be available to all. Our platform removes geographical and logistical barriers to care."
                    iconBgClass="bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600"
                />
                {/* Value 4 */}
                <ValueCard 
                    animationClass="fade-in-up delay-400"
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>}
                    title="Transparency & Integrity"
                    description="No hidden fees or confusing terms. We champion clear communication and honest practices for both patients and therapists."
                    iconBgClass="bg-gradient-to-br from-purple-100 to-purple-200 text-purple-600"
                />
                {/* Value 5 */}
                <ValueCard 
                    animationClass="fade-in-up delay-500"
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.124-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.124-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
                    title="Community & Support"
                    description="We are building a community where healing is a shared journey, fostering connections that encourage and motivate."
                    iconBgClass="bg-gradient-to-br from-amber-100 to-amber-200 text-amber-600"
                />
                {/* Value 6 */}
                <ValueCard 
                    animationClass="fade-in-up delay-600"
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>}
                    title="Continuous Innovation"
                    description="We stay ahead of the curve, constantly improving our technology to provide the smoothest, most effective booking experience."
                    iconBgClass="bg-gradient-to-br from-cyan-100 to-cyan-200 text-cyan-600"
                />
            </div>
        </div>
        
        {/* Contact Us Section */}
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-10 border border-gray-100 fade-in-up">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="text-center md:text-left">
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">Have questions?</h2>
                    <p className="text-gray-600 text-lg">We're here to help you find the right care.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                    <a href="mailto:support@bookmyphysio.com" className="flex items-center justify-center px-6 py-3 bg-gray-50 border border-gray-200 rounded-xl hover:bg-amber-50 hover:border-amber-200 hover:text-amber-600 transition-all group">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 group-hover:text-amber-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                        <span className="font-medium">support@bookmyphysio.com</span>
                    </a>
                     <div className="flex items-center justify-center px-6 py-3 bg-gray-50 border border-gray-200 rounded-xl">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg> 
                        <span className="font-medium text-gray-700">(+91) 123-456-7890</span>
                    </div>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default AboutPage;
