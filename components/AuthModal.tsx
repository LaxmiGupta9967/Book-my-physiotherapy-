
import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';

interface AuthModalProps {
  initialMode: 'login' | 'signup';
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ initialMode, onClose }) => {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>(initialMode);
  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const [authMessage, setAuthMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Ref to track if component is mounted
  const isMounted = useRef(true);

  // Safety timer to prevent infinite loading state
  useEffect(() => {
    let timer: number;
    if (loading) {
        timer = window.setTimeout(() => {
            if (isMounted.current && loading) {
                setLoading(false);
                if (!error) {
                    setError('Request timed out. Please check your internet connection and try again.');
                }
            }
        }, 15000); // 15 seconds timeout
    }
    return () => clearTimeout(timer);
  }, [loading, error]);

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const resetAllAuthStates = () => {
    setName('');
    setEmail('');
    setPassword('');
    setPhone('');
    setOtp('');
    setIsOtpSent(false);
    setError('');
    setResetMessage('');
    setAuthMessage('');
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setAuthMessage('');

    try {
        if (mode === 'login') {
            if (!email || !password) {
                if (isMounted.current) {
                    setError('Please fill in all fields.');
                    setLoading(false);
                }
                return;
            }
            const { error } = await supabase.auth.signInWithPassword({ 
                email: email.trim(), 
                password 
            });
            
            if (isMounted.current) {
                if (error) {
                    if (error.message === 'Email not confirmed') {
                        setError('Please verify your email address. Check your inbox for a confirmation link.');
                    } else if (error.message.includes('Invalid login credentials')) {
                        setError('Invalid email or password. Have you signed up yet?');
                    } else {
                        setError(error.message); 
                    }
                    setLoading(false);
                } else {
                    // Success! App.tsx will detect session change and close modal.
                    // We don't set loading false here to prevent button flash before close
                    onClose();
                }
            }
        } else if (mode === 'signup') {
            if (!email || !password || !name) {
                if (isMounted.current) {
                    setError('Please fill in all fields.');
                    setLoading(false);
                }
                return;
            }
            const { data, error } = await supabase.auth.signUp({
                email: email.trim(),
                password,
                options: {
                    data: {
                        full_name: name,
                    },
                },
            });
            
            if (isMounted.current) {
                if (error) {
                    setError(error.message);
                    setLoading(false);
                } else {
                    if (data.session) {
                       onClose();
                    } else {
                       // User signed up but likely needs to confirm email
                       setAuthMessage('Signup successful! Please check your email for a confirmation link before logging in.');
                       setLoading(false);
                    }
                }
            }
        }
    } catch (err: any) {
        console.error("Auth Error:", err);
        if (isMounted.current) {
            setError(err.message || 'An unexpected error occurred.');
            setLoading(false);
        }
    }
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
        if (isOtpSent) {
            // This is the OTP verification step
            if (!otp || !/^\d{6}$/.test(otp)) {
              if (isMounted.current) {
                  setError('Please enter the 6-digit OTP.');
                  setLoading(false);
              }
              return;
            }

            const fullPhoneNumber = `+91${phone}`;
            const { data: verifyData, error: verifyError } = await supabase.auth.verifyOtp({
              phone: fullPhoneNumber,
              token: otp,
              type: 'sms',
            });

            if (isMounted.current) {
                if (verifyError) {
                  setError(verifyError.message);
                  setLoading(false);
                  return;
                }
                
                // If it was a signup, and we have a name, update the user metadata
                if (mode === 'signup' && name && verifyData.user) {
                    const { error: updateError } = await supabase.auth.updateUser({
                        data: { full_name: name }
                    });
                    
                    if (updateError) {
                        console.warn('Could not update user name after phone signup:', updateError.message);
                    }
                }
                
                onClose(); // Success
            }
        } else {
            // This is the "send OTP" step
            if (mode === 'signup' && !name) {
                if (isMounted.current) {
                    setError('Please enter your full name.');
                    setLoading(false);
                }
                return;
            }
            if (!phone || !/^\d{10}$/.test(phone)) {
              if (isMounted.current) {
                  setError('Please enter a valid 10-digit Indian phone number.');
                  setLoading(false);
              }
              return;
            }

            const fullPhoneNumber = `+91${phone}`;
            const { error } = await supabase.auth.signInWithOtp({ phone: fullPhoneNumber });
            
            if (isMounted.current) {
                if (error) {
                  setError(error.message);
                } else {
                  setIsOtpSent(true);
                  setAuthMessage('An OTP has been sent to your phone.');
                }
                setLoading(false);
            }
        }
    } catch (err: any) {
        if (isMounted.current) {
            setError(err.message || 'An unexpected error occurred.');
            setLoading(false);
        }
    }
  };


  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResetMessage('');
    
    try {
        if (!email) {
          if (isMounted.current) {
              setError('Please enter your email address.');
              setLoading(false);
          }
          return;
        }

        const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
            redirectTo: window.location.origin, // URL to redirect to after password reset
        });

        if (isMounted.current) {
            if (error) {
                setError(error.message);
            } else {
                setResetMessage(`If an account with that email exists, a password reset link has been sent.`);
            }
            setLoading(false);
        }
    } catch (err: any) {
        if (isMounted.current) {
            setError(err.message || 'An unexpected error occurred.');
            setLoading(false);
        }
    }
  };

  const switchMode = (newMode: 'login' | 'signup' | 'forgot') => {
    setMode(newMode);
    setAuthMethod('email'); // Default to email on mode switch
    resetAllAuthStates();
     // Keep email if switching from login to forgot password
    if (newMode !== 'forgot') {
        setEmail('');
    }
  };

  const renderContent = () => {
    if (mode === 'forgot') {
      return (
        <form onSubmit={handlePasswordReset}>
            <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">Reset Password</h2>
                <p className="text-center text-gray-500 text-sm mb-6">Enter your email to receive a reset link.</p>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                            required
                            aria-required="true"
                        />
                    </div>
                </div>
                 {error && <p className="text-red-500 text-sm mt-4 text-center" role="alert">{error}</p>}
                 {resetMessage && <p className="text-green-600 text-sm mt-4 text-center" role="status">{resetMessage}</p>}
            </div>

            <div className="p-6 bg-gray-50 rounded-b-xl space-y-3">
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full px-6 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:bg-gray-400"
                >
                    {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
                 <button
                    type="button"
                    onClick={() => switchMode('login')}
                    className="w-full text-sm text-center text-amber-600 hover:underline"
                >
                    Back to Login
                </button>
            </div>
        </form>
      );
    }
    
    const currentOnSubmit = authMethod === 'email' ? handleEmailSubmit : handlePhoneSubmit;

    return (
        <form onSubmit={currentOnSubmit}>
            <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
                  {mode === 'login' ? 'Welcome Back!' : 'Create Your Account'}
                </h2>
                
                {authMethod === 'email' && (
                  <div className="space-y-4">
                    {mode === 'signup' && (
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                            <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500" required aria-required="true" />
                        </div>
                    )}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                        <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500" required aria-required="true" />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <div className="relative mt-1">
                            <input type={showPassword ? 'text' : 'password'} id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500 pr-10" required aria-required="true" />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-gray-700" aria-label={showPassword ? "Hide password" : "Show password"}>
                                {showPassword ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}> <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a9.97 9.97 0 01-1.563 3.029m0 0l-2.14 2.14" /> </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}> <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /> <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /> </svg>
                                )}
                            </button>
                        </div>
                    </div>
                    {mode === 'login' && (
                        <div className="text-right -mt-2">
                            <button type="button" onClick={() => switchMode('forgot')} className="text-sm font-medium text-amber-600 hover:text-amber-500 hover:underline focus:outline-none"> Forgot Password? </button>
                        </div>
                    )}
                  </div>
                )}
                
                {authMethod === 'phone' && (
                    isOtpSent ? (
                        <div>
                            <p className="text-center text-gray-500 text-sm mb-1">We've sent an OTP to +91 {phone}.</p>
                            <button type="button" onClick={() => setIsOtpSent(false)} className="text-center w-full text-xs text-amber-600 hover:underline mb-4">Change number</button>
                             <div>
                                <label htmlFor="otp" className="block text-sm font-medium text-gray-700">Enter 6-Digit OTP</label>
                                <input type="text" id="otp" maxLength={6} value={otp} onChange={(e) => setOtp(e.target.value)} className="mt-1 w-full text-center tracking-[0.5em] px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500" required />
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {mode === 'signup' && (
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                                    <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500" required />
                                </div>
                            )}
                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                                <div className="relative mt-1">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">+91</span>
                                    <input type="tel" id="phone" placeholder="9876543210" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500 pl-10" required />
                                </div>
                            </div>
                        </div>
                    )
                )}
                
                 {error && <p className="text-red-500 text-sm mt-4 text-center" role="alert">{error}</p>}
                 {authMessage && <p className="text-green-600 text-sm mt-4 text-center" role="status">{authMessage}</p>}
            </div>

            <div className="p-6 bg-gray-50 rounded-b-xl">
                 <button
                    type="submit"
                    disabled={loading || !!authMessage}
                    className="w-full px-6 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    {loading ? 'Processing...' : (
                        mode === 'signup' ? 'Create Account' : 
                        authMethod === 'phone' ? (isOtpSent ? 'Verify & Login' : 'Send OTP') : 'Login'
                    )}
                </button>

                <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center" aria-hidden="true"><div className="w-full border-t border-gray-300" /></div>
                    <div className="relative flex justify-center"><span className="bg-gray-50 px-2 text-sm text-gray-500">OR</span></div>
                </div>

                <button
                    type="button"
                    onClick={() => {
                        setAuthMethod(p => p === 'email' ? 'phone' : 'email');
                        resetAllAuthStates();
                    }}
                    className="w-full text-sm text-center text-amber-600 hover:underline font-semibold"
                  >
                    {mode === 'login' 
                        ? (authMethod === 'email' ? 'Continue with Phone OTP' : 'Continue with Email')
                        : (authMethod === 'email' ? 'Continue with Phone OTP' : 'Continue with Email')
                    }
                  </button>
            </div>
        </form>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4" onClick={authMessage ? undefined : onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b flex justify-between items-start">
            <div className="flex border-b border-gray-200 -mb-px">
              {mode !== 'forgot' && !authMessage && (
                <>
                  <button
                      onClick={() => switchMode('login')}
                      className={`py-2 px-4 text-lg font-semibold transition-colors focus:outline-none ${mode === 'login' ? 'text-amber-500 border-b-2 border-amber-500' : 'text-gray-500 hover:text-gray-700'}`}
                      aria-pressed={mode === 'login'}
                  >
                      Login
                  </button>
                  <button
                      onClick={() => switchMode('signup')}
                      className={`py-2 px-4 text-lg font-semibold transition-colors focus:outline-none ${mode === 'signup' ? 'text-amber-500 border-b-2 border-amber-500' : 'text-gray-500 hover:text-gray-700'}`}
                      aria-pressed={mode === 'signup'}
                  >
                      Sign Up
                  </button>
                </>
              )}
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600" aria-label="Close authentication modal">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
        {renderContent()}
      </div>
    </div>
  );
};

export default AuthModal;
