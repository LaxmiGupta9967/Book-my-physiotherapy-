
import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HeroSection from './components/HeroSection';
import TherapistCard from './components/TherapistCard';
import TherapistProfile from './components/TherapistProfile';
import BookingModal from './components/BookingModal';
import AuthModal from './components/AuthModal';
import ProfilePage from './components/ProfilePage';
import CancelBookingModal from './components/CancelBookingModal';
import AboutPage from './components/AboutPage';
import TherapistRegistrationPage from './components/TherapistRegistrationPage';
import AdminPage from './components/AdminPage';
import DeleteConfirmationModal from './components/DeleteConfirmationModal';
import BookingConfirmationModal from './components/BookingConfirmationModal';
import IntakeFormModal from './components/IntakeFormModal';
import ViewIntakeFormModal from './components/ViewIntakeFormModal';
import TherapistDashboard from './components/TherapistDashboard';
import MobileFooterNav from './components/MobileFooterNav';
import FeaturedTherapists from './components/FeaturedTherapists';
import PaymentProcessingModal from './components/PaymentProcessingModal';
import { Therapist, User, Booking, IntakeForm } from './types';
import { supabase } from './lib/supabaseClient';
import { MOCK_THERAPISTS } from './constants';

// TODO: Replace with your actual Google Apps Script Web App URL
const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbyR2eimdPo_KuSJj9xCfEi2sK41NQ7HQ9O6AnfMIuIgenM9b7M1Lv7vsmm_r_uKTmpo1Q/exec"; 

