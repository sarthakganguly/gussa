import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';

export default function EmailVerificationPage() {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState('Verifying your email...');
  const [isError, setIsError] = useState(false);
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setMessage('No verification token found.');
      setIsError(true);
      return;
    }

    const verifyToken = async () => {
      try {
        const response = await fetch('/api/auth/verify-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Verification failed.');
        }

        setMessage(data.message);
        setIsError(false);
      } catch (err: any) {
        setMessage(err.message);
        setIsError(true);
      }
    };

    verifyToken();
  }, [token]);

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-center p-4">
      <div className="max-w-md w-full">
        <h1 className={`text-3xl font-bold mb-4 ${isError ? 'text-red-500' : 'text-green-500'}`}>
          Email Verification
        </h1>
        <p className="text-gray-300 mb-8">{message}</p>
        {!isError && (
          <Link to="/login">
            <button className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Proceed to Login
            </button>
          </Link>
        )}
      </div>
    </div>
  );
}
