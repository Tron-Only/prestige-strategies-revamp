import { useState } from 'react';
import { X, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

interface MpesaModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseId: number;
  courseTitle: string;
  amount: number;
  currency: string;
  onPaymentSuccess: () => void;
}

type PaymentStatus = 'input' | 'processing' | 'success' | 'error';

export function MpesaModal({
  isOpen,
  onClose,
  courseId,
  courseTitle,
  amount,
  currency,
  onPaymentSuccess
}: MpesaModalProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [status, setStatus] = useState<PaymentStatus>('input');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate phone number (Kenyan format)
    const cleanPhone = phoneNumber.replace(/\s/g, '');
    if (!/^(254|0)[17]\d{8}$/.test(cleanPhone)) {
      setErrorMessage('Please enter a valid Kenyan phone number (e.g., 0712345678)');
      return;
    }

    setStatus('processing');
    setErrorMessage('');

    try {
      // Get student token
      const token = localStorage.getItem('student_token');
      if (!token) {
        throw new Error('Please sign in to continue');
      }

      // Initiate M-Pesa payment
      const response = await fetch('/api/payments/initiate.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          course_id: courseId,
          phone_number: cleanPhone.startsWith('0') ? '254' + cleanPhone.slice(1) : cleanPhone,
          amount: amount
        })
      });

      const data = await response.json();

      if (data.success) {
        setStatus('success');
        
        // If in test mode, show test mode message
        if (data.test_mode) {
          console.log('✅ TEST MODE: Payment simulated successfully');
        }
        
        // Wait a moment then call success callback
        setTimeout(() => {
          onPaymentSuccess();
        }, 2000);
      } else {
        setStatus('error');
        setErrorMessage(data.error || 'Payment failed. Please try again.');
      }
    } catch (error: any) {
      setStatus('error');
      setErrorMessage(error.message || 'Payment failed. Please try again.');
    }
  };

  const handleClose = () => {
    if (status !== 'processing') {
      setPhoneNumber('');
      setStatus('input');
      setErrorMessage('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded max-w-md w-full p-8 relative shadow-lg">
        {/* Close button */}
        {status !== 'processing' && (
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded transition-colors"
            style={{ color: '#6B7280' }}
          >
            <X size={24} />
          </button>
        )}

        {/* Input State */}
        {status === 'input' && (
          <>
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ backgroundColor: '#F4E4C1' }}>
                <svg className="w-10 h-10" style={{ color: '#D4AF37' }} viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-2" style={{ color: '#00CED1' }}>Pay with M-Pesa</h2>
              <p style={{ color: '#6B7280' }}>
                Complete your enrollment for <strong style={{ color: '#00CED1' }}>{courseTitle}</strong>
              </p>
            </div>

            <div className="border rounded p-4 mb-6" style={{ backgroundColor: '#F4E4C1', borderColor: '#D4AF37' }}>
              <div className="flex justify-between items-center">
                <span className="font-semibold" style={{ color: '#00CED1' }}>Amount to pay:</span>
                <span className="text-2xl font-extrabold" style={{ color: '#00CED1' }}>
                  {currency} {amount.toLocaleString()}
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-5">
                <label htmlFor="phone" className="block text-sm font-bold mb-2" style={{ color: '#00CED1' }}>
                  M-Pesa Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="0712345678 or 254712345678"
                  className="w-full px-4 py-3 border rounded focus:ring-2 focus:outline-none font-medium"
                  style={{ borderColor: '#E5E5E5' }}
                  required
                />
                {errorMessage && (
                  <p className="mt-2 text-sm font-medium" style={{ color: '#DC2626' }}>{errorMessage}</p>
                )}
              </div>

              <div className="bg-yellow-50 border rounded p-4 mb-6" style={{ borderColor: '#FCD34D' }}>
                <p className="text-sm font-medium leading-relaxed" style={{ color: '#92400E' }}>
                  <strong>Note:</strong> You will receive an M-Pesa prompt on your phone. 
                  Enter your PIN to complete the payment.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 px-5 py-3 border rounded font-semibold transition-colors hover:bg-gray-50"
                  style={{ borderColor: '#E5E5E5', color: '#6B7280' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-5 py-3 rounded font-semibold text-white transition-opacity hover:opacity-90"
                  style={{ backgroundColor: '#00CED1' }}
                >
                  Pay Now
                </button>
              </div>
            </form>
          </>
        )}

        {/* Processing State */}
        {status === 'processing' && (
          <div className="text-center py-10">
            <Loader2 className="mx-auto h-20 w-20 animate-spin mb-6" style={{ color: '#D4AF37' }} />
            <h3 className="text-2xl font-bold mb-3" style={{ color: '#00CED1' }}>Processing Payment...</h3>
            <p className="mb-6" style={{ color: '#6B7280' }}>
              Check your phone for the M-Pesa prompt
            </p>
            <div className="border rounded p-4" style={{ backgroundColor: '#F4E4C1', borderColor: '#D4AF37' }}>
              <p className="text-sm font-medium leading-relaxed" style={{ color: '#00CED1' }}>
                Please enter your M-Pesa PIN on your phone to complete the payment.
                Do not close this window.
              </p>
            </div>
          </div>
        )}

        {/* Success State */}
        {status === 'success' && (
          <div className="text-center py-10">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6" style={{ backgroundColor: '#D1FAE5' }}>
              <CheckCircle className="h-12 w-12" style={{ color: '#10B981' }} />
            </div>
            <h3 className="text-2xl font-bold mb-3" style={{ color: '#00CED1' }}>Payment Successful!</h3>
            <p className="mb-4" style={{ color: '#6B7280' }}>
              You have been enrolled in <strong style={{ color: '#00CED1' }}>{courseTitle}</strong>
            </p>
            <p className="text-sm font-medium" style={{ color: '#6B7280' }}>
              Redirecting to your course...
            </p>
          </div>
        )}

        {/* Error State */}
        {status === 'error' && (
          <div className="text-center py-10">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6" style={{ backgroundColor: '#FEE2E2' }}>
              <AlertCircle className="h-12 w-12" style={{ color: '#DC2626' }} />
            </div>
            <h3 className="text-2xl font-bold mb-3" style={{ color: '#00CED1' }}>Payment Failed</h3>
            <p className="mb-8" style={{ color: '#6B7280' }}>
              {errorMessage}
            </p>
            <button
              onClick={() => {
                setStatus('input');
                setErrorMessage('');
              }}
              className="px-8 py-3 rounded font-semibold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: '#00CED1' }}
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default MpesaModal;