const App: React.FC = () => {
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [filteredTherapists, setFilteredTherapists] = useState<Therapist[]>([]);
  const [selectedTherapist, setSelectedTherapist] = useState<Therapist | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [therapistToBook, setTherapistToBook] = useState<Therapist | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [page, setPage] = useState<'browse' | 'profile' | 'therapist-registration' | 'admin' | 'therapist-dashboard' | 'about'>('browse');
  const [bookingToReschedule, setBookingToReschedule] = useState<Booking | null>(null);

  // Loading and error state for fetching therapists
  const [isLoadingTherapists, setIsLoadingTherapists] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // State for cancel confirmation modal
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState<Booking | null>(null);

  // State for booking confirmation modal
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [lastBookingPaid, setLastBookingPaid] = useState(false);

  // State for Payment Processing
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [pendingBookingDetails, setPendingBookingDetails] = useState<{
      date: Date;
      time: string;
      patientName: string;
      phoneNo: string;
      service: string;
  } | null>(null);


  // Admin state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [therapistToDelete, setTherapistToDelete] = useState<Therapist | null>(null);
  const [therapistToEdit, setTherapistToEdit] = useState<Therapist | null>(null);

  // Intake Form state
  const [bookingForIntake, setBookingForIntake] = useState<Booking | null>(null);
  const [intakeDataToView, setIntakeDataToView] = useState<IntakeForm | null>(null);
  const [isViewIntakeModalOpen, setIsViewIntakeModalOpen] = useState(false);


  // Auth state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  // Mobile Nav State
  const [activeMobilePage, setActiveMobilePage] = useState<'home' | 'search' | 'profile' | 'none'>('home');


  useEffect(() => {
    setIsLoadingTherapists(true);
    setFetchError(null);
    // Use the mock data from constants.ts instead of fetching from Supabase
    // We simulate a short delay to mimic a network request for better UX
    setTimeout(() => {
      setTherapists(MOCK_THERAPISTS);
      setFilteredTherapists(MOCK_THERAPISTS);
      setIsLoadingTherapists(false);
    }, 300); // 300ms delay
  }, []);

  const handleShowAdminPage = useCallback(() => {
    setSelectedTherapist(null);
    setPage('admin');
  }, []);
  
  const handleShowTherapistDashboard = useCallback(() => {
    setSelectedTherapist(null);
    setPage('therapist-dashboard');
  }, []);

  const handleCloseAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
  }, []);

  // Supabase auth state listener
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      try {
        if (session?.user) {
            // Attempt to fetch profile
            const { data: profiles, error } = await supabase
                .from('profiles')
                .select('full_name, role, therapist_id')
                .eq('id', session.user.id);
            
            if (error) {
                console.warn('Error fetching profile (falling back to session data):', error.message);
                // Fallback: Create a temporary user object from session data
                // This allows the user to log in even if RLS blocks profile read
                const fallbackUser: User = {
                    id: session.user.id,
                    name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
                    role: 'patient', // Default role
                    email: session.user.email
                };
                setCurrentUser(fallbackUser);
                
                if (_event === 'SIGNED_IN') {
                    handleCloseAuthModal();
                }
            } else if (profiles && profiles.length > 0) {
                const profile = profiles[0];
                const userName = profile.full_name || session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || session.user.phone || 'New User';

                const user: User = {
                    id: session.user.id,
                    name: userName,
                    role: profile.role,
                    therapistId: profile.therapist_id,
                };
                if (session.user.email) user.email = session.user.email;
                setCurrentUser(user);
                
                if (_event === 'SIGNED_IN') {
                    handleCloseAuthModal();
                    if (user.role === 'therapist') {
                        handleShowTherapistDashboard();
                    } else if (user.role === 'admin') {
                        handleShowAdminPage();
                    }
                }
            } else {
                console.warn('Profile not found for authenticated user. Attempting to create one.');
                const fullName = session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || session.user.phone || 'New User';

                const { data: insertedProfiles, error: insertError } = await supabase
                    .from('profiles')
                    .insert({
                        id: session.user.id,
                        full_name: fullName,
                        role: 'patient'
                    })
                    .select('full_name, role, therapist_id');

                if (insertError) {
                    console.error('Failed to create profile on-the-fly:', insertError.message);
                     // Even if creation fails, log them in as a fallback
                     const fallbackUser: User = {
                        id: session.user.id,
                        name: fullName,
                        role: 'patient',
                        email: session.user.email
                    };
                    setCurrentUser(fallbackUser);
                    if (_event === 'SIGNED_IN') {
                        handleCloseAuthModal();
                    }
                } else if (insertedProfiles && insertedProfiles.length > 0) {
                    const newProfile = insertedProfiles[0];
                    const user: User = {
                        id: session.user.id,
                        name: newProfile.full_name,
                        role: newProfile.role,
                        therapistId: newProfile.therapist_id,
                    };
                    if (session.user.email) user.email = session.user.email;
                    setCurrentUser(user);

                    if (_event === 'SIGNED_IN') {
                        handleCloseAuthModal();
                    }
                }
            }
        } else {
            setCurrentUser(null);
        }
      } catch (e: any) {
        console.error("Caught an error in onAuthStateChange:", e.message);
      }
    });

    return () => {
        subscription.unsubscribe();
    };
  }, [handleCloseAuthModal, handleShowAdminPage, handleShowTherapistDashboard]);

  const handleOpenLoginModal = () => {
    setAuthMode('login');
    setIsAuthModalOpen(true);
  };
  
  const handleOpenSignUpModal = () => {
    setAuthMode('signup');
    setIsAuthModalOpen(true);
  };
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
    handleGoHome();
  };

  const handleSearch = (searchTerm: string, specialty: string) => {
    let results = therapists;
    const lowercasedTerm = searchTerm.toLowerCase();

    if (lowercasedTerm) {
      results = results.filter(t =>
        t.name.toLowerCase().includes(lowercasedTerm) ||
        t.title.toLowerCase().includes(lowercasedTerm) ||
        t.location.toLowerCase().includes(lowercasedTerm) ||
        (t.specialties && t.specialties.some(s => s.toLowerCase().includes(lowercasedTerm)))
      );
    }

    if (specialty) {
      results = results.filter(t => t.specialties && t.specialties.includes(specialty));
    }
    
    setFilteredTherapists(results);
    handleGoHome();
  };
  
  const handleSelectTherapist = (therapist: Therapist) => {
    setSelectedTherapist(therapist);
    window.scrollTo(0, 0);
  };
  
  const handleGoHome = () => {
    setSelectedTherapist(null);
    setPage('browse');
    setTherapistToEdit(null);
    setActiveMobilePage('home');
  };

  const handleShowAboutPage = () => {
    setSelectedTherapist(null);
    setPage('about');
  };

  const handleShowProfile = () => {
    if (currentUser?.role === 'patient') {
      setSelectedTherapist(null);
      setPage('profile');
      setActiveMobilePage('profile');
    } else if (currentUser?.role === 'therapist') {
      handleShowTherapistDashboard();
    } else if (currentUser?.role === 'admin') {
      handleShowAdminPage();
    }
  };

  const handleMobileProfileClick = () => {
    if (currentUser) {
      handleShowProfile();
    } else {
      handleOpenLoginModal();
    }
  };

  const handleMobileSearchClick = () => {
    handleGoHome();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleShowTherapistRegistration = () => {
    setSelectedTherapist(null);
    setTherapistToEdit(null);
    setPage('therapist-registration');
  }
  
  const handleOpenBookingModal = (therapist: Therapist) => {
    if (!currentUser) {
      handleOpenLoginModal();
      return;
    }
    setTherapistToBook(therapist);
    setIsBookingModalOpen(true);
  };
  
  const handleOpenRescheduleModal = (bookingId: string) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (booking) {
      setBookingToReschedule(booking);
      setTherapistToBook(booking.therapist);
      setIsBookingModalOpen(true);
    }
  };

  const handleCloseBookingModal = () => {
    setIsBookingModalOpen(false);
    setTherapistToBook(null);
    setBookingToReschedule(null);
    setPendingBookingDetails(null);
  };
  
  // Updated: Handles initial click of "Confirm" in BookingModal
  const handleBookingConfirm = (details: {date: Date, time: string, patientName: string, phoneNo: string, service: string}) => {
    // If rescheduling, update immediately (simplified flow for reschedule)
    if (bookingToReschedule) {
        const updatedBookings = bookings.map(b =>
            b.id === bookingToReschedule.id ? {
                ...b,
                date: details.date,
                time: details.time,
                status: 'confirmed' as const,
                phoneNo: details.phoneNo,
                service: details.service
            } : b
        );
        setBookings(updatedBookings.sort((a, b) => a.date.getTime() - b.date.getTime()));
        setBookingToReschedule(null);
        setIsBookingModalOpen(false);
        setLastBookingPaid(false); 
        setIsConfirmModalOpen(true);
        return;
    }

    // New Booking Flow
    if (therapistToBook && currentUser) {
        // 1. Store details temporarily - CRITICAL: Do this before closing the modal
        setPendingBookingDetails(details);
        
        // Check if online payment is enabled for this therapist/clinic
        // Using optional chaining and defaulting to false if undefined
        const onlinePaymentAvailable = therapistToBook.clinic?.isOnlinePaymentAvailable === true;

        if (onlinePaymentAvailable) {
            // 2. Transition State: Close Booking, Open Payment
            // We do NOT call handleCloseBookingModal() here because that clears therapistToBook
            setIsBookingModalOpen(false);
            
            // Short timeout to ensure state settles if needed, though usually not required in React 18+ automatic batching
            // but good for visual transition
            setTimeout(() => {
                setIsPaymentModalOpen(true);
            }, 50);
        } else {
            // Default to 'pay later' confirmation
            setIsBookingModalOpen(false);
            finalizeBooking(details, false);
        }
    }
  };

  const handlePaymentSuccess = (paymentId: string) => {
      setIsPaymentModalOpen(false);
      // Ensure we have the details before finalizing
      if (pendingBookingDetails) {
          finalizeBooking(pendingBookingDetails, true);
      } else {
          console.error("Payment successful but booking details missing");
      }
  };

  const sendBookingToGoogleSheets = async (booking: Booking) => {
    if (!GOOGLE_SHEET_URL) {
      console.warn("Google Sheet URL is not configured.");
      return;
    }

    try {
      // Use no-cors to prevent CORS blocking since we only need to write, not read response
      await fetch(GOOGLE_SHEET_URL, {
        method: "POST",
        mode: "no-cors", 
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookingId: booking.id,
          patientName: booking.patientName,
          patientEmail: currentUser?.email || 'N/A',
          phone: booking.phoneNo || 'N/A',
          therapistName: booking.therapist.name,
          date: booking.date.toDateString(),
          time: booking.time,
          service: booking.service || 'General',
          status: booking.status,
          isPaid: booking.isPaid
        }),
      });
      console.log("Booking logged to Google Sheets");
    } catch (error) {
      console.error("Error logging to Google Sheets", error);
    }
  };

  const finalizeBooking = (details: typeof pendingBookingDetails, isPaid: boolean) => {
     if (!details || !therapistToBook || !currentUser) return;

      const newBooking: Booking = {
          id: `${Date.now()}-${therapistToBook.id}`,
          userId: currentUser.id,
          patientName: details.patientName,
          therapist: therapistToBook,
          date: details.date,
          time: details.time,
          status: 'confirmed',
          phoneNo: details.phoneNo,
          service: details.service,
          isPaid: isPaid,
      };
      
      setBookings(prevBookings => [...prevBookings, newBooking].sort((a, b) => a.date.getTime() - b.date.getTime()));
      
      // Send to Google Sheets
      sendBookingToGoogleSheets(newBooking);

      setTherapistToBook(newBooking.therapist);
      setLastBookingPaid(isPaid);
      setIsConfirmModalOpen(true);
      setPendingBookingDetails(null);
      // We don't clear therapistToBook here immediately so BookingConfirmationModal can use it
  };
    
  // --- Additional Handlers for Modals and Actions ---

  const handleOpenCancelModal = (bookingId: string) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (booking) {
      setBookingToCancel(booking);
      setIsCancelModalOpen(true);
    }
  };

  const handleCloseCancelModal = () => {
    setIsCancelModalOpen(false);
    setBookingToCancel(null);
  };

  const handleConfirmCancelBooking = async (bookingId: string) => {
    const bookingToUpdate = bookings.find(b => b.id === bookingId);
    if (bookingToUpdate) {
        setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'cancelled' } : b));
    }
    handleCloseCancelModal();
  };

  const handleDeleteTherapist = (therapist: Therapist) => {
    setTherapistToDelete(therapist);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setTherapistToDelete(null);
  };

  const handleConfirmDelete = () => {
    if (therapistToDelete) {
      setTherapists(prev => prev.filter(t => t.id !== therapistToDelete.id));
      setFilteredTherapists(prev => prev.filter(t => t.id !== therapistToDelete.id));
    }
    handleCloseDeleteModal();
  };
  
  const handleEditTherapist = (therapist: Therapist) => {
    setTherapistToEdit(therapist);
    setPage('therapist-registration');
  };

  const handleProfileCreate = (therapist: Therapist) => {
    const newTherapist = { ...therapist, id: Date.now() }; // Ensure a unique ID
    setTherapists(prev => [...prev, newTherapist]);
    setFilteredTherapists(prev => [...prev, newTherapist]);
    handleGoHome();
  };

  const handleProfileUpdate = (updatedTherapist: Therapist) => {
    setTherapists(prev => prev.map(t => t.id === updatedTherapist.id ? updatedTherapist : t));
    setFilteredTherapists(prev => prev.map(t => t.id === updatedTherapist.id ? updatedTherapist : t));
    handleGoHome();
  };

  const handleOpenIntakeForm = (bookingId: string) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (booking) {
      setBookingForIntake(booking);
    }
  };

  const handleCloseIntakeForm = () => {
    setBookingForIntake(null);
  };

  const handleIntakeFormSubmit = (bookingId: string, formData: IntakeForm) => {
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, intakeForm: formData } : b));
    handleCloseIntakeForm();
  };

  const handleViewIntakeForm = (bookingId: string) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (booking && booking.intakeForm) {
      setIntakeDataToView(booking.intakeForm);
      setIsViewIntakeModalOpen(true);
    }
  };

  const handleCloseViewIntakeModal = () => {
    setIsViewIntakeModalOpen(false);
    setIntakeDataToView(null);
  };
  
  const featuredTherapistIds = [2, 13, 11]; // Dr. Shilpa Rangari, Dr. Suman Gupta, Dr. Neelam Patel
  const featuredTherapists = therapists.filter(t => featuredTherapistIds.includes(t.id));
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header
        currentUser={currentUser}
        onLogoClick={handleGoHome}
        onLoginClick={handleOpenLoginModal}
        onSignUpClick={handleOpenSignUpModal}
        onLogoutClick={handleLogout}
        onProfileClick={handleShowProfile}
        onAboutClick={handleShowAboutPage}
        onForProfessionalsClick={handleShowTherapistRegistration}
        onAdminClick={handleShowAdminPage}
        onDashboardClick={handleShowTherapistDashboard}
      />
      <main className="flex-grow">
        {page === 'browse' && !selectedTherapist && (
          <>
            <HeroSection onSearch={handleSearch} />
            <FeaturedTherapists 
              therapists={featuredTherapists}
              onViewProfile={handleSelectTherapist}
              onBookNow={handleOpenBookingModal}
            />
            <div className="container mx-auto px-4 py-16">
               <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8 text-center">
                  {filteredTherapists.length === therapists.length ? 'All Therapists' : 'Search Results'}
              </h2>
              {isLoadingTherapists ? (
                <div className="text-center p-10">Loading therapists...</div>
              ) : fetchError ? (
                <div className="text-center p-10 text-red-500">{fetchError}</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredTherapists.map((therapist, index) => (
                    <div key={therapist.id} className="fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                      <TherapistCard
                        therapist={therapist}
                        onViewProfile={() => handleSelectTherapist(therapist)}
                        onBookNow={() => handleOpenBookingModal(therapist)}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
        {selectedTherapist && (
          <TherapistProfile
            therapist={selectedTherapist}
            onBack={handleGoHome}
            onBookNow={() => handleOpenBookingModal(selectedTherapist)}
            currentUser={currentUser}
          />
        )}
        {page === 'profile' && currentUser?.role === 'patient' && (
          <ProfilePage 
            user={currentUser} 
            bookings={bookings.filter(b => b.userId === currentUser.id)}
            onCancelBooking={handleOpenCancelModal}
            onRescheduleBooking={handleOpenRescheduleModal}
            onFillIntakeForm={handleOpenIntakeForm}
            onViewIntakeForm={handleViewIntakeForm}
          />
        )}
        {page === 'about' && <AboutPage />}
        {page === 'therapist-registration' && (
          <TherapistRegistrationPage
            onProfileCreate={handleProfileCreate}
            onProfileUpdate={handleProfileUpdate}
            therapistToEdit={therapistToEdit}
            onBack={handleGoHome}
          />
        )}
        {page === 'admin' && currentUser?.role === 'admin' && (
          <AdminPage
            therapists={therapists}
            onAddTherapist={handleShowTherapistRegistration}
            onEditTherapist={handleEditTherapist}
            onDeleteTherapist={handleDeleteTherapist}
          />
        )}
         {page === 'therapist-dashboard' && currentUser?.role === 'therapist' && (
          <TherapistDashboard
            therapist={therapists.find(t => t.id === currentUser.therapistId)!}
            bookings={bookings.filter(b => b.therapist.id === currentUser.therapistId)}
            onEditProfile={() => handleEditTherapist(therapists.find(t => t.id === currentUser.therapistId)!)}
            onViewIntakeForm={handleViewIntakeForm}
          />
        )}
      </main>
      <Footer
        onFindTherapistClick={handleGoHome}
        onAboutClick={handleShowAboutPage}
        onForProfessionalsClick={handleShowTherapistRegistration}
      />
      {/* Modals */}
      {isBookingModalOpen && therapistToBook && currentUser && (
        <BookingModal
          therapist={therapistToBook}
          currentUser={currentUser}
          onClose={handleCloseBookingModal}
          onConfirm={handleBookingConfirm}
          isRescheduling={!!bookingToReschedule}
        />
      )}
      
      {isPaymentModalOpen && therapistToBook && currentUser && pendingBookingDetails && (
        <PaymentProcessingModal
            amount={therapistToBook.fee}
            therapist={therapistToBook}
            currentUser={currentUser}
            onSuccess={handlePaymentSuccess}
            onClose={() => {
                setIsPaymentModalOpen(false);
                setPendingBookingDetails(null);
                setTherapistToBook(null);
            }}
            bookingDate={pendingBookingDetails.date.toISOString()}
        />
      )}

      {isAuthModalOpen && <AuthModal initialMode={authMode} onClose={handleCloseAuthModal} />}
      {isCancelModalOpen && bookingToCancel && (
        <CancelBookingModal
          booking={bookingToCancel}
          onClose={handleCloseCancelModal}
          onConfirm={handleConfirmCancelBooking}
        />
      )}
      {isDeleteModalOpen && therapistToDelete && (
          <DeleteConfirmationModal 
            therapistName={therapistToDelete.name} 
            onClose={handleCloseDeleteModal}
            onConfirm={handleConfirmDelete}
          />
      )}
      <BookingConfirmationModal 
        isOpen={isConfirmModalOpen} 
        therapist={therapistToBook} 
        onClose={() => {
            setIsConfirmModalOpen(false);
            setTherapistToBook(null);
        }}
        onGoToProfile={handleShowProfile}
        isPaid={lastBookingPaid}
      />
      {bookingForIntake && currentUser && (
        <IntakeFormModal
          booking={bookingForIntake}
          userName={currentUser.name}
          onClose={handleCloseIntakeForm}
          onSubmit={handleIntakeFormSubmit}
        />
      )}
      {isViewIntakeModalOpen && intakeDataToView && (
        <ViewIntakeFormModal intakeData={intakeDataToView} onClose={handleCloseViewIntakeModal} />
      )}
      <MobileFooterNav 
        activePage={activeMobilePage}
        onHomeClick={handleGoHome}
        onSearchClick={handleMobileSearchClick}
        onProfileClick={handleMobileProfileClick}
      />
    </div>
  );
};

export default App;
