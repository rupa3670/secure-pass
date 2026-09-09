// app/dashboard/profile/page.jsx
'use client';
import { useState, useEffect } from 'react';
import { authClient } from '@/lib/auth-client';
import { apiFetch } from '@/lib/api';
import { Button, useOverlayState } from '@heroui/react';
import { FaUserShield, FaUserEdit, FaTrashAlt, FaEnvelope, FaShieldAlt } from 'react-icons/fa';
import Image from 'next/image';
import EditProfileModal from '@/components/dashboard/profile/EditModal';

export default function ProfilePage() {
  const { data: session, isPending, refetch } = authClient.useSession();
  const editModalState = useOverlayState();
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (session?.user) {
      setUser(session.user);
    }
  }, [session]);

  const handleUpdateProfile = async (updatedData) => {
    try {
      // Better-auth ba apnar custom backend route diye update handle korte paren
      await apiFetch('/api/user/profile', {
        method: 'PUT',
        body: JSON.stringify(updatedData),
      });
      await refetch(); // Refresh session data
      setUser((prev) => ({ ...prev, ...updatedData }));
      alert('Profile updated successfully!');
    } catch (err) {
      alert(err.message || 'Failed to update profile.');
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm('Warning: This action is permanent. Do you want to delete your Secure Pass account?')) return;
    try {
      await apiFetch('/api/user/profile', { method: 'DELETE' });
      await authClient.signOut();
      alert('Account deleted.');
      window.location.href = '/login';
    } catch (err) {
      alert(err.message || 'Failed to delete account.');
    }
  };

  if (isPending) {
    return (
      <div className="flex justify-center items-center min-h-[70vh] text-cyan-400 animate-pulse font-medium">
        Loading profile data...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 lg:p-10 space-y-8 text-slate-100 min-h-screen">
      
      {/* Top Banner Header */}
      <div className="flex items-center gap-4 bg-slate-900/50 border border-slate-800/80 p-6 rounded-2xl backdrop-blur-md shadow-xl">
        <div className="p-3 bg-cyan-950/80 border border-cyan-800/50 rounded-xl text-cyan-400 text-2xl shadow-inner">
          <FaUserShield />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Account Profile</h1>
          <p className="text-sm text-slate-400 mt-0.5">Manage your personal credentials and account preferences.</p>
        </div>
      </div>

      {/* Profile Card Section */}
      <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 lg:p-8 backdrop-blur-md shadow-xl flex flex-col md:flex-row items-center gap-8">
        
        {/* User Avatar with First Letter Fallback */}
        <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-cyan-500/50 shadow-lg shadow-cyan-950 flex items-center justify-center bg-slate-800 shrink-0">
          {user?.image && user.image.startsWith('http') ? (
            <Image 
              src={user.image} 
              alt={user.name || 'User'} 
              fill
              className="object-cover"
            />
          ) : (
            <span className="text-4xl text-cyan-400 font-bold uppercase">
              {user?.name ? user.name.charAt(0) : 'U'}
            </span>
          )}
        </div>

        {/* User Details */}
        <div className="flex-1 space-y-3 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
            <h2 className="text-2xl font-bold text-white">{user?.name || 'Anonymous User'}</h2>
            <span className="inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/50 text-cyan-400 text-xs font-semibold">
              <FaShieldAlt className="text-[10px]" /> {user?.role || 'Secure User'}
            </span>
          </div>

          <p className="text-slate-400 text-sm flex items-center justify-center md:justify-start gap-2">
            <FaEnvelope className="text-slate-500" /> {user?.email || 'No email provided'}
          </p>

          <p className="text-xs text-slate-500 pt-1">
            Account status: <span className="text-green-400 font-medium">Protected & Active</span>
          </p>
        </div>

      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/20 border border-slate-800/50 p-6 rounded-2xl">
        <div>
          <h3 className="text-base font-semibold text-white">Account Management</h3>
          <p className="text-xs text-slate-400">Modify your profile details or completely remove your account.</p>
        </div>

        <div className="flex items-center gap-3">
          <Button 
            color="primary"
            onPress={editModalState.open}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium px-5 rounded-xl shadow-lg shadow-cyan-500/20"
          >
            <FaUserEdit className="inline mr-1" /> Edit Profile
          </Button>

          <Button 
            color="danger"
            variant="flat"
            onPress={handleDeleteAccount}
            className="bg-red-950/30 hover:bg-red-950/60 text-red-400 border border-red-900/30 rounded-xl"
          >
            <FaTrashAlt className="inline mr-1" /> Delete Account
          </Button>
        </div>
      </div>

      {/* Edit Profile Modal Component */}
      {user && (
        <EditProfileModal 
          modalState={editModalState} 
          userData={{ name: user.name, email: user.email, avatar: user.image }} 
          onSave={handleUpdateProfile} 
        />
      )}

    </div>
  );
}