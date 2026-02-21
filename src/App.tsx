/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import EmailVerificationPage from './pages/EmailVerificationPage';
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
  const { user, logout } = useAuth();
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Profile</h1>
      <p className="text-gray-400 mt-2">Welcome, {user?.username}!</p>
      <div className="mt-6 max-w-xs">
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
        <Route path="/verify-email" element={<EmailVerificationPage />} />
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

