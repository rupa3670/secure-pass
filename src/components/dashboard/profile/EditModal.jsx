// components/dashboard/profile/EditModal.jsx
'use client';
import { useState, useEffect } from 'react';
import { Button, Input, Modal } from '@heroui/react';
import { FaUserEdit } from 'react-icons/fa';

export default function EditProfileModal({ modalState, userData, onSave }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    avatar: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userData) {
      setForm({
        name: userData.name || '',
        email: userData.email || '',
        avatar: userData.avatar || '',
      });
    }
  }, [userData]);

  const handleSubmit = async () => {
    setLoading(true);
    await onSave(form);
    setLoading(false);
    modalState.close();
  };

  return (
    <Modal state={modalState}>
      <Modal.Backdrop className="bg-black/80 backdrop-blur-sm">
        <Modal.Container>
          <Modal.Dialog className="bg-[#0b101b] border border-slate-800 text-white rounded-2xl shadow-2xl p-2">
            <Modal.Header className="border-b border-slate-800 pb-4">
              <Modal.Heading className="text-lg font-bold flex items-center gap-2 text-cyan-400">
                <FaUserEdit className="text-sm" /> Edit Profile Information
              </Modal.Heading>
            </Modal.Header>
            <Modal.Body className="space-y-4 py-4">
              <Input 
                label="Full Name" 
                value={form.name} 
                onChange={(e) => setForm({ ...form, name: e.target.value })} 
              />
              <Input 
                label="Email Address" 
                type="email" 
                value={form.email} 
                onChange={(e) => setForm({ ...form, email: e.target.value })} 
              />
              <Input 
                label="Profile Image URL" 
                value={form.avatar} 
                onChange={(e) => setForm({ ...form, avatar: e.target.value })} 
                placeholder="https://i.ibb.co/... or image url"
              />
            </Modal.Body>
            <Modal.Footer className="border-t border-slate-800 pt-4 flex justify-end gap-2">
              <Button 
                variant="light" 
                onPress={modalState.close}
                className="text-slate-400 hover:text-white"
              >
                Cancel
              </Button>
              <Button 
                color="primary" 
                onPress={handleSubmit}
                isLoading={loading}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium"
              >
                Save Changes
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}