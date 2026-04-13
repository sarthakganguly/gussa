import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

export default function ForgotPasswordPage() {
  const [identifier, setIdentifier] = useState('');
  const [recoveryCode, setRecoveryCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/restore-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, recoveryCode }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'An error occurred.');
      }

      // If successful, navigate to reset page with the token
      navigate(`/reset-password?token=${data.resetToken}`);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white">Restore Account</h2>
        <p className="mt-2 text-center text-sm text-gray-400">
          Enter your email or username and your 12-character recovery code.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-gray-800 py-8 px-4 shadow-xl sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <Input 
              id="identifier" 
              name="identifier" 
              type="text" 
              label="Email or Username" 
              value={identifier} 
              onChange={(e) => setIdentifier(e.target.value)} 
              required 
            />
            <Input 
              id="recoveryCode" 
              name="recoveryCode" 
              type="text" 
              label="Recovery Code" 
              value={recoveryCode} 
              onChange={(e) => setRecoveryCode(e.target.value)} 
              placeholder="XXXX-XXXX-XXXX"
              required 
            />

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <div>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Verifying...' : 'Restore & Reset Password'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
