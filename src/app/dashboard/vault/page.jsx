// app/dashboard/vault/page.jsx
'use client';
import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { encryptPassword, decryptPassword } from '@/lib/crypto';
import { useVaultKey } from '@/hooks/useVaultKey';
import { Button, Input, Modal, useOverlayState } from '@heroui/react';
import { 
  FaShieldAlt, 
  FaPlus, 
  FaSearch, 
  FaGlobe, 
  FaUser, 
  FaLock, 
  FaEye, 
  FaEyeSlash, 
  FaTrashAlt, 
  FaKey, 
  FaShieldVirus 
} from 'react-icons/fa';

export default function VaultPage() {
  const { vaultKey } = useVaultKey();
  const [entries, setEntries] = useState([]);
  const [search, setSearch] = useState('');
  const [revealed, setRevealed] = useState({});
  const [loading, setLoading] = useState(true);
  const modalState = useOverlayState(); 
  const [form, setForm] = useState({ siteName: '', siteUrl: '', username: '', password: '' });

  const loadEntries = async () => {
    setLoading(true);
    try {
      const query = search ? `?search=${encodeURIComponent(search)}` : '';
      const data = await apiFetch(`/api/vault${query}`);
      setEntries(data.entries || []);
    } catch (err) {
      console.error("Failed to load vault entries:", err.message);
      setEntries([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadEntries(); }, [search]);

  const handleAdd = async () => {
    if (!vaultKey) return alert('Vault locked — re-enter master password');
    try {
      const { encryptedPassword, iv } = await encryptPassword(form.password, vaultKey);
      await apiFetch('/api/vault', {
        method: 'POST',
        body: JSON.stringify({
          siteName: form.siteName,
          siteUrl: form.siteUrl,
          username: form.username,
          encryptedPassword,
          iv,
        }),
      });
      setForm({ siteName: '', siteUrl: '', username: '', password: '' });
      modalState.close();
      loadEntries();
    } catch (err) {
      alert(err.message || 'Failed to add entry');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this secure entry?')) return;
    try {
      await apiFetch(`/api/vault/${id}`, { method: 'DELETE' });
      loadEntries();
    } catch (err) {
      alert(err.message || 'Failed to delete');
    }
  };

  const handleReveal = async (entry) => {
    if (!vaultKey) return alert('Vault locked');
    if (revealed[entry._id]) {
      setRevealed((prev) => ({ ...prev, [entry._id]: undefined }));
      return;
    }
    const plain = await decryptPassword(entry.encryptedPassword, entry.iv, vaultKey);
    setRevealed((prev) => ({ ...prev, [entry._id]: plain }));
  };

  return (
    <div className="max-w-6xl mx-auto p-6 lg:p-10 space-y-8 text-slate-100 min-h-screen">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/50 border border-slate-800/80 p-6 rounded-2xl backdrop-blur-md shadow-xl">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-cyan-950/80 border border-cyan-800/50 rounded-xl text-cyan-400 text-2xl shadow-inner">
            <FaShieldAlt />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              Secure Vault
            </h1>
            <p className="text-sm text-slate-400 mt-0.5">
              Manage and decrypt your credentials with military-grade security.
            </p>
          </div>
        </div>

        <Button 
          color="primary" 
          onPress={modalState.open}
          className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium px-5 py-2.5 rounded-xl shadow-lg shadow-cyan-500/20 hover:opacity-90 transition-all flex items-center gap-2"
        >
          <FaPlus className="text-xs" /> Add Password
        </Button>
      </div>

      {/* Search Bar Section */}
      <div className="relative max-w-md flex items-center">
        <span className="absolute left-3 text-slate-400 z-10">
          <FaSearch />
        </span>
        <Input 
          placeholder="Search by site or username..." 
          value={search} 
          onChange={(e) => setSearch(e.target.value)}
          className="bg-slate-900/40 pl-8"
        />
      </div>

      {/* Vault Entries Grid / List */}
      {loading ? (
        <div className="flex justify-center items-center py-20 text-cyan-400 animate-pulse font-medium">
          Loading secure credentials...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {entries.map((entry) => (
            <div 
              key={entry._id} 
              className="group relative bg-slate-900/40 border border-slate-800/80 hover:border-cyan-800/50 rounded-2xl p-5 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-950/30 flex flex-col justify-between gap-4"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-800/80 border border-slate-700/50 flex items-center justify-center text-cyan-400 font-bold">
                      {entry.siteName?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-white group-hover:text-cyan-400 transition-colors">
                        {entry.siteName}
                      </h3>
                      {entry.siteUrl && (
                        <a 
                          href={entry.siteUrl} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="text-xs text-slate-400 hover:text-cyan-300 flex items-center gap-1 mt-0.5"
                        >
                          <FaGlobe className="text-[10px]" /> {entry.siteUrl}
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-slate-950/40 border border-slate-900 rounded-xl p-3 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <FaUser className="text-xs text-slate-500" />
                    <span className="text-slate-400 text-xs">Username:</span>
                    <span className="font-medium text-slate-200">{entry.username}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <FaKey className="text-xs text-slate-500" />
                      <span className="text-slate-400 text-xs">Password:</span>
                    </div>
                    {revealed[entry._id] ? (
                      <span className="text-green-400 font-mono text-xs bg-green-950/30 border border-green-900/50 px-2 py-0.5 rounded">
                        {revealed[entry._id]}
                      </span>
                    ) : (
                      <span className="text-slate-600 font-mono text-xs tracking-widest">
                        ••••••••••••
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800/60">
                <Button 
                  size="sm" 
                  variant="flat" 
                  onPress={() => handleReveal(entry)}
                  className="bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white"
                >
                  {revealed[entry._id] ? <FaEyeSlash className="text-xs inline mr-1" /> : <FaEye className="text-xs inline mr-1" />}
                  {revealed[entry._id] ? 'Hide' : 'Reveal'}
                </Button>
                
                <Button 
                  size="sm" 
                  color="danger" 
                  variant="flat" 
                  onPress={() => handleDelete(entry._id)}
                  className="bg-red-950/30 hover:bg-red-950/60 text-red-400 border border-red-900/30"
                >
                  <FaTrashAlt className="text-xs inline mr-1" /> Delete
                </Button>
              </div>
            </div>
          ))}

          {entries.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-16 text-center bg-slate-900/20 border border-slate-800/50 rounded-2xl">
              <FaShieldVirus className="text-4xl text-slate-600 mb-3" />
              <p className="text-slate-400 font-medium">No secure entries found.</p>
              <p className="text-slate-600 text-sm mt-1">Click on "+ Add Password" to securely store your first credential.</p>
            </div>
          )}
        </div>
      )}

      {/* v3 compound Modal structure */}
      <Modal state={modalState}>
        <Modal.Backdrop className="bg-black/80 backdrop-blur-sm">
          <Modal.Container>
            <Modal.Dialog className="bg-[#0b101b] border border-slate-800 text-white rounded-2xl shadow-2xl p-2">
              <Modal.Header className="border-b border-slate-800 pb-4">
                <Modal.Heading className="text-lg font-bold flex items-center gap-2 text-cyan-400">
                  <FaLock className="text-sm" /> Add New Password
                </Modal.Heading>
              </Modal.Header>
              <Modal.Body className="space-y-4 py-4">
                <Input 
                  label="Site Name" 
                  placeholder="e.g. Google, GitHub"
                  value={form.siteName} 
                  onChange={(e) => setForm({ ...form, siteName: e.target.value })} 
                />
                <Input 
                  label="Site URL" 
                  placeholder="https://example.com"
                  value={form.siteUrl} 
                  onChange={(e) => setForm({ ...form, siteUrl: e.target.value })} 
                />
                <Input 
                  label="Username / Email" 
                  placeholder="you@example.com"
                  value={form.username} 
                  onChange={(e) => setForm({ ...form, username: e.target.value })} 
                />
                <Input 
                  label="Password" 
                  type="password" 
                  placeholder="••••••••••••"
                  value={form.password} 
                  onChange={(e) => setForm({ ...form, password: e.target.value })} 
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
                  onPress={handleAdd}
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium"
                >
                  Save Entry
                </Button>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>

    </div>
  );
}