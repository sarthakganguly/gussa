import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { generateRandomUsername } from '../shared/utils';

export default function SignupPage() {
  const [username, setUsername] = useState(generateRandomUsername());
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [recoveryCode, setRecoveryCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'An error occurred.');
      }

      setSuccess(data.message);
      setRecoveryCode(data.recoveryCode);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (recoveryCode) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-gray-800 py-8 px-4 shadow-xl sm:rounded-lg sm:px-10 text-center border border-indigo-500">
            <h2 className="text-2xl font-bold text-green-400 mb-4">Account Created!</h2>
            <div className="text-gray-300 mb-6 text-sm">
              <p className="mb-4">This is your <strong>Secret Recovery Key</strong>. You will need it to reset your password if you forget it.</p>
              <p className="text-red-400 font-bold uppercase p-2 bg-red-900/20 rounded">
                We cannot recover this for you. Write it down or save it somewhere safe now.
              </p>
            </div>
            
            <div className="bg-gray-900 p-6 rounded-md border-2 border-dashed border-indigo-400 mb-8 select-all cursor-copy" title="Click to select all">
              <span className="text-3xl font-mono text-white tracking-widest">{recoveryCode}</span>
            </div>

            <Button onClick={() => navigate('/login')}>
              I have saved my recovery key
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white">Create a new account</h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-gray-800 py-8 px-4 shadow-xl sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <Input id="username" name="username" type="text" label="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
            <Input id="email" name="email" type="email" label="Email address" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <Input id="password" name="password" type="password" label="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <div>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Creating Account...' : 'Sign up'}
              </Button>
            </div>
          </form>
          <div className="mt-6 text-center">
            <Link to="/login" className="font-medium text-indigo-400 hover:text-indigo-300">
              Already have an account? Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
