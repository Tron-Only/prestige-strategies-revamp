import { useEffect, useRef } from 'react';
import { useStudentAuth } from '@/contexts/StudentAuthContext';

interface GoogleSignInProps {
  onSuccess?: () => void;
  onError?: (error: any) => void;
}

declare global {
  interface Window {
    google?: any;
  }
}

export function GoogleSignIn({ onSuccess, onError }: GoogleSignInProps) {
  const { login } = useStudentAuth();
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load Google Sign-In script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID',
          callback: handleCredentialResponse,
        });

        if (buttonRef.current) {
          window.google.accounts.id.renderButton(
            buttonRef.current,
            { 
              theme: 'outline', 
              size: 'large',
              width: '100%',
              text: 'continue_with',
              shape: 'rectangular'
            }
          );
        }
      }
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleCredentialResponse = async (response: any) => {
    try {
      console.log('Google Sign-In response received');
      
      // The response.credential contains the JWT token from Google
      await login(response.credential);
      
      console.log('Login successful, calling onSuccess callback');
      onSuccess?.();
    } catch (error) {
      console.error('Google Sign-In error:', error);
      onError?.(error);
    }
  };

  return (
    <div>
      <div ref={buttonRef} id="google-signin-button" className="mb-3"></div>
      <p className="text-sm text-gray-500 text-center font-medium">
        Sign in securely with your Google account
      </p>
    </div>
  );
}

export default GoogleSignIn;
