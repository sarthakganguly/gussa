/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import DashboardPage from './pages/DashboardPage';
import MainLayout from './components/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Placeholder pages for the other sections
import { useState, FormEvent } from 'react';
import { useAuth } from './contexts/AuthContext';
import Button from './components/ui/Button';

const LogPage = () => {
  const [content, setContent] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ content }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to save log.');
      }

      setSuccess('Log saved successfully!');
      setContent('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Log Your Thoughts</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full h-40 p-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="What's on your mind?"
        />
        <div className="mt-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save'}
          </Button>
        </div>
        {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
        {success && <p className="text-green-400 text-sm mt-2">{success}</p>}
      </form>
    </div>
  );
};
const PlayPage = () => <div className="p-4"><h1 className="text-2xl font-bold">Play</h1></div>;
const BreathePage = () => <div className="p-4"><h1 className="text-2xl font-bold">Breathe</h1></div>;
import Button from './components/ui/Button';

const ProfilePage = () => {
  const { user, token, login, logout } = useAuth();
  const [showKey, setShowKey] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Mask the recovery code: keep last 4 characters, replace rest with X
  const maskCode = (code: string) => {
    if (!code) return 'XXXX-XXXX-XXXX';
    const visiblePart = code.slice(-4);
    const maskedPart = 'XXXX-XXXX-';
    return maskedPart + visiblePart;
  };

  const handleRegenerate = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/auth/regenerate-recovery-key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to regenerate key.');
      }

      // Update local context/storage with the NEW plain key
      if (user) {
        login(token!, { ...user, recoveryCode: data.recoveryCode });
      }

      setSuccess('Recovery key regenerated successfully!');
      setPassword('');
      setIsRegenerating(false);
      setShowKey(true); // Show the new key immediately
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Profile Settings</h1>
      
      <div className="bg-gray-800 rounded-lg p-6 shadow-lg mb-6 border border-gray-700">
        <h2 className="text-lg font-semibold text-white mb-4">Account Information</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400">Username</label>
            <p className="text-white text-lg">{user?.username}</p>
          </div>
          
          <div className="pt-4 border-t border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-400">Recovery Key</label>
              <button 
                onClick={() => setShowKey(!showKey)}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
              >
                {showKey ? 'Hide' : 'Reveal'}
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-mono text-indigo-400 tracking-wider bg-gray-900 px-3 py-1 rounded border border-gray-600 w-full text-center">
                {user?.recoveryCode ? (showKey ? user.recoveryCode : maskCode(user.recoveryCode)) : 'XXXX-XXXX-XXXX'}
              </span>
            </div>
            <p className="mt-2 text-xs text-gray-500 italic">
              * This key is required to reset your password. Keep it safe.
            </p>
            
            {!isRegenerating ? (
              <button 
                onClick={() => setIsRegenerating(true)}
                className="mt-4 text-sm text-red-400 hover:text-red-300 font-medium"
              >
                Regenerate New Key
              </button>
            ) : (
              <form onSubmit={handleRegenerate} className="mt-4 p-4 bg-gray-900 rounded border border-red-900/30">
                <p className="text-sm text-gray-300 mb-3 font-semibold text-red-400">Danger Zone: Regenerating will invalidate your old key.</p>
                <input 
                  type="password" 
                  placeholder="Enter current password to confirm"
                  className="w-full p-2 mb-3 bg-gray-800 border border-gray-700 rounded text-white text-sm"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <div className="flex space-x-3">
                  <Button type="submit" variant="primary" size="sm" fullWidth={false}>Confirm & Regenerate</Button>
                  <Button type="button" variant="secondary" size="sm" fullWidth={false} onClick={() => setIsRegenerating(false)}>Cancel</Button>
                </div>
                {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
              </form>
            )}
            {success && <p className="text-green-400 text-sm mt-2">{success}</p>}
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <Button onClick={logout} variant="secondary">Log Out</Button>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/" element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route index element={<Navigate to="/dash" replace />} />
            <Route path="dash" element={<DashboardPage />} />
            <Route path="log" element={<LogPage />} />
            <Route path="play" element={<PlayPage />} />
            <Route path="breathe" element={<BreathePage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

